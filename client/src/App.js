import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import RoleRoute from './components/common/RoleRoute';
import Layout from './components/layout/Layout';
import LoadingSpinner from './components/common/LoadingSpinner';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import UserManagement from './pages/admin/UserManagement';
import GardenerDirectory from './pages/GardenerDirectory';
import PlantCatalog from './pages/PlantCatalog';
import PlantDetail from './pages/PlantDetail';
import AddEditPlant from './pages/AddEditPlant';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="gardeners" element={<GardenerDirectory />} />
              <Route path="plants" element={<PlantCatalog />} />
              <Route path="plants/:id" element={<PlantDetail />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              
              {/* Protected routes - require authentication */}
              <Route path="dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Admin only routes */}
              <Route path="admin/users" element={
                <RoleRoute requiredRole="admin">
                  <UserManagement />
                </RoleRoute>
              } />
              
              {/* Gardener or higher routes - Future gardener-specific routes will go here */}

              {/* Plant management routes (gardener+ only) */}
              <Route path="plants/add" element={
                <RoleRoute minimumRole="gardener">
                  <AddEditPlant />
                </RoleRoute>
              } />
              <Route path="plants/:id/edit" element={
                <RoleRoute minimumRole="gardener">
                  <AddEditPlant />
                </RoleRoute>
              } />
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          
          {/* Toast notifications */}
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="toast-container"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
