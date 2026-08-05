import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, FolderOpen, MailOpen, TrendingUp, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [contactsRes, projectsRes] = await Promise.all([
          api.get('/admin/contacts?limit=5'),
          api.get('/admin/projects')
        ]);
        
        setStats({
          contacts: contactsRes.data,
          projectsCount: projectsRes.data.count,
          recentContacts: contactsRes.data.data
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="space-y-10 page-enter">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="card-glass p-6 h-[120px] skeleton"></div>
          ))}
        </div>
        <div className="card-glass h-[400px] skeleton"></div>
      </div>
    );
  }

  const statCards = [
    { label: 'Total Inquiries', value: stats?.contacts?.total || 0, icon: <Users size={24} />, color: 'text-blue-500' },
    { label: 'Total Projects', value: stats?.projectsCount || 0, icon: <FolderOpen size={24} />, color: 'text-brand' },
    { label: 'New Unread', value: stats?.contacts?.data?.filter(c => c.status === 'new').length || 0, icon: <MailOpen size={24} />, color: 'text-red-500' },
    { label: 'Engagement', value: '+12%', icon: <TrendingUp size={24} />, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-10 page-enter">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="card-glass p-6 flex items-start justify-between group relative overflow-hidden transform hover:-translate-y-1 transition-transform duration-300">
            {/* Top teal border accent */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="z-10">
              <p className="text-[11px] font-bold uppercase tracking-widest text-text-secondary mb-2">{card.label}</p>
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-text-primary to-text-secondary tracking-tight group-hover:text-brand transition-colors duration-300">{card.value}</h3>
            </div>
            <div className={`z-10 p-3 rounded-xl bg-light-hover border border-light-border ${card.color} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card-glass overflow-hidden">
        <div className="p-6 border-b border-light-border flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-widest text-text-primary">Recent Inquiries</h2>
          <Link to="/contacts" className="text-xs font-semibold text-brand hover:text-brand-light uppercase tracking-wider">View All</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-light-hover/50">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Name</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Email</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-text-muted">Date</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentContacts?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-text-muted text-sm">No recent inquiries found.</td>
                </tr>
              ) : (
                stats?.recentContacts?.map(contact => (
                  <tr key={contact._id} className="border-b border-light-border hover:bg-light-hover/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-semibold text-text-primary">{contact.fullName}</td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{contact.email}</td>
                    <td className="px-6 py-4">
                      <span className={`badge badge-${contact.status}`}>{contact.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-secondary">{new Date(contact.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
