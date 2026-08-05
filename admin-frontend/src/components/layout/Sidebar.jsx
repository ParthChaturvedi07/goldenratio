import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderOpen, Settings as SettingsIcon, ExternalLink, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/contacts', icon: <Users size={20} />, label: 'Contacts' },
    { to: '/projects', icon: <FolderOpen size={20} />, label: 'Projects' },
    { to: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  return (
    <aside className={`w-64 bg-light-bg/95 backdrop-blur-xl border-r border-light-border flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand */}
      <div className="relative h-20 flex items-center gap-3 px-6 border-b border-light-border overflow-hidden">
        {/* Glow effect */}
        <div className="absolute top-1/2 left-4 -translate-y-1/2 w-16 h-16 bg-brand/20 blur-xl rounded-full pointer-events-none"></div>
        <div className="relative w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] z-10">
          <span className="text-white font-black text-xl italic">φ</span>
        </div>
        <div className="relative flex flex-col z-10 flex-1">
          <span className="font-bold text-[15px] tracking-tight leading-none text-text-primary">Golden Ratio</span>
          <span className="text-[10px] uppercase tracking-widest text-text-muted mt-1">Admin Panel</span>
        </div>
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 text-text-muted hover:text-text-primary transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:translate-x-1 ${
                isActive
                  ? 'bg-[#ede9e1] border-l-4 border-brand text-brand shadow-[4px_4px_10px_rgba(0,0,0,0.05),-4px_-4px_10px_rgba(255,255,255,0.8)]'
                  : 'text-text-secondary hover:bg-light-hover hover:text-text-primary border-l-4 border-transparent'
              }`
            }
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-light-border">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-text-secondary hover:bg-light-hover hover:text-text-primary transition-colors"
        >
          <ExternalLink size={20} />
          View Site
        </a>
      </div>
    </aside>
  );
};

export default Sidebar;
