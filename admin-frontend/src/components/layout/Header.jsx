import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = () => {
  const { admin, logout } = useAuth();
  const location = useLocation();

  // Simple title mapper
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/contacts')) return 'Contact Inquiries';
    if (path.startsWith('/projects')) return 'Portfolio Projects';
    if (path.startsWith('/settings')) return 'Profile Settings';
    return 'Admin Panel';
  };

  return (
    <header className="h-20 bg-light-bg/80 backdrop-blur-xl border-b border-light-border flex items-center justify-between px-10 sticky top-0 z-30">
      <div>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-light-hover flex items-center justify-center text-text-primary">
            <User size={18} />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-text-primary leading-none capitalize">{admin?.username}</span>
            <span className="text-[10px] text-brand uppercase tracking-widest font-bold mt-1">{admin?.role}</span>
          </div>
        </div>

        <div className="w-px h-8 bg-light-border"></div>

        {/* Logout */}
        <button 
          onClick={logout}
          className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-text-muted hover:text-red-500 transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
