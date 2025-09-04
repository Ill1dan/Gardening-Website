import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BookOpenIcon,
  UserGroupIcon, 
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

const ViewerDashboard = () => {
  const { user } = useAuth();

  const learningResources = [
    { title: 'Beginner Gardening Guide', description: 'Start your gardening journey', icon: BookOpenIcon, href: '/guides/beginner' },
    { title: 'Plant Care Basics', description: 'Learn essential plant care', icon: AcademicCapIcon, href: '/guides/plant-care' },
    { title: 'Seasonal Gardening', description: 'What to plant when', icon: BookOpenIcon, href: '/guides/seasonal' },
    { title: 'Common Problems', description: 'Troubleshoot garden issues', icon: QuestionMarkCircleIcon, href: '/guides/problems' }
  ];

  const communityFeatures = [
    { title: 'Browse Gardeners', description: 'Find expert gardeners in your area', icon: UserGroupIcon, href: '/gardeners', color: 'bg-green-600' },
    { title: 'Ask Questions', description: 'Get help from the community', icon: ChatBubbleLeftRightIcon, href: '/questions', color: 'bg-blue-600' },
    { title: 'Join Discussions', description: 'Participate in gardening topics', icon: ChatBubbleLeftRightIcon, href: '/discussions', color: 'bg-purple-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-3 rounded-full bg-blue-100">
            <EyeIcon className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome, {user?.firstName}!
            </h1>
            <p className="text-lg text-gray-600">
              Explore and learn from our gardening community
            </p>
          </div>
        </div>
      </div>

      {/* Learning Journey */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Learning Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {learningResources.map((resource, index) => {
            const IconComponent = resource.icon;
            return (
              <Link
                key={index}
                to={resource.href}
                className="block p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="p-2 rounded-lg bg-blue-100 mb-3">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">{resource.title}</h3>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Community Features */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Connect with the Community</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {communityFeatures.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <Link
                key={index}
                to={feature.href}
                className="block p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${feature.color}`}>
                    <IconComponent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Profile Completion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Complete Your Profile</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Basic Information</span>
              <span className="text-sm font-medium text-green-600">✓ Complete</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Profile Picture</span>
              <span className="text-sm font-medium text-orange-600">
                {user?.profileImage ? '✓ Complete' : '○ Add Photo'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bio & Interests</span>
              <span className="text-sm font-medium text-orange-600">
                {user?.bio ? '✓ Complete' : '○ Add Bio'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Location</span>
              <span className="text-sm font-medium text-orange-600">
                {user?.location ? '✓ Complete' : '○ Add Location'}
              </span>
            </div>
          </div>
          <Link 
            to="/profile" 
            className="block mt-4 text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Update Profile
          </Link>
        </div>

        {/* Quick Tips */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Gardening Tips</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-600">
                  Start small - choose 2-3 easy plants to begin your gardening journey.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-600">
                  Water early morning or late evening to reduce evaporation.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm text-gray-600">
                  Don't be afraid to ask questions - our community is here to help!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewerDashboard;

