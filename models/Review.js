const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: [true, 'Plant reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  title: {
    type: String,
    required: [true, 'Review title is required'],
    trim: true,
    maxlength: [100, 'Review title cannot exceed 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Review comment is required'],
    trim: true,
    maxlength: [1000, 'Review comment cannot exceed 1000 characters']
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: {
      type: String,
      default: ''
    }
  }],
  helpfulVotes: {
    type: Number,
    default: 0
  },
  isVerifiedPurchase: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
  // Removed virtuals temporarily to prevent issues
  // toJSON: { virtuals: true },
  // toObject: { virtuals: true }
});

// Compound index to ensure one review per user per plant
// Temporarily disabled to prevent unique constraint errors
// reviewSchema.index({ plant: 1, user: 1 }, { unique: true });

// Indexes for better performance
reviewSchema.index({ plant: 1, isActive: 1 });
reviewSchema.index({ user: 1, isActive: 1 });
reviewSchema.index({ rating: -1 });
reviewSchema.index({ createdAt: -1 });
reviewSchema.index({ helpfulVotes: -1 });

// Post-save middleware to update plant's average rating
// Temporarily disabled to prevent errors
reviewSchema.post('save', function() {
  // Disabled for now - will handle rating updates manually in the controller
  // setImmediate(async () => {
  //   try {
  //     await this.constructor.updatePlantRating(this.plant);
  //   } catch (error) {
  //     console.error('Error in post-save middleware:', error);
  //   }
  // });
});

// Post-remove middleware to update plant's average rating
reviewSchema.post('remove', async function() {
  await this.constructor.updatePlantRating(this.plant);
});

// Static method to update plant's average rating
reviewSchema.statics.updatePlantRating = async function(plantId) {
  try {
    // Import Plant model here to avoid circular dependency issues
    const Plant = mongoose.model('Plant');
    
    // Check if plant exists first
    const plantExists = await Plant.findById(plantId);
    if (!plantExists) {
      return;
    }
    
    const stats = await this.aggregate([
      {
        $match: {
          plant: plantId,
          isActive: true
        }
      },
      {
        $group: {
          _id: '$plant',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);
    
    if (stats.length > 0) {
      const updateData = {
        averageRating: Math.round(stats[0].averageRating * 10) / 10, // Round to 1 decimal
        reviewCount: stats[0].reviewCount
      };
      await Plant.findByIdAndUpdate(plantId, updateData);
    } else {
      await Plant.findByIdAndUpdate(plantId, {
        averageRating: 0,
        reviewCount: 0
      });
    }
  } catch (error) {
    console.error('Error updating plant rating:', error);
    // Don't throw error, just log it
  }
};

// Static method to get reviews for a plant
reviewSchema.statics.getPlantReviews = function(plantId, options = {}) {
  return this.find({ plant: plantId, isActive: true })
    .populate('user', 'username firstName lastName profileImage')
    .limit(options.limit || 10)
    .skip(options.skip || 0)
    .sort(options.sort || { helpfulVotes: -1, createdAt: -1 });
};

module.exports = mongoose.model('Review', reviewSchema);
