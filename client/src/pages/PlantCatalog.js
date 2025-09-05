import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import plantService from '../services/plantService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import PlantCard from '../components/catalog/PlantCard';
import PlantFilters from '../components/catalog/PlantFilters';
import Pagination from '../components/common/Pagination';

const PlantCatalog = () => {
  const { user, isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  // Get filters from URL params
  const currentFilters = {
    page: parseInt(searchParams.get('page')) || 1,
    limit: parseInt(searchParams.get('limit')) || 12,
    category: searchParams.get('category') || '',
    type: searchParams.get('type') || '',
    difficulty: searchParams.get('difficulty') || '',
    sunlight: searchParams.get('sunlight') || '',
    water: searchParams.get('water') || '',
    search: searchParams.get('search') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    featured: searchParams.get('featured') || '',
    favorites: searchParams.get('favorites') || ''
  };

  useEffect(() => {
    fetchPlants();
    fetchCategories();
  }, [searchParams]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const response = await plantService.getPlants(currentFilters);
      setPlants(response.data);
      setPagination(response.pagination);
    } catch (error) {
      toast.error(error.message || 'Failed to fetch plants');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await plantService.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    const updatedParams = new URLSearchParams();
    
    // Add all non-empty filters to URL params
    Object.entries({ ...currentFilters, ...newFilters, page: 1 }).forEach(([key, value]) => {
      if (value && value !== '') {
        updatedParams.set(key, value);
      }
    });

    setSearchParams(updatedParams);
  };

  const handlePageChange = (page) => {
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.set('page', page);
    setSearchParams(updatedParams);
  };

  const clearFilters = () => {
    setSearchParams({});
  };

  const getActiveFiltersCount = () => {
    return Object.entries(currentFilters).filter(([key, value]) => 
      value && value !== '' && key !== 'page' && key !== 'limit' && key !== 'sortBy' && key !== 'sortOrder'
    ).length;
  };

  const handleAdminDeletePlant = async (plantId) => {
    try {
      const result = await plantService.adminDeletePlant(plantId);
      if (result.success) {
        toast.success(result.message);
        // Refresh the plants list
        fetchPlants();
      }
    } catch (error) {
      console.error('Error deleting plant:', error);
      toast.error(error.message || 'Failed to delete plant');
    }
  };

  const handleFeaturedToggle = (plantId, newFeaturedStatus) => {
    // Update the plant in the local state
    setPlants(prevPlants => 
      prevPlants.map(plant => 
        plant._id === plantId 
          ? { ...plant, featured: newFeaturedStatus }
          : plant
      )
    );
  };

  if (loading && plants.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-green-50 via-white to-emerald-50 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 bg-white/80"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-100 rounded-full opacity-20"></div>
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-emerald-100 rounded-full opacity-20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-green-50 rounded-full opacity-30"></div>
        
        {/* Plant icons decoration */}
        <div className="absolute top-8 left-8 text-green-200 opacity-40">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"/>
          </svg>
        </div>
        <div className="absolute top-16 right-16 text-emerald-200 opacity-30">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 6,17.25C7.5,17.25 9,16.5 10,15.5C11,14.5 12,13.5 13,12.5C14,11.5 15,10.5 16,9.5C17,8.5 17,8 17,8Z"/>
          </svg>
        </div>
        <div className="absolute bottom-8 left-1/4 text-green-200 opacity-25">
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            {/* Main heading with enhanced styling */}
            <div className="mb-6">
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-green-700 bg-clip-text text-transparent leading-tight">
                Plant Catalog
              </h1>
              <div className="mt-4 w-24 h-1 bg-gradient-to-r from-green-400 to-emerald-500 mx-auto rounded-full"></div>
            </div>
            
            {/* Enhanced subtitle */}
            <p className="mt-6 text-xl md:text-2xl text-gray-700 font-medium max-w-3xl mx-auto leading-relaxed">
              Discover beautiful plants, premium seeds, essential tools, and everything you need to create your perfect garden sanctuary
            </p>
            
            {/* Stats or additional info */}
            <div className="mt-8 flex flex-wrap justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>Expert-curated collection</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span>Care guides included</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Community reviews</span>
              </div>
            </div>

            {/* Enhanced Add New Plant button */}
            {user && (user.role === 'gardener' || user.role === 'admin') && (
              <div className="mt-10">
                <Link
                  to="/plants/add"
                  className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300 focus:ring-opacity-50"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-colors duration-300">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                    <span className="text-lg">Add New Plant</span>
                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Clear all ({getActiveFiltersCount()})
                  </button>
                )}
              </div>
              
              <PlantFilters
                filters={currentFilters}
                categories={categories}
                onFilterChange={handleFilterChange}
                user={user}
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 mt-8 lg:mt-0">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <p className="text-gray-600">
                  {pagination.totalCount} {pagination.totalCount === 1 ? 'item' : 'items'} found
                </p>
                {currentFilters.search && (
                  <span className="text-sm text-gray-500">
                    for "{currentFilters.search}"
                  </span>
                )}
              </div>
              
              {/* Sort Options */}
              <div className="flex items-center space-x-2">
                <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                <select
                  id="sort"
                  value={`${currentFilters.sortBy}-${currentFilters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    handleFilterChange({ sortBy, sortOrder });
                  }}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="averageRating-desc">Highest Rated</option>
                  <option value="favoriteCount-desc">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            )}

            {/* Plants Grid */}
            {!loading && plants.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {plants.map((plant) => (
                  <PlantCard 
                    key={plant._id} 
                    plant={plant} 
                    onDelete={isAdmin() ? handleAdminDeletePlant : null}
                    onFeaturedToggle={isAdmin() ? handleFeaturedToggle : null}
                  />
                ))}
              </div>
            )}

            {/* No Results */}
            {!loading && plants.length === 0 && (
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-400">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No plants found</h3>
                <p className="text-gray-600 mb-4">
                  {currentFilters.search || getActiveFiltersCount() > 0
                    ? "Try adjusting your search or filters"
                    : "No plants are available at the moment"
                  }
                </p>
                {getActiveFiltersCount() > 0 && (
                  <button
                    onClick={clearFilters}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}

            {/* Pagination */}
            {!loading && plants.length > 0 && pagination.totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={handlePageChange}
                  hasNextPage={pagination.hasNextPage}
                  hasPrevPage={pagination.hasPrevPage}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlantCatalog;
