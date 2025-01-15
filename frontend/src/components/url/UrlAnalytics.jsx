import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getUrlAnalytics } from '../../services/urlService';

export default function UrlAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const { shortId } = useParams();

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await getUrlAnalytics(shortId);
        console.log('Analytics response:', response);
        if (response.success) {
          setAnalytics(response);
        } else {
          console.error('Failed to fetch analytics:', response.message);
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [shortId]);

  if (loading) return <div>Loading...</div>;
  if (!analytics) return <div>No analytics data available</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-black text-white">
  <h2 className="text-2xl font-bold mb-4 text-red-500 text-center sm:text-left">URL Analytics</h2>
  <div className="bg-gray-900 rounded-lg shadow p-6">
    <div className="mb-4">
      <p className="text-lg font-semibold text-white">Total Clicks:</p>
      <p className="text-3xl font-bold text-green-500">
        {analytics.totalClicks}
      </p>
    </div>
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-white">Click History</h3>
      <div className="space-y-2">
        {analytics.analytics.map((visit, index) => (
          <div
            key={index}
            className="p-3 bg-gray-800 rounded flex justify-between sm:flex-col md:flex-row"
          >
            <div>
              <p className="font-medium text-white">
                {new Date(visit.timestamp).toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">{visit.userAgent}</p>
            </div>
            <p className="text-gray-500 mt-2 md:mt-0">{visit.ipAddress}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
  )}