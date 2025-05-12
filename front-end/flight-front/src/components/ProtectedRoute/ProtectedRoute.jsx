// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
      // Redirect to the login page if there's no token
      return <Navigate to="/" />;
    }
  
  
  return children;
};

export default ProtectedRoute;
