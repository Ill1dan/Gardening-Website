const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Event title is required'],
    trim: true,
    maxlength: [200, 'Event title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Event description is required'],
    maxlength: [2000, 'Event description cannot exceed 2000 characters']
  },
  shortDescription: {
    type: String,
    required: [true, 'Event short description is required'],
    maxlength: [300, 'Event short description cannot exceed 300 characters']
  },
  type: {
    type: String,
    required: [true, 'Event type is required'],
    enum: {
      values: ['workshop', 'plant-fair', 'seasonal-campaign', 'webinar', 'garden-tour', 'plant-swap', 'community-garden', 'expert-talk'],
      message: 'Event type must be one of the valid options'
    }
  },
  category: {
    type: String,
    required: [true, 'Event category is required'],
    enum: {
      values: ['beginner', 'intermediate', 'advanced', 'all-levels', 'kids', 'seniors', 'community'],
      message: 'Event category must be one of the valid options'
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
  startDate: {
    type: Date,
    required: [true, 'Event start date is required']
  },
  endDate: {
    type: Date,
    required: [true, 'Event end date is required']
  },
  registrationDeadline: {
    type: Date
  },
  location: {
    type: {
      type: String,
      enum: ['online', 'physical', 'hybrid'],
      required: true
    },
    venue: {
      type: String,
      maxlength: [200, 'Venue name cannot exceed 200 characters']
    },
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: { type: String, default: 'USA' }
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    },
    onlineLink: {
      type: String,
      maxlength: [500, 'Online link cannot exceed 500 characters']
    }
  },
  capacity: {
    type: Number,
    min: [1, 'Capacity must be at least 1'],
    max: [10000, 'Capacity cannot exceed 10000']
  },
  currentRegistrations: {
    type: Number,
    default: 0,
    min: [0, 'Current registrations cannot be negative']
  },
  price: {
    type: Number,
    default: 0,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD',
    maxlength: [3, 'Currency code cannot exceed 3 characters']
  },
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  instructors: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'cancelled', 'completed'],
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
  requirements: [{
    type: String,
    maxlength: [200, 'Each requirement cannot exceed 200 characters']
  }],
  whatToExpect: [{
    type: String,
    maxlength: [300, 'Each expectation cannot exceed 300 characters']
  }],
  materials: [{
    item: {
      type: String,
      required: true,
      maxlength: [100, 'Material item name cannot exceed 100 characters']
    },
    required: {
      type: Boolean,
      default: true
    },
    providedByOrganizer: {
      type: Boolean,
      default: false
    }
  }],
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    hours: {
      type: Number,
      min: [0, 'Duration hours cannot be negative'],
      max: [168, 'Duration hours cannot exceed 168 (1 week)']
    },
    minutes: {
      type: Number,
      min: [0, 'Duration minutes cannot be negative'],
      max: [59, 'Duration minutes cannot exceed 59']
    }
  },
  viewCount: {
    type: Number,
    default: 0
  },
  registrationCount: {
    type: Number,
    default: 0
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
eventSchema.index({ title: 1 });
eventSchema.index({ slug: 1 });
eventSchema.index({ type: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ status: 1 });
eventSchema.index({ organizer: 1 });
eventSchema.index({ featured: 1 });
eventSchema.index({ isActive: 1 });
eventSchema.index({ startDate: 1 });
eventSchema.index({ endDate: 1 });
eventSchema.index({ publishedAt: -1 });
eventSchema.index({ createdAt: -1 });
eventSchema.index({ viewCount: -1 });
eventSchema.index({ tags: 1 });
eventSchema.index({ difficulty: 1 });
eventSchema.index({ 'location.type': 1 });

// Virtual for checking if event is upcoming
eventSchema.virtual('isUpcoming').get(function() {
  return this.startDate > new Date();
});

// Virtual for checking if event is ongoing
eventSchema.virtual('isOngoing').get(function() {
  const now = new Date();
  return this.startDate <= now && this.endDate >= now;
});

// Virtual for checking if event is past
eventSchema.virtual('isPast').get(function() {
  return this.endDate < new Date();
});

// Virtual for checking if registration is open
eventSchema.virtual('isRegistrationOpen').get(function() {
  const now = new Date();
  if (this.registrationDeadline && this.registrationDeadline < now) {
    return false;
  }
  if (this.capacity && this.currentRegistrations >= this.capacity) {
    return false;
  }
  return this.status === 'published' && this.isUpcoming;
});

// Virtual for available spots
eventSchema.virtual('availableSpots').get(function() {
  if (!this.capacity) return null;
  return Math.max(0, this.capacity - this.currentRegistrations);
});

// Virtual for total duration in minutes
eventSchema.virtual('totalDurationMinutes').get(function() {
  const hours = this.duration?.hours || 0;
  const minutes = this.duration?.minutes || 0;
  return (hours * 60) + minutes;
});

// Virtual for formatted duration
eventSchema.virtual('formattedDuration').get(function() {
  const hours = this.duration?.hours || 0;
  const minutes = this.duration?.minutes || 0;
  
  if (hours === 0 && minutes === 0) return 'Duration not specified';
  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
});

// Pre-save middleware to generate slug
eventSchema.pre('save', function(next) {
  // Generate slug from title if not provided
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }

  // Set publishedAt when status changes to published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
  }

  // Validate date logic
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    const error = new Error('End date must be after start date');
    error.name = 'ValidationError';
    return next(error);
  }

  if (this.registrationDeadline && this.startDate && this.registrationDeadline >= this.startDate) {
    const error = new Error('Registration deadline must be before start date');
    error.name = 'ValidationError';
    return next(error);
  }

  // Update lastModifiedAt
  this.lastModifiedAt = new Date();

  next();
});

