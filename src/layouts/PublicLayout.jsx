// src/layouts/PublicLayout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const PublicLayout = () => (
  <div className="min-h-screen bg-cloudWhite flex flex-col items-center justify-center">
    <Outlet />
  </div>
);

export default PublicLayout;
