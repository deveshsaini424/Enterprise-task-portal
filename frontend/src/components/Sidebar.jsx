import React from "react";
import { NavLink } from "react-router-dom";
// FIX: Updated import path for better project structure
import { useAuth } from "../context/AuthContext"; // We need this to check for admin role

// We use inline SVGs for simplicity
const DashboardIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6-4h.01M12 16h.01"
    />
  </svg>
);
const ProjectsIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 19.582s-3.462 1.418-7.001 0M4 6h16M4 10h16M4 14h16M4 18h16"
    />
  </svg>
);
const AdminIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const Sidebar = () => {
  const { user } = useAuth();

  // Helper function to style the active NavLink
  const getNavLinkClass = ({ isActive }) => {
    return isActive
      ? "flex items-center p-3 text-white bg-indigo-700 rounded-lg"
      : "flex items-center p-3 text-indigo-100 hover:bg-indigo-700 rounded-lg transition-colors";
  };

  return (
    <div className="w-64 bg-indigo-800 text-white flex-col p-4 hidden md:flex">
      {/* Hidden on mobile, flex on medium and up */}
      <div className="text-2xl font-bold mb-10 text-center">
        TaskPortal
      </div>
      <nav className="flex-1 flex flex-col space-y-2">
        <NavLink to="/app/dashboard" className={getNavLinkClass}>
          <DashboardIcon />
          <span className="ml-3">Dashboard</span>
        </NavLink>

        <NavLink to="/app/projects" className={getNavLinkClass}>
          <ProjectsIcon />
          <span className="ml-3">My Projects</span>
        </NavLink>

        {/* Admin-only link */}
        {user?.role === "admin" && (
          <NavLink to="/app/admin" className={getNavLinkClass}>
            <AdminIcon />
            <span className="ml-3">Admin Panel</span>
          </NavLink>
        )}
      </nav>
      <div className="mt-auto text-center text-indigo-300 text-sm">
        <p>&copy; 2024 Your Company</p>
      </div>
    </div>
  );
};

export default Sidebar;

