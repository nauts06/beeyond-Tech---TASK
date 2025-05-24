import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { auth } = useAuth();

  if (!auth.isLoggedIn) return <Navigate to="/login" />;
  if (!allowedRoles.includes(auth.role)) return <Navigate to="/unauthorized" />;

  return children;
};

export default PrivateRoute;
