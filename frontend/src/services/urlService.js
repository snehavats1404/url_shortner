// src/services/urlService.js
import { getAuthHeaders } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getAuthToken = () => {
  return localStorage.getItem('token') || document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
};


export const createShortUrl = async (url) => {
    console.log(url)
  try {

      const token = getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }
    const response = await fetch(`${API_URL}/urls`, {
      method: 'POST',
      headers: getAuthHeaders(),
      credentials: 'include',
      body: JSON.stringify({ url })
      
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error('Failed to create short URL');
    }
     return {
      ...data,
      shortUrl: data.shortUrl || `${API_URL.replace('/api', '')}/s/${data.shortId}`

     }
  } catch (error) {
    return { success: false, message: error.message };
  }
};
export const getRedirectUrl = (shortId) => {
   const baseUrl = API_URL.replace('/api','');
  return `${baseUrl}/s/${shortId}`;
};


export const getUserUrls = async () => {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_URL}/urls/user`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch URLs');
    }

    return data;
  } catch (error) {
    console.error('Error fetching URLs:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch URLs'
    };
  }
};

export const getUrlAnalytics = async (shortId) => {
  try {
    const token = getAuthToken();
    if (!token) {
      return { success: false, message: 'Not authenticated' };
    }

    const response = await fetch(`${API_URL}/urls/analytics/${shortId}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch analytics');
    }

    return data;
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return {
      success: false,
      message: error.message || 'Failed to fetch analytics'
    };
  }
};
