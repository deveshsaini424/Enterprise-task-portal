import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
// Fix: Corrected the import path
import { useAuth } from "./context/AuthContext"; // Import the useAuth hook

function RefreshHandler() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth(); // Get login function and user state from context

  useEffect(() => {
    // Only run this check if the user is not already logged in
    if (!user) {
      const data = localStorage.getItem("user-info");
      if (data) {
        try {
          const parsedData = JSON.parse(data);
          const { token, user: storedUser } = parsedData;

          if (token && storedUser) {
            // Log the user in using the stored data
            login(storedUser, token);

            // If they are on the login/register page, send them to dashboard
            if (
              location.pathname === "/" ||
              location.pathname === "/login" ||
              location.pathname === "/register"
            ) {
              navigate("/dashboard", { replace: true });
            }
          }
        } catch (error) {
          console.error("Failed to parse user-info from localStorage", error);
          localStorage.removeItem("user-info");
        }
      }
    }
  }, [location, navigate, login, user]); // Add user and login to dependency array

  return null; // This component does not render anything
}

export default RefreshHandler;

