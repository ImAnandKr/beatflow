import React, { createContext, useState, useEffect } from 'react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check for user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      // You should probably set an error state here to show in the UI
      alert('Login Failed: ' + (error.response?.data?.message || 'Server Error'));
    }
  };

  const register = async (username, email, password) => {
    try {
      const { data } = await api.post('/auth/register', {
        username,
        email,
        password,
      });
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/');
    } catch (error) {
      console.error(
        'Registration failed:',
        error.response?.data?.message || error.message
      );
      alert(
        'Registration Failed: ' +
          (error.response?.data?.message || 'Server Error')
      );
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, setUser }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;