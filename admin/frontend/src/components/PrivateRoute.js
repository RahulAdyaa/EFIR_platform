// admin/frontend/src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const adminInfo = JSON.parse(localStorage.getItem('adminInfo'));
  return adminInfo && adminInfo.token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;