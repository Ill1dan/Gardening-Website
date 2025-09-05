const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
    maxlength: [200, 'Article title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  excerpt: {
    type: String,
    required: [true, 'Article excerpt is required'],
    maxlength: [500, 'Article excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Article content is required'],
    maxlength: [10000, 'Article content cannot exceed 10000 characters']
  },
  category: {
    type: String,
    required: [true, 'Article category is required'],
    enum: {
      values: ['gardening-tips', 'plant-care', 'seasonal-guides', 'pest-control', 'soil-fertilizer', 'tools-equipment', 'beginner-guides', 'advanced-techniques', 'indoor-gardening', 'outdoor-gardening'],
      message: 'Category must be one of the valid options'
    }
  },
  tags: [{
    type: String,
    lowercase: true,
    trim: true,
    maxlength: [30, 'Each tag cannot exceed 30 characters']
  }],
  featuredImage: {
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    },
    caption: {
      type: String,
      maxlength: [200, 'Image caption cannot exceed 200 characters']
    }
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  commentCount: {
    type: Number,
    default: 0
  },
  readingTime: {
    type: Number, // in minutes
    default: 5
  },
  publishedAt: {
    type: Date
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
articleSchema.index({ title: 1 });
articleSchema.index({ slug: 1 });
articleSchema.index({ category: 1 });
articleSchema.index({ status: 1 });
articleSchema.index({ author: 1 });
articleSchema.index({ featured: 1 });
articleSchema.index({ isActive: 1 });
articleSchema.index({ publishedAt: -1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ viewCount: -1 });
articleSchema.index({ likeCount: -1 });
articleSchema.index({ tags: 1 });

// Virtual for reading time calculation
articleSchema.virtual('calculatedReadingTime').get(function() {
  const wordsPerMinute = 200;
  const wordCount = this.content.split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
});

// Pre-save middleware to generate slug and set reading time
articleSchema.pre('save', function(next) {
  // Generate slug from title if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Calculate reading time
  if (this.isModified('content')) {
    this.readingTime = this.calculatedReadingTime;
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Update lastModifiedAt
  this.lastModifiedAt = new Date();

  next();
});

// Instance method to increment view count
articleSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Instance method to increment like count
articleSchema.methods.incrementLikeCount = function() {
  this.likeCount += 1;
  return this.save();
};

// Instance method to decrement like count
articleSchema.methods.decrementLikeCount = function() {
  this.likeCount = Math.max(0, this.likeCount - 1);
  return this.save();
};

// Static method to get published articles
articleSchema.statics.getPublishedArticles = function(options = {}) {
  const query = { 
    status: 'published', 
    isActive: true 
  };
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.author) {
    query.author = options.author;
  }
  
  if (options.featured) {
    query.featured = true;
  }

  return this.find(query)
    .populate('author', 'username firstName lastName profileImage experienceLevel')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort(options.sort || { publishedAt: -1 });
};

// Static method to search articles
articleSchema.statics.searchArticles = function(searchTerm, options = {}) {
  const query = {
    status: 'published',
    isActive: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { excerpt: { $regex: searchTerm, $options: 'i' } },
      { content: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  
  return this.find(query)
    .populate('author', 'username firstName lastName profileImage experienceLevel')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort(options.sort || { publishedAt: -1 });
};

// Static method to get featured articles
articleSchema.statics.getFeaturedArticles = function(limit = 6) {
  return this.find({ 
    featured: true, 
    status: 'published', 
    isActive: true 
  })
    .populate('author', 'username firstName lastName profileImage experienceLevel')
    .limit(limit)
    .sort({ publishedAt: -1 });
};

// Static method to get articles by category
articleSchema.statics.getArticlesByCategory = function(category, options = {}) {
  const query = { 
    category, 
    status: 'published', 
    isActive: true 
  };
  
  return this.find(query)
    .populate('author', 'username firstName lastName profileImage experienceLevel')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort(options.sort || { publishedAt: -1 });
};

// Static method to get author's articles
articleSchema.statics.getAuthorArticles = function(authorId, options = {}) {
  const query = { 
    author: authorId,
    isActive: true 
  };
  
  if (options.status) {
    query.status = options.status;
  }
  
  return this.find(query)
    .populate('author', 'username firstName lastName profileImage experienceLevel')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort(options.sort || { createdAt: -1 });
};

module.exports = mongoose.model('Article', articleSchema);
