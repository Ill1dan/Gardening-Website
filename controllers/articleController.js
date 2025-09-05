const Article = require('../models/Article');
const mongoose = require('mongoose');

// Get all published articles with filtering and pagination
const getArticles = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      author,
      search,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build filter query
    const filter = { 
      status: 'published', 
      isActive: true 
    };
    
    if (category) filter.category = category;
    if (author) filter.author = author;
    if (featured === 'true') filter.featured = true;

    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const articles = await Article.find(filter)
      .populate('author', 'username firstName lastName profileImage experienceLevel')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortObj);

    // Get total count for pagination
    const totalCount = await Article.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getArticles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles',
      error: error.message
    });
  }
};

// Get single article by ID or slug
const getArticleById = async (req, res) => {
  try {
    const { id } = req.params;

    let article;
    
    // Check if it's a valid ObjectId, otherwise treat as slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      article = await Article.findById(id)
        .populate('author', 'username firstName lastName profileImage experienceLevel specializations');
    } else {
      article = await Article.findOne({ slug: id })
        .populate('author', 'username firstName lastName profileImage experienceLevel specializations');
    }

    if (!article || !article.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Only show published articles to non-authors
    if (article.status !== 'published' && 
        (!req.user || article.author._id.toString() !== req.user._id.toString())) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // View count is now handled by a separate endpoint

    // Get related articles
    const relatedArticles = await Article.find({
      _id: { $ne: article._id },
      category: article.category,
      status: 'published',
      isActive: true
    })
      .populate('author', 'username firstName lastName profileImage')
      .limit(6)
      .sort({ publishedAt: -1 });

    res.json({
      success: true,
      data: {
        article,
        relatedArticles
      }
    });
  } catch (error) {
    console.error('Error in getArticleById:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching article',
      error: error.message
    });
  }
};

// Create new article (gardeners and admins only)
const createArticle = async (req, res) => {
  try {
    const articleData = {
      ...req.body,
      author: req.user._id
    };

    const article = new Article(articleData);
    await article.save();

    const populatedArticle = await Article.findById(article._id)
      .populate('author', 'username firstName lastName profileImage');

    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: populatedArticle
    });
  } catch (error) {
    console.error('Error in createArticle:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An article with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating article',
      error: error.message
    });
  }
};

// Update article (authors can update their own, admins can update any)
const updateArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this article'
      });
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName profileImage');

    res.json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle
    });
  } catch (error) {
    console.error('Error in updateArticle:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An article with this title already exists'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating article',
      error: error.message
    });
  }
};

// Delete article (soft delete - set isActive to false)
const deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Check permissions
    if (req.user.role !== 'admin' && article.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this article'
      });
    }

    await Article.findByIdAndUpdate(id, { isActive: false });

    res.json({
      success: true,
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteArticle:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting article',
      error: error.message
    });
  }
};

// Get featured articles
const getFeaturedArticles = async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const articles = await Article.getFeaturedArticles(parseInt(limit));

    res.json({
      success: true,
      data: articles
    });
  } catch (error) {
    console.error('Error in getFeaturedArticles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching featured articles',
      error: error.message
    });
  }
};

// Get article categories with counts
const getCategories = async (req, res) => {
  try {
    const categories = await Article.aggregate([
      { $match: { status: 'published', isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error in getCategories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message
    });
  }
};

// Get author's articles
const getAuthorArticles = async (req, res) => {
  try {
    const { authorId } = req.params;
    const { page = 1, limit = 12, status } = req.query;

    if (!mongoose.Types.ObjectId.isValid(authorId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid author ID'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const articles = await Article.getAuthorArticles(authorId, {
      status: status || 'published',
      limit: parseInt(limit),
      skip,
      sort: { createdAt: -1 }
    });

    const totalCount = await Article.countDocuments({
      author: authorId,
      isActive: true,
      ...(status && { status })
    });
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in getAuthorArticles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching author articles',
      error: error.message
    });
  }
};

// Like/Unlike article
const toggleArticleLike = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    const article = await Article.findById(id);
    
    if (!article || !article.isActive || article.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // For now, we'll just increment/decrement the like count
    // In a real application, you'd want to track individual user likes
    const { action } = req.body; // 'like' or 'unlike'
    
    if (action === 'like') {
      await article.incrementLikeCount();
    } else if (action === 'unlike') {
      await article.decrementLikeCount();
    } else {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Use "like" or "unlike"'
      });
    }

    res.json({
      success: true,
      message: `Article ${action}d successfully`,
      data: { likeCount: article.likeCount }
    });
  } catch (error) {
    console.error('Error in toggleArticleLike:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating article like',
      error: error.message
    });
  }
};

