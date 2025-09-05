import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import articleService from '../services/articleService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Pagination from '../components/common/Pagination';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  HeartIcon,
  EyeIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  XMarkIcon,
  PencilIcon,
  TrashIcon,
  StarIcon
} from '@heroicons/react/24/outline';

const Articles = () => {
  const { user, isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  
  // Filter states
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'publishedAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12,
    status: '',
    isActive: ''
  });
  
  // Separate search input state to prevent re-renders
  const [searchInput, setSearchInput] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  const categoryLabels = {
    'gardening-tips': 'Gardening Tips',
    'plant-care': 'Plant Care',
    'seasonal-guides': 'Seasonal Guides',
    'pest-control': 'Pest Control',
    'soil-fertilizer': 'Soil & Fertilizer',
    'tools-equipment': 'Tools & Equipment',
    'beginner-guides': 'Beginner Guides',
    'advanced-techniques': 'Advanced Techniques',
    'indoor-gardening': 'Indoor Gardening',
    'outdoor-gardening': 'Outdoor Gardening'
  };

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      
      console.log('fetchArticles called - isAdmin:', isAdmin(), 'filters:', filters);
      
      // Use admin service if user is admin, otherwise use regular service
      const response = isAdmin() 
        ? await articleService.adminGetAllArticles(filters)
        : await articleService.getArticles(filters);
      
      console.log('Articles response:', response);
      setArticles(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Error fetching articles:', err);
      toast.error(err.message || 'Failed to fetch articles');
    } finally {
      setLoading(false);
    }
  }, [isAdmin, filters]);

  useEffect(() => {
    console.log('Articles useEffect - authLoading:', authLoading, 'user:', user, 'isAdmin:', isAdmin());
    
    // Don't fetch articles if auth is still loading
    if (authLoading) {
      console.log('Skipping fetch - auth still loading');
      return;
    }
    
    fetchArticles();
    fetchCategories();
  }, [filters, authLoading, fetchArticles]);

  // Sync search input with filters when filters change from other sources
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Debounced search - automatically search after user stops typing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchInput, filters.search]);

  const fetchCategories = async () => {
    try {
      const response = await articleService.getCategories();
      setCategories(response.data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };


  const handleClearSearch = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '', page: 1 }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getCategoryLabel = (category) => {
    return categoryLabels[category] || category;
  };

  // Admin functions
  const handleAdminDeleteArticle = async (articleId) => {
    if (window.confirm('Are you sure you want to permanently delete this article?\n\nThis action cannot be undone!')) {
      try {
        const result = await articleService.adminHardDeleteArticle(articleId);
        if (result.success) {
          toast.success(result.message);
          // Refresh the articles list
          fetchArticles();
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error(error.message || 'Failed to delete article');
      }
    }
  };

  const handleFeaturedToggle = async (articleId, newFeaturedStatus) => {
    try {
      const result = await articleService.adminToggleFeatured(articleId, newFeaturedStatus);
      if (result.success) {
        toast.success(result.message);
        // Update the article in the local state
        setArticles(prevArticles => 
          prevArticles.map(article => 
            article._id === articleId 
              ? { ...article, featured: newFeaturedStatus }
              : article
          )
        );
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error(error.message || 'Failed to update featured status');
    }
  };

  if (loading || authLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Gardening Articles</h1>
            <p className="text-lg text-gray-600">
              Discover expert tips, guides, and insights from our community of gardeners
            </p>
          </div>
          
          {/* Admin Add Article Button */}
          {isAdmin() && (
            <Link
              to="/articles/new"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add New Article
            </Link>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="search"
                placeholder="Search articles..."
                value={searchInput}
                onChange={handleSearchInputChange}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FunnelIcon className="w-5 h-5 mr-2" />
            Filters
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {getCategoryLabel(cat._id)} ({cat.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="publishedAt">Date Published</option>
                  <option value="viewCount">Most Viewed</option>
                  <option value="likeCount">Most Liked</option>
                  <option value="title">Title</option>
                  {isAdmin() && (
                    <>
                      <option value="createdAt">Date Created</option>
                      <option value="updatedAt">Last Updated</option>
                    </>
                  )}
                </select>
              </div>

              {/* Sort Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Order
                </label>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="desc">Newest First</option>
                  <option value="asc">Oldest First</option>
                </select>
              </div>
            </div>

            {/* Admin-only filters */}
            {isAdmin() && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Admin Filters</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={filters.status}
                      onChange={(e) => handleFilterChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">All Statuses</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  {/* Active Status Filter */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Active Status
                    </label>
                    <select
                      value={filters.isActive}
                      onChange={(e) => handleFilterChange('isActive', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="">All Articles</option>
                      <option value="true">Active Only</option>
                      <option value="false">Inactive Only</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Search Results Info */}
      {filters.search && (
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            {loading ? (
              'Searching...'
            ) : (
              <>
                Found {pagination.totalCount} article{pagination.totalCount !== 1 ? 's' : ''} 
                {filters.search && ` for "${filters.search}"`}
              </>
            )}
          </p>
        </div>
      )}

      {/* Articles Grid */}
      {articles.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {articles.map((article) => (
              <article key={article._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Featured Image */}
                <Link to={`/articles/${article.slug || article._id}`}>
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={article.featuredImage.url}
                      alt={article.featuredImage.alt || article.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      {getCategoryLabel(article.category)}
                    </span>
                  </div>

                  {/* Title */}
                  <Link to={`/articles/${article.slug || article._id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600 transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                  </Link>

                  {/* Excerpt */}
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  {article.tags && article.tags.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            <TagIcon className="w-3 h-3 mr-1" />
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{article.tags.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center space-x-4">
                      {/* Author */}
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-1" />
                        <Link
                          to={`/gardeners/${article.author._id}`}
                          className="hover:text-primary-600 transition-colors"
                        >
                          {article.author.firstName} {article.author.lastName}
                        </Link>
                      </div>

                      {/* Reading Time */}
                      <div className="flex items-center">
                        <ClockIcon className="w-4 h-4 mr-1" />
                        {article.readingTime} min read
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center">
                        <EyeIcon className="w-4 h-4 mr-1" />
                        {article.viewCount}
                      </div>
                      <div className="flex items-center">
                        <HeartIcon className="w-4 h-4 mr-1" />
                        {article.likeCount}
                      </div>
                    </div>
                  </div>

                  {/* Admin Controls */}
                  {isAdmin() && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {/* Status Badge */}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            article.status === 'published' 
                              ? 'bg-green-100 text-green-800'
                              : article.status === 'draft'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {article.status}
                          </span>
                          
                          {/* Active Status */}
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            article.isActive 
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {article.isActive ? 'Active' : 'Inactive'}
                          </span>

                          {/* Featured Status */}
                          {article.featured && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              <StarIcon className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex items-center space-x-2">
                          {/* Edit Button */}
                          <Link
                            to={`/articles/${article._id}/edit`}
                            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                            title="Edit Article"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Link>

                          {/* Featured Toggle */}
                          <button
                            onClick={() => handleFeaturedToggle(article._id, !article.featured)}
                            className={`p-1 transition-colors ${
                              article.featured 
                                ? 'text-yellow-500 hover:text-yellow-600' 
                                : 'text-gray-400 hover:text-yellow-500'
                            }`}
                            title={article.featured ? 'Remove from Featured' : 'Mark as Featured'}
                          >
                            <StarIcon className="w-4 h-4" />
                          </button>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleAdminDeleteArticle(article._id)}
                            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete Article"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Published Date */}
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <div className="flex items-center text-xs text-gray-500">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      Published {formatDate(article.publishedAt)}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No articles found</h3>
          <p className="text-gray-600">
            {filters.search || filters.category
              ? 'Try adjusting your search criteria or filters.'
              : 'Check back later for new articles from our gardening community.'}
          </p>
        </div>
      )}

      {/* Write Article CTA for Gardeners */}
      {isAuthenticated && user?.role === 'gardener' && (
        <div className="mt-12 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Share Your Gardening Knowledge
          </h3>
          <p className="text-gray-600 mb-6">
            Write an article and help fellow gardeners learn from your experience
          </p>
          <Link
            to="/articles/new"
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Write an Article
          </Link>
        </div>
      )}
    </div>
  );
};

export default Articles;
