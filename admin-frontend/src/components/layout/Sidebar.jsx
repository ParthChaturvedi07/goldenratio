import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, FolderOpen, Settings as SettingsIcon, ExternalLink } from 'lucide-react';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { to: '/contacts', icon: <Users size={20} />, label: 'Contacts' },
    { to: '/projects', icon: <FolderOpen size={20} />, label: 'Projects' },
    { to: '/settings', icon: <SettingsIcon size={20} />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-light-bg/80 backdrop-blur-xl border-r border-light-border flex flex-col h-screen fixed left-0 top-0 z-40">
      {/* Brand */}
      <div className="h-20 flex items-center gap-3 px-6 border-b border-light-border">
        <div className="w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-[4px_4px_10px_rgba(0,0,0,0.1)]">
          <span className="text-white font-black text-xl italic">φ</span>
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[15px] tracking-tight leading-none text-text-primary">Golden Ratio</span>
          <span className="text-[10px] uppercase tracking-widest text-text-muted mt-1">Admin Panel</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? 'bg-white shadow-sm border border-light-border text-brand'
                  : 'text-text-secondary hover:bg-light-hover hover:text-text-primary'
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
