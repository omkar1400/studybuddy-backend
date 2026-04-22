import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle unauthorized access - clear session and let app handle redirect
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

// ============== User Authentication APIs ==============
export const userAPI = {
  /** Register a new user account */
  register: (name, email, password) =>
    api.post('/users/register', { name, email, password }),
  
  /** Login with email and password to get JWT token */
  login: (email, password) =>
    api.post('/users/login', { email, password }),
  
  /** Get current logged-in user's profile */
  getProfile: () =>
    api.get('/users/profile'),
  
  /** Retrieve all users (admin function) */
  getAllUsers: () =>
    api.get('/users'),
  
  /** Get specific user by ID */
  getUserById: (id) =>
    api.get(`/users/${id}`),
  
  /** Update user information */
  updateUser: (id, userData) =>
    api.put(`/users/${id}`, userData),
  
  /** Delete user account */
  deleteUser: (id) =>
    api.delete(`/users/${id}`)
};

// ============== Subject Management APIs ==============
export const subjectAPI = {
  /** Get all subjects for current user */
  getAllSubjects: () =>
    api.get('/subjects'),
  
  /** Get specific subject by ID */
  getSubjectById: (id) =>
    api.get(`/subjects/${id}`),
  
  /** Create new study subject */
  createSubject: (name, description) =>
    api.post('/subjects', { name, description }),
  
  /** Update existing subject */
  updateSubject: (id, name, description) =>
    api.put(`/subjects/${id}`, { name, description }),
  
  /** Delete subject */
  deleteSubject: (id) =>
    api.delete(`/subjects/${id}`)
};

// ============== Study Session APIs ==============
export const sessionAPI = {
  /** Get all study sessions */
  getAllSessions: () =>
    api.get('/sessions'),
  
  /** Get specific session by ID */
  getSessionById: (id) =>
    api.get(`/sessions/${id}`),
  
  /** Get sessions filtered by status (pending/completed/cancelled) */
  getSessionsByStatus: (status) =>
    api.get(`/sessions/status/${status}`),
  
  /** Create new study session */
  createSession: (sessionData) =>
    api.post('/sessions', sessionData),
  
  /** Update existing session */
  updateSession: (id, sessionData) =>
    api.put(`/sessions/${id}`, sessionData),
  
  /** Delete session */
  deleteSession: (id) =>
    api.delete(`/sessions/${id}`)
};

export default api;