// Instance method to increment view count
eventSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Instance method to increment registration count
eventSchema.methods.incrementRegistrationCount = function() {
  this.registrationCount += 1;
  this.currentRegistrations += 1;
  return this.save();
};

// Instance method to decrement registration count
eventSchema.methods.decrementRegistrationCount = function() {
  this.registrationCount = Math.max(0, this.registrationCount - 1);
  this.currentRegistrations = Math.max(0, this.currentRegistrations - 1);
  return this.save();
};

// Static method to get published events
eventSchema.statics.getPublishedEvents = function(options = {}) {
  const query = { 
    status: 'published', 
    isActive: true 
  };
  
  if (options.type) {
    query.type = options.type;
  }
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.difficulty) {
    query.difficulty = options.difficulty;
  }
  
  if (options.organizer) {
    query.organizer = options.organizer;
  }
  
  if (options.featured) {
    query.featured = true;
  }

  if (options.upcoming) {
    query.startDate = { $gt: new Date() };
  }

  if (options.ongoing) {
    const now = new Date();
    query.startDate = { $lte: now };
    query.endDate = { $gte: now };
  }

  return this.find(query)
    .populate('organizer', 'username firstName lastName profileImage experienceLevel')
    .populate('instructors', 'username firstName lastName profileImage experienceLevel specializations')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort(options.sort || { startDate: 1 });
};

// Static method to search events
eventSchema.statics.searchEvents = function(searchTerm, options = {}) {
  const query = {
    status: 'published',
    isActive: true,
    $or: [
      { title: { $regex: searchTerm, $options: 'i' } },
      { description: { $regex: searchTerm, $options: 'i' } },
      { shortDescription: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  
  return this.find(query)
    .populate('organizer', 'username firstName lastName profileImage experienceLevel')
    .populate('instructors', 'username firstName lastName profileImage experienceLevel specializations')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort(options.sort || { startDate: 1 });
};

// Static method to get featured events
eventSchema.statics.getFeaturedEvents = function(limit = 6) {
  return this.find({ 
    featured: true, 
    status: 'published', 
    isActive: true,
    startDate: { $gt: new Date() } // Only upcoming featured events
  })
    .populate('organizer', 'username firstName lastName profileImage experienceLevel')
    .populate('instructors', 'username firstName lastName profileImage experienceLevel specializations')
    .limit(limit)
    .sort({ startDate: 1 });
};

// Static method to get upcoming events
eventSchema.statics.getUpcomingEvents = function(options = {}) {
  const query = { 
    status: 'published', 
    isActive: true,
    startDate: { $gt: new Date() }
  };
  
  if (options.type) {
    query.type = options.type;
  }
  
  return this.find(query)
    .populate('organizer', 'username firstName lastName profileImage experienceLevel')
    .populate('instructors', 'username firstName lastName profileImage experienceLevel specializations')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort({ startDate: 1 });
};

module.exports = mongoose.model('Event', eventSchema);
