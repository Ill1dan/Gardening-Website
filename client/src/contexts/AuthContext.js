import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize authentication state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = authService.getToken();
        const storedUser = authService.getStoredUser();

        if (token && storedUser) {
          // Verify token with server
          const result = await authService.getCurrentUser();
          
          if (result.success) {
            setUser(result.user);
            setIsAuthenticated(true);
          } else {
            // Token is invalid, clear storage
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        // Clear invalid auth state
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      const result = await authService.login(credentials);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        toast.success('Login successful!');
        return { success: true, user: result.user };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = 'Login failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (userData) => {
    try {
      setLoading(true);
      const result = await authService.register(userData);
      
      if (result.success) {
        setUser(result.user);
        setIsAuthenticated(true);
        toast.success('Registration successful! Welcome to our gardening community!');
        return { success: true, user: result.user };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = 'Registration failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    toast.info('You have been logged out.');
  };

  // Update profile function
  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData);
      
      if (result.success) {
        setUser(result.user);
        toast.success(result.message);
        return { success: true, user: result.user };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = 'Profile update failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Change password function
  const changePassword = async (passwordData) => {
    try {
      const result = await authService.changePassword(passwordData);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      } else {
        toast.error(result.message);
        return { success: false, message: result.message };
      }
    } catch (error) {
      const message = 'Password change failed. Please try again.';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Role checking functions
  const hasRole = (role) => {
    return user?.role === role;
  };

  const hasMinimumRole = (minimumRole) => {
    if (!user) return false;

    const roleHierarchy = {
      viewer: 1,
      gardener: 2,
      admin: 3
    };

    const userLevel = roleHierarchy[user.role];
    const requiredLevel = roleHierarchy[minimumRole];

    return userLevel >= requiredLevel;
  };

  const isAdmin = () => hasRole('admin');
  const isGardener = () => hasRole('gardener');
  const isViewer = () => hasRole('viewer');
  const isGardenerOrHigher = () => hasMinimumRole('gardener');

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    hasRole,
    hasMinimumRole,
    isAdmin,
    isGardener,
    isViewer,
    isGardenerOrHigher
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
