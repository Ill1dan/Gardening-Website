import api from './api';

class AuthService {
  // Register new user
  async register(userData) {
    try {
      const response = await api.post('/auth/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user, token };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  }

  // Login user
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (response.data.success) {
        const { token, user, wasPromoted, promotionInfo } = response.data;
        
        // Store token and user data
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return { 
          success: true, 
          user, 
          token, 
          wasPromoted,
          promotionInfo
        };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      const banReason = error.response?.data?.banReason;
      
      return { 
        success: false, 
        message: errorMessage,
        banReason: banReason,
        isBanned: errorMessage.includes('banned')
      };
    }
  }

  // Logout user
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  // Get current user
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      
      if (response.data.success) {
        const { user } = response.data;
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to get user data' 
      };
    }
  }

  // Update user profile
  async updateProfile(profileData) {
    try {
      const response = await api.put('/auth/profile', profileData);
      
      if (response.data.success) {
        const { user } = response.data;
        
        // Update stored user data
        localStorage.setItem('user', JSON.stringify(user));
        
        return { success: true, user, message: response.data.message };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Profile update failed' 
      };
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.put('/auth/password', passwordData);
      
      if (response.data.success) {
        return { success: true, message: response.data.message };
      }
      
      return { success: false, message: response.data.message };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Password change failed' 
      };
    }
  }

  // Get stored token
  getToken() {
    return localStorage.getItem('token');
  }

  // Get stored user
  getStoredUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = this.getToken();
    const user = this.getStoredUser();
    return !!(token && user);
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getStoredUser();
    return user?.role === role;
  }

  // Check if user has minimum role level
  hasMinimumRole(minimumRole) {
    const user = this.getStoredUser();
    if (!user) return false;

    const roleHierarchy = {
      viewer: 1,
      gardener: 2,
      admin: 3
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[minimumRole];

    return userLevel >= requiredLevel;
  }

  // Check if user is admin
  isAdmin() {
    return this.hasRole('admin');
  }

  // Check if user is gardener or higher
  isGardenerOrHigher() {
    return this.hasMinimumRole('gardener');
  }
}

export default new AuthService();
