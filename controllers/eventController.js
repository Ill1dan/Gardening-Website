const Event = require('../models/Event');
const mongoose = require('mongoose');

// Get all published events with filtering and pagination
const getEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      category,
      difficulty,
      organizer,
      search,
      sortBy = 'startDate',
      sortOrder = 'asc',
      featured,
      upcoming,
      ongoing
    } = req.query;

    // Build filter query
    const filter = { 
      status: 'published', 
      isActive: true 
    };
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (organizer) filter.organizer = organizer;
    if (featured === 'true') filter.featured = true;

    // Add time-based filters
    const now = new Date();
    if (upcoming === 'true') {
      filter.startDate = { $gt: now };
    }
    if (ongoing === 'true') {
      filter.startDate = { $lte: now };
      filter.endDate = { $gte: now };
    }

    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const events = await Event.find(filter)
      .populate('organizer', 'username firstName lastName profileImage experienceLevel')
      .populate('instructors', 'username firstName lastName profileImage experienceLevel specializations')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortObj);

    // Get total count for pagination
    const totalCount = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Get single event by ID or slug
const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    let event;
    
    // Check if it's a valid ObjectId, otherwise treat as slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findById(id)
        .populate('organizer', 'username firstName lastName profileImage experienceLevel specializations bio')
        .populate('instructors', 'username firstName lastName profileImage experienceLevel specializations bio');
    } else {
      event = await Event.findOne({ slug: id })
        .populate('organizer', 'username firstName lastName profileImage experienceLevel specializations bio')
        .populate('instructors', 'username firstName lastName profileImage experienceLevel specializations bio');
    }

    if (!event || !event.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Only show published events to non-organizers
    if (event.status !== 'published' && 
        (!req.user || event.organizer._id.toString() !== req.user._id.toString()) &&
        (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get related events
    const relatedEvents = await Event.find({
      _id: { $ne: event._id },
      type: event.type,
      status: 'published',
      isActive: true,
      startDate: { $gt: new Date() }
    })
      .populate('organizer', 'username firstName lastName profileImage')
      .limit(6)
      .sort({ startDate: 1 });

    res.json({
      success: true,
      data: {
        event,
        relatedEvents
      }
    });
  } catch (error) {
    console.error('Error in getEventById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event',
      error: error.message
    });
  }
};

// Create new event (admin only)
const createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      organizer: req.user._id
    };

    const event = new Event(eventData);
    await event.save();

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'username firstName lastName profileImage')
      .populate('instructors', 'username firstName lastName profileImage');

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: populatedEvent
    });
  } catch (error) {
    console.error('Error in createEvent:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An event with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating event',
      error: error.message
    });
  }
};

// Update event (admin only)
const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Only admin can update events
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this event'
      });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('organizer', 'username firstName lastName profileImage')
      .populate('instructors', 'username firstName lastName profileImage');

    res.json({
      success: true,
      message: 'Event updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error('Error in updateEvent:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An event with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating event',
      error: error.message
    });
  }
};

// Delete event (soft delete - set isActive to false) (admin only)
const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Only admin can delete events
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this event'
      });
    }

    await Event.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Get featured events
const getFeaturedEvents = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const events = await Event.getFeaturedEvents(parseInt(limit));

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error in getFeaturedEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured events',
      error: error.message
    });
  }
};

// Get upcoming events
const getUpcomingEvents = async (req, res) => {
  try {
    const { limit = 12, type } = req.query;

    const events = await Event.getUpcomingEvents({
      limit: parseInt(limit),
      type
    });

    res.json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error('Error in getUpcomingEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming events',
      error: error.message
    });
  }
};

// Get event types with counts
const getEventTypes = async (req, res) => {
  try {
    const types = await Event.aggregate([
      { $match: { status: 'published', isActive: true } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: types
    });
  } catch (error) {
    console.error('Error in getEventTypes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching event types',
      error: error.message
    });
  }
};

