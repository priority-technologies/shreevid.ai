const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

/**
 * Thumbnail Generator Service
 * Creates optimized thumbnails from images and videos
 */
class ThumbnailGenerator {
  constructor() {
    this.thumbnailDir = path.join(__dirname, '../uploads/thumbnails');
    
    // Create thumbnails directory if it doesn't exist
    if (!fs.existsSync(this.thumbnailDir)) {
      fs.mkdirSync(this.thumbnailDir, { recursive: true });
    }
  }

  /**
   * Generate thumbnail from image
   * @param {string} imagePath - Path to source image
   * @param {string} sessionId - Session ID for naming
   * @returns {Promise<string>} - Public path to thumbnail
   */
  async generateFromImage(imagePath, sessionId) {
    try {
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image not found: ${imagePath}`);
      }

      const thumbnailFilename = `${sessionId}-thumb.webp`;
      const thumbnailPath = path.join(this.thumbnailDir, thumbnailFilename);

      // Generate 300x200 thumbnail in WebP format (smaller size)
      await sharp(imagePath)
        .resize(300, 200, {
          fit: 'cover',
          position: 'center',
        })
        .webp({ quality: 75 })
        .toFile(thumbnailPath);

      console.log(`[ThumbnailGen] ✅ Thumbnail created: ${thumbnailFilename}`);

      return `/uploads/thumbnails/${thumbnailFilename}`;
    } catch (error) {
      console.error(`[ThumbnailGen] Error: ${error.message}`);
      // Return original image path if thumbnail fails
      return imagePath;
    }
  }

  /**
   * Generate thumbnail with text overlay (for preview)
   * @param {string} imagePath - Path to source image
   * @param {string} sessionId - Session ID for naming
   * @param {string} title - Title text to overlay
   * @returns {Promise<string>} - Public path to thumbnail
   */
  async generateWithText(imagePath, sessionId, title) {
    try {
      if (!fs.existsSync(imagePath)) {
        throw new Error(`Image not found: ${imagePath}`);
      }

      const thumbnailFilename = `${sessionId}-thumb-text.webp`;
      const thumbnailPath = path.join(this.thumbnailDir, thumbnailFilename);

      // Create thumbnail with gradient overlay and text
      const svgOverlay = Buffer.from(`
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" style="stop-color:#000;stop-opacity:0" />
              <stop offset="100%" style="stop-color:#000;stop-opacity:0.7" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="url(#grad)"/>
          <text x="10" y="185" font-family="Arial, sans-serif" font-size="14" fill="white" font-weight="bold" text-anchor="start">
            <tspan>${title.substring(0, 30)}</tspan>
          </text>
        </svg>
      `);

      await sharp(imagePath)
        .resize(300, 200, {
          fit: 'cover',
          position: 'center',
        })
        .composite([{ input: svgOverlay, gravity: 'southeast' }])
        .webp({ quality: 75 })
        .toFile(thumbnailPath);

      console.log(`[ThumbnailGen] ✅ Thumbnail with text created: ${thumbnailFilename}`);

      return `/uploads/thumbnails/${thumbnailFilename}`;
    } catch (error) {
      console.error(`[ThumbnailGen] Error: ${error.message}`);
      // Fallback to simple thumbnail
      return this.generateFromImage(imagePath, sessionId);
    }
  }

  /**
   * Create a colorful gradient thumbnail (no image needed)
   * @param {string} sessionId - Session ID for naming
   * @param {string} title - Title for the thumbnail
   * @returns {Promise<string>} - Public path to thumbnail
   */
  async generateGradientThumbnail(sessionId, title) {
    try {
      const thumbnailFilename = `${sessionId}-thumb-gradient.webp`;
      const thumbnailPath = path.join(this.thumbnailDir, thumbnailFilename);

      // Generate gradient background
      const colors = [
        ['#3b82f6', '#1e40af'], // Blue
        ['#8b5cf6', '#5b21b6'], // Purple
        ['#ec4899', '#be185d'], // Pink
        ['#06b6d4', '#0369a1'], // Cyan
        ['#10b981', '#065f46'], // Green
      ];

      const selectedColor = colors[Math.floor(Math.random() * colors.length)];

      const svgImage = Buffer.from(`
        <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:${selectedColor[0]};stop-opacity:1" />
              <stop offset="100%" style="stop-color:${selectedColor[1]};stop-opacity:1" />
            </linearGradient>
          </defs>
          <rect width="300" height="200" fill="url(#grad)"/>
          <text x="150" y="100" font-family="Arial, sans-serif" font-size="18" fill="white" font-weight="bold" text-anchor="middle" dominant-baseline="middle">
            <tspan>${title.substring(0, 25)}</tspan>
          </text>
          <circle cx="50" cy="50" r="30" fill="rgba(255,255,255,0.1)"/>
          <circle cx="250" cy="150" r="40" fill="rgba(255,255,255,0.05)"/>
        </svg>
      `);

      await sharp(svgImage)
        .resize(300, 200)
        .webp({ quality: 75 })
        .toFile(thumbnailPath);

      console.log(`[ThumbnailGen] ✅ Gradient thumbnail created: ${thumbnailFilename}`);

      return `/uploads/thumbnails/${thumbnailFilename}`;
    } catch (error) {
      console.error(`[ThumbnailGen] Error: ${error.message}`);
      return null;
    }
  }

  /**
   * Clean up thumbnail
   * @param {string} thumbnailPath - Path to thumbnail file
   */
  async deleteThumbnail(thumbnailPath) {
    try {
      const fullPath = path.join(__dirname, '..', thumbnailPath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        console.log(`[ThumbnailGen] Thumbnail deleted: ${path.basename(fullPath)}`);
      }
    } catch (error) {
      console.warn(`[ThumbnailGen] Warning: ${error.message}`);
    }
  }
}

module.exports = ThumbnailGenerator;
