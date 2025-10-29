import React from 'react'; // <-- FIX
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // You can replace this with a proper loading spinner
    return <div>Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;