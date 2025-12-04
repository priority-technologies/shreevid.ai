/**
 * Watermark Configuration for Shreevid AI
 * Handles watermark placement, text, and styling for video outputs
 */

module.exports = {
  // Watermark text displayed on videos
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
    // Path to logo file (will be set dynamically)
    // Use light logo for dark backgrounds (videos typically have dark areas)
    path: null, // Set at runtime based on video colors
    width: 80,  // pixels
    height: 80, // pixels
    opacity: 0.9
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
