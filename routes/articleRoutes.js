const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getFeaturedArticles,
  getCategories,
  getAuthorArticles,
  toggleArticleLike,
  incrementArticleView,
  adminGetAllArticles,
  adminHardDeleteArticle,
  adminToggleFeatured
} = require('../controllers/articleController');

const { protect, requireRole, optionalAuth } = require('../middleware/auth');
const { validateArticle, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/', optionalAuth, getArticles);
router.get('/featured', getFeaturedArticles);
router.get('/categories', getCategories);
router.get('/author/:authorId', getAuthorArticles);

// Protected routes (require authentication)
// Like/Unlike routes
router.post('/:id/like', protect, toggleArticleLike);

// View increment route (public, no auth required)
router.post('/:id/view', incrementArticleView);

// Article detail route (must come after specific routes to avoid conflicts)
router.get('/:id', getArticleById);

// Article management routes (gardener+ only)
router.post('/', protect, requireRole('gardener'), validateArticle, handleValidationErrors, createArticle);
router.put('/:id', protect, requireRole('gardener'), validateArticle, handleValidationErrors, updateArticle);
router.delete('/:id', protect, requireRole('gardener'), deleteArticle);

// Admin routes
router.get('/admin/all', protect, requireRole('admin'), adminGetAllArticles);
router.put('/admin/:id/featured', protect, requireRole('admin'), adminToggleFeatured);
router.delete('/admin/:id/permanent', protect, requireRole('admin'), adminHardDeleteArticle);

module.exports = router;
