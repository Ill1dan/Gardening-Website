const express = require('express');
const router = express.Router();
const {
  createReview,
  updateReview,
  deleteReview,
  getUserReviews,
  voteHelpful,
  getReviewById,
  adminGetAllReviews,
  adminHardDeleteReview
} = require('../controllers/reviewController');

const { protect, requireRole } = require('../middleware/auth');
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

// Admin routes
router.get('/admin/all', requireRole('admin'), adminGetAllReviews);
router.delete('/admin/:id/permanent', requireRole('admin'), adminHardDeleteReview);

module.exports = router;
