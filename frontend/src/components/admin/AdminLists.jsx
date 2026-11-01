import React, { useEffect, useMemo, useState } from 'react';
import { ImageOff, Phone, Search, RefreshCw, Trash2 } from 'lucide-react';
import { adminApi, CONFIG } from '../../lib/api';
import { PageTitle, fmtDate } from './AdminLayout';
import { Button } from '../ui/button';

const useList = (path) => {
  const [rows, setRows] = useState(null);
  const load = () => { setRows(null); adminApi.get(path).then(setRows).catch(() => setRows([])); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(load, [path]);
  return [rows, load];
};

const Toolbar = ({ q, setQ, onRefresh, testid }) => (
  <div className="flex gap-2">
    <div className="relative">
      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" data-testid={`${testid}-search`} className="pl-9 pr-3 py-2 rounded-full border border-gray-200 bg-white text-sm w-48 sm:w-64" />
    </div>
    <Button variant="outline" size="sm" className="rounded-full" onClick={onRefresh} data-testid={`${testid}-refresh`}><RefreshCw className="w-4 h-4" /></Button>
  </div>
);

const filterRows = (rows, q) => {
  if (!rows) return rows;
  const s = q.trim().toLowerCase();
  return s ? rows.filter((r) => JSON.stringify(r).toLowerCase().includes(s)) : rows;
};

const DeleteBtn = ({ onYes }) => {
  const [ask, setAsk] = useState(false);
  if (!ask) return <button type="button" onClick={() => setAsk(true)} className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50" title="Delete"><Trash2 className="w-4 h-4" /></button>;
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">Delete?
      <button type="button" className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => { setAsk(false); onYes(); }}>Yes</button>
      <button type="button" className="px-2 py-1 rounded border" onClick={() => setAsk(false)}>No</button>
    </span>
  );
};

const Empty = ({ rows, label, testid }) => (rows === null
  ? <div className="py-20 text-center text-gray-400">Loading…</div>
  : <div className="py-20 text-center text-gray-400" data-testid={testid}>No {label} yet.</div>);

export const AdminOrders = () => {
  const [rows, load] = useList('/admin/orders');
  const [q, setQ] = useState('');
  const list = useMemo(() => filterRows(rows, q), [rows, q]);
  return (
    <div data-testid="admin-orders-page">
      <PageTitle title="📦 Orders" sub={<>Coconut orders placed on the website. Also in <a className="underline" href={CONFIG.ordersUrl}>WordPress → Orders</a>.</>} action={<Toolbar q={q} setQ={setQ} onRefresh={load} testid="admin-orders" />} />
      {!list?.length ? <Empty rows={list} label="orders" testid="admin-orders-empty" /> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="admin-orders-list">
          {list.map((o) => (
            <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 min-w-0">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                  {o.logo_url ? <img src={o.logo_url} alt="logo" className="w-full h-full object-contain" /> : <ImageOff className="w-5 h-5 text-gray-300" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2"><div className="font-display font-bold text-pink-600">{o.order_number}</div><DeleteBtn onYes={() => adminApi.del(`/admin/orders/${o.id}`).then(load)} /></div>
                  <div className="text-sm font-semibold text-gray-900 whitespace-pre-line break-all leading-tight">{o.print_text || '—'}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1 text-sm text-gray-600">
                <div className="break-words">{o.event_name}</div>
                <a href={`tel:${o.mobile}`} className="flex items-center gap-2 hover:text-green-700"><Phone className="w-4 h-4 text-gray-400" /> {o.mobile}</a>
                <div className="text-xs text-gray-400">{fmtDate(o.created_at)}</div>
              </div>
              {o.logo_url && <a href={o.logo_url} target="_blank" rel="noreferrer" className="mt-2 inline-block text-xs font-semibold text-green-700 hover:underline">View full logo →</a>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminEnquiries = () => {
  const [rows, load] = useList('/admin/enquiries');
  const [q, setQ] = useState('');
  const list = useMemo(() => filterRows(rows, q), [rows, q]);
  return (
    <div data-testid="admin-enquiries-page">
      <PageTitle title="💬 Enquiries" sub={<>Messages from the contact form. Also in <a className="underline" href={CONFIG.enquiriesUrl}>WordPress → Enquiries</a>.</>} action={<Toolbar q={q} setQ={setQ} onRefresh={load} testid="admin-enquiries" />} />
      {!list?.length ? <Empty rows={list} label="enquiries" testid="admin-enquiries-empty" /> : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto" data-testid="admin-enquiries-list">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
              <tr><th className="p-3">Name</th><th className="p-3">WhatsApp</th><th className="p-3">Event</th><th className="p-3">Location</th><th className="p-3">Qty</th><th className="p-3">Notes</th><th className="p-3">Received</th><th className="p-3" /></tr>
            </thead>
            <tbody>
              {list.map((e) => (
                <tr key={e.id} className="border-t border-gray-100 align-top">
                  <td className="p-3 font-semibold text-gray-900">{e.name}</td>
                  <td className="p-3"><a href={`tel:${e.whatsapp}`} className="text-green-700">{e.whatsapp}</a></td>
                  <td className="p-3">{e.eventType || '—'}{e.eventDate ? ` · ${e.eventDate}` : ''}</td>
                  <td className="p-3">{e.location || '—'}</td>
                  <td className="p-3">{e.quantity || '—'}</td>
                  <td className="p-3 max-w-xs text-gray-500 break-words">{e.customization || '—'}</td>
                  <td className="p-3 text-xs text-gray-400 whitespace-nowrap">{fmtDate(e.created_at)}</td>
                  <td className="p-3"><DeleteBtn onYes={() => adminApi.del(`/admin/enquiries/${e.id}`).then(load)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
