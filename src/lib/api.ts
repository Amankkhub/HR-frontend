import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) =>
    api.post('/auth/register', data),
};

// Employee APIs
export const employeeAPI = {
  getAll: () => api.get('/employees'),
  getById: (id: string) => api.get(`/employees/${id}`),
  create: (data: any) => api.post('/employees', data),
  update: (id: string, data: any) => api.patch(`/employees/${id}`, data),
  delete: (id: string) => api.delete(`/employees/${id}`),
};

// Department APIs
export const departmentAPI = {
  getAll: () => api.get('/departments'),
};

// Location APIs
export const locationAPI = {
  getAll: () => api.get('/locations'),
};

// Attendance APIs
export const attendanceAPI = {
  getAll: () => api.get('/attendance'),
  getById: (id: string) => api.get(`/attendance/${id}`),
  create: (data: any) => api.post('/attendance', data),
  update: (id: string, data: any) => api.patch(`/attendance/${id}`, data),
  delete: (id: string) => api.delete(`/attendance/${id}`),
};

export default api;
