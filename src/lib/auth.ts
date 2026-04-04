import { authAPI } from './api';

export interface LoginResponse {
  message: string;
  access_token: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await authAPI.login(email, password);
  const token = response.data.access_token;
  const userData = response.data.user || response.data;
  
  localStorage.setItem('access_token', token);
  
  // Store user data if available
  if (userData.id) localStorage.setItem('user_id', userData.id);
  if (userData.firstName) localStorage.setItem('user_firstName', userData.firstName);
  if (userData.lastName) localStorage.setItem('user_lastName', userData.lastName);
  if (userData.email) localStorage.setItem('user_email', userData.email);
  
  return response.data;
};

export const logoutUser = () => {
  // Clear localStorage
  localStorage.removeItem('access_token');
  
  // Clear cookie
  if (typeof window !== 'undefined') {
    document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }
};

export const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};
