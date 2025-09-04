import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  PlusIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ChartBarIcon,
  UserGroupIcon,
  HeartIcon,
  PencilIcon,
  UserIcon
} from '@heroicons/react/24/outline';

const GardenerDashboard = () => {
  const { user } = useAuth();

  const contentActions = [
    { title: 'Create Plant Guide', description: 'Share your plant knowledge', icon: PlusIcon, href: '/gardener/guides/new', color: 'bg-green-600' },
    { title: 'Write Article', description: 'Share gardening tips', icon: PencilIcon, href: '/gardener/articles/new', color: 'bg-blue-600' },
    { title: 'Answer Questions', description: 'Help community members', icon: ChatBubbleLeftRightIcon, href: '/questions', color: 'bg-purple-600' },
    { title: 'My Content', description: 'Manage your contributions', icon: BookOpenIcon, href: '/gardener/content', color: 'bg-indigo-600' }
  ];

  const mentorshipFeatures = [
    { title: 'Mentorship Requests', count: '3 pending', color: 'text-orange-600' },
    { title: 'Active Mentees', count: '7 gardeners', color: 'text-green-600' },
    { title: 'Questions Answered', count: '24 this month', color: 'text-blue-600' },
    { title: 'Content Views', count: '1.2k views', color: 'text-purple-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-full bg-green-100">
            <UserIcon className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName}!
            </h1>
            <p className="text-lg text-gray-600">
              Ready to share your gardening expertise today?
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mentorshipFeatures.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>{stat.count}</p>
              </div>
              <ChartBarIcon className="w-8 h-8 text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Content Creation Actions */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Share Your Knowledge</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {contentActions.map((action, index) => {
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
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Your guide "Growing Tomatoes from Seed" received 5 new likes
                </p>
                <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  You answered a question about "Pest control for roses"
                </p>
                <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  New mentorship request from Sarah Johnson
                </p>
                <p className="text-xs text-gray-400 mt-1">1 day ago</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Your article "Composting Basics" was featured in the newsletter
                </p>
                <p className="text-xs text-gray-400 mt-1">2 days ago</p>
              </div>
            </div>
          </div>
        </div>

        {/* Gardener Profile Summary */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Gardener Profile</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Experience Level</span>
                <span className="text-sm text-gray-600 capitalize">{user?.experienceLevel}</span>
              </div>
            </div>
            
            {user?.specializations?.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-700 block mb-2">Specializations</span>
                <div className="flex flex-wrap gap-1">
                  {user.specializations.map((spec) => (
                    <span
                      key={spec}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {spec.replace('-', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Community Impact</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <HeartIcon className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">127 helpful answers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-gray-600">15 gardeners mentored</span>
                </div>
                <div className="flex items-center space-x-2">
                  <BookOpenIcon className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">8 guides published</span>
                </div>
              </div>
            </div>

            <Link 
              to="/profile" 
              className="block mt-4 text-center bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Update Profile
            </Link>
          </div>
        </div>
      </div>

      {/* Mentorship Section */}
      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mentorship & Community</h3>
          <Link 
            to="/gardener/mentorship" 
            className="text-sm text-green-600 hover:text-green-700 font-medium"
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <UserGroupIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h4 className="font-medium text-gray-900">Pending Requests</h4>
            <p className="text-2xl font-bold text-orange-600">3</p>
            <p className="text-sm text-gray-600">New mentorship requests</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <ChatBubbleLeftRightIcon className="w-6 h-6 text-green-600" />
            </div>
            <h4 className="font-medium text-gray-900">Questions to Answer</h4>
            <p className="text-2xl font-bold text-green-600">12</p>
            <p className="text-sm text-gray-600">Community questions</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <HeartIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-medium text-gray-900">Impact Score</h4>
            <p className="text-2xl font-bold text-blue-600">89</p>
            <p className="text-sm text-gray-600">Community helpfulness</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GardenerDashboard;

