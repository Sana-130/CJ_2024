import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Import useAuth hook

const PrivateRoute = () => {
  const { user } = useAuth();  // Access user from the context

  if (!user) {
    console.log(user);
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
