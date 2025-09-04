import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  UsersIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  UserPlusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    gardeners: 0,
    viewers: 0,
    recentSignups: 0,
    pendingReports: 0
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    // Simulate API call
    setStats({
      totalUsers: 1247,
      activeUsers: 1189,
      gardeners: 156,
      viewers: 1091,
      recentSignups: 23,
      pendingReports: 5
    });
  }, []);

  const adminActions = [
    { title: 'User Management', description: 'Manage user accounts and roles', icon: UsersIcon, href: '/admin/users', color: 'bg-blue-600' },
    { title: 'Content Moderation', description: 'Review reported content', icon: ExclamationTriangleIcon, href: '/admin/moderation', color: 'bg-red-600' },
    { title: 'Platform Analytics', description: 'View detailed statistics', icon: ChartBarIcon, href: '/admin/analytics', color: 'bg-green-600' },
    { title: 'System Settings', description: 'Configure platform settings', icon: CogIcon, href: '/admin/settings', color: 'bg-purple-600' }
  ];

  const quickStats = [
    { title: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: UsersIcon, color: 'text-blue-600', change: '+12 this week' },
    { title: 'Active Users', value: stats.activeUsers.toLocaleString(), icon: CheckCircleIcon, color: 'text-green-600', change: '95.3% active' },
    { title: 'Expert Gardeners', value: stats.gardeners.toLocaleString(), icon: ShieldCheckIcon, color: 'text-purple-600', change: '+3 this month' },
    { title: 'Recent Signups', value: stats.recentSignups.toLocaleString(), icon: UserPlusIcon, color: 'text-orange-600', change: 'Last 7 days' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-full bg-purple-100">
            <ShieldCheckIcon className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-lg text-gray-600">
              Welcome back, {user?.firstName}. Here's your platform overview.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
                  <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                </div>
                <IconComponent className={`w-8 h-8 ${stat.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Admin Actions */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Administrative Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {adminActions.map((action, index) => {
            const IconComponent = action.icon;
            return (
              <Link
                key={index}
                to={action.href}
                className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`p-3 rounded-lg ${action.color} mb-3`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{action.title}</h3>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Platform Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  New gardener "Mike Thompson" joined the platform
                </p>
                <p className="text-xs text-gray-400 mt-1">15 minutes ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Content report submitted for review in "Plant Care" section
                </p>
                <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  User "Sarah Johnson" was promoted to Gardener role
                </p>
                <p className="text-xs text-gray-400 mt-1">3 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  System maintenance completed successfully
                </p>
                <p className="text-xs text-gray-400 mt-1">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Security alert: Multiple failed login attempts detected
                </p>
                <p className="text-xs text-gray-400 mt-1">8 hours ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alerts & Tasks</h3>
          <div className="space-y-4">
            <div className="p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="flex items-center space-x-2 mb-2">
                <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
                <span className="font-medium text-red-800">Urgent</span>
              </div>
              <p className="text-sm text-red-700">
                {stats.pendingReports} content reports pending review
              </p>
              <Link to="/admin/moderation" className="text-xs text-red-600 hover:text-red-800 font-medium">
                Review Now →
              </Link>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center space-x-2 mb-2">
                <DocumentTextIcon className="w-5 h-5 text-yellow-600" />
                <span className="font-medium text-yellow-800">Review Required</span>
              </div>
              <p className="text-sm text-yellow-700">
                12 gardener applications awaiting approval
              </p>
              <Link to="/admin/users?filter=pending" className="text-xs text-yellow-600 hover:text-yellow-800 font-medium">
                Review Applications →
              </Link>
            </div>

            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center space-x-2 mb-2">
                <ChartBarIcon className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-800">Weekly Report</span>
              </div>
              <p className="text-sm text-blue-700">
                Platform analytics report is ready
              </p>
              <Link to="/admin/analytics" className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                View Report →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* System Health */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Server Status</h4>
            <p className="text-sm text-green-600 font-medium">Online</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Database</h4>
            <p className="text-sm text-green-600 font-medium">Healthy</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">API Status</h4>
            <p className="text-sm text-green-600 font-medium">Operational</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ExclamationTriangleIcon className="w-6 h-6 text-yellow-600" />
            </div>
            <h4 className="font-medium text-gray-900">Storage</h4>
            <p className="text-sm text-yellow-600 font-medium">78% Used</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

