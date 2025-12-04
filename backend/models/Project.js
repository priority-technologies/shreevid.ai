const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    prompt: { type: String, required: true },
    imageUrl: { type: String, required: true },
    thumbnailUrl: { type: String }, // thumbnail for preview
    videoUrl: { type: String }, // after generation
    videoStatus: { type: String, enum: ['pending', 'processing', 'generating', 'completed', 'failed'], default: 'pending' },
    duration: { type: Number }, // in seconds
    resolution: { type: String, default: '1080p' },
    voiceSettings: {
      voice: { type: String, default: 'default' },
      backgroundNoise: { type: Number, default: 0 }, // 0-100
    },
    costCredits: { type: Number, default: 10 },
    watermarkApplied: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Project', projectSchema);
