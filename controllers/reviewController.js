const Review = require('../models/Review');
const Plant = require('../models/Plant');
const mongoose = require('mongoose');

// Create a new review
const createReview = async (req, res) => {
  try {
    const { plantId } = req.params;
    const { rating, title, comment, images = [] } = req.body;

    if (!mongoose.Types.ObjectId.isValid(plantId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid plant ID'
      });
    }

    // Check if plant exists
    const plant = await Plant.findById(plantId);
    if (!plant || !plant.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Plant not found'
      });
    }

    // Check if user has already reviewed this plant
    const existingReview = await Review.findOne({
      plant: plantId,
      user: req.user._id,
      isActive: true
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this plant'
      });
    }

    const review = new Review({
      plant: plantId,
      user: req.user._id,
      rating,
      title,
      comment,
      images
    });

    await review.save();

    // Update plant rating manually
    try {
      await Review.updatePlantRating(plantId);
    } catch (error) {
      console.error('Error updating plant rating:', error);
      // Don't fail the review creation if rating update fails
    }

    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username firstName lastName profileImage')
      .populate('plant', 'name')
      .lean(); // Use lean() to avoid virtuals issues

    // Send response immediately after saving
    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: populatedReview
    });
  } catch (error) {
    console.error('Error in createReview:', error);
    
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
      message: 'Error creating review',
      error: error.message
    });
  }
};

// Update a review
const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (title !== undefined) updateData.title = title;
    if (comment !== undefined) updateData.comment = comment;
    if (images !== undefined) updateData.images = images;

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('user', 'username firstName lastName profileImage')
      .populate('plant', 'name');

    res.json({
      success: true,
      message: 'Review updated successfully',
      data: updatedReview
    });
  } catch (error) {
    console.error('Error in updateReview:', error);
    
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
      message: 'Error updating review',
      error: error.message
    });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    await Review.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteReview:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting review',
      error: error.message
    });
  }
};

// Get user's reviews
const getUserReviews = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ 
      user: req.user._id, 
      isActive: true 
    })
      .populate('plant', 'name images category')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ createdAt: -1 });

    const totalCount = await Review.countDocuments({ 
      user: req.user._id, 
      isActive: true 
    });
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: reviews,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getUserReviews:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user reviews',
      error: error.message
    });
  }
};

// Vote review as helpful
const voteHelpful = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findById(id);
    
    if (!review || !review.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Prevent users from voting on their own reviews
    if (review.user.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Cannot vote on your own review'
      });
    }

    // For simplicity, we'll just increment the helpful votes
    // In a production app, you'd want to track who voted to prevent duplicate votes
    review.helpfulVotes += 1;
    await review.save();

    res.json({
      success: true,
      message: 'Vote recorded successfully',
      data: { helpfulVotes: review.helpfulVotes }
    });
  } catch (error) {
    console.error('Error in voteHelpful:', error);
    res.status(500).json({
      success: false,
      message: 'Error recording vote',
      error: error.message
    });
  }
};

// Get review by ID
const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review ID'
      });
    }

    const review = await Review.findById(id)
      .populate('user', 'username firstName lastName profileImage')
      .populate('plant', 'name images category');

    if (!review || !review.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error('Error in getReviewById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching review',
      error: error.message
    });
  }
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  voteHelpful,
  getReviewById
};
