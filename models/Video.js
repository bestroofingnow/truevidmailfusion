const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String },
  duration: { type: Number },
  recipients: [{
    email: String,
    viewedAt: Date,
    viewCount: { type: Number, default: 0 }
  }],
  shareableLink: { type: String, unique: true },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

module.exports = mongoose.model('Video', videoSchema);
