const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const RunwayMLService = require('../services/videoGeneration');
const GoogleTTSService = require('../services/textToSpeech');
const VideoComposerService = require('../services/videoComposer');

/**
 * Unified Video Generation Controller
 * Coordinates RunwayML, Google TTS, and FFmpeg to create complete videos
 */

class VideoGenerationController {
  constructor() {
    this.videoGenService = new RunwayMLService();
    this.ttsService = new GoogleTTSService();
    this.composerService = new VideoComposerService();
    this.uploadsDir = path.join(__dirname, '../uploads');
    this.videoDir = path.join(this.uploadsDir, 'videos');
    this.audioDir = path.join(this.uploadsDir, 'audio');
    this.finalDir = path.join(this.uploadsDir, 'final');

    // Create directories if they don't exist
    [this.videoDir, this.audioDir, this.finalDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Main pipeline: Image → Video → Audio → Merge → Watermark → Final
   * @param {string} imagePath - Path to uploaded image
   * @param {string} description - Text description for voiceover
   * @param {string} voiceType - Voice selection (default, male, female, robotic)
   * @returns {Promise<object>} - Result with finalVideoPath
   */
  async generateCompleteVideo(imagePath, description, voiceType = 'default') {
    const sessionId = uuidv4();
    const startTime = Date.now();

    try {
      console.log(`\n[${'='.repeat(60)}]`);
      console.log(`[VideoGenerator] Session: ${sessionId}`);
      console.log(`[VideoGenerator] Starting complete video generation pipeline`);
      console.log(`[${'='.repeat(60)}]\n`);

      // STEP 1: Validate inputs
      console.log('[Step 1/5] Validating inputs...');
      if (!imagePath || !fs.existsSync(imagePath)) {
        throw new Error(`Image not found: ${imagePath}`);
      }
      if (!description || description.trim().length === 0) {
        throw new Error('Description cannot be empty');
      }

      // STEP 2: Generate video from image
      console.log('[Step 2/5] Generating video from image (RunwayML)...');
      const videoResult = await this.videoGenService.generateVideo(imagePath, {
        duration: 5,
        fps: 24,
        format: 'mp4'
      });

      if (!videoResult.success) {
        throw new Error('Video generation failed');
      }

      // Download video locally
      const videoFilename = `${sessionId}-runway.mp4`;
      const localVideoPath = path.join(this.videoDir, videoFilename);
      
      console.log('[Step 2/5] Downloading video to local storage...');
      await this.videoGenService.downloadVideo(videoResult.videoUrl, localVideoPath);
      console.log(`[Step 2/5] ✅ Video ready: ${videoFilename}`);

      // STEP 3: Generate voiceover
      console.log('[Step 3/5] Generating voiceover (Google TTS)...');
      const audioResult = await this.ttsService.textToSpeech(description, voiceType);

      if (!audioResult.audio) {
        throw new Error('Audio generation failed');
      }

      const audioFilename = `${sessionId}-tts.mp3`;
      const localAudioPath = path.join(this.audioDir, audioFilename);
      
      console.log('[Step 3/5] Saving voiceover to local storage...');
      await this.ttsService.saveAudio(audioResult.audio, localAudioPath);
      console.log(`[Step 3/5] ✅ Voiceover ready: ${audioFilename}`);

      // STEP 4: Merge video and audio + Watermark
      console.log('[Step 4/5] Merging video and audio...');
      const finalFilename = `${sessionId}-final.mp4`;
      const finalVideoPath = path.join(this.finalDir, finalFilename);

      const composedVideo = await this.composerService.processCompleteVideo(
        localVideoPath,
        localAudioPath,
        finalVideoPath
      );

      console.log(`[Step 4/5] ✅ Video composition complete: ${finalFilename}`);

      // STEP 5: Cleanup and verify
      console.log('[Step 5/5] Finalizing...');
      
      // Verify final file exists and has size
      if (!fs.existsSync(finalVideoPath)) {
        throw new Error('Final video file not found');
      }

      const fileStats = fs.statSync(finalVideoPath);
      const fileSizeMB = (fileStats.size / (1024 * 1024)).toFixed(2);

      console.log(`[Step 5/5] ✅ Video finalized: ${fileSizeMB}MB`);

      const processingTime = ((Date.now() - startTime) / 1000).toFixed(1);

      console.log(`\n[${'='.repeat(60)}]`);
      console.log(`[VideoGenerator] ✅ COMPLETE PIPELINE SUCCESS!`);
      console.log(`[VideoGenerator] Total processing time: ${processingTime}s`);
      console.log(`[${'='.repeat(60)}]\n`);

      // Return result with public path
      return {
        success: true,
        sessionId,
        videoPath: `/uploads/final/${finalFilename}`,
        localPath: finalVideoPath,
        videoFilename: finalFilename,
        fileSize: fileStats.size,
        fileSizeMB,
        duration: videoResult.duration,
        voiceUsed: voiceType,
        processingTime: parseFloat(processingTime),
        watermarkApplied: true,
        createdAt: new Date()
      };

    } catch (error) {
      console.error(`\n[VideoGenerator] ❌ PIPELINE FAILED!`);
      console.error(`[VideoGenerator] Error: ${error.message}`);
      console.error(`[${'='.repeat(60)}]\n`);

      // Cleanup partial files
      await this.cleanupSession(sessionId);

      throw error;
    }
  }

  /**
   * Cleanup temporary files from failed generation
   * @param {string} sessionId - Session ID to cleanup
   */
  async cleanupSession(sessionId) {
    try {
      const files = [
        path.join(this.videoDir, `${sessionId}-runway.mp4`),
        path.join(this.audioDir, `${sessionId}-tts.mp3`),
        path.join(this.finalDir, `${sessionId}-final.mp4`)
      ];

      for (const file of files) {
        if (fs.existsSync(file)) {
          fs.unlinkSync(file);
          console.log(`[Cleanup] Removed: ${path.basename(file)}`);
        }
      }
    } catch (error) {
      console.warn(`[Cleanup] Warning: ${error.message}`);
    }
  }

  /**
   * Get video generation statistics
   * @returns {object} - Statistics
   */
  async getStats() {
    try {
      const videos = fs.readdirSync(this.videoDir).length;
      const audio = fs.readdirSync(this.audioDir).length;
      const final = fs.readdirSync(this.finalDir).length;

      return {
        videosGenerated: videos,
        audioFilesGenerated: audio,
        finalVideos: final,
        totalSessions: Math.max(videos, audio, final)
      };
    } catch (error) {
      return { error: error.message };
    }
  }

  /**
   * Get RunwayML account credits
   * @returns {Promise<number>} - Remaining credits
   */
  async getRunwayCredits() {
    try {
      return await this.videoGenService.getCredits();
    } catch (error) {
      console.error('Failed to get credits:', error.message);
      return null;
    }
  }
}

module.exports = VideoGenerationController;
