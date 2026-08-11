
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  Settings as SettingsIcon,
  ExternalLink,
  X,
  Mail,
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navItems = [
    {
      to: '/',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
    {
      to: '/contacts',
      icon: <Users size={20} />,
      label: 'Contacts',
    },
    {
      to: '/projects',
      icon: <FolderOpen size={20} />,
      label: 'Projects',
    },
    {
      to: '/settings',
      icon: <SettingsIcon size={20} />,
      label: 'Settings',
    },
  ];

  const hostingerInfo = {
    domain: 'grcreation.in',
    adminEmail: 'admin@grcreation.in',
    contactEmail: 'contact@grcreation.in',
    panelUrl: 'https://hpanel.hostinger.com/email/grcreation.in/accounts?location=list',
  };

  return (
    <aside
      className={`w-64 bg-light-bg/95 backdrop-blur-xl border-r border-light-border flex flex-col h-screen fixed left-0 top-0 z-50 transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
    >
      {/* Brand */}
      <div className="relative h-20 flex items-center gap-3 px-6 border-b border-light-border overflow-hidden">
        <div className="absolute top-1/2 left-4 -translate-y-1/2 w-16 h-16 bg-brand/20 blur-xl rounded-full pointer-events-none" />

        <div className="relative w-10 h-10 rounded-xl bg-[#1a1a1a] flex items-center justify-center flex-shrink-0 shadow-[4px_4px_10px_rgba(0,0,0,0.1)] z-10">
          <span className="text-white font-black text-xl italic">φ</span>
        </div>

        <div className="relative flex flex-col z-10 flex-1">
          <span className="font-bold text-[15px] tracking-tight leading-none text-text-primary">
            Golden Ratio
          </span>
          <span className="text-[10px] uppercase tracking-widest text-text-muted mt-1">
            Admin Panel
          </span>
        </div>

        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="md:hidden p-2 text-text-muted hover:text-text-primary transition-colors"
          aria-label="Close sidebar"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setIsOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:translate-x-1 ${isActive
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
      <div className="p-4 border-t border-light-border flex flex-col gap-3">
        {/* View Site */}
        <a
          href="https://www.grcreation.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-text-secondary hover:bg-light-hover hover:text-text-primary transition-colors"
        >
          <ExternalLink size={20} />
          View Site
        </a>

        {/* Hostinger Panel */}
        <div
          className="rounded-2xl p-4 flex flex-col gap-3"
          style={{
            background: '#f2efe8',
            boxShadow:
              '4px 4px 10px rgba(0,0,0,0.06), -4px -4px 10px rgba(255,255,255,0.8)',
          }}
        >
          {/* Header */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: '#673de6' }}
            >
              <span className="text-white font-black text-sm">H</span>
            </div>

            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-text-primary leading-none">
                Hostinger
              </span>
              <span className="text-[10px] text-text-muted truncate mt-0.5">
                {hostingerInfo.domain}
              </span>
            </div>
          </div>

          {/* Email Information */}
          <div className="flex flex-col gap-1.5 text-[11px]">
            <div className="flex items-center gap-2 text-text-secondary">
              <Mail
                size={12}
                className="flex-shrink-0 text-text-muted"
              />
              <span className="truncate">
                {hostingerInfo.adminEmail}
              </span>
            </div>

            <div className="flex items-center gap-2 text-text-secondary">
              <Mail
                size={12}
                className="flex-shrink-0 text-text-muted"
              />
              <span className="truncate">
                {hostingerInfo.contactEmail}
              </span>
            </div>
          </div>

          {/* Manage Hosting */}
          <a
            href={hostingerInfo.panelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-[11px] font-semibold uppercase tracking-wide text-white transition-transform hover:scale-[1.02]"
            style={{ background: '#673de6' }}
          >
            Manage Hosting
            <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
