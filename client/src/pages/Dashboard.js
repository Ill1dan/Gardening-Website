import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserGroupIcon, 
  ChartBarIcon, 
  CogIcon, 
  PlusIcon,
  EyeIcon,
  UserIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const Dashboard = () => {
  const { user, isAdmin, isGardener, isViewer } = useAuth();

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'text-purple-600 bg-purple-100';
      case 'gardener':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <ShieldCheckIcon className="w-6 h-6" />;
      case 'gardener':
        return <UserIcon className="w-6 h-6" />;
      default:
        return <EyeIcon className="w-6 h-6" />;
    }
  };

  const getRoleDescription = (role) => {
    switch (role) {
      case 'admin':
        return 'You have full administrative access to manage users, content, and platform settings.';
      case 'gardener':
        return 'You can share knowledge, create content, and help other community members with their gardening questions.';
      default:
        return 'You can browse content, ask questions, and learn from experienced gardeners in the community.';
    }
  };

  const getQuickActions = () => {
    const actions = [];

    if (isAdmin) {
      actions.push(
        { title: 'Manage Users', href: '/admin/users', icon: UserGroupIcon, color: 'bg-purple-600' },
        { title: 'View Statistics', href: '/admin/stats', icon: ChartBarIcon, color: 'bg-indigo-600' },
        { title: 'Platform Settings', href: '/admin/settings', icon: CogIcon, color: 'bg-gray-600' }
      );
    }

    if (isGardener) {
      actions.push(
        { title: 'Create Guide', href: '/gardener/guides/new', icon: PlusIcon, color: 'bg-green-600' },
        { title: 'My Contributions', href: '/gardener/contributions', icon: ChartBarIcon, color: 'bg-blue-600' }
      );
    }

    actions.push(
      { title: 'Browse Gardeners', href: '/gardeners', icon: UserGroupIcon, color: 'bg-primary-600' },
      { title: 'My Profile', href: '/profile', icon: UserIcon, color: 'bg-gray-600' }
    );

    return actions;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-gray-600">
          Here's what's happening in your gardening community today.
        </p>
      </div>

      {/* Role Information Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-full ${getRoleColor(user?.role)}`}>
            {getRoleIcon(user?.role)}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Your Role: {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </h2>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user?.role)}`}>
                {user?.role}
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              {getRoleDescription(user?.role)}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Experience Level:</span>
                <span className="ml-2 capitalize text-gray-600">{user?.experienceLevel}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Member Since:</span>
                <span className="ml-2 text-gray-600">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
              {user?.location && (
                <div>
                  <span className="font-medium text-gray-700">Location:</span>
                  <span className="ml-2 text-gray-600">{user?.location}</span>
                </div>
              )}
              {user?.specializations?.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700">Specializations:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {user.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                      >
                        {spec.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {getQuickActions().map((action, index) => {
            const IconComponent = action.icon;
            return (
              <a
                key={index}
                href={action.href}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{action.title}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Recent Activity / Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activity Feed */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-600">
                  Welcome to GardenHub! Complete your profile to get the most out of our community.
                </p>
                <p className="text-xs text-gray-400 mt-1">Just now</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-600">
                  You joined the GardenHub community. Explore our features and connect with fellow gardeners!
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Community Stats */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Community Overview</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Total Members</span>
              <span className="text-sm text-gray-600">Growing daily</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Expert Gardeners</span>
              <span className="text-sm text-gray-600">Ready to help</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Plant Guides</span>
              <span className="text-sm text-gray-600">Coming soon</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Community Posts</span>
              <span className="text-sm text-gray-600">Share your knowledge</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
