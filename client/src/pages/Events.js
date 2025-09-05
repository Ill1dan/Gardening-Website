import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import eventService from '../services/eventService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  StarIcon,
  EyeIcon,
  PlusIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';

const Events = () => {
  const { isAdmin } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    difficulty: '',
    upcoming: 'true',
    featured: '',
    sortBy: 'startDate',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);

  const eventTypes = [
    { value: '', label: 'All Types' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'plant-fair', label: 'Plant Fair' },
    { value: 'seasonal-campaign', label: 'Seasonal Campaign' },
    { value: 'webinar', label: 'Webinar' },
    { value: 'garden-tour', label: 'Garden Tour' },
    { value: 'plant-swap', label: 'Plant Swap' },
    { value: 'community-garden', label: 'Community Garden' },
    { value: 'expert-talk', label: 'Expert Talk' }
  ];

  const categories = [
    { value: '', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'all-levels', label: 'All Levels' },
    { value: 'kids', label: 'Kids' },
    { value: 'seniors', label: 'Seniors' },
    { value: 'community', label: 'Community' }
  ];

  const difficulties = [
    { value: '', label: 'Any Difficulty' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const timeFilters = [
    { value: 'true', label: 'Upcoming Events' },
    { value: '', label: 'All Events' },
    { value: 'ongoing', label: 'Ongoing Events' }
  ];

  const featuredFilters = [
    { value: '', label: 'All Events' },
    { value: 'true', label: 'Featured Only' },
    { value: 'false', label: 'Non-Featured Only' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [filters]);

  const fetchEvents = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        ...filters
      };

      // Clean up empty filters
      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await eventService.getEvents(params);
      setEvents(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchEvents();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      type: '',
      category: '',
      difficulty: '',
      upcoming: 'true',
      featured: '',
      sortBy: 'startDate',
      sortOrder: 'asc'
    });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'workshop': 'bg-blue-100 text-blue-800',
      'plant-fair': 'bg-green-100 text-green-800',
      'seasonal-campaign': 'bg-orange-100 text-orange-800',
      'webinar': 'bg-purple-100 text-purple-800',
      'garden-tour': 'bg-emerald-100 text-emerald-800',
      'plant-swap': 'bg-yellow-100 text-yellow-800',
      'community-garden': 'bg-indigo-100 text-indigo-800',
      'expert-talk': 'bg-red-100 text-red-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'beginner': 'bg-green-100 text-green-800',
      'intermediate': 'bg-yellow-100 text-yellow-800',
      'advanced': 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || 'bg-gray-100 text-gray-800';
  };

  if (loading && events.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Gardening Events</h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
              Join workshops, plant fairs, and seasonal campaigns to grow your gardening knowledge and connect with fellow enthusiasts.
            </p>
            {isAdmin() && (
              <Link
                to="/events/new"
                className="inline-flex items-center gap-2 bg-white text-primary-600 hover:bg-primary-50 font-medium px-6 py-3 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                <PlusIcon className="h-5 w-5" />
                Create New Event
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        {isAdmin() && (
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Manage Events</h2>
              <p className="text-gray-600 mt-1">Create and manage gardening events for the community</p>
            </div>
            <Link
              to="/events/new"
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              Create Event
            </Link>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-6 py-2 whitespace-nowrap"
            >
              Search
            </button>
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="btn-secondary px-4 py-2 flex items-center gap-2 whitespace-nowrap"
            >
              <FunnelIcon className="h-5 w-5" />
              Filters
            </button>
          </form>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="border-t border-gray-200 pt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Event Type
                </label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {eventTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={filters.difficulty}
                  onChange={(e) => handleFilterChange('difficulty', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {difficulties.map(difficulty => (
                    <option key={difficulty.value} value={difficulty.value}>
                      {difficulty.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Filter
                </label>
                <select
                  value={filters.upcoming}
                  onChange={(e) => handleFilterChange('upcoming', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {timeFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Featured
                </label>
                <select
                  value={filters.featured}
                  onChange={(e) => handleFilterChange('featured', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  {featuredFilters.map(filter => (
                    <option key={filter.value} value={filter.value}>
                      {filter.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2 lg:col-span-5 flex justify-end">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-8">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Events Grid */}
        {events.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <div key={event._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="relative">
                    <img
                      src={event.featuredImage.url}
                      alt={event.featuredImage.alt || event.title}
                      className="w-full h-48 object-cover"
                    />
                    {event.featured && (
                      <div className="absolute top-2 left-2">
                        <div className="bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                          <StarIconSolid className="h-3 w-3" />
                          Featured
                        </div>
                      </div>
                    )}
                    <div className="absolute top-2 right-2 flex gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getEventTypeColor(event.type)}`}>
                        {event.type.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                        <Link
                          to={`/events/${event.slug || event._id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {event.title}
                        </Link>
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getDifficultyColor(event.difficulty)}`}>
                        {event.difficulty}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {event.shortDescription}
                    </p>

                    {/* Tags */}
                    {event.tags && event.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {event.tags.slice(0, 3).map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200"
                            >
                              <span className="text-primary-500 mr-1">#</span>
                              {tag}
                            </span>
                          ))}
                          {event.tags.length > 3 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              +{event.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        <span>
                          {formatDate(event.startDate)}
                          {event.startDate !== event.endDate && ` - ${formatDate(event.endDate)}`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <ClockIcon className="h-4 w-4" />
                        <span>
                          {formatTime(event.startDate)}
                          {event.formattedDuration && ` (${event.formattedDuration})`}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <MapPinIcon className="h-4 w-4" />
                        <span>
                          {event.location.type === 'online' ? 'Online Event' :
                           event.location.type === 'hybrid' ? 'Hybrid Event' :
                           event.location.venue || 'Physical Event'}
                        </span>
                      </div>

                      {event.capacity && (
                        <div className="flex items-center gap-2">
                          <UserGroupIcon className="h-4 w-4" />
                          <span>
                            {event.availableSpots} spots available
                          </span>
                        </div>
                      )}

                      {event.price > 0 && (
                        <div className="flex items-center gap-2">
                          <CurrencyDollarIcon className="h-4 w-4" />
                          <span>
                            ${event.price} {event.currency}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-400">
                      <div className="flex items-center gap-2">
                        <img
                          src={event.organizer.profileImage || '/default-avatar.png'}
                          alt={event.organizer.firstName}
                          className="w-5 h-5 rounded-full"
                        />
                        <span>by {event.organizer.firstName} {event.organizer.lastName}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <EyeIcon className="h-4 w-4" />
                        <span>{event.viewCount}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <Link
                        to={`/events/${event.slug || event._id}`}
                        className="btn-primary w-full text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={fetchEvents}
                className="flex justify-center"
              />
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No events found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {filters.search || filters.type || filters.category || filters.difficulty
                ? 'Try adjusting your search filters.'
                : 'Check back later for upcoming events.'}
            </p>
            {(filters.search || filters.type || filters.category || filters.difficulty) && (
              <button
                onClick={resetFilters}
                className="mt-4 btn-primary"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;
