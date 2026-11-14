// Base URL for our Node.js / Express backend API
const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get stored JWT token from localStorage
const getToken = () => localStorage.getItem('token');

// Centralized API Service Object
const API = {
  // --- PRODUCTS ---
  getProducts: async (queryString = '') => {
    try {
      const response = await fetch(`${API_BASE_URL}/products${queryString}`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return { products: [], error: error.message };
    }
  },

  getProductById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!response.ok) throw new Error('Product not found');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return null;
    }
  },

  // --- CATEGORIES ---
  getCategories: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return [];
    }
  },

  // --- AUTHENTICATION ---
  login: async (email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      
      // Save token and user info
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  register: async (name, email, password) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, data };
    } catch (error) {
      return { success: false, message: error.message };
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/index.html';
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};