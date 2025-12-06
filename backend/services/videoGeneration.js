const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');

/**
 * RunwayML Video Generation Service
 * Converts images to videos using RunwayML Gen-3 API
 */

class RunwayMLService {
  constructor() {
    this.apiKey = process.env.RUNWAYML_API_KEY || process.env.RUNWAY_API_KEY;
    this.apiBaseUrl = 'https://api.dev.runwayml.com/v1';
    
    if (!this.apiKey) {
      throw new Error('RUNWAYML_API_KEY not found in environment variables');
    }

    this.client = axios.create({
      baseURL: this.apiBaseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'X-Runway-Version': '2024-11-06'
      }
    });
  }

  /**
   * Generate video from image
   * @param {string} imagePath - Path to input image file
   * @param {object} options - Generation options
   * @returns {Promise<object>} - Task object with video URL
   */
  async generateVideo(imagePath, options = {}) {
    try {
      const {
        duration = 5,
        text_prompt = ''
      } = options;

      console.log(`[RunwayML] Generating video from image: ${imagePath}`);

      // Read image file and convert to base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      const mimeType = this.getMimeType(imagePath);
      const imageDataUri = `data:${mimeType};base64,${base64Image}`;

      // Prepare request payload for Gen-4 Turbo (more stable)
      const payload = {
        promptImage: imageDataUri,
        model: 'gen4_turbo',
        promptText: text_prompt || 'A smooth cinematic video with natural motion',
        duration: duration,
        ratio: '1280:720', // 16:9 landscape format
        seed: Math.floor(Math.random() * 1000000)
      };

      // Submit generation request
      console.log('[RunwayML] Submitting generation request...');
      console.log('[RunwayML] Payload:', JSON.stringify({ ...payload, promptImage: 'base64_data...' }, null, 2));
      
      const response = await this.client.post('/image_to_video', payload);

      if (!response.data || !response.data.id) {
        throw new Error('Invalid response from RunwayML API: no task ID');
      }

      const taskId = response.data.id;
      console.log(`[RunwayML] Task submitted with ID: ${taskId}`);

      // Poll for completion
      return await this.pollVideoGeneration(taskId);

    } catch (error) {
      console.error('[RunwayML] Video generation error:', error.response?.data || error.message);
      throw new Error(`RunwayML video generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp'
    };
    return mimeTypes[ext] || 'image/jpeg';
  }

  /**
   * Poll for video generation completion
   * @param {string} taskId - RunwayML task ID
   * @returns {Promise<object>} - Completed task with video URL
   */
  async pollVideoGeneration(taskId, maxAttempts = 180, interval = 3000) {
    console.log(`[RunwayML] Polling task ${taskId}...`);

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        const response = await this.client.get(`/tasks/${taskId}`);
        const task = response.data;

        console.log(`[RunwayML] Attempt ${attempt}/${maxAttempts} - Status: ${task.status}`);

        if (task.status === 'SUCCEEDED') {
          console.log('[RunwayML] Video generation completed!');
          const videoUrl = task.output?.[0] || task.artifacts?.[0]?.url || task.outputUrl;
          if (!videoUrl) {
            console.error('[RunwayML] No video URL in response:', JSON.stringify(task, null, 2));
            throw new Error('No video URL in successful response');
          }
          return {
            success: true,
            taskId: taskId,
            videoUrl: videoUrl,
            duration: task.duration || 5,
            createdAt: new Date()
          };
        }

        if (task.status === 'FAILED') {
          const errorMsg = task.failure?.message || task.failureReason || task.error || 'Unknown error';
          console.error('[RunwayML] Task failed details:', JSON.stringify(task, null, 2));
          throw new Error(`Task failed: ${errorMsg}`);
        }

        // Wait before next poll (3 seconds for faster response)
        await new Promise(resolve => setTimeout(resolve, interval));

      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.error(`[RunwayML] Task not found: ${taskId}`);
          throw new Error('Task not found');
        }
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
      const response = await this.client.get('/organization');
      return response.data.creditBalance;
    } catch (error) {
      console.error('[RunwayML] Failed to get credits:', error.message);
      throw error;
    }
  }
}

module.exports = RunwayMLService;
