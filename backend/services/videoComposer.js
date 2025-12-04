const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * FFmpeg Video Composer Service
 * Merges video + audio and applies watermark overlay
 */

class VideoComposerService {
  constructor() {
    this.ffmpegPath = process.env.FFMPEG_PATH || 'ffmpeg';
    this.timeout = process.env.FFMPEG_TIMEOUT || 300000; // 5 minutes
    
    // Watermark configuration
    this.watermark = {
      text: process.env.WATERMARK_TEXT || 'Shreevid.ai',
      position: process.env.WATERMARK_POSITION || 'bottom-right',
      offsetX: parseInt(process.env.WATERMARK_OFFSET_X) || 20,
      offsetY: parseInt(process.env.WATERMARK_OFFSET_Y) || 20,
      fontSize: parseInt(process.env.WATERMARK_FONT_SIZE) || 36,
      fontColor: process.env.WATERMARK_FONT_COLOR || 'white',
      bgColor: process.env.WATERMARK_BG_COLOR || 'black',
      bgOpacity: parseFloat(process.env.WATERMARK_BG_OPACITY) || 0.3
    };

    this.validateFFmpeg();
  }

  /**
   * Check if FFmpeg is installed and accessible
   */
  validateFFmpeg() {
    try {
      const { execSync } = require('child_process');
      execSync(`${this.ffmpegPath} -version`, { stdio: 'pipe' });
      console.log('[VideoComposer] ✅ FFmpeg found and accessible');
      this.ffmpegAvailable = true;
    } catch (error) {
      console.warn('[VideoComposer] ⚠️  FFmpeg not found. Will be needed for video composition.');
      console.warn('  Windows: Download from https://ffmpeg.org/download.html or run: choco install ffmpeg');
      console.warn('  Mac: brew install ffmpeg');
      console.warn('  Linux: sudo apt-get install ffmpeg');
      this.ffmpegAvailable = false;
    }
  }

