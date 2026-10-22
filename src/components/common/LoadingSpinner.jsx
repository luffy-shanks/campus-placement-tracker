// src/components/common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen bg-cloudWhite" role="status" aria-label="Loading">
    <div className="w-12 h-12 border-4 border-cobaltBlue border-t-transparent rounded-full animate-spin" />
  </div>
);

export default LoadingSpinner;
