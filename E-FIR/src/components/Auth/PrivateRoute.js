import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import LoadingSpinner from '../Common/LoadingSpinner';

const PrivateRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />; // Show a loading spinner while checking auth status
  }

  if (!user) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Logged in, but doesn't have the required role
    // You might want a 403 Forbidden page here
    return <Navigate to="/" replace />; // Redirect to home or an access denied page
  }

  // User is logged in and has the required role, render the child routes
  return <Outlet />;
};

export default PrivateRoute;