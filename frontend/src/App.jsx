import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PageNotFound from './PageNotFound'; 
import DashboardPage from './pages/DashboardPage'; 
import ProjectsPage from './pages/ProjectsPage'; 
import ProjectDetailPage from './pages/ProjectDetailPage'; 
import AdminPage from './pages/AdminPage'; 
import ProfilePage from './pages/ProfilePage';

// Components
import RefreshHandler from './RefreshHandler';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute'; 
import Layout from './components/Layout';

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <BrowserRouter>
          <RefreshHandler />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes inside /app */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="dashboard" />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="project/:projectId" element={<ProjectDetailPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route 
                path="admin" 
                element={
                  <AdminRoute>
                    <AdminPage />
                  </AdminRoute>
                } 
              />
            </Route>

            {/* 404 Page */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;