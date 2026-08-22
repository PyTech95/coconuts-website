import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { Lock, Mail, LogIn } from 'lucide-react';
import { Button } from './ui/button';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

function formatApiErrorDetail(detail) {
  if (detail == null) return 'Something went wrong. Please try again.';
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) return detail.map((e) => (e && typeof e.msg === 'string' ? e.msg : JSON.stringify(e))).join(' ');
  if (detail && typeof detail.msg === 'string') return detail.msg;
  return String(detail);
}

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email: email.trim().toLowerCase(), password });
      localStorage.setItem('mc_admin_token', data.access_token);
      navigate('/admin');
    } catch (err) {
      setError(formatApiErrorDetail(err.response?.data?.detail) || err.message);
    } finally {
      setLoading(false);
    }
  };

  const field = 'w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0710] px-4" data-testid="admin-login-page">
      <div className="pointer-events-none absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-green-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="relative w-full max-w-md">
        <Link to="/" className="block text-center text-white/60 text-sm mb-6 hover:text-white">← Back to site</Link>
        <div className="rounded-3xl bg-white/[0.04] backdrop-blur border border-white/10 p-8 shadow-2xl">
          <div className="text-center">
            <span className="font-script text-pink-400 text-2xl">Mr. Coconetto</span>
            <h1 className="font-display font-bold text-2xl text-white mt-1">Admin Dashboard</h1>
            <p className="text-white/50 text-sm mt-1">Sign in to manage your site</p>
          </div>
          <form onSubmit={submit} className="mt-7 space-y-4">
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input data-testid="admin-email" type="email" required placeholder="admin@mrcoconetto.com" value={email} onChange={(e) => setEmail(e.target.value)} className={field} />
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input data-testid="admin-password" type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className={field} />
            </div>
            {error && <div data-testid="admin-login-error" className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}
            <Button type="submit" disabled={loading} data-testid="admin-login-submit" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-6 font-semibold">
              {loading ? 'Signing in…' : (<><LogIn className="w-4 h-4 mr-2" /> Sign In</>)}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
