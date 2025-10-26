import React from "react";
import { Link } from "react-router-dom";


const PageNotFound = () => {
  return (
    <div className="bg-linear-to-br from-purple-600 via-indigo-600 to-cyan-500 min-h-screen flex items-center justify-center font-sans text-center p-4">
      <div className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-8 max-w-md w-full">
       
        <div className="mx-auto mb-6">
          <svg
            className="w-40 h-40 text-indigo-500 mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
            <path d="M12 18a6 6 0 0 0-6-6" />
            <path d="M12 6a6 6 0 0 1 6 6" />
          </svg>
        </div>

        <h1 className="text-5xl font-extrabold text-gray-800 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Page Not Found
        </h2>
        <p className="text-gray-500 mb-8">
          Oops! It seems the page you were looking for doesn't exist or has been
          moved.
        </p>

        <Link
          to="./pages/LoginPage"
          className="inline-block px-8 py-3 text-lg font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors shadow-md transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default PageNotFound;
