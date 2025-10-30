// C:\beatflow\frontend\src\api\axios.js

import axios from 'axios';

// Get the API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create a base Axios instance for our API
const api = axios.create({
  baseURL: API_URL,
});

// Create an Axios instance for proxied JioSaavn/Spotify requests
const musicApi = axios.create({
  baseURL: `${API_URL}/music`,
});

// Create an Axios instance for user-specific data (playlists, favorites)
const userApi = axios.create({
  baseURL: `${API_URL}/user`,
});

// --- THIS IS THE FIX ---
// Add an interceptor to userApi to automatically add the auth token
userApi.interceptors.request.use(
  (config) => {
    // Read the 'local_token' we store in AuthContext
    const token = localStorage.getItem('local_token'); 
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// ----------------------

export { api, musicApi, userApi };