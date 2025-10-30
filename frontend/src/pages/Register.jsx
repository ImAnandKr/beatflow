// C:\beatflow\frontend\src\pages\Register.jsx

import React, { useState } from 'react';
import useAuth from '../hooks/useAuth';
import { Link, Navigate } from 'react-router-dom';
import { Music, Mail, Lock, User } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Get the LOCAL register function and user
  const { register, user } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    register(username, email, password);
  };

  // If user is already logged in, redirect to home
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-neutral-900">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg dark:bg-neutral-800"
      >
        <div className="flex flex-col items-center">
          <Music className="w-12 h-12 text-primary" />
          <h2 className="mt-4 text-3xl font-bold text-center text-gray-900 dark:text-white">
            Create your BeatFlow account
          </h2>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative">
            <User className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-neutral-400" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
              className="w-full px-4 py-3 pl-10 bg-gray-100 border-transparent rounded-lg dark:bg-neutral-700 focus:border-primary focus:ring-primary focus:ring-2"
            />
          </div>
          <div className="relative">
            <Mail className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-neutral-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              required
              className="w-full px-4 py-3 pl-10 bg-gray-100 border-transparent rounded-lg dark:bg-neutral-700 focus:border-primary focus:ring-primary focus:ring-2"
            />
          </div>
          <div className="relative">
            <Lock className="absolute w-5 h-5 transform -translate-y-1/2 left-3 top-1/2 text-neutral-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)} // <-- THIS IS THE FIX
              placeholder="Password"
              required
              className="w-full px-4 py-3 pl-10 bg-gray-100 border-transparent rounded-lg dark:bg-neutral-700 focus:border-primary focus:ring-primary focus:ring-2"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-neutral-400">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-medium text-primary hover:underline"
          >
            Log in
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;