  /**
   * Merge video and audio
   * @param {string} videoPath - Path to video file
   * @param {string} audioPath - Path to audio file (MP3/WAV)
   * @param {string} outputPath - Output video path
   * @returns {Promise<string>} - Path to merged video
   */
  async mergeVideoAudio(videoPath, audioPath, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // Check if FFmpeg is available
        if (!this.ffmpegAvailable) {
          console.warn('[VideoComposer] ⚠️  FFmpeg not available - cannot merge video and audio');
          console.warn('[VideoComposer] Please install FFmpeg and restart the application');
          reject(new Error('FFmpeg not installed. Cannot process video. Install FFmpeg and restart.'));
          return;
        }

        console.log('[VideoComposer] Merging video and audio...');
        console.log(`  Video: ${videoPath}`);
        console.log(`  Audio: ${audioPath}`);

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // FFmpeg command: merge video + audio
        const args = [
          '-i', videoPath,           // Input video
          '-i', audioPath,            // Input audio
          '-c:v', 'copy',            // Copy video codec (no re-encoding)
          '-c:a', 'aac',             // Audio codec
          '-map', '0:v:0',           // Map video from first input
          '-map', '1:a:0',           // Map audio from second input
          '-shortest',               // Stop at shortest input
          '-y',                      // Overwrite output file
          outputPath
        ];

        console.log('[VideoComposer] Executing FFmpeg merge...');
        const process = spawn(this.ffmpegPath, args);

        let stderr = '';
        process.stderr.on('data', (data) => {
          stderr += data.toString();
          // Log progress
          if (data.toString().includes('frame=')) {
            process.stdout.write('.');
          }
        });

        process.on('error', (error) => {
          console.error('[VideoComposer] FFmpeg process error:', error);
          reject(new Error(`FFmpeg error: ${error.message}`));
        });

        process.on('close', (code) => {
          if (code === 0) {
            console.log('\n[VideoComposer] Merge completed successfully');
            resolve(outputPath);
          } else {
            console.error('[VideoComposer] FFmpeg exited with code:', code);
            reject(new Error(`FFmpeg merge failed: ${stderr}`));
          }
        });

        // Set timeout
        setTimeout(() => {
          process.kill();
          reject(new Error(`Merge operation timeout after ${this.timeout}ms`));
        }, this.timeout);

      } catch (error) {
        console.error('[VideoComposer] Merge error:', error.message);
        reject(error);
      }
    });
  }

  /**
   * Add watermark to video
   * @param {string} inputPath - Input video path
   * @param {string} outputPath - Output video path
   * @returns {Promise<string>} - Path to watermarked video
   */
  async addWatermark(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // Check if FFmpeg is available
        if (!this.ffmpegAvailable) {
          console.warn('[VideoComposer] ⚠️  FFmpeg not available - cannot add watermark');
          console.warn('[VideoComposer] Please install FFmpeg and restart the application');
          reject(new Error('FFmpeg not installed. Cannot process video. Install FFmpeg and restart.'));
          return;
        }

        console.log('[VideoComposer] Adding watermark to video...');
        console.log(`  Text: ${this.watermark.text}`);
        console.log(`  Position: ${this.watermark.position}`);

        // Ensure output directory exists
        const dir = path.dirname(outputPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }

        // Calculate position coordinates
        const posCoords = this.calculateWatermarkPosition(this.watermark.position);

        // Build drawtext filter
        const drawtext = `drawtext=text='${this.watermark.text}':fontsize=${this.watermark.fontSize}:fontcolor=${this.watermark.fontColor}:x=${posCoords.x}:y=${posCoords.y}:fontfile=/path/to/font.ttf`;

        // FFmpeg command: add text watermark
        const args = [
          '-i', inputPath,
          '-vf', drawtext,
          '-codec:a', 'copy',       // Copy audio codec
          '-y',                      // Overwrite output
          outputPath
        ];

        console.log('[VideoComposer] Executing FFmpeg watermark...');
        const process = spawn(this.ffmpegPath, args);

        let stderr = '';
        process.stderr.on('data', (data) => {
          stderr += data.toString();
        });

        process.on('error', (error) => {
          console.error('[VideoComposer] FFmpeg process error:', error);
          reject(new Error(`FFmpeg error: ${error.message}`));
        });

        process.on('close', (code) => {
          if (code === 0) {
            console.log('[VideoComposer] Watermark added successfully');
            resolve(outputPath);
          } else {
            console.error('[VideoComposer] FFmpeg exited with code:', code);
            reject(new Error(`FFmpeg watermark failed: ${stderr}`));
          }
        });

        // Set timeout
        setTimeout(() => {
          process.kill();
          reject(new Error(`Watermark operation timeout after ${this.timeout}ms`));
        }, this.timeout);

      } catch (error) {
        console.error('[VideoComposer] Watermark error:', error.message);
        reject(error);
      }
    });
  }

  /**
   * Complete pipeline: merge + watermark
   * @param {string} videoPath - Input video (from RunwayML)
   * @param {string} audioPath - Audio file (from Google TTS)
   * @param {string} finalOutputPath - Final output path
   * @returns {Promise<string>} - Path to final video
   */
  async processCompleteVideo(videoPath, audioPath, finalOutputPath) {
    try {
      console.log('[VideoComposer] Starting complete video processing...');

      // Step 1: Merge video + audio
      const tempMergedPath = finalOutputPath.replace('.mp4', '_merged.mp4');
      console.log('[VideoComposer] Step 1: Merging video and audio...');
      await this.mergeVideoAudio(videoPath, audioPath, tempMergedPath);

      // Step 2: Add watermark
      console.log('[VideoComposer] Step 2: Adding watermark...');
      const result = await this.addWatermark(tempMergedPath, finalOutputPath);

      // Clean up temporary file
      if (fs.existsSync(tempMergedPath)) {
        fs.unlinkSync(tempMergedPath);
        console.log('[VideoComposer] Temporary file cleaned up');
      }

      console.log('[VideoComposer] ✅ Complete video processing finished!');
      return result;

    } catch (error) {
      console.error('[VideoComposer] Complete video processing failed:', error.message);
      throw error;
    }
  }

  /**
   * Calculate watermark position coordinates
   * @param {string} position - Position (bottom-right, bottom-left, top-right, top-left)
   * @returns {object} - {x, y} coordinates
   */
  calculateWatermarkPosition(position) {
    const positions = {
      'bottom-right': { x: `w-tw-${this.watermark.offsetX}`, y: `h-th-${this.watermark.offsetY}` },
      'bottom-left': { x: this.watermark.offsetX, y: `h-th-${this.watermark.offsetY}` },
      'top-right': { x: `w-tw-${this.watermark.offsetX}`, y: this.watermark.offsetY },
      'top-left': { x: this.watermark.offsetX, y: this.watermark.offsetY }
    };

    return positions[position] || positions['bottom-right'];
  }

  /**
   * Get video metadata (duration, resolution, fps)
   * @param {string} videoPath - Path to video file
   * @returns {Promise<object>} - Video metadata
   */
  async getVideoMetadata(videoPath) {
    return new Promise((resolve, reject) => {
      try {
        const args = ['-v', 'error', '-show_format', '-show_streams', videoPath];
        const ffprobe = spawn('ffprobe', args);

        let output = '';
        ffprobe.stdout.on('data', (data) => {
          output += data.toString();
        });

        ffprobe.on('close', (code) => {
          if (code === 0) {
            // Parse basic info (simplified)
            resolve({
              valid: true,
              info: output
            });
          } else {
            reject(new Error('Failed to get video metadata'));
          }
        });

      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = VideoComposerService;
