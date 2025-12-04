const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Project = require('../models/Project');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { verifyToken } = require('../middleware/auth');
const VideoGenerationController = require('../controllers/videoGenerationController');
const ThumbnailGenerator = require('../services/thumbnailGenerator');
const { CREDIT_COSTS } = require('../config/credits');

const router = express.Router();
const videoController = new VideoGenerationController();

// File upload setup
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({
  dest: uploadsDir,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images allowed'), false);
    }
  },
});

// UPLOAD IMAGE & CREATE PROJECT (Real API Integration with Prepaid Credits)
router.post('/create', verifyToken, upload.single('image'), async (req, res) => {
  try {
    const { prompt, voiceSettings } = req.body;
    const userId = req.userId;

    if (!prompt || !req.file) {
      return res.status(400).json({ error: 'Image and prompt required' });
    }

    // Get user and check credits
    const user = await User.findById(userId);
    const costCredits = CREDIT_COSTS.VIDEO_GENERATION_5SEC; // 125 credits for 5 sec video

    if (!user.hasEnoughCredits(costCredits)) {
      return res.status(400).json({ 
        error: 'Insufficient credits',
        required: costCredits,
        available: user.credits,
        message: `You need ${costCredits} credits but only have ${user.credits}. Please purchase more credits.`
      });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    const imageAbsolutePath = path.join(__dirname, `../uploads/${req.file.filename}`);

    // Generate thumbnail
    const thumbnailGenerator = new ThumbnailGenerator();
    const sessionId = uuidv4();
    let thumbnailUrl = null;
    
    try {
      // Try to generate thumbnail from the uploaded image
      thumbnailUrl = await thumbnailGenerator.generateFromImage(imageAbsolutePath, sessionId);
    } catch (thumbError) {
      console.warn(`[Project] Thumbnail generation failed, using gradient: ${thumbError.message}`);
      // Fallback to gradient thumbnail if image processing fails
      try {
        thumbnailUrl = await thumbnailGenerator.generateGradientThumbnail(sessionId, prompt);
      } catch (gradientError) {
        console.warn(`[Project] Gradient thumbnail also failed, using image URL`);
        thumbnailUrl = imageUrl; // Use original image as fallback
      }
    }

    // Create project record
    const project = new Project({
      userId,
      title: `Shreevid ${new Date().toLocaleDateString()}`,
      prompt,
      imageUrl,
      thumbnailUrl, // Add generated thumbnail
      videoStatus: 'generating',
      voiceSettings: voiceSettings ? JSON.parse(voiceSettings) : { voice: 'default' },
      cost: costCredits,
    });

    await project.save();

    // Deduct credits from user
    const balanceBefore = user.credits;
    await user.deductCredits(costCredits, 'Video generation');
    
    // Log transaction
    const transaction = new Transaction({
      userId,
      type: 'deduction',
      amount: costCredits,
      balanceBefore,
      balanceAfter: user.credits,
      description: `Video generation: ${prompt.substring(0, 50)}...`,
      projectId: project._id,
    });
    await transaction.save();

    // Start real video generation (non-blocking)
    setImmediate(async () => {
      try {
        console.log(`[Project] Starting real video generation for project: ${project._id}`);

        // Get voice type from settings
        const voiceType = voiceSettings ? JSON.parse(voiceSettings).voice : 'default';

        // Call the real video generation pipeline
        const result = await videoController.generateCompleteVideo(
          imageAbsolutePath,
          prompt,
          voiceType
        );

        // Update project with completed video
        const updatedProject = await Project.findById(project._id);
        updatedProject.videoUrl = result.videoPath;
        updatedProject.videoStatus = 'completed';
        updatedProject.duration = result.duration;
        updatedProject.watermarkApplied = true;
        updatedProject.metadata = {
          sessionId: result.sessionId,
          fileSize: result.fileSizeMB,
          processingTime: result.processingTime,
          voice: voiceType,
        };
        await updatedProject.save();

        console.log(`[Project] ✅ Video generation complete: ${project._id}`);

      } catch (error) {
        console.error(`[Project] ❌ Video generation failed: ${error.message}`);

        // Update project status to failed
        const failedProject = await Project.findById(project._id);
        if (failedProject) {
          failedProject.videoStatus = 'failed';
          failedProject.errorMessage = error.message;
          await failedProject.save();
        }

        // Refund credits on failure
        const refundUser = await User.findById(userId);
        const refundBalanceBefore = refundUser.credits;
        await refundUser.addCredits(costCredits, 'Refund - Video generation failed');
        
        // Log refund transaction
        const refundTransaction = new Transaction({
          userId,
          type: 'refund',
          amount: costCredits,
          balanceBefore: refundBalanceBefore,
          balanceAfter: refundUser.credits,
          description: `Refund: Video generation failed`,
          projectId: project._id,
        });
        await refundTransaction.save();
      }
    });

    res.status(201).json({
      message: 'Video generation started. Credits deducted.',
      projectId: project._id,
      status: 'generating',
      estimatedTime: '60-90 seconds',
      creditsDeducted: costCredits,
      remainingCredits: user.credits,
    });

  } catch (error) {
    console.error('[Project] Error creating project:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET ALL PROJECTS (Previous Work)
router.get('/my-projects', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET GENERATION STATUS
router.get('/status/:projectId', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, userId: req.userId });
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({
      projectId: project._id,
      status: project.videoStatus,
      progress: project.videoStatus === 'generating' ? 'Processing...' : 'Complete',
      videoUrl: project.videoUrl,
      duration: project.duration,
      createdAt: project.createdAt,
      metadata: project.metadata,
      errorMessage: project.errorMessage
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SYSTEM STATISTICS
router.get('/admin/stats', verifyToken, async (req, res) => {
  try {
    const stats = await videoController.getStats();
    const credits = await videoController.getRunwayCredits();

    res.json({
      videoGeneration: stats,
      runwayCredits: credits,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET PREVIOUS WORK
router.get('/previous-work', verifyToken, async (req, res) => {
  try {
    const projects = await Project.find({ userId: req.userId, videoStatus: 'completed' })
      .sort({ createdAt: -1 })
      .limit(10);
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET SINGLE PROJECT
router.get('/:projectId', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, userId: req.userId });
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// EDIT VIDEO SETTINGS (voice, background noise)
router.put('/:projectId/edit', verifyToken, async (req, res) => {
  try {
    const { voiceSettings } = req.body;
    const project = await Project.findOne({ _id: req.params.projectId, userId: req.userId });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (voiceSettings) {
      project.voiceSettings = { ...project.voiceSettings, ...voiceSettings };
    }

    await project.save();
    res.json({ message: 'Video settings updated', project });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DOWNLOAD VIDEO
router.get('/:projectId/download', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOne({ _id: req.params.projectId, userId: req.userId });

    if (!project || !project.videoUrl) {
      return res.status(404).json({ error: 'Video not found or still processing' });
    }

    // In real scenario, serve actual video file with watermark
    const videoPath = path.join(__dirname, `../public${project.videoUrl}`);

    // For now, send mock response
    res.json({
      message: 'Video ready for download',
      downloadUrl: project.videoUrl,
      watermarkApplied: true,
      fileName: `${project.title}-shreenika.mp4`,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE PROJECT
router.delete('/:projectId', verifyToken, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ _id: req.params.projectId, userId: req.userId });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
