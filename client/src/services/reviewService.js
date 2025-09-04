import api from './api';

class ReviewService {
  // Create a new review
  async createReview(plantId, reviewData) {
    try {
      const response = await api.post(`/reviews/plant/${plantId}`, reviewData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update a review
  async updateReview(reviewId, reviewData) {
    try {
      const response = await api.put(`/reviews/${reviewId}`, reviewData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete a review
  async deleteReview(reviewId) {
    try {
      const response = await api.delete(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's reviews
  async getUserReviews(params = {}) {
    try {
      const response = await api.get('/reviews/my', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get review by ID
  async getReviewById(reviewId) {
    try {
      const response = await api.get(`/reviews/${reviewId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Vote review as helpful
  async voteHelpful(reviewId) {
    try {
      const response = await api.post(`/reviews/${reviewId}/helpful`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Handle API errors
  handleError(error) {
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      const errors = error.response.data?.errors || [];
      return {
        message,
        errors,
        status: error.response.status
      };
    } else if (error.request) {
      // Request was made but no response received
      return {
        message: 'Network error. Please check your connection.',
        errors: [],
        status: null
      };
    } else {
      // Something else happened
      return {
        message: error.message || 'An unexpected error occurred',
        errors: [],
        status: null
      };
    }
  }
}

export default new ReviewService();
