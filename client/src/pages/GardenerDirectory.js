import React, { useState, useEffect } from 'react';
import userService from '../services/userService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { MapPinIcon, StarIcon, UserGroupIcon, SparklesIcon } from '@heroicons/react/24/outline';

const GardenerDirectory = () => {
  const [gardeners, setGardeners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    experienceLevel: '',
    specialization: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 1,
    count: 0,
    totalGardeners: 0
  });

  const specializations = [
    { value: 'vegetables', label: 'Vegetables' },
    { value: 'flowers', label: 'Flowers' },
    { value: 'herbs', label: 'Herbs' },
    { value: 'trees', label: 'Trees' },
    { value: 'indoor-plants', label: 'Indoor Plants' },
    { value: 'organic-gardening', label: 'Organic Gardening' },
    { value: 'landscaping', label: 'Landscaping' },
    { value: 'composting', label: 'Composting' }
  ];

  const experienceLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'expert', label: 'Expert' }
  ];

  useEffect(() => {
    fetchGardeners();
  }, [filters, pagination.current]);

  const fetchGardeners = async () => {
    setLoading(true);
    try {
      const params = {
        page: pagination.current,
        limit: 12,
        ...filters
      };

      // Remove empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const result = await userService.getGardeners(params);
      
      if (result.success) {
        setGardeners(result.gardeners);
        setPagination(result.pagination);
      }
    } catch (error) {
      console.error('Error fetching gardeners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
    setPagination(prev => ({ ...prev, current: 1 }));
  };

  const handlePageChange = (page) => {
    setPagination(prev => ({ ...prev, current: page }));
  };

  const getExperienceBadgeClass = (level) => {
    switch (level) {
      case 'expert':
        return 'bg-purple-100 text-purple-800';
      case 'advanced':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="relative mb-12">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 rounded-2xl opacity-50"></div>
        
        <div className="relative bg-white rounded-2xl shadow-lg border border-gray-100 p-8 md:p-12">
          <div className="text-center max-w-4xl mx-auto">
            {/* Icon and title */}
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <UserGroupIcon className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <SparklesIcon className="w-4 h-4 text-yellow-800" />
                </div>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Meet Our Gardeners
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed">
              Connect with experienced gardeners who are ready to share their knowledge and help you grow.
            </p>
            
            {/* Stats */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                <span>Expert Knowledge</span>
              </div>
              <div className="flex items-center">
                <MapPinIcon className="w-4 h-4 text-green-500 mr-1" />
                <span>Local & Global</span>
              </div>
              <div className="flex items-center">
                <UserGroupIcon className="w-4 h-4 text-blue-500 mr-1" />
                <span>Community Driven</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience Level
            </label>
            <select
              value={filters.experienceLevel}
              onChange={(e) => handleFilterChange('experienceLevel', e.target.value)}
              className="input-field"
            >
              <option value="">All Levels</option>
              {experienceLevels.map(level => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <select
              value={filters.specialization}
              onChange={(e) => handleFilterChange('specialization', e.target.value)}
              className="input-field"
            >
              <option value="">All Specializations</option>
              {specializations.map(spec => (
                <option key={spec.value} value={spec.value}>
                  {spec.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="input-field"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <LoadingSpinner message="Loading gardeners..." />
      ) : (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {gardeners.length} of {pagination.totalGardeners} gardeners
            </p>
          </div>

          {/* Gardeners Grid */}
          {gardeners.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No gardeners found
              </h3>
              <p className="text-gray-600">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gardeners.map((gardener) => (
                <div key={gardener._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {gardener.profileImage ? (
                        <img 
                          src={gardener.profileImage} 
                          alt={`${gardener.firstName} ${gardener.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                          <span className="text-lg font-bold text-primary-600">
                            {gardener.firstName?.charAt(0)}{gardener.lastName?.charAt(0)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">
                        {gardener.firstName} {gardener.lastName}
                      </h3>
                      <p className="text-sm text-gray-600">@{gardener.username}</p>
                      <div className="flex items-center mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getExperienceBadgeClass(gardener.experienceLevel)}`}>
                          {gardener.experienceLevel}
                        </span>
                        {gardener.location && (
                          <div className="flex items-center ml-3 text-xs text-gray-500">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            {gardener.location}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {gardener.bio && (
                    <p className="mt-4 text-sm text-gray-600 line-clamp-3">
                      {gardener.bio}
                    </p>
                  )}

                  {gardener.specializations?.length > 0 && (
                    <div className="mt-4">
                      <div className="flex flex-wrap gap-1">
                        {gardener.specializations.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
                          >
                            {spec.replace('-', ' ')}
                          </span>
                        ))}
                        {gardener.specializations.length > 3 && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            +{gardener.specializations.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Member since {new Date(gardener.createdAt).toLocaleDateString()}
                    </span>
                    <button className="text-sm font-medium text-primary-600 hover:text-primary-500">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.total > 1 && (
            <div className="mt-8 flex justify-center">
              <nav className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.current - 1)}
                  disabled={pagination.current === 1}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                {Array.from({ length: Math.min(pagination.total, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-2 text-sm font-medium rounded-md ${
                        page === pagination.current
                          ? 'text-primary-600 bg-primary-50 border border-primary-300'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(pagination.current + 1)}
                  disabled={pagination.current === pagination.total}
                  className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default GardenerDirectory;
