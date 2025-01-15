// src/services/authService.js

const API_URL = import.meta.env.VITE_API_URL || 'https://url-shortner-backend-madh.onrender.com/api';

// Helper to get the token from cookie
const getTokenFromCookie = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
};

// Common headers for authenticated requests
export const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const register = async (userData) => {
  const response = await fetch(`${API_URL}/users/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (data.success) {
    // Store token in localStorage as backup
    localStorage.setItem('token', data.token);
  }
  return data;

};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(credentials),
  });
const data = await response.json();
  if (data.success) {
    localStorage.setItem('token', data.token);
  }
  return data;
};


export const verifyToken = async () => {
  // Get token from both cookie and localStorage
  const token = getTokenFromCookie() || localStorage.getItem('token');
  if (!token) return { success: false };

  const response = await fetch(`${API_URL}/users/verify`, {
    method:'GET',
    headers:{ 
      'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
    },
    credentials: 'include'
  });
  return response.json();
};


export const logout = () => {
  localStorage.removeItem('token');
  document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};
