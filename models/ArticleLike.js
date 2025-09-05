const mongoose = require('mongoose');

const articleLikeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: [true, 'Article reference is required']
  }
}, {
  timestamps: true
});

// Compound index to ensure one like per user per article
articleLikeSchema.index({ user: 1, article: 1 }, { unique: true });

// Indexes for better performance
articleLikeSchema.index({ user: 1 });
articleLikeSchema.index({ article: 1 });

module.exports = mongoose.model('ArticleLike', articleLikeSchema);
