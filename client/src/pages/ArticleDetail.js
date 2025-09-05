import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import articleService from '../services/articleService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ReactMarkdown from 'react-markdown';
import { 
  HeartIcon,
  EyeIcon,
  ClockIcon,
  CalendarDaysIcon,
  UserIcon,
  TagIcon,
  PencilIcon,
  TrashIcon,
  ArrowLeftIcon,
  ShareIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { toast } from 'react-toastify';

const ArticleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

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

  // Add a ref to track if we've already incremented the view for this article
  const hasIncrementedView = useRef(false);

  useEffect(() => {
    // Reset the view increment flag when the article ID changes
    hasIncrementedView.current = false;
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Always fetch article without incrementing view
      const response = await articleService.getArticleById(id, false);
      setArticle(response.data.article);
      setRelatedArticles(response.data.relatedArticles);
      
      // Increment view count separately, only once per component mount
      if (!hasIncrementedView.current && response.data.article.status === 'published') {
        hasIncrementedView.current = true;
        // Call increment view in a separate request
        try {
          await articleService.incrementArticleView(id);
        } catch (viewErr) {
          console.error('Failed to increment view:', viewErr);
          // Don't show error to user for view increment failures
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch article');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast.error('Please sign in to like articles');
      return;
    }

    try {
      setIsLiking(true);
      const action = isLiked ? 'unlike' : 'like';
      await articleService.toggleArticleLike(article._id, action);
      
      setIsLiked(!isLiked);
      setArticle(prev => ({
        ...prev,
        likeCount: prev.likeCount + (isLiked ? -1 : 1)
      }));
      
      toast.success(`Article ${action}d successfully`);
    } catch (err) {
      toast.error(err.message || 'Failed to update like status');
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this article?')) {
      return;
    }

    try {
      await articleService.deleteArticle(article._id);
      toast.success('Article deleted successfully');
      navigate('/articles');
    } catch (err) {
      toast.error(err.message || 'Failed to delete article');
    }
  };

  // Admin-specific handlers
  const handleAdminDeleteArticle = async () => {
    if (window.confirm(`Are you sure you want to permanently delete "${article.title}"?\n\nThis will permanently remove the article and all its data.\n\nThis action cannot be undone!`)) {
      try {
        const result = await articleService.adminHardDeleteArticle(article._id);
        if (result.success) {
          toast.success(result.message);
          navigate('/articles'); // Redirect to articles list after deletion
        }
      } catch (error) {
        console.error('Error deleting article:', error);
        toast.error(error.message || 'Failed to delete article');
      }
    }
  };

  const handleFeaturedToggle = async () => {
    try {
      const result = await articleService.adminToggleFeatured(article._id, !article.featured);
      if (result.success) {
        toast.success(result.message);
        setArticle(prev => ({
          ...prev,
          featured: !prev.featured
        }));
      }
    } catch (error) {
      console.error('Error toggling featured status:', error);
      toast.error(error.message || 'Failed to update featured status');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.excerpt,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
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

  const canEdit = user && (
    user.role === 'admin' || 
    (user.role === 'gardener' && article?.author._id === user._id)
  );

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-gray-600 mb-8">{error}</p>
          <Link
            to="/articles"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link
          to="/articles"
          className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4 mr-2" />
          Back to Articles
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Featured Image */}
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={article.featuredImage.url}
                alt={article.featuredImage.alt || article.title}
                className="w-full h-64 lg:h-80 object-cover"
              />
            </div>

            {/* Article Header */}
            <div className="p-6 lg:p-8">
              {/* Category */}
              <div className="mb-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  {getCategoryLabel(article.category)}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {article.title}
              </h1>

              {/* Excerpt */}
              <p className="text-lg text-gray-600 mb-6">
                {article.excerpt}
              </p>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex items-center space-x-6">
                  {/* Author */}
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                      {article.author.profileImage ? (
                        <img
                          src={article.author.profileImage}
                          alt={`${article.author.firstName}'s profile`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="w-6 h-6 text-primary-600" />
                      )}
                    </div>
                    <div>
                      <Link
                        to={`/gardeners/${article.author._id}`}
                        className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                      >
                        {article.author.firstName} {article.author.lastName}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {article.author.experienceLevel} Gardener
                      </p>
                    </div>
                  </div>

                  {/* Reading Time */}
                  <div className="flex items-center text-gray-500">
                    <ClockIcon className="w-4 h-4 mr-1" />
                    {article.readingTime} min read
                  </div>

                  {/* Published Date */}
                  <div className="flex items-center text-gray-500">
                    <CalendarDaysIcon className="w-4 h-4 mr-1" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                {/* Admin Status Information */}
                {isAdmin() && (
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
                )}

                {/* Actions */}
                <div className="flex items-center space-x-3">
                  {/* Like Button */}
                  <button
                    onClick={handleLike}
                    disabled={isLiking}
                    className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                      isLiked
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {isLiked ? (
                      <HeartSolidIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <HeartIcon className="w-4 h-4 mr-1" />
                    )}
                    {article.likeCount}
                  </button>

                  {/* Share Button */}
                  <button
                    onClick={handleShare}
                    className="flex items-center px-3 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <ShareIcon className="w-4 h-4 mr-1" />
                    Share
                  </button>

                  {/* Edit/Delete Actions */}
                  {canEdit && (
                    <div className="flex items-center space-x-2">
                      <Link
                        to={`/articles/${article._id}/edit`}
                        className="flex items-center px-3 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      >
                        <PencilIcon className="w-4 h-4 mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={handleDelete}
                        className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Admin-only Actions */}
                  {isAdmin() && (
                    <div className="flex items-center space-x-2">
                      {/* Featured Toggle */}
                      <button
                        onClick={handleFeaturedToggle}
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                          article.featured 
                            ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' 
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                        title={article.featured ? 'Remove from Featured' : 'Mark as Featured'}
                      >
                        <StarIcon className="w-4 h-4 mr-1" />
                        {article.featured ? 'Unfeature' : 'Feature'}
                      </button>

                      {/* Admin Hard Delete */}
                      <button
                        onClick={handleAdminDeleteArticle}
                        className="flex items-center px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        title="Permanently delete article (Admin only)"
                      >
                        <TrashIcon className="w-4 h-4 mr-1" />
                        Hard Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {article.tags && article.tags.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        <TagIcon className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Article Content */}
              <div className="prose prose-lg max-w-none text-gray-800 leading-relaxed">
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => (
                      <h1 className="text-3xl font-bold text-gray-900 mb-6 mt-8 first:mt-0">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }) => (
                      <h2 className="text-2xl font-semibold text-gray-900 mb-4 mt-6">
                        {children}
                      </h2>
                    ),
                    h3: ({ children }) => (
                      <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-5">
                        {children}
                      </h3>
                    ),
                    h4: ({ children }) => (
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 mt-4">
                        {children}
                      </h4>
                    ),
                    p: ({ children }) => (
                      <p className="mb-4 text-gray-800 leading-relaxed">
                        {children}
                      </p>
                    ),
                    ul: ({ children }) => (
                      <ul className="mb-4 ml-6 list-disc space-y-2">
                        {children}
                      </ul>
                    ),
                    ol: ({ children }) => (
                      <ol className="mb-4 ml-6 list-decimal space-y-2">
                        {children}
                      </ol>
                    ),
                    li: ({ children }) => (
                      <li className="text-gray-800 leading-relaxed">
                        {children}
                      </li>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">
                        {children}
                      </strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic text-gray-700">
                        {children}
                      </em>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="border-l-4 border-primary-500 pl-4 my-4 italic text-gray-700 bg-gray-50 py-2">
                        {children}
                      </blockquote>
                    ),
                    code: ({ children }) => (
                      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
                        {children}
                      </code>
                    ),
                    pre: ({ children }) => (
                      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                        {children}
                      </pre>
                    ),
                    a: ({ href, children }) => (
                      <a 
                        href={href} 
                        className="text-primary-600 hover:text-primary-700 underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    ),
                    hr: () => (
                      <hr className="my-8 border-gray-300" />
                    )
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>

              {/* Additional Images */}
              {article.images && article.images.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Images</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {article.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={image.url}
                          alt={image.alt || `Article image ${index + 1}`}
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        {image.caption && (
                          <p className="mt-2 text-sm text-gray-600 text-center">
                            {image.caption}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </article>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Article Stats */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Article Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <EyeIcon className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Views</span>
                </div>
                <span className="font-medium text-gray-900">{article.viewCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <HeartIcon className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Likes</span>
                </div>
                <span className="font-medium text-gray-900">{article.likeCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <ClockIcon className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">Reading Time</span>
                </div>
                <span className="font-medium text-gray-900">{article.readingTime} min</span>
              </div>
            </div>
          </div>

          {/* Author Info */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
            <div className="flex items-start space-x-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                {article.author.profileImage ? (
                  <img
                    src={article.author.profileImage}
                    alt={`${article.author.firstName}'s profile`}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <UserIcon className="w-8 h-8 text-primary-600" />
                )}
              </div>
              <div className="flex-1">
                <Link
                  to={`/gardeners/${article.author._id}`}
                  className="font-medium text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {article.author.firstName} {article.author.lastName}
                </Link>
                <p className="text-sm text-gray-500 capitalize">
                  {article.author.experienceLevel} Gardener
                </p>
                {article.author.specializations && article.author.specializations.length > 0 && (
                  <div className="mt-2">
                    <div className="flex flex-wrap gap-1">
                      {article.author.specializations.slice(0, 3).map((spec) => (
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
              </div>
            </div>
          </div>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Articles</h3>
              <div className="space-y-4">
                {relatedArticles.map((relatedArticle) => (
                  <Link
                    key={relatedArticle._id}
                    to={`/articles/${relatedArticle.slug || relatedArticle._id}`}
                    className="block group"
                  >
                    <div className="flex space-x-3">
                      <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={relatedArticle.featuredImage.url}
                          alt={relatedArticle.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                          {relatedArticle.title}
                        </h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(relatedArticle.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArticleDetail;
