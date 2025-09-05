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
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900">Plant Catalog</h1>
            <p className="mt-4 text-xl text-gray-600">
              Discover plants, seeds, tools, and everything you need for your garden
            </p>
            {user && (user.role === 'gardener' || user.role === 'admin') && (
              <div className="mt-6">
                <Link
                  to="/plants/add"
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add New Plant
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
