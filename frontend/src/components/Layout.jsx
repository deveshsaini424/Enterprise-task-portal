import React from 'react';
import { Outlet } from 'react-router-dom'; // <-- Import Outlet
import { useAuth } from '../context/AuthContext'; // <-- Simplified Path
import Sidebar from './Sidebar'; // <-- Removed .jsx
import { Loader2 } from 'lucide-react';

const Layout = () => {
  const { user, logout, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white shadow-sm z-10 p-4">
          <div className="flex justify-end items-center">
            <span className="text-sm font-medium text-gray-700 mr-4">
              Welcome, {user?.name || 'User'}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
          {/* --- THIS IS THE CRITICAL CHANGE --- */}
          {/* Child routes (Dashboard, Projects) will be rendered here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

