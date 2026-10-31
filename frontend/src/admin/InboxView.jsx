import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, MessageSquare, RefreshCw, Phone, Calendar, MapPin, ImageOff, Download, Trash2 } from 'lucide-react';
import { API, IS_DEMO, authHeaders, clearToken, asset } from '../lib/api';

const fmtDate = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return iso; }
};

const DEMO_ORDERS = [
  { id: 'd1', order_number: 'MC-7A2F1C', print_text: 'Radha\n&\nRupesh', event_name: 'Wedding — Jaipur', mobile: '+91 98xxxxxx10', created_at: new Date().toISOString() },
  { id: 'd2', order_number: 'MC-3B9E0D', print_text: '#TechSummit26', event_name: 'Corporate offsite', mobile: '+91 97xxxxxx22', created_at: new Date(Date.now() - 86400000).toISOString() },
];
const DEMO_ENQ = [
  { id: 'e1', name: 'Priya Mathur', whatsapp: '+91 99xxxxxx01', eventType: 'Haldi', eventDate: '2026-11-21', location: 'Delhi', quantity: '200 coconuts', customization: 'Marigold theme, names', created_at: new Date().toISOString() },
];

const toCsv = (rows) => {
  if (!rows.length) return '';
  const keys = Object.keys(rows[0]).filter((k) => k !== 'id');
  const esc = (v) => `"${String(v ?? '').replace(/"/g, '""').replace(/\n/g, ' / ')}"`;
  return [keys.join(','), ...rows.map((r) => keys.map((k) => esc(r[k])).join(','))].join('\n');
};

export default function InboxView() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true); setError('');
    if (IS_DEMO) { setOrders(DEMO_ORDERS); setEnquiries(DEMO_ENQ); setLoading(false); return; }
    try {
      const headers = authHeaders();
      const [o, e] = await Promise.all([axios.get(`${API}/admin/orders`, { headers }), axios.get(`${API}/admin/enquiries`, { headers })]);
      setOrders(o.data || []); setEnquiries(e.data || []);
    } catch (err) {
      if (err.response?.status === 401) { clearToken(); navigate('/admin/login?next=/admin/inbox'); return; }
      setError('Could not load data. Please try again.');
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const STATUSES = ['new', 'contacted', 'confirmed', 'in production', 'delivered', 'cancelled'];
  const setStatus = async (o, status) => {
    setOrders((prev) => prev.map((x) => (x.id === o.id ? { ...x, status } : x)));
    if (IS_DEMO) return;
    try { await axios.patch(`${API}/admin/orders/${o.id}`, { status }, { headers: authHeaders() }); } catch { setError('Could not update status'); }
  };
  const removeOrder = async (o) => {
    if (!window.confirm(`Delete order ${o.order_number}?`)) return;
    setOrders((prev) => prev.filter((x) => x.id !== o.id));
    if (IS_DEMO) return;
    try { await axios.delete(`${API}/admin/orders/${o.id}`, { headers: authHeaders() }); } catch { setError('Could not delete order'); }
  };
  const removeEnquiry = async (e) => {
    if (!window.confirm(`Delete enquiry from ${e.name}?`)) return;
    setEnquiries((prev) => prev.filter((x) => x.id !== e.id));
    if (IS_DEMO) return;
    try { await axios.delete(`${API}/admin/enquiries/${e.id}`, { headers: authHeaders() }); } catch { setError('Could not delete enquiry'); }
  };

  const download = () => {
    const rows = tab === 'orders' ? orders : enquiries;
    const blob = new Blob([toCsv(rows)], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `${tab}-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  };

  return (
    <div data-testid="admin-inbox-page">
      <div className="flex flex-wrap items-center gap-2 mb-5">
        <h1 className="font-display font-bold text-2xl text-gray-900 mr-auto">Orders & Enquiries</h1>
        <button onClick={() => setTab('orders')} data-testid="admin-tab-orders" className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === 'orders' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
          <Package className="w-4 h-4" /> Orders <span className={`ml-1 px-1.5 rounded-full text-xs ${tab === 'orders' ? 'bg-white/25' : 'bg-gray-100'}`}>{orders.length}</span>
        </button>
        <button onClick={() => setTab('enquiries')} data-testid="admin-tab-enquiries" className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition-colors ${tab === 'enquiries' ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
          <MessageSquare className="w-4 h-4" /> Enquiries <span className={`ml-1 px-1.5 rounded-full text-xs ${tab === 'enquiries' ? 'bg-white/25' : 'bg-gray-100'}`}>{enquiries.length}</span>
        </button>
        <button onClick={load} data-testid="admin-refresh" className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50"><RefreshCw className="w-4 h-4" /></button>
        <button onClick={download} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50" title="Download CSV"><Download className="w-4 h-4" /> CSV</button>
      </div>

      {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}
      {loading ? (
        <div className="py-24 text-center text-gray-400" data-testid="admin-loading">Loading…</div>
      ) : tab === 'orders' ? (
        orders.length === 0 ? <div className="py-24 text-center text-gray-400" data-testid="admin-orders-empty">No orders yet.</div> : (
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4" data-testid="admin-orders-list">
            {orders.map((o) => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                    {o.logo_url ? <img src={asset(o.logo_url)} alt="logo" className="w-full h-full object-contain" /> : <ImageOff className="w-5 h-5 text-gray-300" />}
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
                <div className="mt-3 flex items-center gap-2">
                  <select value={o.status || 'new'} onChange={(e) => setStatus(o, e.target.value)} className={`flex-1 rounded-lg border text-xs font-semibold px-2 py-1.5 capitalize ${(o.status || 'new') === 'new' ? 'border-pink-300 bg-pink-50 text-pink-700' : (o.status === 'delivered' ? 'border-green-300 bg-green-50 text-green-700' : o.status === 'cancelled' ? 'border-gray-300 bg-gray-100 text-gray-500' : 'border-amber-300 bg-amber-50 text-amber-700')}`}>
                    {STATUSES.map((st) => <option key={st} value={st}>{st}</option>)}
                  </select>
                  <button type="button" onClick={() => removeOrder(o)} className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 hover:text-red-600 hover:border-red-200 flex items-center justify-center" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
                {o.logo_url && <a href={asset(o.logo_url)} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-green-700 hover:underline">View full logo →</a>}
              </div>
            ))}
          </div>
        )
      ) : enquiries.length === 0 ? <div className="py-24 text-center text-gray-400" data-testid="admin-enquiries-empty">No enquiries yet.</div> : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4" data-testid="admin-enquiries-list">
          {enquiries.map((e) => (
            <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start justify-between gap-2">
                <div className="font-display font-bold text-gray-900">{e.name}</div>
                <button type="button" onClick={() => removeEnquiry(e)} className="w-7 h-7 rounded-lg text-gray-300 hover:text-red-600 hover:bg-red-50 flex items-center justify-center shrink-0" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
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
    </div>
  );
}
