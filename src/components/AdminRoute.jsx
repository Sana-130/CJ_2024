import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';  // Import useAuth hook

const AdminRoute = () => {
  const { user } = useAuth(); 
  let userObj = user.toJson(); // Access user from the context

  if (!user && userObj.isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;
