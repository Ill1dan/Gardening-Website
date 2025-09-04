const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  voteHelpful,
  getReviewById
} = require('../controllers/reviewController');

const { protect } = require('../middleware/auth');
const { validateReview, handleValidationErrors } = require('../middleware/validation');

// All review routes require authentication
router.use(protect);

// Review management
router.post('/plant/:plantId', validateReview, handleValidationErrors, createReview);
router.get('/my', getUserReviews);
router.get('/:id', getReviewById);
router.put('/:id', validateReview, handleValidationErrors, updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', voteHelpful);

module.exports = router;
