// src/services/apiHelpers.js
export const getTokenFromCookie = () => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];
};

export const getAuthHeaders = () => {
  const token = getTokenFromCookie() || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};