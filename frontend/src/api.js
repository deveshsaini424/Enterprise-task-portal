import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'; 

console.log("API Base URL:", baseURL);

const api = axios.create({
    baseURL: baseURL
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); 
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth Calls
export const googleAuth = (code) => api.post(`/auth/google`, { code });
export const localLogin = (credentials) => api.post(`/auth/login`, credentials);
export const localRegister = (userData) => api.post(`/auth/register`, userData);
export const getMe = () => api.get(`/api/users/me`);

// User Profile Calls
export const getUserProfile = (email) => api.get(`/api/users/${email}`);
export const updateUserProfile = (userData) => api.put(`/api/users/update`, userData);

// Project Calls
export const getMyProjects = () => api.get(`/api/projects`);
export const createProject = (projectData) => api.post(`/api/projects`, projectData);
export const getProjectDetails = (id) => api.get(`/api/projects/${id}`);
export const updateProject = (id, projectData) => api.put(`/api/projects/${id}`, projectData);
export const deleteProject = (id) => api.delete(`/api/projects/${id}`);
export const addTeamMember = (projectId, userId) => api.put(`/api/projects/${projectId}/team/add`, { userId });
export const removeTeamMember = (projectId, userId) => api.put(`/api/projects/${projectId}/team/remove`, { userId });
export const getDashboardStats = () => api.get(`/api/projects/stats`);
export const getAllUsers = () => api.get(`/api/users`);

// Task Calls
export const getTasksForProject = (projectId) => api.get(`/api/tasks/project/${projectId}`);
export const createTask = (taskData) => api.post(`/api/tasks`, taskData);
export const updateTask = (taskId, taskData) => api.put(`/api/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) => api.delete(`/api/tasks/${taskId}`);

export default api;