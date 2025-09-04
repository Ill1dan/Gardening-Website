import api from './api';

class UserService {
  // Get all users (Admin only)
  async getAllUsers(params = {}) {
    try {
      const response = await api.get('/users', { params });
      
      if (response.data.success) {
        return { 
          success: true, 
          users: response.data.data, 
          pagination: response.data.pagination 
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch users' 
      };
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      
      if (response.data.success) {
        return { success: true, user: response.data.user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch user' 
      };
    }
  }

  // Update user role (Admin only)
  async updateUserRole(userId, role) {
    try {
      const response = await api.put(`/users/${userId}/role`, { role });
      
      if (response.data.success) {
        return { 
          success: true, 
          user: response.data.user, 
          message: response.data.message 
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update user role' 
      };
    }
  }

  // Deactivate user (Admin only)
  async deactivateUser(userId) {
    try {
      const response = await api.put(`/users/${userId}/deactivate`);
      
      if (response.data.success) {
        return { 
          success: true, 
          user: response.data.user, 
          message: response.data.message 
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to deactivate user' 
      };
    }
  }

  // Reactivate user (Admin only)
  async reactivateUser(userId) {
    try {
      const response = await api.put(`/users/${userId}/reactivate`);
      
      if (response.data.success) {
        return { 
          success: true, 
          user: response.data.user, 
          message: response.data.message 
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to reactivate user' 
      };
    }
  }

  // Get user statistics (Admin only)
  async getUserStats() {
    try {
      const response = await api.get('/users/admin/stats');
      
      if (response.data.success) {
        return { success: true, stats: response.data.stats };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch user statistics' 
      };
    }
  }

  // Get gardeners (Public)
  async getGardeners(params = {}) {
    try {
      const response = await api.get('/users/gardeners', { params });
      
      if (response.data.success) {
        return { 
          success: true, 
          gardeners: response.data.data, 
          pagination: response.data.pagination 
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to fetch gardeners' 
      };
    }
  }
}

export default new UserService();
