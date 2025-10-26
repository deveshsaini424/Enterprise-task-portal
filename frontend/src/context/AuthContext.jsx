import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios'; // We can just use axios directly

const AuthContext = createContext(null);

// Create a re-usable axios instance
const api = axios.create({
  baseURL: 'http://localhost:8080', // Your backend URL
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token')); // Only store the token
  const [loading, setLoading] = useState(true); // Start as true

  useEffect(() => {
    const loadUser = async () => {
      if (token) {
        localStorage.setItem('token', token);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        try {
          // Fetch user profile using the new /me route
          const { data } = await api.get('/api/users/me');
          setUser(data); // Set the user from the API response
        } catch (err) {
          // Token is invalid or expired
          console.error('Failed to load user', err);
          logout(); // Log them out
        }
      } else {
        localStorage.removeItem('token');
        delete api.defaults.headers.common['Authorization'];
        setUser(null);
      }
      setLoading(false); // We are done loading
    };

    loadUser();
  }, [token]); // This effect runs whenever the token changes

  const login = (userData, userToken) => {
    setUser(userData); // Set user immediately
    setToken(userToken); // This will trigger the useEffect to save/load
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading, api }}>
      {/* Don't render children until we know if user is logged in */}
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
