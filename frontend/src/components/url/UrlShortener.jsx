import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Copy, CheckCircle, ExternalLink } from 'lucide-react';

// Simple Alert Component
const Alert = ({ variant = 'default', children, className = '' }) => {
  const baseStyles = 'p-4 rounded-lg mb-4 text-white';
  const variants = {
    default: 'bg-gray-800 border border-gray-700',
    destructive: 'bg-red-900 text-red-300 border border-red-700',
    success: 'bg-green-900 text-green-300 border border-green-700'
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default function UrlShortener() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let timeout;
    if (copied) {
      timeout = setTimeout(() => setCopied(false), 2000);
    }
    return () => clearTimeout(timeout);
  }, [copied]);

  useEffect(() => {
    let timeout;
    if (showSuccess) {
      timeout = setTimeout(() => setShowSuccess(false), 3000);
    }
    return () => clearTimeout(timeout);
  }, [showSuccess]);

  const validateUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setShortUrl('');
    setAnalytics(null);

    if (!validateUrl(url)) {
      setError('Please enter a valid URL starting with http:// or https://');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to shorten URLs');
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        credentials: 'include',
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create short URL');
      }

      setShortUrl(data.shortId);
      setShowSuccess(true);
      setUrl('');
      
      // Fetch initial analytics
      if (data.shortId) {
        const analyticsData = await fetch(
          `${import.meta.env.VITE_API_URL}/urls/analytics/${data.shortId}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            },
            credentials: 'include'
          }
        );
        
        if (!analyticsData.ok) {
          console.error('Failed to fetch analytics');
          return;
        }

        const analyticsJson = await analyticsData.json();
        setAnalytics(analyticsJson);
      }
    } catch (error) {
      setError(error.message || 'Failed to create short URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
    } catch (err) {
      setError('Failed to copy URL');
    }
  };

  return (
<div className="max-w-2xl mx-auto p-6 space-y-6 bg-black text-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-4">URL Shortener</h2>

  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="relative">
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter URL (e.g., https://example.com)"
        className="w-full p-3 pr-12 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500"
        disabled={loading}
      />
      {url && (
        <ExternalLink
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
      )}
    </div>

    <button
      type="submit"
      disabled={loading}
      className={`w-full p-3 rounded-lg text-white font-medium transition-colors
        ${loading
          ? 'bg-gray-700 cursor-not-allowed'
          : 'bg-green-500 hover:bg-green-600'}`}
    >
      {loading ? 'Creating...' : 'Shorten URL'}
    </button>
  </form>

  {error && (
    <Alert variant="destructive" className="mt-4">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-5 w-5" />
        <span>{error}</span>
      </div>
    </Alert>
  )}

  {showSuccess && (
    <Alert variant="success" className="mt-4">
      <div className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        <span>URL successfully shortened!</span>
      </div>
    </Alert>
  )}

  {shortUrl && (
    <div className="mt-6 space-y-4">
      <div className="p-4 bg-gray-900 rounded-lg">
        <p className="font-medium mb-2 text-gray-300">Your shortened URL:</p>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={shortUrl}
            readOnly
            className="flex-1 p-2 border border-gray-700 rounded-lg bg-gray-800 text-white focus:ring-2 focus:ring-green-500"
          />
          <button
            onClick={copyToClipboard}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2
              ${copied
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-red-500 hover:bg-red-600'} text-white`}
          >
            {copied ? (
              <>
                <CheckCircle className="h-4 w-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {analytics && analytics.clicks?.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">Click Analytics</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.clicks}>
                <XAxis dataKey="date" stroke="#FFFFFF" />
                <YAxis stroke="#FFFFFF" />
                <Tooltip />
                <Bar dataKey="count" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  )}
</div>
  )}