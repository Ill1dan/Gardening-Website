const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const path = require('path');
const { deleteOldProfileImage } = require('../middleware/upload');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d'
  });
};

// Send token response
const sendTokenResponse = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    message,
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      profileImage: user.profileImage,
      bio: user.bio,
      location: user.location,
      experienceLevel: user.experienceLevel,
      specializations: user.specializations,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    }
  });
};

// Send token response with promotion notification
const sendTokenResponseWithPromotion = (user, statusCode, res, message) => {
  const token = generateToken(user._id);
  
  // Remove password from output
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    message,
    token,
    wasPromoted: true,
    promotionInfo: {
      newLevel: user.experienceLevel,
      promotedAt: user.experienceLevelUpdatedAt
    },
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      role: user.role,
      profileImage: user.profileImage,
      bio: user.bio,
      location: user.location,
      experienceLevel: user.experienceLevel,
      specializations: user.specializations,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt
    }
  });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { 
      username, 
      email, 
      password, 
      firstName, 
      lastName, 
      role = 'viewer',
      bio,
      location,
      experienceLevel,
      specializations
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: existingUser.email === email 
          ? 'User with this email already exists' 
          : 'Username already taken'
      });
    }

    // Create user
    const user = await User.create({
      username,
      email,
      password,
      firstName,
      lastName,
      role,
      bio,
      location,
      experienceLevel,
      specializations
    });

    sendTokenResponse(user, 201, res, 'User registered successfully');

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Check for user and include password
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account has been deactivated'
      });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(401).json({
        success: false,
        message: 'Your account has been temporarily banned. Please contact support for more information.',
        banReason: user.banReason
      });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check if user was promoted since last login
    const wasPromoted = user.experienceLevelUpdatedAt && 
                       user.lastLogin && 
                       user.experienceLevelUpdatedAt > user.lastLogin;

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Send response with promotion info
    if (wasPromoted) {
      sendTokenResponseWithPromotion(user, 200, res, 'Login successful');
    } else {
      sendTokenResponse(user, 200, res, 'Login successful');
    }

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        location: user.location,
        experienceLevel: user.experienceLevel,
        specializations: user.specializations,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      firstName,
      lastName,
      bio,
      location,
      experienceLevel,
      specializations
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        firstName,
        lastName,
        bio,
        location,
        experienceLevel,
        specializations
      },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        fullName: user.fullName,
        role: user.role,
        profileImage: user.profileImage,
        bio: user.bio,
        location: user.location,
        experienceLevel: user.experienceLevel,
        specializations: user.specializations,
        isEmailVerified: user.isEmailVerified,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile update',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Change password
// @route   PUT /api/auth/password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password change',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Upload profile image
// @route   POST /api/auth/profile/image
// @access  Private
const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete old profile image if it exists
    if (user.profileImage) {
      deleteOldProfileImage(user.profileImage);
    }

    // Update user with new profile image path
    const imageUrl = `/uploads/profile-images/${req.file.filename}`;
    user.profileImage = imageUrl;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile image uploaded successfully',
      data: {
        profileImage: imageUrl
      }
    });

  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Delete profile image
// @route   DELETE /api/auth/profile/image
// @access  Private
const deleteProfileImage = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Delete the image file if it exists
    if (user.profileImage) {
      deleteOldProfileImage(user.profileImage);
      
      // Remove profile image from user document
      user.profileImage = null;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Profile image deleted successfully'
    });

  } catch (error) {
    console.error('Delete profile image error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during image deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  uploadProfileImage,
  deleteProfileImage
};
