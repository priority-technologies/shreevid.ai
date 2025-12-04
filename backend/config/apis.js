/**
 * API Keys and Credentials Configuration
 * IMPORTANT: Never commit this file to public repositories!
 * This template shows what information you need to collect
 */

module.exports = {
  // ============================================
  // STABILITY AI - Video Generation
  // ============================================
  stabilityAI: {
    apiKey: process.env.STABILITY_AI_KEY || null,
    apiUrl: "https://api.stability.ai/v2beta/image-to-video",
    
    // Free tier: 50 videos/month
    // Paid: More videos and faster processing
    limits: {
      maxVideosPerMonth: 50,
      maxVideoLength: 25, // seconds
    },
    
    // Video generation settings
    videoSettings: {
      frameRate: 24,
      motionBucketId: 40,  // Higher = more motion
      cfgScale: 12.5       // Guidance scale for quality
    }
  },

  // ============================================
  // GOOGLE CLOUD - Text-to-Speech
  // ============================================
  googleTTS: {
    projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || null,
    keyFilePath: process.env.GOOGLE_APPLICATION_CREDENTIALS || null,
    
    // Free tier: 1 million characters/month
    // Paid: More characters and premium voices
    limits: {
      maxCharactersPerMonth: 1000000,
      maxCharactersPerRequest: 5000
    },
    
    // Voice settings
    voiceSettings: {
      default: {
        languageCode: "en-US",
        name: "en-US-Neural2-C",  // Female voice, natural
        ssmlGender: "FEMALE",
        speakingRate: 1.0,
        pitch: 0.0
      },
      male: {
        languageCode: "en-US",
        name: "en-US-Neural2-A",  // Male voice
        ssmlGender: "MALE",
        speakingRate: 1.0,
        pitch: 0.0
      },
      robotic: {
        languageCode: "en-US",
        name: "en-US-Standard-E",  // More robotic
        ssmlGender: "MALE",
        speakingRate: 0.95,
        pitch: -2.0
      }
    }
  },

  // ============================================
  // DATABASE
  // ============================================
  mongodb: {
    uri: process.env.MONGODB_URI || null,
  },

  // ============================================
  // PAYMENT GATEWAY (For future use)
  // ============================================
  razorpay: {
    keyId: process.env.RAZORPAY_KEY_ID || null,
    keySecret: process.env.RAZORPAY_KEY_SECRET || null
  },

  // ============================================
  // EMAIL SERVICE (For future use)
  // ============================================
  email: {
    service: "gmail", // or sendgrid, aws-ses, etc.
    from: process.env.EMAIL_USER || null,
    password: process.env.EMAIL_PASS || null
  }
};
