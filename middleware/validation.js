const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: errors.array().map(error => ({
        field: error.path || error.param,
        message: error.msg,
        value: error.value
      }))
    });
  }
  
  next();
};

// User registration validation
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username can only contain letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  
  body('firstName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name is required and must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name is required and must not exceed 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('role')
    .optional()
    .isIn(['viewer', 'gardener', 'admin'])
    .withMessage('Role must be viewer, gardener, or admin'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),
  
  body('experienceLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Experience level must be beginner, intermediate, advanced, or expert'),
  
  body('specializations')
    .optional()
    .isArray()
    .withMessage('Specializations must be an array')
    .custom((value) => {
      const validSpecializations = ['vegetables', 'flowers', 'herbs', 'trees', 'indoor-plants', 'organic-gardening', 'landscaping', 'composting'];
      if (value && value.some(spec => !validSpecializations.includes(spec))) {
        throw new Error('Invalid specialization provided');
      }
      return true;
    })
];

// User login validation
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const validateProfileUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('First name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('First name can only contain letters and spaces'),
  
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Last name must be between 1 and 50 characters')
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage('Last name can only contain letters and spaces'),
  
  body('bio')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Bio must not exceed 500 characters'),
  
  body('location')
    .optional()
    .isLength({ max: 100 })
    .withMessage('Location must not exceed 100 characters'),
  
  body('experienceLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Experience level must be beginner, intermediate, advanced, or expert'),
  
  body('specializations')
    .optional()
    .isArray()
    .withMessage('Specializations must be an array')
    .custom((value) => {
      const validSpecializations = ['vegetables', 'flowers', 'herbs', 'trees', 'indoor-plants', 'organic-gardening', 'landscaping', 'composting'];
      if (value && value.some(spec => !validSpecializations.includes(spec))) {
        throw new Error('Invalid specialization provided');
      }
      return true;
    })
];

// Password change validation
const validatePasswordChange = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
    .custom((value, { req }) => {
      if (value === req.body.currentPassword) {
        throw new Error('New password must be different from current password');
      }
      return true;
    })
];

// Role update validation
const validateRoleUpdate = [
  body('role')
    .isIn(['viewer', 'gardener', 'admin'])
    .withMessage('Role must be viewer, gardener, or admin')
];

// MongoDB ObjectId validation
const validateObjectId = (field = 'id') => [
  param(field)
    .isMongoId()
    .withMessage('Invalid ID format')
];

// Query parameter validations
const validateUserQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('role')
    .optional()
    .isIn(['viewer', 'gardener', 'admin'])
    .withMessage('Role filter must be viewer, gardener, or admin'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'firstName', 'lastName', 'username', 'role', 'lastLogin'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc')
];

const validateGardenerQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('experienceLevel')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Experience level must be beginner, intermediate, advanced, or expert'),
  
  query('specialization')
    .optional()
    .isIn(['vegetables', 'flowers', 'herbs', 'trees', 'indoor-plants', 'organic-gardening', 'landscaping', 'composting'])
    .withMessage('Invalid specialization')
];

// Plant validation
const validatePlant = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Plant name is required and must not exceed 100 characters'),
  
  body('scientificName')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Scientific name must not exceed 100 characters'),
  
  body('category')
    .isIn(['indoor', 'outdoor', 'herbs', 'vegetables', 'flowers', 'trees', 'succulents', 'tools', 'fertilizers', 'seeds'])
    .withMessage('Invalid category'),
  
  body('type')
    .isIn(['plant', 'seed', 'tool', 'fertilizer', 'accessory'])
    .withMessage('Invalid type'),
  
  body('shortDescription')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Short description is required and must not exceed 200 characters'),
  
  body('fullDescription')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Full description is required and must not exceed 2000 characters'),
  
  body('images')
    .isArray({ min: 1 })
    .withMessage('At least one image is required'),
  
  body('images.*.url')
    .isURL()
    .withMessage('Each image must have a valid URL'),
  
  body('careInstructions.sunlight')
    .optional({ checkFalsy: true })
    .isIn(['low', 'medium', 'high', 'direct', 'indirect'])
    .withMessage('Invalid sunlight requirement'),
  
  body('careInstructions.water')
    .optional({ checkFalsy: true })
    .isIn(['low', 'medium', 'high', 'daily', 'weekly', 'bi-weekly', 'monthly'])
    .withMessage('Invalid water requirement'),
  
  body('careInstructions.soilType')
    .optional({ checkFalsy: true })
    .isIn(['well-draining', 'moist', 'sandy', 'loamy', 'clay', 'acidic', 'alkaline'])
    .withMessage('Invalid soil type'),
  
  body('growthInfo.difficulty')
    .optional({ checkFalsy: true })
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid difficulty level'),
  
  body('tags')
    .optional({ checkFalsy: true })
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('price.amount')
    .optional({ checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number')
];

// Review validation
const validateReview = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  
  body('title')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Review title is required and must not exceed 100 characters'),
  
  body('comment')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Review comment is required and must not exceed 1000 characters'),
  
  body('images')
    .optional()
    .isArray()
    .withMessage('Images must be an array'),
  
  body('images.*.url')
    .optional()
    .isURL()
    .withMessage('Each image must have a valid URL')
];

// Plant query validation
const validatePlantQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('category')
    .optional()
    .isIn(['indoor', 'outdoor', 'herbs', 'vegetables', 'flowers', 'trees', 'succulents', 'tools', 'fertilizers', 'seeds'])
    .withMessage('Invalid category'),
  
  query('type')
    .optional()
    .isIn(['plant', 'seed', 'tool', 'fertilizer', 'accessory'])
    .withMessage('Invalid type'),
  
  query('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Invalid difficulty level'),
  
  query('sunlight')
    .optional()
    .isIn(['low', 'medium', 'high', 'direct', 'indirect'])
    .withMessage('Invalid sunlight requirement'),
  
  query('water')
    .optional()
    .isIn(['low', 'medium', 'high', 'daily', 'weekly', 'bi-weekly', 'monthly'])
    .withMessage('Invalid water requirement'),
  
  query('search')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search term must be between 1 and 100 characters'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'name', 'averageRating', 'favoriteCount', 'viewCount'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  query('featured')
    .optional()
    .isBoolean()
    .withMessage('Featured must be a boolean')
];

module.exports = {
  handleValidationErrors,
  validateRegistration,
  validateLogin,
  validateProfileUpdate,
  validatePasswordChange,
  validateRoleUpdate,
  validateObjectId,
  validateUserQuery,
  validateGardenerQuery,
  validatePlant,
  validateReview,
  validatePlantQuery
};
