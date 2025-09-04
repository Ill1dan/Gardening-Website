import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import ViewerDashboard from './dashboards/ViewerDashboard';
import GardenerDashboard from './dashboards/GardenerDashboard';
import AdminDashboard from './dashboards/AdminDashboard';

const Dashboard = () => {
  const { user, isAdmin, isGardener, isViewer } = useAuth();

  // Route to appropriate dashboard based on user role
  if (isAdmin()) {
    return <AdminDashboard />;
  } else if (isGardener()) {
    return <GardenerDashboard />;
  } else {
    return <ViewerDashboard />;
  }
};

export default Dashboard;
