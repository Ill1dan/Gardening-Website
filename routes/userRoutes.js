const express = require('express');
const {
  getAllUsers,
  getUserById,
  updateUserRole,
  deactivateUser,
  reactivateUser,
  getUserStats,
  getGardeners,
  banUser,
  unbanUser,
  permanentlyDeleteUser,
  updateUserExperience
} = require('../controllers/userController');
const { protect, authorize, requireRole, authorizeOwnerOrAdmin } = require('../middleware/auth');
const {
  validateRoleUpdate,
  validateObjectId,
  validateUserQuery,
  validateGardenerQuery
} = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/gardeners', validateGardenerQuery, getGardeners);

// Protected routes - require authentication
router.use(protect);

// Routes accessible by authenticated users
router.get('/:id', validateObjectId(), authorizeOwnerOrAdmin, getUserById);

// Admin only routes
router.get('/', authorize('admin'), validateUserQuery, getAllUsers);
router.get('/admin/stats', authorize('admin'), getUserStats);
router.put('/:id/role', authorize('admin'), validateObjectId(), validateRoleUpdate, updateUserRole);
router.put('/:id/deactivate', authorize('admin'), validateObjectId(), deactivateUser);
router.put('/:id/reactivate', authorize('admin'), validateObjectId(), reactivateUser);
router.put('/:id/ban', authorize('admin'), validateObjectId(), banUser);
router.put('/:id/unban', authorize('admin'), validateObjectId(), unbanUser);
router.put('/:id/experience', authorize('admin'), validateObjectId(), updateUserExperience);
router.delete('/:id/permanent', authorize('admin'), validateObjectId(), permanentlyDeleteUser);

module.exports = router;
