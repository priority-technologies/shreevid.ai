const express = require('express');
const router = express.Router();
const VideoGenerationController = require('../controllers/videoGenerationController');

const videoController = new VideoGenerationController();

/**
 * Test endpoint to verify video generation pipeline
 * This is for development/debugging purposes only
 */

router.get('/health', async (req, res) => {
  try {
    // Check FFmpeg availability
    const { execSync } = require('child_process');
    let ffmpegStatus = 'not installed';
    try {
      execSync('ffmpeg -version', { stdio: 'pipe' });
      ffmpegStatus = 'installed';
    } catch (err) {
      ffmpegStatus = 'not installed';
    }

    res.json({
      status: 'ok',
      service: 'Shreevid Video Generation API',
      timestamp: new Date(),
      components: {
        runwayML: process.env.RUNWAY_API_KEY ? 'configured' : 'not configured',
        googleTTS: process.env.GOOGLE_TTS_PROJECT_ID ? 'configured' : 'not configured',
        ffmpeg: ffmpegStatus
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/stats', async (req, res) => {
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

router.post('/test-tts', async (req, res) => {
  try {
    const { text, voice } = req.body;

    if (!text) {
      return res.status(400).json({ error: 'Text parameter required' });
    }

    const ttsService = new (require('../services/textToSpeech'))();
    const result = await ttsService.textToSpeech(text, voice || 'default');

    res.json({
      success: true,
      message: 'TTS test successful',
      encoding: result.encoding,
      duration: result.duration,
      voice: result.voice
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/runway-credits', async (req, res) => {
  try {
    const credits = await videoController.getRunwayCredits();
    res.json({
      credits: credits,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
