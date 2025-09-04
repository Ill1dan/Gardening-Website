const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  plant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plant',
    required: [true, 'Plant reference is required']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to ensure one favorite per user per plant
favoriteSchema.index({ user: 1, plant: 1 }, { unique: true });

// Indexes for better performance
favoriteSchema.index({ user: 1 });
favoriteSchema.index({ plant: 1 });
favoriteSchema.index({ createdAt: -1 });

// Post-save middleware to update plant's favorite count
favoriteSchema.post('save', async function() {
  await this.constructor.updatePlantFavoriteCount(this.plant);
});

// Post-remove middleware to update plant's favorite count
favoriteSchema.post('remove', async function() {
  await this.constructor.updatePlantFavoriteCount(this.plant);
});

// Static method to update plant's favorite count
favoriteSchema.statics.updatePlantFavoriteCount = async function(plantId) {
  const Plant = mongoose.model('Plant');
  
  const count = await this.countDocuments({ plant: plantId });
  await Plant.findByIdAndUpdate(plantId, { favoriteCount: count });
};

// Static method to get user's favorites
favoriteSchema.statics.getUserFavorites = function(userId, options = {}) {
  return this.find({ user: userId })
    .populate('plant')
    .limit(options.limit || 20)
    .skip(options.skip || 0)
    .sort(options.sort || { createdAt: -1 });
};

// Static method to check if user has favorited a plant
favoriteSchema.statics.isFavorited = async function(userId, plantId) {
  const favorite = await this.findOne({ user: userId, plant: plantId });
  return !!favorite;
};

module.exports = mongoose.model('Favorite', favoriteSchema);
