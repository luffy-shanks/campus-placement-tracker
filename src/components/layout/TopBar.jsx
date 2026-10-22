// src/components/layout/TopBar.jsx
import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, ChevronDown, LogOut, User, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TopBar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    const closeOnEscape = event => { if (event.key === 'Escape') { setDropdownOpen(false); setNotificationsOpen(false); } };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', closeOnEscape);
    return () => { document.removeEventListener('mousedown', handleClickOutside); document.removeEventListener('keydown', closeOnEscape); };
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const handleSearchKeyDown = event => {
    if (event.key !== 'Enter' || !search.trim()) return;
    const destination = user?.role === 'admin' ? '/admin/applications' : '/student/drives';
    navigate(`${destination}?search=${encodeURIComponent(search.trim())}`);
  };

  const initials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="flex items-center justify-between bg-pureWhite px-4 lg:px-6 py-3 border-b border-moonlitSilver sticky top-0 z-20">
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        <button type="button" aria-label="Open navigation menu" className="rounded p-1 text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobaltBlue lg:hidden" onClick={onMenuClick}>
          <Menu size={22} />
        </button>
        <div className="relative hidden sm:block">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/40" />
          <input
            type="text"
            aria-label="Search"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9 pr-4 py-2 border border-moonlitSilver rounded-lg text-sm w-64 focus:outline-none focus:ring-2 focus:ring-cobaltBlue bg-cloudWhite"
          />
        </div>
      </div>

      {/* Right: notifications + profile */}
      <div className="flex items-center gap-4">
        {/* Notification bell */}
        <div className="relative">
        <button type="button" aria-label="Notifications" aria-expanded={notificationsOpen} aria-haspopup="dialog" onClick={() => setNotificationsOpen(open => !open)} className="relative rounded p-1 text-charcoal/70 transition hover:text-charcoal focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobaltBlue">
          <Bell size={20} />
        </button>
        {notificationsOpen && <div role="dialog" aria-label="Notifications" className="absolute right-0 mt-2 w-64 rounded-lg border border-moonlitSilver bg-pureWhite p-4 shadow-lg"><p className="text-sm font-semibold text-charcoal">Notifications</p><p className="mt-2 text-xs text-charcoal/55">You’re all caught up.</p></div>}
        </div>

        {/* Profile dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            aria-expanded={dropdownOpen}
            aria-haspopup="menu"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-cloudWhite rounded-lg px-2 py-1.5 transition"
          >
            <div className="w-8 h-8 rounded-full bg-cobaltBlue flex items-center justify-center text-pureWhite text-sm font-semibold">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-charcoal leading-tight">{user?.name || 'User'}</p>
              <p className="text-xs text-charcoal/50 capitalize">{user?.role || 'Guest'}</p>
            </div>
            <ChevronDown size={14} className={`text-charcoal/40 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {dropdownOpen && (
            <div role="menu" aria-label="Account menu" className="absolute right-0 mt-2 w-48 bg-pureWhite rounded-lg border border-moonlitSilver shadow-lg overflow-hidden z-50">
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  setDropdownOpen(false);
                  navigate(user?.role === 'admin' ? '/admin/settings' : '/student/profile');
                }}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-charcoal hover:bg-cloudWhite transition"
              >
                <User size={16} /> Profile
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-signalRed hover:bg-signalRed/5 transition border-t border-moonlitSilver/50"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopBar;
