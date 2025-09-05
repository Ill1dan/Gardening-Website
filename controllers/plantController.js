const Plant = require('../models/Plant');
const Review = require('../models/Review');
const Favorite = require('../models/Favorite');
const mongoose = require('mongoose');

// Get all plants with filtering and pagination
const getPlants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      type,
      difficulty,
      sunlight,
      water,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build filter query
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (difficulty) filter['growthInfo.difficulty'] = difficulty;
    if (sunlight) filter['careInstructions.sunlight'] = sunlight;
    if (water) filter['careInstructions.water'] = water;
    if (featured === 'true') filter.featured = true;

    // Add search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const plants = await Plant.find(filter)
      .populate('addedBy', 'username firstName lastName')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortObj);

    // Get total count for pagination
    const totalCount = await Plant.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: plants,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getPlants:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plants',
      error: error.message
    });
  }
};

// Get single plant by ID
const getPlantById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }

    const plant = await Plant.findById(id)
      .populate('addedBy', 'username firstName lastName profileImage experienceLevel specializations');

    if (!plant || !plant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Increment view count
    await plant.incrementViewCount();

    // Get related plants
    const relatedPlants = await Plant.find({
      _id: { $ne: plant._id },
      category: plant.category,
      isActive: true
    })
      .limit(6)
      .sort({ averageRating: -1 });

    res.json({
      success: true,
      data: {
        plant,
        relatedPlants
      }
    });
  } catch (error) {
    console.error('Error in getPlantById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plant',
      error: error.message
    });
  }
};

// Create new plant (gardeners and admins only)
const createPlant = async (req, res) => {
  try {
    const plantData = {
      ...req.body,
      addedBy: req.user._id
    };

    // Custom validation for plant/seeds
    if (plantData.type === 'plant' || plantData.type === 'seed') {
      if (!plantData.careInstructions?.sunlight) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: ['Sunlight is required for plants and seeds']
        });
      }
      if (!plantData.careInstructions?.water) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: ['Water requirement is required for plants and seeds']
        });
      }
      if (!plantData.careInstructions?.soilType) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: ['Soil type is required for plants and seeds']
        });
      }
      if (!plantData.growthInfo?.difficulty) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: ['Difficulty level is required for plants and seeds']
        });
      }
    }

    const plant = new Plant(plantData);
    await plant.save();

    const populatedPlant = await Plant.findById(plant._id)
      .populate('addedBy', 'username firstName lastName');

    res.status(201).json({
      success: true,
      message: 'Plant created successfully',
      data: populatedPlant
    });
  } catch (error) {
    console.error('Error in createPlant:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating plant',
      error: error.message
    });
  }
};

// Update plant (gardeners can update their own, admins can update any)
const updatePlant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }

    const plant = await Plant.findById(id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && plant.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this plant'
      });
    }

    // Custom validation for plant/seeds
    if (req.body.type === 'plant' || req.body.type === 'seed') {
      if (!req.body.careInstructions?.sunlight) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: ['Sunlight is required for plants and seeds']
        });
      }
      if (!req.body.careInstructions?.water) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: ['Water requirement is required for plants and seeds']
        });
      }
      if (!req.body.careInstructions?.soilType) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: ['Soil type is required for plants and seeds']
        });
      }
      if (!req.body.growthInfo?.difficulty) {
        return res.status(400).json({
          success: false,
          message: 'Validation error',
          errors: ['Difficulty level is required for plants and seeds']
        });
      }
    }

    const updatedPlant = await Plant.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('addedBy', 'username firstName lastName');

    res.json({
      success: true,
      message: 'Plant updated successfully',
      data: updatedPlant
    });
  } catch (error) {
    console.error('Error in updatePlant:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating plant',
      error: error.message
    });
  }
};

// Delete plant (soft delete - set isActive to false)
const deletePlant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }

    const plant = await Plant.findById(id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && plant.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this plant'
      });
    }

    await Plant.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Plant deleted successfully'
    });
  } catch (error) {
    console.error('Error in deletePlant:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting plant',
      error: error.message
    });
  }
};

