// src/components/layout/Sidebar.jsx
import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import {
  GraduationCap, LayoutDashboard, Briefcase, FileText, User, Users,
  BarChart2, Settings, LogOut, ChevronLeft, ChevronRight, Menu, X,
} from 'lucide-react';

const navItems = {
  student: [
    { name: 'Dashboard', path: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Placement Drives', path: '/student/drives', icon: Briefcase },
    { name: 'My Applications', path: '/student/applications', icon: FileText },
    { name: 'My Profile', path: '/student/profile', icon: User },
  ],
  admin: [
    { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Manage Drives', path: '/admin/drives', icon: Briefcase },
    { name: 'Manage Students', path: '/admin/students', icon: Users },
    { name: 'Applications', path: '/admin/applications', icon: FileText },
    { name: 'Companies', path: '/admin/companies', icon: BarChart2 },
    { name: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart2 },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ],
};

const Sidebar = ({ mobileOpen, setMobileOpen, collapsed = false, onCollapseChange = () => {} }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const items = user?.role ? navItems[user.role] : [];

  useEffect(() => {
    if (!mobileOpen) return undefined;
    const previousFocus = document.activeElement;
    const drawer = document.querySelector('[role="dialog"][aria-label="Navigation menu"]');
    const closeOnEscape = event => {
      if (event.key === 'Escape') setMobileOpen(false);
      if (event.key === 'Tab') {
        const focusable = [...(drawer?.querySelectorAll('a[href],button:not([disabled])') || [])];
        if (!focusable.length) return;
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', closeOnEscape);
    drawer?.querySelector('[data-mobile-nav-close]')?.focus();
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      previousFocus?.focus?.();
    };
  }, [mobileOpen, setMobileOpen]);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const linkClasses = ({ isActive }) =>
      `flex items-center gap-3 py-2.5 px-4 rounded-lg mx-2 text-sm transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-pureWhite ${
      isActive
        ? 'bg-cobaltBlue text-pureWhite font-semibold'
        : 'text-pureWhite/70 hover:bg-pureWhite/10 hover:text-pureWhite'
    }`;

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className={`grid items-center border-b border-pureWhite/10 ${collapsed ? 'grid-cols-1 justify-items-center gap-3 p-3' : 'grid-cols-[minmax(0,1fr)_auto] gap-2 p-4'}`}>
        <div className={`flex min-w-0 items-center overflow-hidden ${collapsed ? 'justify-center' : 'gap-2'}`}>
          <GraduationCap size={28} className="text-cobaltBlue flex-shrink-0" />
          {!collapsed && (
            <span className="text-base font-bold text-pureWhite whitespace-nowrap">
              Campus Placement Tracker
            </span>
          )}
        </div>
        {/* Collapse toggle – desktop only */}
        <button type="button" aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-expanded={!collapsed}
          onClick={() => onCollapseChange(!collapsed)}
          className="hidden lg:flex shrink-0 items-center justify-center rounded p-1 text-pureWhite/70 hover:text-pureWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobaltBlue">
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
        {/* Close button – mobile only */}
        {mobileOpen && (
          <button type="button" data-mobile-nav-close aria-label="Close navigation menu" onClick={() => setMobileOpen(false)} className="rounded p-1 text-pureWhite/70 hover:text-pureWhite focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobaltBlue">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav aria-label={`${user?.role || 'User'} navigation`} className="flex-1 overflow-y-auto py-4 space-y-1">
        {items.map(item => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={linkClasses}
              onClick={() => setMobileOpen?.(false)}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </NavLink>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="border-t border-pureWhite/10 p-4">
        <button type="button" aria-label="Log out"
          onClick={handleLogout}
          className="flex items-center gap-3 w-full py-2.5 px-4 rounded-lg text-sm text-pureWhite/70 hover:bg-signalRed/20 hover:text-signalRed transition-colors mx-0"
        >
          <LogOut size={20} className="flex-shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-charcoal h-screen fixed top-0 left-0 z-30 transition-all duration-300 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button type="button" aria-label="Close navigation menu" className="absolute inset-0 bg-charcoal/60" onClick={() => setMobileOpen(false)} />
          <aside role="dialog" aria-modal="true" aria-label="Navigation menu" className="relative z-50 h-full w-64 bg-charcoal flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};

export default Sidebar;
