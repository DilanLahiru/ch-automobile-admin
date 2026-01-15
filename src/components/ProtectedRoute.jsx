import React from "react";
// Packages
import { Navigate, Outlet } from "react-router-dom";
// Components
import Layout from "./Layout";

// Protected Route Component to check if user is authenticated or not and redirect to login page if not authenticated
const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />; // Redirect to login page if not authenticated
  }
  return (
    <Layout>
      <Outlet /> // Render the child routes if authenticated
    </Layout>
  ); // Render the child routes if authenticated
};

export default ProtectedRoute;
