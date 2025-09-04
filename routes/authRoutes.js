const express = require('express');
const {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  uploadProfileImage,
  deleteProfileImage
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange
} = require('../middleware/validation');
const { uploadSingle, handleUploadError } = require('../middleware/upload');

const router = express.Router();

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, validateProfileUpdate, updateProfile);
router.put('/password', protect, validatePasswordChange, changePassword);

// Profile image routes
router.post('/profile/image', protect, uploadSingle, handleUploadError, uploadProfileImage);
router.delete('/profile/image', protect, deleteProfileImage);

module.exports = router;
