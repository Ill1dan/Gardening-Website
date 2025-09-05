const express = require('express');
const router = express.Router();
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getFeaturedEvents,
  getUpcomingEvents,
  getEventTypes,
  getOrganizerEvents,
  incrementEventView,
  adminGetAllEvents,
  adminHardDeleteEvent,
  adminToggleFeatured
} = require('../controllers/eventController');

const { protect, requireRole, optionalAuth } = require('../middleware/auth');
const { validateEvent, handleValidationErrors } = require('../middleware/validation');

// Public routes
router.get('/', optionalAuth, getEvents);
router.get('/featured', getFeaturedEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/types', getEventTypes);
router.get('/organizer/:organizerId', getOrganizerEvents);

// View increment route (public, no auth required)
router.post('/:id/view', incrementEventView);

// Event detail route (must come after specific routes to avoid conflicts)
router.get('/:id', optionalAuth, getEventById);

// Admin-only event management routes
router.post('/', protect, requireRole('admin'), validateEvent, handleValidationErrors, createEvent);
router.put('/:id', protect, requireRole('admin'), validateEvent, handleValidationErrors, updateEvent);
router.delete('/:id', protect, requireRole('admin'), deleteEvent);

// Admin routes
router.get('/admin/all', protect, requireRole('admin'), adminGetAllEvents);
router.put('/admin/:id/featured', protect, requireRole('admin'), adminToggleFeatured);
router.delete('/admin/:id/permanent', protect, requireRole('admin'), adminHardDeleteEvent);

module.exports = router;
