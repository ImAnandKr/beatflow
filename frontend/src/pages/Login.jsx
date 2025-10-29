import React, { useState } from 'react'; // <-- FIX
import useAuth from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import { Music, Mail, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

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
            Welcome back to BeatFlow
          </h2>
          <p className="mt-2 text-center text-gray-600 text-md dark:text-neutral-300">
            Sign in to continue
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
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
              onChange={(e) => setPassword(e.target.value)}
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
              Log In
            </button>
          </div>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-neutral-400">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-medium text-primary hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;