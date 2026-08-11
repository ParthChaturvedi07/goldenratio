import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, admin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  if (admin) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      toast.error('Please enter both username and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post('/admin/auth/login', { username, password });
      if (res.data.success) {
        toast.success('Welcome back!');
        login(res.data.admin, res.data.token);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to login. Check credentials.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setIsSubmitting(true);
    try {
      const res = await api.post('/admin/auth/google', {
        credential: credentialResponse.credential,
      });
      if (res.data.success) {
        toast.success('Welcome back!');
        login(res.data.admin, res.data.token);
        navigate(from, { replace: true });
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Google sign-in failed.';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-light-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1a1a1a 1px, transparent 1px)', backgroundSize: '32px 32px' }}></div>

      <div className="card-glass w-full max-w-md p-10 relative overflow-hidden animate-fade-in-up z-10 shadow-[0_20px_50px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] mx-auto flex items-center justify-center mb-6 shadow-lg shadow-black/10">
              <span className="text-white font-black text-3xl italic">φ</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-text-primary mb-2">Golden Ratio</h1>
            <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-bold">Admin Portal</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-text-secondary mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input-field"
                placeholder="Enter your username"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-text-secondary mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center items-center h-12 mt-4"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
            </button>
          </form>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-black/10" />
            <span className="text-[10px] uppercase tracking-widest text-text-muted font-bold">or</span>
            <div className="flex-1 h-px bg-black/10" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Google sign-in failed.')}
              theme="outline"
              shape="pill"
              width="320"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 text-center animate-fade-in z-10" style={{ animationDelay: '0.4s' }}>
        <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">
          &copy; {new Date().getFullYear()} Golden Ratio Design & Build
        </p>
      </div>
    </div>
  );
};

export default Login;