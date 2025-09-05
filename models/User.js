const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please enter a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long'],
    select: false // Don't include password in queries by default
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  role: {
    type: String,
    enum: {
      values: ['viewer', 'gardener', 'admin'],
      message: 'Role must be either viewer, gardener, or admin'
    },
    default: 'viewer'
  },
  profileImage: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot exceed 100 characters'],
    default: ''
  },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    default: 'beginner'
  },
  experienceLevelUpdatedAt: {
    type: Date,
    default: null
  },
  specializations: [{
    type: String,
    enum: ['vegetables', 'flowers', 'herbs', 'trees', 'indoor-plants', 'organic-gardening', 'landscaping', 'composting']
  }],
  isActive: {
    type: Boolean,
    default: true
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  banReason: {
    type: String,
    maxlength: [500, 'Ban reason cannot exceed 500 characters'],
    default: null
  },
  bannedAt: {
    type: Date,
    default: null
  },
  bannedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Index for better performance
userSchema.index({ email: 1 });
userSchema.index({ username: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });
userSchema.index({ isBanned: 1 });

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  // Only hash password if it's been modified
  if (!this.isModified('password')) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update updatedAt
userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check password
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to check if user has permission
userSchema.methods.hasPermission = function(requiredRole) {
  const roleHierarchy = {
    viewer: 1,
    gardener: 2,
    admin: 3
  };
  
  return roleHierarchy[this.role] >= roleHierarchy[requiredRole];
};

// Static method to get users by role
userSchema.statics.getUsersByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Static method to get user statistics
userSchema.statics.getUserStats = function() {
  return this.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$role', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ]);
};

// Static method to ban a user
userSchema.statics.banUser = async function(userId, banReason, bannedBy) {
  return this.findByIdAndUpdate(
    userId,
    {
      isBanned: true,
      banReason,
      bannedAt: new Date(),
      bannedBy
    },
    { new: true }
  );
};

// Static method to unban a user
userSchema.statics.unbanUser = async function(userId) {
  return this.findByIdAndUpdate(
    userId,
    {
      isBanned: false,
      banReason: null,
      bannedAt: null,
      bannedBy: null
    },
    { new: true }
  );
};

// Static method to permanently delete a user and all related data
userSchema.statics.permanentlyDeleteUser = async function(userId) {
  const mongoose = require('mongoose');
  const Plant = mongoose.model('Plant');
  const Review = mongoose.model('Review');
  const Favorite = mongoose.model('Favorite');
  
  // Delete all plants created by the user
  await Plant.deleteMany({ addedBy: userId });
  
  // Delete all reviews by the user
  await Review.deleteMany({ user: userId });
  
  // Delete all favorites by the user
  await Favorite.deleteMany({ user: userId });
  
  // Finally delete the user
  return this.findByIdAndDelete(userId);
};

module.exports = mongoose.model('User', userSchema);