// Get plant reviews
const getPlantReviews = async (req, res) => {
  try {
    const { id } = req.params;
    const { page = 1, limit = 10, sortBy = 'helpfulVotes' } = req.query;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const sortObj = {};
    if (sortBy === 'newest') {
      sortObj.createdAt = -1;
    } else if (sortBy === 'oldest') {
      sortObj.createdAt = 1;
    } else if (sortBy === 'rating-high') {
      sortObj.rating = -1;
    } else if (sortBy === 'rating-low') {
      sortObj.rating = 1;
    } else {
      sortObj.helpfulVotes = -1;
      sortObj.createdAt = -1;
    }

    const reviews = await Review.find({ plant: id, isActive: true })
      .populate('user', 'username firstName lastName profileImage')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortObj);

    const totalCount = await Review.countDocuments({ plant: id, isActive: true });
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    // Get rating distribution
    const ratingStats = await Review.aggregate([
      { $match: { plant: new mongoose.Types.ObjectId(id), isActive: true } },
      { $group: { _id: '$rating', count: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        ratingStats,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNextPage: parseInt(page) < totalPages,
          hasPrevPage: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error in getPlantReviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reviews',
      error: error.message
    });
  }
};

// Add plant to favorites
const addToFavorites = async (req, res) => {
  try {
    const { id } = req.params;
    const { notes = '' } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }

    // Check if plant exists
    const plant = await Plant.findById(id);
    if (!plant || !plant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Check if already favorited
    const existingFavorite = await Favorite.findOne({
      user: req.user._id,
      plant: id
    });

    if (existingFavorite) {
      return res.status(400).json({
        success: false,
        message: 'Plant already in favorites'
      });
    }

    const favorite = new Favorite({
      user: req.user._id,
      plant: id,
      notes
    });

    await favorite.save();

    res.status(201).json({
      success: true,
      message: 'Plant added to favorites'
    });
  } catch (error) {
    console.error('Error in addToFavorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
};

// Remove plant from favorites
const removeFromFavorites = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }

    const favorite = await Favorite.findOneAndDelete({
      user: req.user._id,
      plant: id
    });

    if (!favorite) {
      return res.status(404).json({
        success: false,
        message: 'Favorite not found'
      });
    }

    res.json({
      success: true,
      message: 'Plant removed from favorites'
    });
  } catch (error) {
    console.error('Error in removeFromFavorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
};

// Get user's favorite plants
const getUserFavorites = async (req, res) => {
  try {
    const { page = 1, limit = 12 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const favorites = await Favorite.find({ user: req.user._id })
      .populate('plant')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalCount = await Favorite.countDocuments({ user: req.user._id });
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: favorites,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getUserFavorites:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

// Get featured plants
const getFeaturedPlants = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const plants = await Plant.getFeaturedPlants(parseInt(limit));

    res.json({
      success: true,
      data: plants
    });
  } catch (error) {
    console.error('Error in getFeaturedPlants:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured plants',
      error: error.message
    });
  }
};

// Get plant categories with counts
const getCategories = async (req, res) => {
  try {
    const categories = await Plant.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Admin: Get all plants including inactive ones
const adminGetAllPlants = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      type,
      difficulty,
      sunlight,
      water,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      isActive
    } = req.query;

    // Build filter query - admin can see inactive plants
    const filter = {};
    
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (difficulty) filter['growthInfo.difficulty'] = difficulty;
    if (sunlight) filter['careInstructions.sunlight'] = sunlight;
    if (water) filter['careInstructions.water'] = water;
    if (featured === 'true') filter.featured = true;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    // Add search functionality
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const plants = await Plant.find(filter)
      .populate('addedBy', 'username firstName lastName')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortObj);

    // Get total count for pagination
    const totalCount = await Plant.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: plants,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in adminGetAllPlants:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching plants',
      error: error.message
    });
  }
};

// Admin: Hard delete plant (permanent deletion)
const adminHardDeletePlant = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }

    const plant = await Plant.findById(id);
    
    if (!plant) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Hard delete the plant and all related data
    await Plant.findByIdAndDelete(id);
    
    // Delete all reviews for this plant
    await Review.deleteMany({ plant: id });
    
    // Delete all favorites for this plant
    await Favorite.deleteMany({ plant: id });

    res.json({
      success: true,
      message: 'Plant permanently deleted'
    });
  } catch (error) {
    console.error('Error in adminHardDeletePlant:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting plant',
      error: error.message
    });
  }
};

module.exports = {
  getPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
  getPlantReviews,
  addToFavorites,
  removeFromFavorites,
  getUserFavorites,
  getFeaturedPlants,
  getCategories,
  adminGetAllPlants,
  adminHardDeletePlant
};
