import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from '@heroicons/react/24/outline';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <div className="mb-8">
          <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">🌱</span>
          </div>
          <h1 className="text-9xl font-bold text-gray-200">404</h1>
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Oops! This garden path doesn't exist
        </h2>
        
        <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for might have been moved, deleted, or doesn't exist. 
          Let's get you back to growing!
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 transition duration-200"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            Back to Home
          </Link>
          
          <Link
            to="/gardeners"
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition duration-200"
          >
            Browse Gardeners
          </Link>
        </div>
        
        <div className="mt-12 text-sm text-gray-500">
          <p>Need help? Contact our support team or check out our community guidelines.</p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
