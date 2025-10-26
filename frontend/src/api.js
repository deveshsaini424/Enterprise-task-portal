import axios from 'axios';

// Get the backend URL from the environment variable provided by Vercel/Vite
// Fallback to localhost:8080 ONLY if the variable is not set (for local dev)
const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'; 

console.log("API Base URL:", baseURL); // Add log to verify

// Create a single, configured axios instance
const api = axios.create({
    baseURL: baseURL // Use the variable here
});

// Add Authorization header interceptor - THIS IS IMPORTANT
// It automatically adds the JWT token to every protected API request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage (AuthContext should handle saving it)
    const token = localStorage.getItem('token'); 
    if (token) {
      // Add the Bearer token to the Authorization header
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);


// --- Export specific API call functions using the configured instance ---

// Auth Calls
export const googleAuth = (code) => api.get(`/auth/google?code=${code}`);
export const localLogin = (credentials) => api.post(`/auth/login`, credentials); // Pass credentials object
export const localRegister = (userData) => api.post(`/auth/register`, userData); // Pass userData object
export const getMe = () => api.get(`/api/users/me`); // For AuthContext

// User Profile Calls
export const getUserProfile = (email) => api.get(`/api/users/${email}`); // Might not be needed if getMe is used
export const updateUserProfile = (userData) => api.put(`/api/users/update`, userData); // Assumes backend uses logged-in user

// Project Calls
export const getMyProjects = () => api.get(`/api/projects`);
export const createProject = (projectData) => api.post(`/api/projects`, projectData);
export const getProjectDetails = (id) => api.get(`/api/projects/${id}`);
export const updateProject = (id, projectData) => api.put(`/api/projects/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/api/projects/${id}`);
export const addTeamMember = (projectId, userId) => api.put(`/api/projects/${projectId}/team/add`, { userId });
export const removeTeamMember = (projectId, userId) => api.put(`/api/projects/${projectId}/team/remove`, { userId });
export const getDashboardStats = () => api.get(`/api/projects/stats`);
export const getAllUsers = () => api.get(`/api/users`); // For team management/admin

// Task Calls
export const getTasksForProject = (projectId) => api.get(`/api/tasks/project/${projectId}`);
export const createTask = (taskData) => api.post(`/api/tasks`, taskData);
export const updateTask = (taskId, taskData) => api.put(`/api/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => api.delete(`/api/tasks/${taskId}`);


