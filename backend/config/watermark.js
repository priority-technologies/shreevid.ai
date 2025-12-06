/**
 * Watermark Configuration for Shreevid AI
 * Handles watermark placement, text, and styling for video outputs
 */

const path = require('path');

module.exports = {
  // Watermark mode: 'logo' or 'text'
  mode: "logo",
  
  // Watermark text displayed on videos (fallback if logo not available)
  text: "Shreevid.ai",
  
  // Position on video (bottom-right recommended for least intrusion)
  position: {
    x: "right",      // left, center, right
    y: "bottom",     // top, middle, bottom
    offsetX: 20,     // pixels from edge
    offsetY: 20      // pixels from edge
  },
  
  // Text styling
  textStyle: {
    fontSize: 36,
    fontFamily: "Arial",
    fontColor: "white",
    opacity: 0.8,
    fontWeight: "bold"
  },
  
  // Logo styling (if using logo image)
  logo: {
    // Path to logo file (White logo for better visibility on videos)
    path: path.join(__dirname, '../../../frontend/public/White Icon.png'),
    width: 120,  // pixels
    height: 120, // pixels
    opacity: 0.85
  },
  
  // Background behind text (for better visibility)
  background: {
    enabled: true,
    color: "#000000",
    opacity: 0.3,
    padding: 10
  },
  
  // When watermark appears
  timing: {
    startFrame: "0%",      // Start at beginning
    endFrame: "100%",      // Until end
    fadeIn: 0.5,           // seconds
    fadeOut: 0.5           // seconds
  }
};
