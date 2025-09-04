import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  UserGroupIcon, 
  AcademicCapIcon, 
  ChatBubbleLeftRightIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: UserGroupIcon,
      title: 'Expert Gardeners',
      description: 'Connect with experienced gardeners who share their knowledge and help you grow.',
      color: 'text-green-600 bg-green-100'
    },
    {
      icon: AcademicCapIcon,
      title: 'Learn & Grow',
      description: 'Access comprehensive guides, tips, and tutorials for all skill levels.',
      color: 'text-blue-600 bg-blue-100'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Community Support',
      description: 'Ask questions, share experiences, and get help from our vibrant community.',
      color: 'text-purple-600 bg-purple-100'
    }
  ];

  const roles = [
    {
      title: 'Viewer',
      description: 'Perfect for beginners who want to learn from the community',
      features: ['Browse plant guides', 'Ask questions', 'Learn from experts', 'Access community resources'],
      color: 'border-blue-200 bg-blue-50'
    },
    {
      title: 'Gardener',
      description: 'For experienced gardeners ready to share their knowledge',
      features: ['Create plant guides', 'Answer questions', 'Share experiences', 'Mentor beginners'],
      color: 'border-green-200 bg-green-50',
      popular: true
    },
    {
      title: 'Admin',
      description: 'Platform management and community oversight',
      features: ['Manage users', 'Moderate content', 'Platform analytics', 'Community guidelines'],
      color: 'border-purple-200 bg-purple-50'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-600 to-primary-700 overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Grow Your Garden,<br />
              <span className="text-green-200">Grow Your Knowledge</span>
            </h1>
            <p className="text-xl text-green-100 mb-8 max-w-3xl mx-auto">
              Join our thriving community of gardeners where beginners learn, experts share, 
              and everyone grows together. Discover the joy of gardening with role-based access 
              tailored to your experience level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link
                    to="/register"
                    className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-50 transition duration-200"
                  >
                    Join Community
                    <ArrowRightIcon className="ml-2 w-5 h-5" />
                  </Link>
                  <Link
                    to="/gardeners"
                    className="inline-flex items-center px-8 py-3 border-2 border-white text-base font-medium rounded-md text-white hover:bg-white hover:text-green-700 transition duration-200"
                  >
                    Meet Our Gardeners
                  </Link>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-700 bg-white hover:bg-gray-50 transition duration-200"
                >
                  Go to Dashboard
                  <ArrowRightIcon className="ml-2 w-5 h-5" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose GardenHub?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our platform brings together gardening enthusiasts of all levels in a 
              supportive, knowledge-sharing environment.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const IconComponent = feature.icon;
              return (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${feature.color}`}>
                    <IconComponent className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Roles Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Role
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our role-based system ensures you get the right experience based on 
              your gardening knowledge and goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {roles.map((role, index) => (
              <div key={index} className={`relative p-6 rounded-lg border-2 ${role.color} transition-shadow hover:shadow-lg`}>
                {role.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {role.title}
                  </h3>
                  <p className="text-gray-600">
                    {role.description}
                  </p>
                </div>
                <ul className="space-y-2">
                  {role.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <svg className="w-4 h-4 text-green-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isAuthenticated && (
        <div className="bg-primary-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Start Your Gardening Journey?
              </h2>
              <p className="text-xl text-primary-100 mb-8">
                Join thousands of gardeners who are learning, sharing, and growing together.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 transition duration-200"
              >
                Get Started Today
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
