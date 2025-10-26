import axios from 'axios';

// The AuthContext.jsx file already sets the default token header for axios
const API_URL = 'http://localhost:8080'; // Your backend URL

// --- Auth Calls ---

// Google Login (sends code, gets back token)
export const googleAuth = (code) =>
  axios.get(`${API_URL}/auth/google?code=${code}`);

// Local Login (sends email/pass, gets back token)
export const localLogin = (email, password) =>
  axios.post(`${API_URL}/auth/login`, { email, password });

// Local Register
export const localRegister = (name, email, password) =>
  axios.post(`${API_URL}/auth/register`, { name, email, password });

// Get current user (using token)
export const getMe = () => axios.get(`${API_URL}/api/users/me`);

// --- Project Calls ---
export const getMyProjects = () => axios.get(`${API_URL}/api/projects`);
export const createProject = (projectData) =>
  axios.post(`${API_URL}/api/projects`, projectData);
export const getProjectDetails = (id) =>
  axios.get(`${API_URL}/api/projects/${id}`);
export const addProjectMember = (projectId, email) =>
  axios.put(`${API_URL}/api/projects/${projectId}/team`, { email });

// --- Task Calls ---
export const getTasksForProject = (projectId) =>
  axios.get(`${API_URL}/api/tasks/project/${projectId}`);
export const createTask = (taskData) =>
  axios.post(`${API_URL}/api/tasks`, taskData);
export const updateTask = (taskId, taskData) =>
  axios.put(`${API_URL}/api/tasks/${taskId}`, taskData);
export const deleteTask = (taskId) =>
  axios.delete(`${API_URL}/api/tasks/${taskId}`);
