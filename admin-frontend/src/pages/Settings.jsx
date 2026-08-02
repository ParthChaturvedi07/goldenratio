import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { User, Mail, Lock, Shield, Loader2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const Settings = () => {
  const { admin, login } = useAuth();

  // Profile form
  const [username, setUsername] = useState(admin?.username || '');
  const [email, setEmail] = useState(admin?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [saving, setSaving] = useState(false);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error('Enter your current password to save changes.');
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match.');
      return;
    }

    if (newPassword && newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }

    setSaving(true);
    try {
      const payload = { currentPassword };
      if (username !== admin?.username) payload.username = username;
      if (email !== admin?.email) payload.email = email;
      if (newPassword) payload.newPassword = newPassword;

      const res = await api.put('/admin/auth/profile', payload);

      if (res.data.success) {
        toast.success('Profile updated successfully!');
        // Update local auth state with new data, keep existing token
        const token = localStorage.getItem('adminToken');
        login(res.data.admin, token);
        // Clear password fields
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">

      {/* Current Role Info */}
      <div className="card-glass p-6 flex items-center gap-5">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand to-brand-dark flex items-center justify-center flex-shrink-0 shadow-lg shadow-brand/20">
          <span className="text-white font-black text-2xl italic">φ</span>
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-bold text-text-primary tracking-tight">{admin?.username}</h2>
          <p className="text-xs text-text-muted uppercase tracking-widest mt-1">{admin?.email}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-dim rounded-xl">
          <Shield size={16} className="text-brand" />
          <span className="text-xs font-bold uppercase tracking-widest text-brand">{admin?.role}</span>
        </div>
      </div>

      {/* Profile Edit Form */}
      <form onSubmit={handleProfileUpdate} className="space-y-8">
        <div className="card-glass p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand border-b border-light-border pb-4 flex items-center gap-2">
            <User size={16} /> Account Details
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                <span className="flex items-center gap-1.5"><User size={12} /> Username</span>
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                <span className="flex items-center gap-1.5"><Mail size={12} /> Email Address</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
          </div>
        </div>

        <div className="card-glass p-8 space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-brand border-b border-light-border pb-4 flex items-center gap-2">
            <Lock size={16} /> Change Password
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                Current Password *
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="input-field"
                placeholder="Required to save any changes"
                required
              />
              <p className="text-[10px] text-text-muted mt-2 tracking-wider">Your current password is required to verify your identity.</p>
            </div>

            <div className="h-px bg-light-border"></div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="Leave blank to keep current"
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-text-secondary mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="btn-primary w-56 flex justify-center items-center h-12"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span className="flex items-center gap-2"><CheckCircle size={16} /> Save Changes</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
