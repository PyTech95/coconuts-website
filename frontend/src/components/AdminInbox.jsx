import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogOut, Package, MessageSquare, RefreshCw, Phone, Calendar, MapPin, ImageOff } from 'lucide-react';
import { Button } from './ui/button';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const fmtDate = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return iso; }
};

const AdminInbox = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('mc_admin_token') : null;
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const logout = useCallback(() => {
    localStorage.removeItem('mc_admin_token');
    navigate('/admin/login');
  }, [navigate]);

  const load = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    setLoading(true);
    setError('');
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const [o, e] = await Promise.all([
        axios.get(`${API}/admin/orders`, { headers }),
        axios.get(`${API}/admin/enquiries`, { headers }),
      ]);
      setOrders(o.data || []);
      setEnquiries(e.data || []);
    } catch (err) {
      if (err.response?.status === 401) { logout(); return; }
      setError('Could not load data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [token, navigate, logout]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-inbox-page">
      {/* Top bar */}
      <header className="sticky top-0 z-20 bg-[#0d0710] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div>
            <span className="font-script text-pink-400 text-lg leading-none block">Mr. Coconetto</span>
            <span className="font-display font-bold text-sm">Admin Inbox</span>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={load} variant="outline" size="sm" data-testid="admin-refresh" className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent">
              <RefreshCw className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline">Refresh</span>
            </Button>
            <Button onClick={logout} size="sm" data-testid="admin-logout" className="rounded-full bg-pink-600 hover:bg-pink-700">
              <LogOut className="w-4 h-4 sm:mr-1.5" /> <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button onClick={() => setTab('orders')} data-testid="admin-tab-orders" className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === 'orders' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            <Package className="w-4 h-4" /> Orders <span className={`ml-1 px-1.5 rounded-full text-xs ${tab === 'orders' ? 'bg-white/25' : 'bg-gray-100'}`}>{orders.length}</span>
          </button>
          <button onClick={() => setTab('enquiries')} data-testid="admin-tab-enquiries" className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === 'enquiries' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
            <MessageSquare className="w-4 h-4" /> Enquiries <span className={`ml-1 px-1.5 rounded-full text-xs ${tab === 'enquiries' ? 'bg-white/25' : 'bg-gray-100'}`}>{enquiries.length}</span>
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}
        {loading ? (
          <div className="py-24 text-center text-gray-400" data-testid="admin-loading">Loading…</div>
        ) : tab === 'orders' ? (
          orders.length === 0 ? (
            <div className="py-24 text-center text-gray-400" data-testid="admin-orders-empty">No orders yet.</div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="admin-orders-list">
              {orders.map((o) => (
                <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                      {o.logo_url ? (
                        <img src={o.logo_url} alt="logo" className="w-full h-full object-contain" />
                      ) : (
                        <ImageOff className="w-5 h-5 text-gray-300" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="font-display font-bold text-pink-600">{o.order_number}</div>
                      <div className="text-sm font-semibold text-gray-900 whitespace-pre-line leading-tight">{o.print_text}</div>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                    <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {o.event_name}</div>
                    <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <a href={`tel:${o.mobile}`} className="hover:text-green-700">{o.mobile}</a></div>
                    <div className="text-xs text-gray-400">{fmtDate(o.created_at)}</div>
                  </div>
                  {o.logo_url && <a href={o.logo_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-green-700 hover:underline">View full logo →</a>}
                </div>
              ))}
            </div>
          )
        ) : enquiries.length === 0 ? (
          <div className="py-24 text-center text-gray-400" data-testid="admin-enquiries-empty">No enquiries yet.</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="admin-enquiries-list">
            {enquiries.map((e) => (
              <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="font-display font-bold text-gray-900">{e.name}</div>
                <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                  <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <a href={`tel:${e.whatsapp}`} className="hover:text-green-700">{e.whatsapp}</a></div>
                  {e.eventType && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {e.eventType}{e.eventDate ? ` · ${e.eventDate}` : ''}</div>}
                  {e.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {e.location}</div>}
                  {e.quantity && <div className="text-xs">Qty: {e.quantity}</div>}
                  {e.customization && <div className="text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2">{e.customization}</div>}
                  <div className="text-xs text-gray-400">{fmtDate(e.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminInbox;
