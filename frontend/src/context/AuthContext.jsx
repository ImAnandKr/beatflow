// C:\beatflow\frontend\src\context\AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import { api, userApi } from '../api/axios';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // === Spotify Auth State ===
  const [accessToken, setAccessToken] = useState(localStorage.getItem('spotify_access_token'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('spotify_refresh_token'));
  const [expiresIn, setExpiresIn] = useState(localStorage.getItem('spotify_expires_in'));
  
  // === Local App Auth State ===
  const [user, setUser] = useState(null); // This is for your local DB user
  const [localToken, setLocalToken] = useState(localStorage.getItem('local_token'));
  
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // Effect 1: Handle Spotify Redirect (get tokens from URL)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const expires_in = params.get('expires_in');

    if (access_token && refresh_token && expires_in) {
      setAccessToken(access_token);
      setRefreshToken(refresh_token);
      setExpiresIn(expires_in);
      localStorage.setItem('spotify_access_token', access_token);
      localStorage.setItem('spotify_refresh_token', refresh_token);
      localStorage.setItem('spotify_expires_in', expires_in);
      
      console.log('Spotify tokens captured and stored!');
      navigate('/', { replace: true });
    }
  }, [location, navigate]);

  // Effect 2: Handle Spotify Token Refresh (Interval)
  useEffect(() => {
    if (!refreshToken || !expiresIn) {
      return; 
    }
    const interval = setInterval(async () => {
      try {
        console.log("Refreshing Spotify token (interval)...");
        const { data } = await api.post('/spotify-auth/refresh', { refreshToken });
        setAccessToken(data.access_token);
        setExpiresIn(data.expires_in);
        localStorage.setItem('spotify_access_token', data.access_token);
        localStorage.setItem('spotify_expires_in', data.expires_in);
        console.log('Spotify token refreshed!');
      } catch (err) {
        console.error('Could not refresh Spotify token', err);
        logout();
      }
    }, (expiresIn - 60) * 1000);

    return () => clearInterval(interval);
  }, [refreshToken, expiresIn]);

  // Effect 3: Fetch Local User Profile (if we have a local token)
  useEffect(() => {
    const fetchLocalUser = async () => {
      if (localToken) {
        try {
          const { data } = await api.get('/auth/me', {
            headers: { Authorization: `Bearer ${localToken}` }
          });
          setUser(data);
        } catch (error) {
          console.error("Local token invalid", error);
          localStorage.removeItem('local_token');
          setLocalToken(null);
          setUser(null);
        }
      }
    };
    
    if (!location.search.includes('access_token')) {
        fetchLocalUser();
    }
  }, [localToken, location.search]);

  // Effect 4: Force Token Refresh on Initial Page Load
  useEffect(() => {
    const storedRefreshToken = localStorage.getItem('spotify_refresh_token');
    const params = new URLSearchParams(location.search);

    if (storedRefreshToken && !params.get('access_token')) {
      console.log('Page loaded. Forcing Spotify token refresh...');
      
      const refreshOnLoad = async () => {
        try {
          const { data } = await api.post('/spotify-auth/refresh', { refreshToken: storedRefreshToken });
          setAccessToken(data.access_token);
          setExpiresIn(data.expires_in);
          localStorage.setItem('spotify_access_token', data.access_token);
          localStorage.setItem('spotify_expires_in', data.expires_in);
          console.log('Spotify token refreshed on load!');
        } catch (err) {
          console.error('Could not refresh token on load', err);
          logout();
        } finally {
          setLoading(false);
        }
      };
      
      refreshOnLoad();
    } else {
      setLoading(false);
    }
  }, []);

  // --- Local App Auth Functions ---
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('local_token', data.token);
      setLocalToken(data.token);
    } catch (error) {
      console.error('Local login failed:', error);
      alert('Local login failed: ' + (error.response?.data?.message || 'Server Error'));
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await api.post('/auth/register', { username, email, password });
      localStorage.setItem('local_token', data.token);
      setLocalToken(data.token);
    } catch (error) {
      console.error('Local registration failed:', error);
      alert('Local registration failed: ' + (error.response?.data?.message || 'Server Error'));
    }
  };

  // --- Universal Logout ---
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_expires_in');
    
    setUser(null);
    setLocalToken(null);
    localStorage.removeItem('local_token');
    
    navigate('/login');
  };

  // --- Favorite Functions (Using localUser) ---
  const addFavorite = async (track) => {
    if (!user) return;
    try {
      const { data: newFavorites } = await userApi.post('/favorites', { song: track });
      setUser((prevUser) => ({ ...prevUser, favorites: newFavorites }));
    } catch (error) {
      console.error('Failed to add favorite', error);
      alert('Failed to add favorite.');
    }
  };

  const removeFavorite = async (trackId) => {
    if (!user) return;
    try {
      const { data: newFavorites } = await userApi.delete(`/favorites/${trackId}`);
      setUser((prevUser) => ({ ...prevUser, favorites: newFavorites }));
    } catch (error) {
      console.error('Failed to remove favorite', error);
      alert('Failed to remove favorite.');
    }
  };

  const isFavorite = (trackId) => {
    return user?.favorites?.some((favTrack) => favTrack.id === trackId) || false;
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        loading,
        logout,
        user: user, 
        login,
        register,
        addFavorite,
        removeFavorite,
        isFavorite,
        isSpotifyLoggedIn: !!accessToken 
      }}
    >
      {/* THIS IS THE FIX: We render children immediately.
        This allows PlayerContext to load and define 'onSpotifyWebPlaybackSDKReady'
        *before* the SDK script finishes.
      */}
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;