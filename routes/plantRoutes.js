const express = require('express');
const router = express.Router();
const {
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
  getCategories
} = require('../controllers/plantController');

const { protect, requireRole } = require('../middleware/auth');
const { validatePlant, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/', getPlants);
router.get('/featured', getFeaturedPlants);
router.get('/categories', getCategories);
router.get('/:id', getPlantById);
router.get('/:id/reviews', getPlantReviews);

// Protected routes (require authentication)
// Favorites routes
router.get('/favorites/my', protect, getUserFavorites);
router.post('/:id/favorites', protect, addToFavorites);
router.delete('/:id/favorites', protect, removeFromFavorites);

// Plant management routes (gardener+ only)
router.post('/', protect, requireRole('gardener'), validatePlant, handleValidationErrors, createPlant);
router.put('/:id', protect, requireRole('gardener'), validatePlant, handleValidationErrors, updatePlant);
router.delete('/:id', protect, requireRole('gardener'), deletePlant);

module.exports = router;
