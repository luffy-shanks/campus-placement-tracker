// src/pages/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-screen bg-cloudWhite flex flex-col items-center justify-center text-center p-6">
    <h1 className="text-6xl font-bold text-charcoal mb-4">404</h1>
    <p className="text-lg text-charcoal/70 mb-6">The page you're looking for doesn't exist.</p>
    <Link to="/" className="px-6 py-3 bg-cobaltBlue text-pureWhite rounded-md font-semibold hover:bg-cobaltBlue/90 transition">
      Go Home
    </Link>
  </div>
);

export default NotFound;
