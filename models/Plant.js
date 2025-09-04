const mongoose = require('mongoose');

const plantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Plant name is required'],
    trim: true,
    maxlength: [100, 'Plant name cannot exceed 100 characters']
  },
  scientificName: {
    type: String,
    trim: true,
    maxlength: [100, 'Scientific name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['indoor', 'outdoor', 'herbs', 'vegetables', 'flowers', 'trees', 'succulents', 'tools', 'fertilizers', 'seeds'],
      message: 'Category must be one of the valid options'
    }
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: {
      values: ['plant', 'seed', 'tool', 'fertilizer', 'accessory'],
      message: 'Type must be one of the valid options'
    },
    default: 'plant'
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
    maxlength: [200, 'Short description cannot exceed 200 characters']
  },
  fullDescription: {
    type: String,
    required: [true, 'Full description is required'],
    maxlength: [2000, 'Full description cannot exceed 2000 characters']
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
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  careInstructions: {
    sunlight: {
      type: String,
      enum: ['low', 'medium', 'high', 'direct', 'indirect']
    },
    water: {
      type: String,
      enum: ['low', 'medium', 'high', 'daily', 'weekly', 'bi-weekly', 'monthly']
    },
    soilType: {
      type: String,
      enum: ['well-draining', 'moist', 'sandy', 'loamy', 'clay', 'acidic', 'alkaline']
    },
    temperature: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
      }
    },
    humidity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    fertilizer: {
      frequency: {
        type: String,
        enum: ['never', 'monthly', 'bi-monthly', 'quarterly', 'seasonally']
      },
      fertilizerType: {
        type: String,
        trim: true
      }
    }
  },
  growthInfo: {
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert']
    },
    growthRate: {
      type: String,
      enum: ['slow', 'medium', 'fast']
    },
    matureSize: {
      height: {
        value: Number,
        unit: {
          type: String,
          enum: ['cm', 'inches', 'feet', 'meters'],
          default: 'cm'
        }
      },
      width: {
        value: Number,
        unit: {
          type: String,
          enum: ['cm', 'inches', 'feet', 'meters'],
          default: 'cm'
        }
      }
    },
    bloomTime: String,
    harvestTime: String
  },
  benefits: [{
    type: String,
    maxlength: [100, 'Each benefit cannot exceed 100 characters']
  }],
  tags: [{
    type: String,
    lowercase: true,
    trim: true
  }],
  plantingInstructions: {
    type: String,
    maxlength: [1000, 'Planting instructions cannot exceed 1000 characters']
  },
  commonProblems: [{
    problem: {
      type: String,
      required: true,
      maxlength: [100, 'Problem description cannot exceed 100 characters']
    },
    solution: {
      type: String,
      required: true,
      maxlength: [300, 'Solution cannot exceed 300 characters']
    }
  }],
  price: {
    amount: {
      type: Number,
      min: [0, 'Price cannot be negative']
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  availability: {
    type: String,
    enum: ['in-stock', 'out-of-stock', 'pre-order', 'seasonal'],
    default: 'in-stock'
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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
  favoriteCount: {
    type: Number,
    default: 0
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
plantSchema.index({ name: 1 });
plantSchema.index({ category: 1 });
plantSchema.index({ type: 1 });
plantSchema.index({ 'careInstructions.difficulty': 1 });
plantSchema.index({ 'careInstructions.sunlight': 1 });
plantSchema.index({ 'careInstructions.water': 1 });
plantSchema.index({ tags: 1 });
plantSchema.index({ featured: 1 });
plantSchema.index({ isActive: 1 });
plantSchema.index({ createdAt: -1 });
plantSchema.index({ averageRating: -1 });
plantSchema.index({ favoriteCount: -1 });

// Virtual for primary image
plantSchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary || this.images[0] || null;
});

// Virtual for related plants (simplified - could be enhanced with ML)
// Temporarily disabled to prevent issues
// plantSchema.virtual('relatedPlants', {
//   ref: 'Plant',
//   localField: 'category',
//   foreignField: 'category',
//   match: function() {
//     return { 
//       _id: { $ne: this._id },
//       isActive: true
//     };
//   },
//   options: { limit: 6, sort: { averageRating: -1 } }
// });

// Pre-save middleware to ensure only one primary image
plantSchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    let primaryCount = 0;
    this.images.forEach((img, index) => {
      if (img.isPrimary) {
        primaryCount++;
        if (primaryCount > 1) {
          img.isPrimary = false;
        }
      }
    });
    
    // If no primary image is set, make the first one primary
    if (primaryCount === 0) {
      this.images[0].isPrimary = true;
    }
  }
  next();
});

// Instance method to increment view count
plantSchema.methods.incrementViewCount = function() {
  this.viewCount += 1;
  return this.save();
};

// Static method to get featured plants
plantSchema.statics.getFeaturedPlants = function(limit = 6) {
  return this.find({ featured: true, isActive: true })
    .populate('addedBy', 'username firstName lastName')
    .limit(limit)
    .sort({ createdAt: -1 });
};

// Static method to get plants by category
plantSchema.statics.getPlantsByCategory = function(category, options = {}) {
  const query = { category, isActive: true };
  return this.find(query)
    .populate('addedBy', 'username firstName lastName')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort(options.sort || { createdAt: -1 });
};

// Static method to search plants
plantSchema.statics.searchPlants = function(searchTerm, options = {}) {
  const query = {
    isActive: true,
    $or: [
      { name: { $regex: searchTerm, $options: 'i' } },
      { shortDescription: { $regex: searchTerm, $options: 'i' } },
      { tags: { $in: [new RegExp(searchTerm, 'i')] } }
    ]
  };
  
  return this.find(query)
    .populate('addedBy', 'username firstName lastName')
    .limit(options.limit || 12)
    .skip(options.skip || 0)
    .sort(options.sort || { averageRating: -1 });
};

module.exports = mongoose.model('Plant', plantSchema);
