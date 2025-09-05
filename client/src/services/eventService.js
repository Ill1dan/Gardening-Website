import api from './api';

const eventService = {
  // Get all events with filtering and pagination
  getEvents: async (params = {}) => {
    try {
      const response = await api.get('/events', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single event by ID or slug
  getEventById: async (id, incrementView = true) => {
    try {
      const headers = {};
      if (!incrementView) {
        headers['increment-view'] = 'false';
      }
      const response = await api.get(`/events/${id}`, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured events
  getFeaturedEvents: async (limit = 6) => {
    try {
      const response = await api.get('/events/featured', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get upcoming events
  getUpcomingEvents: async (params = {}) => {
    try {
      const response = await api.get('/events/upcoming', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get event types
  getEventTypes: async () => {
    try {
      const response = await api.get('/events/types');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get events by organizer
  getOrganizerEvents: async (organizerId, params = {}) => {
    try {
      const response = await api.get(`/events/organizer/${organizerId}`, {
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new event (admin only)
  createEvent: async (eventData) => {
    try {
      const response = await api.post('/events', eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update event (admin only)
  updateEvent: async (id, eventData) => {
    try {
      const response = await api.put(`/events/${id}`, eventData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete event (admin only)
  deleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Increment event view count
  incrementEventView: async (id) => {
    try {
      const response = await api.post(`/events/${id}/view`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get all events including inactive ones
  adminGetAllEvents: async (params = {}) => {
    try {
      const response = await api.get('/events/admin/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Toggle featured status
  adminToggleFeatured: async (id, featured) => {
    try {
      const response = await api.put(`/events/admin/${id}/featured`, { featured });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Hard delete event
  adminHardDeleteEvent: async (id) => {
    try {
      const response = await api.delete(`/events/admin/${id}/permanent`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default eventService;
