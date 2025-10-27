import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext(null);

// Use environment variable for API URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080",
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        localStorage.setItem("token", token);
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        try {
          const { data } = await api.get("/api/users/me");
          setUser(data);
        } catch (err) {
          console.error("Failed to load user", err);
          logout();
        }
      } else {
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
      }
      setLoading(false);
    };

    loadUser();
  }, [token]);

  const login = (userData, userToken) => {
    // Save to localStorage immediately
    localStorage.setItem("token", userToken);
    localStorage.setItem("user", JSON.stringify(userData));
    
    // Update state
    setUser(userData);
    setToken(userToken);
    
    // Set axios header immediately
    api.defaults.headers.common["Authorization"] = `Bearer ${userToken}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, api }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};