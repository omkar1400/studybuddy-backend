import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// request interceptor with custom logging
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[StudyBuddy API] ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[StudyBuddy API] Request failed:', error);
    return Promise.reject(error);
  }
);

// response interceptor with custom error handling
api.interceptors.response.use(
  (response) => {
    console.log(`[StudyBuddy API] Response OK: ${response.status}`);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      console.warn('[StudyBuddy API] Session expired');
    }
    console.error('[StudyBuddy API] Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

// user authentication APIs
export const userAPI = {
  register: (name, email, password) =>
    api.post('/users/register', { name, email, password }),
  
  login: (email, password) =>
    api.post('/users/login', { email, password }),
  
  getProfile: () =>
    api.get('/users/profile'),
  
  getAllUsers: () =>
    api.get('/users'),
  
  getUserById: (id) =>
    api.get(`/users/${id}`),
  
  updateUser: (id, userData) =>
    api.put(`/users/${id}`, userData),
  
  deleteUser: (id) =>
    api.delete(`/users/${id}`)
};

// subject management APIs
export const subjectAPI = {
  getAllSubjects: () =>
    api.get('/subjects'),
  
  getSubjectById: (id) =>
    api.get(`/subjects/${id}`),
  
  createSubject: (name, description) =>
    api.post('/subjects', { name, description }),
  
  updateSubject: (id, name, description) =>
    api.put(`/subjects/${id}`, { name, description }),
  
  deleteSubject: (id) =>
    api.delete(`/subjects/${id}`)
};

// study session APIs
export const sessionAPI = {
  getAllSessions: () =>
    api.get('/sessions'),
  
  getSessionById: (id) =>
    api.get(`/sessions/${id}`),
  
  getSessionsByStatus: (status) =>
    api.get(`/sessions/status/${status}`),
  
  createSession: (sessionData) =>
    api.post('/sessions', sessionData),
  
  updateSession: (id, sessionData) =>
    api.put(`/sessions/${id}`, sessionData),
  
  deleteSession: (id) =>
    api.delete(`/sessions/${id}`)
};

export default api;