// Get organizer's events
const getOrganizerEvents = async (req, res) => {
  try {
    const { organizerId } = req.params;
    const { page = 1, limit = 12, status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(organizerId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid organizer ID'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const filter = {
      organizer: organizerId,
      isActive: true
    };

    if (status) {
      filter.status = status;
    } else {
      filter.status = 'published';
    }

    const events = await Event.find(filter)
      .populate('organizer', 'username firstName lastName profileImage')
      .populate('instructors', 'username firstName lastName profileImage')
      .limit(parseInt(limit))
      .skip(skip)
      .sort({ startDate: 1 });

    const totalCount = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getOrganizerEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching organizer events',
      error: error.message
    });
  }
};

// Increment event view count (separate endpoint)
const incrementEventView = async (req, res) => {
  try {
    const { id } = req.params;

    let event;
    
    // Check if it's a valid ObjectId, otherwise treat as slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      event = await Event.findById(id);
    } else {
      event = await Event.findOne({ slug: id });
    }
    
    if (!event || !event.isActive || event.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Add debouncing to prevent rapid successive increments
    const clientIP = req.ip || req.connection.remoteAddress;
    const viewKey = `event_view_${event._id}_${clientIP}`;
    
    // Check if we've recently incremented this view (using a simple in-memory cache)
    if (!global.recentEventViews) {
      global.recentEventViews = new Map();
    }
    
    const lastViewTime = global.recentEventViews.get(viewKey);
    const now = Date.now();
    
    // Only increment if more than 5 seconds have passed since last increment
    if (!lastViewTime || (now - lastViewTime) > 5000) {
      await event.incrementViewCount();
      global.recentEventViews.set(viewKey, now);
      
      // Clean up old entries every 100 views to prevent memory leaks
      if (global.recentEventViews.size > 100) {
        const cutoffTime = now - 60000; // 1 minute ago
        for (const [key, time] of global.recentEventViews.entries()) {
          if (time < cutoffTime) {
            global.recentEventViews.delete(key);
          }
        }
      }

      res.json({
        success: true,
        message: 'View count incremented',
        viewCount: event.viewCount + 1
      });
    } else {
      res.json({
        success: true,
        message: 'View already counted recently',
        viewCount: event.viewCount
      });
    }
  } catch (error) {
    console.error('Error in incrementEventView:', error);
    res.status(500).json({
      success: false,
      message: 'Error incrementing view count',
      error: error.message
    });
  }
};

// Admin: Get all events including inactive ones
const adminGetAllEvents = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      category,
      difficulty,
      organizer,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      isActive
    } = req.query;

    // Build filter query - admin can see inactive events
    const filter = {};
    
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (organizer) filter.organizer = organizer;
    if (status) filter.status = status;
    if (featured === 'true') filter.featured = true;
    if (isActive !== undefined && isActive !== '') filter.isActive = isActive === 'true';

    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const events = await Event.find(filter)
      .populate('organizer', 'username firstName lastName profileImage')
      .populate('instructors', 'username firstName lastName profileImage')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortObj);

    // Get total count for pagination
    const totalCount = await Event.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: events,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in adminGetAllEvents:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching events',
      error: error.message
    });
  }
};

// Admin: Hard delete event (permanent deletion)
const adminHardDeleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    const event = await Event.findById(id);
    
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Hard delete the event
    await Event.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Event permanently deleted'
    });
  } catch (error) {
    console.error('Error in adminHardDeleteEvent:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting event',
      error: error.message
    });
  }
};

// Admin: Toggle featured status of an event
const adminToggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID'
      });
    }

    if (typeof featured !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Featured status must be a boolean value'
      });
    }

    const event = await Event.findByIdAndUpdate(
      id,
      { featured },
      { new: true, runValidators: true }
    )
      .populate('organizer', 'username firstName lastName profileImage')
      .populate('instructors', 'username firstName lastName profileImage');

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    res.json({
      success: true,
      message: `Event ${featured ? 'marked as featured' : 'removed from featured'}`,
      data: event
    });
  } catch (error) {
    console.error('Error in adminToggleFeatured:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating featured status',
      error: error.message
    });
  }
};

module.exports = {
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
};
