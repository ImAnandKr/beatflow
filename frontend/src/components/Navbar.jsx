import React, { useState, useEffect } from 'react'; // <-- FIX
import { Link, useNavigate } from 'react-router-dom';
import {
  Music,
  Search,
  Home,
  Library,
  Sun,
  Moon,
  LogOut,
  LogIn,
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Apply theme on load and when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between p-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-lg shadow-sm">
      {/* Left Side - Brand & Nav */}
      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-xl font-bold">
          <Music className="w-6 h-6 text-primary" />
          <span className="hidden md:block">BeatFlow</span>
        </Link>
        <div className="items-center hidden gap-4 md:flex">
          <Link
            to="/"
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Home className="w-5 h-5" />
            Home
          </Link>
          <Link
            to="/search"
            className="flex items-center gap-2 transition-colors hover:text-primary"
          >
            <Search className="w-5 h-5" />
            Search
          </Link>
          {user && (
            <Link
              to="/playlists"
              className="flex items-center gap-2 transition-colors hover:text-primary"
            >
              <Library className="w-5 h-5" />
              My Playlists
            </Link>
          )}
        </div>
      </div>

      {/* Middle - Search Bar (Mobile focus) */}
      <div className="flex-1 max-w-xs mx-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search songs..."
              className="w-full px-4 py-2 pl-10 text-sm bg-gray-100 rounded-full dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-4 top-1/2 text-neutral-500" />
          </div>
        </form>
      </div>

      {/* Right Side - Auth & Theme */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        {user ? (
          <>
            <span className="hidden text-sm font-medium md:block">
              Hi, {user.username}
            </span>
            <button
              onClick={logout}
              className="flex items-center gap-2 p-2 px-3 text-sm transition-colors bg-red-500 rounded-full text-white hover:bg-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:block">Logout</span>
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 p-2 px-3 text-sm transition-colors rounded-full bg-primary text-white hover:bg-primary/90"
          >
            <LogIn className="w-4 h-4" />
            <span className="hidden md:block">Login</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;