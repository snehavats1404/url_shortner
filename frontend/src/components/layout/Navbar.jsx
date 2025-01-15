// src/components/layout/Navbar.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { logout } from '../../services/authService';
<<<<<<< HEAD
import { useState} from 'react';
=======
import React,{ useState } from 'react';
>>>>>>> 955b4d6de164be8a82dfb56bf7128c6326872698
const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

const toggleMobileMenu = () => {
  setMobileMenuOpen(!mobileMenuOpen);
};


export default function Navbar() {
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    logout();
    setUser(null);
  };

  return (
<nav className="bg-black shadow-md">
  <div className="container mx-auto px-4">
    <div className="flex justify-between items-center h-16">
      <Link to="/" className="text-xl font-bold text-white">
        URL Shortener
      </Link>
      <div className="flex items-center space-x-4">
        {/* Toggle for mobile navigation */}
        <div className="sm:hidden">
          <button className="text-white" onClick={toggleMobileMenu}>
            {/* Hamburger icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Desktop Links */}
        <div className="hidden sm:flex items-center space-x-4">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:ring-2 focus:ring-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:ring-2 focus:ring-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:ring-2 focus:ring-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>

    {/* Mobile menu */}
    {mobileMenuOpen && (
      <div className="sm:hidden bg-black p-4">
        <div className="flex flex-col space-y-4">
          {user ? (
            <>
              <span className="text-gray-300">Welcome, {user.name}</span>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:ring-2 focus:ring-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:ring-2 focus:ring-white"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:ring-2 focus:ring-white"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    )}
  </div>
</nav>
  )}
