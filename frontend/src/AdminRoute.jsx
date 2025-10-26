import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Removed .jsx
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    // Show a full-screen loading spinner while we check auth
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  // Check if user exists and if their role is 'admin'
  if (user && user.role === 'admin') {
    // If admin, render the children (e.g., the AdminPage)
    return children;
  } else {
    // If not loading, but not an admin (or not logged in), redirect
    // Redirect to dashboard is usually safer than login page
    return <Navigate to="/app/dashboard" replace />;
  }
};

export default AdminRoute;

