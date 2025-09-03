class RecipeAPI {
    constructor() {
      this.baseURL = 'http://localhost:5000/api';
      this.token = localStorage.getItem('authToken');
    }
  
    // Set auth token
    setToken(token) {
      this.token = token;
      localStorage.setItem('authToken', token);
    }
  
    // Remove auth token
    removeToken() {
      this.token = null;
      localStorage.removeItem('authToken');
    }
  
    // Generic API request method
    async request(endpoint, options = {}) {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };
  
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
  
      try {
        const response = await fetch(url, config);
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'API request failed');
        }
  
        return data;
      } catch (error) {
        console.error('API Error:', error);
        throw error;
      }
    }
  
    // Recipe endpoints
    async searchRecipes(ingredients, dietary = '', cookingTime = '') {
      const params = new URLSearchParams({
        ingredients: ingredients.join(','),
        dietary,
        cookingTime,
      });
  
      return this.request(`/recipes/search?${params}`);
    }
  
    async getRecipe(id) {
      return this.request(`/recipes/${id}`);
    }
  
    async saveRecipe(recipeData) {
      return this.request('/recipes', {
        method: 'POST',
        body: JSON.stringify(recipeData),
      });
    }
  
    async getFavorites() {
      return this.request('/recipes/favorites');
    }
  
    async addToFavorites(recipeId) {
      return this.request(`/recipes/${recipeId}/favorite`, {
        method: 'POST',
      });
    }
  
    async removeFromFavorites(recipeId) {
      return this.request(`/recipes/${recipeId}/favorite`, {
        method: 'DELETE',
      });
    }
  
    // User endpoints
    async register(userData) {
      return this.request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
    }
  
    async login(credentials) {
      const response = await this.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
  
      if (response.token) {
        this.setToken(response.token);
      }
  
      return response;
    }
  
    async logout() {
      this.removeToken();
      return this.request('/auth/logout', {
        method: 'POST',
      });
    }
  
    async getProfile() {
      return this.request('/users/profile');
    }
  
    async updateProfile(profileData) {
      return this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });
    }
  
    async getUserStats() {
      return this.request('/users/stats');
    }
  
    async updateCookingStats(recipeId) {
      return this.request('/users/cooking-stats', {
        method: 'POST',
        body: JSON.stringify({ recipeId }),
      });
    }
  
    // Health check
    async healthCheck() {
      return this.request('/health');
    }
  }
  
  // Create global API instance
  window.recipeAPI = new RecipeAPI();