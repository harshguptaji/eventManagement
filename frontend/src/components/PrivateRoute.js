// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ element, requiredTag }) => {
    const { admin } = useSelector((state) => state.auth);
  
    // If no admin is logged in, redirect to login page
    if (!admin) {
      return <Navigate to="/" />;
    }
  
    // If admin role is 'admin', allow access by default
    if (admin.role === 'admin') {
      return element;
    }
  
    // If role is 'subAdmin', check if the required tag is present in the admin's tags
    if (admin.role === 'subAdmin') {
      if (!requiredTag || admin.tags.includes(requiredTag)) {
        return element; // Allow access if tag is present or if no tag is required
      } else {
        return <Navigate to="/" />; // Redirect if the tag is not found
      }
    }
  
    // Default case: if the role is neither admin nor subAdmin, redirect to login
    return <Navigate to="/" />;
  };
  
  export default PrivateRoute;