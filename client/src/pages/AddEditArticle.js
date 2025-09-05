import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import articleService from '../services/articleService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  ArrowLeftIcon,
  PhotoIcon,
  TagIcon,
  EyeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const AddEditArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEditing = Boolean(id);
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [article, setArticle] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: [],
    featuredImage: {
      url: '',
      alt: ''
    },
    images: [],
    status: 'draft'
  });
  
  const [errors, setErrors] = useState({});
  const [tagInput, setTagInput] = useState('');

  const categories = [
    { value: 'gardening-tips', label: 'Gardening Tips' },
    { value: 'plant-care', label: 'Plant Care' },
    { value: 'seasonal-guides', label: 'Seasonal Guides' },
    { value: 'pest-control', label: 'Pest Control' },
    { value: 'soil-fertilizer', label: 'Soil & Fertilizer' },
    { value: 'tools-equipment', label: 'Tools & Equipment' },
    { value: 'beginner-guides', label: 'Beginner Guides' },
    { value: 'advanced-techniques', label: 'Advanced Techniques' },
    { value: 'indoor-gardening', label: 'Indoor Gardening' },
    { value: 'outdoor-gardening', label: 'Outdoor Gardening' }
  ];

  useEffect(() => {
    if (isEditing) {
      fetchArticle();
    }
  }, [id, isEditing]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      const response = await articleService.getArticleById(id);
      setArticle(response.data.article);
    } catch (err) {
      toast.error(err.message || 'Failed to fetch article');
      navigate('/articles');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setArticle(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleNestedInputChange = (parent, field, value) => {
    setArticle(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value
      }
    }));
  };

  const handleAddTag = (e) => {
    if (e) e.preventDefault();
    if (tagInput.trim() && article.tags.length < 10) {
      const newTag = tagInput.trim().toLowerCase();
      if (!article.tags.includes(newTag)) {
        setArticle(prev => ({
          ...prev,
          tags: [...prev.tags, newTag]
        }));
        setTagInput('');
      }
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleAddImage = () => {
    setArticle(prev => ({
      ...prev,
      images: [...prev.images, { url: '', alt: '', caption: '' }]
    }));
  };

  const handleImageChange = (index, field, value) => {
    setArticle(prev => ({
      ...prev,
      images: prev.images.map((img, i) => 
        i === index ? { ...img, [field]: value } : img
      )
    }));
  };

  const handleRemoveImage = (index) => {
    setArticle(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!article.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!article.excerpt.trim()) {
      newErrors.excerpt = 'Excerpt is required';
    }
    if (!article.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!article.category) {
      newErrors.category = 'Category is required';
    }
    if (!article.featuredImage.url.trim()) {
      newErrors.featuredImage = 'Featured image URL is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors below');
      return;
    }

    try {
      setSaving(true);
      
      // Clean up empty images
      const cleanedArticle = {
        ...article,
        images: article.images.filter(img => img.url.trim())
      };

      if (isEditing) {
        await articleService.updateArticle(id, cleanedArticle);
        toast.success('Article updated successfully');
      } else {
        await articleService.createArticle(cleanedArticle);
        toast.success('Article created successfully');
      }
      
      navigate('/articles');
    } catch (err) {
      if (err.errors) {
        setErrors(err.errors.reduce((acc, error) => {
          acc[error.field] = error.message;
          return acc;
        }, {}));
      }
      toast.error(err.message || 'Failed to save article');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/articles')}
            className="flex items-center text-gray-600 hover:text-primary-600 transition-colors mr-4"
          >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Back to Articles
          </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Article' : 'Write New Article'}
        </h1>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update your article content and settings' : 'Share your gardening knowledge with the community'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Article Information
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={article.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.title ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter article title..."
                maxLength={200}
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {article.title.length}/200 characters
              </p>
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Excerpt *
              </label>
              <textarea
                name="excerpt"
                value={article.excerpt}
                onChange={handleInputChange}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.excerpt ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Write a brief summary of your article..."
                maxLength={500}
              />
              {errors.excerpt && (
                <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                {article.excerpt.length}/500 characters
              </p>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                name="category"
                value={article.category}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.category ? 'border-red-300' : 'border-gray-300'
                }`}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category}</p>
              )}
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={article.status}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Draft articles are only visible to you. Published articles are visible to everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <PhotoIcon className="w-5 h-5 mr-2" />
            Featured Image
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Image URL *
              </label>
              <input
                type="url"
                value={article.featuredImage.url}
                onChange={(e) => handleNestedInputChange('featuredImage', 'url', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.featuredImage ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="https://example.com/image.jpg"
              />
              {errors.featuredImage && (
                <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alt Text
              </label>
              <input
                type="text"
                value={article.featuredImage.alt}
                onChange={(e) => handleNestedInputChange('featuredImage', 'alt', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe the image for accessibility..."
                maxLength={200}
              />
            </div>

            {/* Image Preview */}
            {article.featuredImage.url && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preview
                </label>
                <div className="w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                  <img
                    src={article.featuredImage.url}
                    alt={article.featuredImage.alt || 'Featured image preview'}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <DocumentTextIcon className="w-5 h-5 mr-2" />
            Article Content
          </h2>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content *
            </label>
            <textarea
              name="content"
              value={article.content}
              onChange={handleInputChange}
              rows={15}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                errors.content ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Write your article content here using Markdown formatting...

Examples:
# Main Heading
## Subheading
### Smaller Heading

**Bold text** and *italic text*

- Bullet point 1
- Bullet point 2

1. Numbered list item 1
2. Numbered list item 2

> This is a quote

[Link text](https://example.com)"
              maxLength={10000}
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600">{errors.content}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              {article.content.length}/10000 characters
            </p>
            <p className="mt-1 text-xs text-blue-600">
              💡 Tip: Use Markdown formatting for better article presentation. Headers, lists, and bold text will be automatically styled.
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
            <TagIcon className="w-5 h-5 mr-2" />
            Tags
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag(e);
                  }
                }}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Add a tag..."
                maxLength={30}
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Current Tags */}
            {article.tags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Current Tags ({article.tags.length}/10)
                </p>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Images */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <PhotoIcon className="w-5 h-5 mr-2" />
              Additional Images
            </h2>
            <button
              type="button"
              onClick={handleAddImage}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Add Image
            </button>
          </div>

          {article.images.length > 0 ? (
            <div className="space-y-4">
              {article.images.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={image.url}
                        onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Alt Text
                      </label>
                      <input
                        type="text"
                        value={image.alt}
                        onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Describe the image..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Caption
                      </label>
                      <input
                        type="text"
                        value={image.caption}
                        onChange={(e) => handleImageChange(index, 'caption', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Optional caption..."
                        maxLength={200}
                      />
                    </div>
                  </div>
                  
                  {/* Image Preview */}
                  {image.url && (
                    <div className="mt-4">
                      <div className="w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.url}
                          alt={image.alt || `Image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="mt-2 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove Image
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">
              No additional images added yet. Click "Add Image" to include more images in your article.
            </p>
          )}
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/articles')}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Saving...' : (isEditing ? 'Update Article' : 'Publish Article')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditArticle;
