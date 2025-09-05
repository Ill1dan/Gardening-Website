import api from './api';

class PlantService {
  // Get all plants with filtering and pagination
  async getPlants(params = {}) {
    try {
      const response = await api.get('/plants', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get single plant by ID
  async getPlantById(id) {
    try {
      const response = await api.get(`/plants/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Create new plant (gardeners+ only)
  async createPlant(plantData) {
    try {
      const response = await api.post('/plants', plantData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Update plant
  async updatePlant(id, plantData) {
    try {
      const response = await api.put(`/plants/${id}`, plantData);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Delete plant
  async deletePlant(id) {
    try {
      const response = await api.delete(`/plants/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get plant reviews
  async getPlantReviews(id, params = {}) {
    try {
      const response = await api.get(`/plants/${id}/reviews`, { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Add plant to favorites
  async addToFavorites(id, notes = '') {
    try {
      const response = await api.post(`/plants/${id}/favorites`, { notes });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Remove plant from favorites
  async removeFromFavorites(id) {
    try {
      const response = await api.delete(`/plants/${id}/favorites`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user's favorite plants
  async getUserFavorites(params = {}) {
    try {
      const response = await api.get('/plants/favorites/my', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get featured plants
  async getFeaturedPlants(limit = 6) {
    try {
      const response = await api.get('/plants/featured', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get plant categories
  async getCategories() {
    try {
      const response = await api.get('/plants/categories');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search plants
  async searchPlants(searchTerm, params = {}) {
    try {
      const response = await api.get('/plants', { 
        params: { search: searchTerm, ...params } 
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get plants by category
  async getPlantsByCategory(category, params = {}) {
    try {
      const response = await api.get('/plants', { 
        params: { category, ...params } 
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Check if plant is favorited by user
  async isFavorited(plantId) {
    try {
      const favorites = await this.getUserFavorites({ limit: 1000 });
      return favorites.data.some(fav => fav.plant._id === plantId);
    } catch (error) {
      return false;
    }
  }

  // Admin: Get all plants including inactive ones
  async adminGetAllPlants(params = {}) {
    try {
      const response = await api.get('/plants/admin/all', { params });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Admin: Permanently delete plant
  async adminDeletePlant(id) {
    try {
      const response = await api.delete(`/plants/admin/${id}/permanent`);
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

export default new PlantService();
