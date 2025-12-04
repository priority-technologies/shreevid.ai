const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * RunwayML Video Generation Service
 * Converts images to videos using RunwayML Gen-3 Turbo API
 */

class RunwayMLService {
  constructor() {
    this.apiKey = process.env.RUNWAY_API_KEY;
    this.apiBaseUrl = process.env.RUNWAY_API_BASE_URL || 'https://api.runwayml.com/v1';
    this.model = process.env.RUNWAY_MODEL || 'gen3';
    
    if (!this.apiKey) {
      throw new Error('RUNWAY_API_KEY not found in environment variables');
    }

    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Generate video from image
   * @param {string} imagePath - Path to input image or image URL
   * @param {object} options - Generation options
   * @returns {Promise<object>} - Task object with video URL
   */
  async generateVideo(imagePath, options = {}) {
    try {
      const {
        duration = 5, // seconds (5-30)
        fps = 24,
        format = 'mp4',
        quality = 'high'
      } = options;

      console.log(`[RunwayML] Generating video from image: ${imagePath}`);

      // Prepare request payload
      const payload = {
        model: `${this.model}-turbo`, // gen3-turbo
        requestType: 'image2video',
        image: imagePath, // Can be URL or base64
        duration: duration,
        fps: fps,
        format: format,
        quality: quality
      };

      // Submit generation request
      console.log('[RunwayML] Submitting generation request...');
      const response = await this.client.post('/image_to_video', payload);

      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from RunwayML API: no task ID');
      }

      const taskId = response.data.id;
      console.log(`[RunwayML] Task submitted with ID: ${taskId}`);

      // Poll for completion
      return await this.pollVideoGeneration(taskId);

    } catch (error) {
      console.error('[RunwayML] Video generation error:', error.message);
      throw new Error(`RunwayML video generation failed: ${error.message}`);
    }
  }

  /**
   * Poll for video generation completion
   * @param {string} taskId - RunwayML task ID
   * @returns {Promise<object>} - Completed task with video URL
   */
  async pollVideoGeneration(taskId, maxAttempts = 60, interval = 3000) {
    console.log(`[RunwayML] Polling task ${taskId}...`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.client.get(`/tasks/${taskId}`);
        const task = response.data;

        console.log(`[RunwayML] Attempt ${attempt}/${maxAttempts} - Status: ${task.status}`);

        if (task.status === 'COMPLETED') {
          console.log('[RunwayML] Video generation completed!');
          return {
            success: true,
            taskId: taskId,
            videoUrl: task.output?.[0], // Video URL
            duration: task.duration,
            createdAt: new Date()
          };
        }

        if (task.status === 'FAILED' || task.status === 'ERROR') {
          throw new Error(`Task failed: ${task.error_message || 'Unknown error'}`);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, interval));

      } catch (error) {
        console.error(`[RunwayML] Poll attempt ${attempt} failed:`, error.message);
        throw error;
      }
    }

    throw new Error(`Video generation timeout after ${maxAttempts * interval / 1000}s`);
  }

  /**
   * Download video from URL and save locally
   * @param {string} videoUrl - Video URL from RunwayML
   * @param {string} outputPath - Local save path
   * @returns {Promise<string>} - Saved file path
   */
  async downloadVideo(videoUrl, outputPath) {
    try {
      console.log(`[RunwayML] Downloading video from: ${videoUrl}`);

      const response = await axios.get(videoUrl, {
        responseType: 'stream'
      });

      // Ensure output directory exists
      const dir = path.dirname(outputPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      // Save to file
      return new Promise((resolve, reject) => {
        const writer = fs.createWriteStream(outputPath);
        response.data.pipe(writer);

        writer.on('finish', () => {
          console.log(`[RunwayML] Video saved to: ${outputPath}`);
          resolve(outputPath);
        });

        writer.on('error', reject);
      });

    } catch (error) {
      console.error('[RunwayML] Download failed:', error.message);
      throw new Error(`Video download failed: ${error.message}`);
    }
  }

  /**
   * Get remaining credit balance
   * @returns {Promise<number>} - Remaining credits
   */
  async getCredits() {
    try {
      const response = await this.client.get('/account/credits');
      return response.data.credits;
    } catch (error) {
      console.error('[RunwayML] Failed to get credits:', error.message);
      throw error;
    }
  }
}

module.exports = RunwayMLService;
