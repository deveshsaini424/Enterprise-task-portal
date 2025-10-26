import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Simplified import path
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a full-screen loading spinner while we check auth
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  // This block was duplicated. It is now fixed.
  
  if (!user) {
    // If not loading and no user, redirect to login
    return <Navigate to="/login" replace />;
  }

  // If user is logged in, render the children (e.g., the <Layout />)
  // 'children' prop is not used here, <Outlet /> is the correct way
  // when using this as a wrapper in <Routes>
  return children; 
};

export default ProtectedRoute;

