const { validationResult } = require('express-validator');
const User = require('../models/User');

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const role = req.query.role;
    const search = req.query.search;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const isActive = req.query.isActive;
    const isBanned = req.query.isBanned;

    // Build query - admin can see all users including inactive and banned
    let query = {};

    if (role && ['viewer', 'gardener', 'admin'].includes(role)) {
      query.role = role;
    }

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (isBanned !== undefined) {
      query.isBanned = isBanned === 'true';
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;

    // Get users
    const users = await User.find(query)
      .select('-password')
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip(startIndex);

    // Get total count
    const total = await User.countDocuments(query);

    // Pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        current: page,
        total: totalPages,
        count: users.length,
        totalUsers: total,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage
      }
    });

  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Update user role (Admin only)
// @route   PUT /api/users/:id/role
// @access  Private/Admin
const updateUserRole = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { role } = req.body;
    const userId = req.params.id;

    // Prevent admin from changing their own role
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot change your own role'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User role updated to ${role}`,
      user
    });

  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during role update',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Deactivate user (Admin only)
// @route   PUT /api/users/:id/deactivate
// @access  Private/Admin
const deactivateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deactivating themselves
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: false },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User deactivated successfully',
      user
    });

  } catch (error) {
    console.error('Deactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user deactivation',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Reactivate user (Admin only)
// @route   PUT /api/users/:id/reactivate
// @access  Private/Admin
const reactivateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { isActive: true },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User reactivated successfully',
      user
    });

  } catch (error) {
    console.error('Reactivate user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user reactivation',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Get user statistics (Admin only)
// @route   GET /api/users/stats
// @access  Private/Admin
const getUserStats = async (req, res) => {
  try {
    const stats = await User.getUserStats();
    
    // Get additional statistics
    const totalUsers = await User.countDocuments({ isActive: true });
    const totalInactive = await User.countDocuments({ isActive: false });
    const recentUsers = await User.countDocuments({
      isActive: true,
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // Format role statistics
    const roleStats = {
      viewer: 0,
      gardener: 0,
      admin: 0
    };

    stats.forEach(stat => {
      roleStats[stat._id] = stat.count;
    });

    res.status(200).json({
      success: true,
      stats: {
        total: totalUsers,
        inactive: totalInactive,
        recentSignups: recentUsers,
        byRole: roleStats
      }
    });

  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Get gardeners (Public - for displaying expert gardeners)
// @route   GET /api/users/gardeners
// @access  Public
const getGardeners = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const experienceLevel = req.query.experienceLevel;
    const specialization = req.query.specialization;
    const search = req.query.search;

    // Build query
    let query = { 
      role: 'gardener', 
      isActive: true 
    };

    if (experienceLevel && ['beginner', 'intermediate', 'advanced', 'expert'].includes(experienceLevel)) {
      query.experienceLevel = experienceLevel;
    }

    if (specialization) {
      query.specializations = { $in: [specialization] };
    }

    // Add search functionality
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const startIndex = (page - 1) * limit;

    // Get gardeners
    const gardeners = await User.find(query)
      .select('firstName lastName username profileImage bio location experienceLevel specializations createdAt')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(startIndex);

    // Get total count
    const total = await User.countDocuments(query);

    // Pagination info
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      data: gardeners,
      pagination: {
        current: page,
        total: totalPages,
        count: gardeners.length,
        totalGardeners: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get gardeners error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Ban user (Admin only)
// @route   PUT /api/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { banReason } = req.body;

    // Prevent admin from banning themselves
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot ban your own account'
      });
    }

    const user = await User.banUser(userId, banReason, req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User banned successfully',
      user
    });

  } catch (error) {
    console.error('Ban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user ban',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Unban user (Admin only)
// @route   PUT /api/users/:id/unban
// @access  Private/Admin
const unbanUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.unbanUser(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'User unbanned successfully',
      user
    });

  } catch (error) {
    console.error('Unban user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user unban',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Permanently delete user (Admin only)
// @route   DELETE /api/users/:id/permanent
// @access  Private/Admin
const permanentlyDeleteUser = async (req, res) => {
  try {
    const userId = req.params.id;

    // Prevent admin from deleting themselves
    if (req.user.id === userId) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Permanently delete user and all related data
    await User.permanentlyDeleteUser(userId);

    res.status(200).json({
      success: true,
      message: 'User and all related data permanently deleted'
    });

  } catch (error) {
    console.error('Permanent delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user deletion',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

// @desc    Update user experience level (Admin only)
// @route   PUT /api/users/:id/experience
// @access  Private/Admin
const updateUserExperience = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const { experienceLevel } = req.body;
    const userId = req.params.id;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        experienceLevel,
        experienceLevelUpdatedAt: new Date()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User experience level updated to ${experienceLevel}`,
      user
    });

  } catch (error) {
    console.error('Update user experience error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during experience level update',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};

module.exports = {
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
};
