import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleRoute = ({ children, requiredRole, minimumRole }) => {
  const { isAuthenticated, loading, hasRole, hasMinimumRole } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check specific role
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check minimum role level
  if (minimumRole && !hasMinimumRole(minimumRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // If children are provided, render them; otherwise render Outlet for nested routes
  return children || <Outlet />;
};

export default RoleRoute;
