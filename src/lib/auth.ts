import { authAPI } from './api';

export interface LoginResponse {
  message: string;
  access_token: string;
}

export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await authAPI.login(email, password);
  const token = response.data.access_token;
  
  localStorage.setItem('access_token', token);
  
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
