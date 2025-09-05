import api from './api';

const articleService = {
  // Get all articles with filtering and pagination
  getArticles: async (params = {}) => {
    try {
      const response = await api.get('/articles', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single article by ID or slug
  getArticleById: async (id, incrementView = true) => {
    try {
      const headers = {};
      if (!incrementView) {
        headers['increment-view'] = 'false';
      }
      const response = await api.get(`/articles/${id}`, { headers });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured articles
  getFeaturedArticles: async (limit = 6) => {
    try {
      const response = await api.get('/articles/featured', {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get article categories
  getCategories: async () => {
    try {
      const response = await api.get('/articles/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get articles by author
  getAuthorArticles: async (authorId, params = {}) => {
    try {
      const response = await api.get(`/articles/author/${authorId}`, {
        params
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create new article
  createArticle: async (articleData) => {
    try {
      const response = await api.post('/articles', articleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update article
  updateArticle: async (id, articleData) => {
    try {
      const response = await api.put(`/articles/${id}`, articleData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete article
  deleteArticle: async (id) => {
    try {
      const response = await api.delete(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Like/Unlike article
  toggleArticleLike: async (id) => {
    try {
      const response = await api.post(`/articles/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Increment article view count
  incrementArticleView: async (id) => {
    try {
      const response = await api.post(`/articles/${id}/view`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Get all articles including inactive ones
  adminGetAllArticles: async (params = {}) => {
    try {
      const response = await api.get('/articles/admin/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Toggle featured status
  adminToggleFeatured: async (id, featured) => {
    try {
      const response = await api.put(`/articles/admin/${id}/featured`, { featured });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Admin: Hard delete article
  adminHardDeleteArticle: async (id) => {
    try {
      const response = await api.delete(`/articles/admin/${id}/permanent`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default articleService;
