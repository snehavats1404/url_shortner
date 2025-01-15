// src/components/url/UrlList.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserUrls } from '../../services/urlService';
import { useAuth } from '../../contexts/AuthContext';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function UrlList() {
  const [urls, setUrls] = useState([]);
  const [loading, setLoading] = useState(true);
   const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getUserUrls();
        if (response.success) {
          setUrls(response.urls);
        }else{
          setError(response.message || "Failed to fetch urls");
        }
      } catch (error) {
        setError('Failed to fetch URLs. Please try again later.')
        console.error('Failed to fetch URLs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUrls();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
<div className="max-w-4xl mx-auto p-6 bg-black text-white">
  <h2 className="text-2xl font-bold mb-6 text-red-500">Your URLs</h2>
  <div className="space-y-4">
    {urls.map((url) => (
      <div
        key={url.shortId}
        className="p-4 bg-gray-800 rounded-lg shadow-lg border border-gray-700"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start">
          <div>
            <p className="font-semibold text-gray-400">Original URL:</p>
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 break-all hover:underline"
            >
              {url.originalUrl}
            </a>
            <p className="mt-4 font-semibold text-gray-400">Short URL:</p>
            <a
              href={`${API_URL}/s/${url.shortId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline"
            >
              {`${API_URL}/s/${url.shortId}`}
            </a>
          </div>
          <div className="flex flex-col gap-2 mt-4 sm:mt-0">
            <Link
              to={`/analytics/${url.shortId}`}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors text-center whitespace-nowrap"
            >
              View Analytics
            </Link>
          </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            Created: {new Date(url.createdAt).toLocaleDateString()} at{' '}
            {new Date(url.createdAt).toLocaleTimeString()}
          </p>
        </div>
      </div>
    ))}
  </div>
</div>
  )}