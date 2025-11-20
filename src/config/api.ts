// API Configuration
// Base URL is loaded from environment variables via dotenv-webpack
// Development: http://localhost:4000
// Production: http://api-bibitku.filkom.ub.ac.id
export const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:4000';

// API Endpoints
export const API_ENDPOINTS = {
  // Health check endpoint
  HEALTH: `${API_BASE_URL}/health`,

  // Calculator endpoints
  CALCULATOR: {
    GENERATE: `${API_BASE_URL}/api/calculator/generate`,
    REVERSE: `${API_BASE_URL}/api/calculator/reverse`,
    BASE: `${API_BASE_URL}/api/calculator`,
  },

  // Articles endpoints
  ARTICLES: {
    LIST: `${API_BASE_URL}/api/articles`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/articles/${id}`,
  },
};

// Legacy export for backward compatibility
// Points to the base API path (not including specific endpoints)
// Files using this should append their specific endpoint path
export const API_URL = `${API_BASE_URL}/api`;