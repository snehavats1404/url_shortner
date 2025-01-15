// src/components/auth/RegisterForm.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

export default function RegisterForm() {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await register(userData);
      if (response.success) {
        setUser(response.user);
        navigate('/');
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Registration failed');
    }
  };

  return (
<div className="max-w-md mx-auto p-6 bg-black text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-green-500">Register</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 text-gray-300">Name</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              name: e.target.value
            }))}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:ring-2 focus:ring-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              email: e.target.value
            }))}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:ring-2 focus:ring-white"
            required
          />
        </div>
        <div>
          <label className="block mb-1 text-gray-300">Password</label>
          <input
            type="password"
            value={userData.password}
            onChange={(e) => setUserData(prev => ({
              ...prev,
              password: e.target.value
            }))}
            className="w-full p-2 border border-gray-700 rounded bg-gray-800 text-white focus:ring-2 focus:ring-white"
            minLength="6"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600 focus:ring-2 focus:ring-white"
        >
          Register
        </button>
      </form>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
}
