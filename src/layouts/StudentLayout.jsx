// src/layouts/StudentLayout.jsx
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import TopBar from '../components/layout/TopBar';

const StudentLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen overflow-x-hidden bg-cloudWhite">
      <a href="#main-content" className="sr-only z-[80] rounded-md bg-pureWhite px-4 py-2 text-cobaltBlue focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobaltBlue">Skip to main content</a>
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} collapsed={sidebarCollapsed} onCollapseChange={setSidebarCollapsed} />
      <div className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}`}>
        <TopBar onMenuClick={() => setMobileOpen(true)} />
        <main id="main-content" tabIndex="-1" aria-label="Student workspace" className="min-w-0 flex-1 overflow-auto p-4 lg:p-6 focus:outline-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
