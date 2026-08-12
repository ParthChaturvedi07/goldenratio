import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Menu } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const Header = ({ toggleSidebar }) => {
  const { admin, logout } = useAuth();
  const location = useLocation();

  // Simple title mapper
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path.startsWith('/contacts')) return 'Contact Inquiries';
    if (path.startsWith('/projects')) return 'Portfolio Projects';
    if (path.startsWith('/products')) return 'Products';
    if (path.startsWith('/settings')) return 'Profile Settings';
    return 'Admin Panel';
  };

  return (
    <header className="h-16 md:h-20 bg-light-bg/80 backdrop-blur-xl border-b border-light-border flex items-center justify-between px-4 md:px-10 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        {/* Mobile Hamburger Menu */}
        <button 
          onClick={toggleSidebar}
          className="md:hidden p-2 -ml-2 text-text-primary hover:bg-light-hover rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>

        <div className="relative">
          <h1 className="text-lg md:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#1a1a1a] via-brand to-[#1a1a1a] tracking-tight inline-block truncate max-w-[150px] sm:max-w-xs md:max-w-none">
            {getPageTitle()}
          </h1>
          {/* Subtle active underline glow */}
          <div className="absolute -bottom-[18px] md:-bottom-[26px] left-0 w-full h-[2px] bg-brand/30 shadow-[0_0_10px_rgba(42,122,110,0.5)] rounded-full hidden md:block"></div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6">
        {/* User Profile */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-light-hover flex items-center justify-center text-text-primary">
            <User size={16} className="md:w-[18px] md:h-[18px]" />
          </div>
          <div className="flex flex-col hidden sm:flex">
            <span className="text-sm font-bold text-text-primary leading-none capitalize">{admin?.username}</span>
            <span className="text-[10px] text-brand uppercase tracking-widest font-bold mt-1">{admin?.role}</span>
          </div>
        </div>

        <div className="w-px h-6 md:h-8 bg-light-border hidden sm:block"></div>

        {/* Logout */}
        <button 
          onClick={logout}
          className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold uppercase tracking-widest text-text-muted hover:text-red-500 transition-colors p-2 md:p-0"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