// Admin: Get all articles including inactive ones
const adminGetAllArticles = async (req, res) => {
  try {
    
    const {
      page = 1,
      limit = 12,
      category,
      author,
      status,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      featured,
      isActive
    } = req.query;

    // Build filter query - admin can see inactive articles
    const filter = {};
    
    if (category) filter.category = category;
    if (author) filter.author = author;
    if (status) filter.status = status;
    if (featured === 'true') filter.featured = true;
    if (isActive !== undefined && isActive !== '') filter.isActive = isActive === 'true';

    // Add search functionality
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sortObj = {};
    
    // For admin, if sorting by publishedAt but some articles might not have it, 
    // fall back to createdAt for articles without publishedAt
    if (sortBy === 'publishedAt') {
      sortObj.publishedAt = sortOrder === 'desc' ? -1 : 1;
      sortObj.createdAt = sortOrder === 'desc' ? -1 : 1; // fallback
    } else {
      sortObj[sortBy] = sortOrder === 'desc' ? -1 : 1;
    }

    // Execute query
    const articles = await Article.find(filter)
      .populate('author', 'username firstName lastName profileImage')
      .limit(parseInt(limit))
      .skip(skip)
      .sort(sortObj);

    // Get total count for pagination
    const totalCount = await Article.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalCount,
        hasNextPage: parseInt(page) < totalPages,
        hasPrevPage: parseInt(page) > 1
      }
    });
  } catch (error) {
    console.error('Error in adminGetAllArticles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching articles',
      error: error.message
    });
  }
};

// Admin: Hard delete article (permanent deletion)
const adminHardDeleteArticle = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Hard delete the article
    await Article.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Article permanently deleted'
    });
  } catch (error) {
    console.error('Error in adminHardDeleteArticle:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting article',
      error: error.message
    });
  }
};

// Increment article view count (separate endpoint)
const incrementArticleView = async (req, res) => {
  try {
    const { id } = req.params;

    let article;
    
    // Check if it's a valid ObjectId, otherwise treat as slug
    if (mongoose.Types.ObjectId.isValid(id)) {
      article = await Article.findById(id);
    } else {
      article = await Article.findOne({ slug: id });
    }
    
    if (!article || !article.isActive || article.status !== 'published') {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    // Add debouncing to prevent rapid successive increments
    const clientIP = req.ip || req.connection.remoteAddress;
    const viewKey = `view_${article._id}_${clientIP}`;
    
    // Check if we've recently incremented this view (using a simple in-memory cache)
    if (!global.recentViews) {
      global.recentViews = new Map();
    }
    
    const lastViewTime = global.recentViews.get(viewKey);
    const now = Date.now();
    
    // Only increment if more than 5 seconds have passed since last increment
    if (!lastViewTime || (now - lastViewTime) > 5000) {
      await article.incrementViewCount();
      global.recentViews.set(viewKey, now);
      
      // Clean up old entries every 100 views to prevent memory leaks
      if (global.recentViews.size > 100) {
        const cutoffTime = now - 60000; // 1 minute ago
        for (const [key, time] of global.recentViews.entries()) {
          if (time < cutoffTime) {
            global.recentViews.delete(key);
          }
        }
      }

      res.json({
        success: true,
        message: 'View count incremented',
        viewCount: article.viewCount + 1
      });
    } else {
      res.json({
        success: true,
        message: 'View already counted recently',
        viewCount: article.viewCount
      });
    }
  } catch (error) {
    console.error('Error in incrementArticleView:', error);
    res.status(500).json({
      success: false,
      message: 'Error incrementing view count',
      error: error.message
    });
  }
};

// Admin: Toggle featured status of an article
const adminToggleFeatured = async (req, res) => {
  try {
    const { id } = req.params;
    const { featured } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid article ID'
      });
    }

    if (typeof featured !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Featured status must be a boolean value'
      });
    }

    const article = await Article.findByIdAndUpdate(
      id,
      { featured },
      { new: true, runValidators: true }
    ).populate('author', 'username firstName lastName profileImage');

    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found'
      });
    }

    res.json({
      success: true,
      message: `Article ${featured ? 'marked as featured' : 'removed from featured'}`,
      data: article
    });
  } catch (error) {
    console.error('Error in adminToggleFeatured:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating featured status',
      error: error.message
    });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle,
  getFeaturedArticles,
  getCategories,
  getAuthorArticles,
  toggleArticleLike,
  incrementArticleView,
  adminGetAllArticles,
  adminHardDeleteArticle,
  adminToggleFeatured
};
