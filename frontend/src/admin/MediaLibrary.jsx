import React, { useCallback, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { Upload, Trash2, Copy, Film, Loader2, Check } from 'lucide-react';
import { API, IS_DEMO, authHeaders, asset } from '../lib/api';
import { BUNDLED_MEDIA } from '../cms/MediaPicker';

export default function MediaLibrary() {
  const [items, setItems] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState('');
  const fileRef = useRef(null);

  const load = useCallback(async () => {
    if (IS_DEMO) { setItems([]); return; }
    try { const { data } = await axios.get(`${API}/admin/media`, { headers: authHeaders() }); setItems(data || []); } catch { setItems([]); }
  }, []);
  useEffect(() => { load(); }, [load]);

  const upload = async (files) => {
    if (!files || !files.length) return;
    if (IS_DEMO) { setError('Uploads are stored on the server on the live site. In this preview, use the picker inside the editor (files are kept in your browser).'); return; }
    setBusy(true); setError('');
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData(); fd.append('file', file);
        await axios.post(`${API}/admin/upload`, fd, { headers: authHeaders(), timeout: 180000 });
      }
      await load();
    } catch (e) { setError(e.response?.data?.detail || e.message); } finally { setBusy(false); }
  };

  const remove = async (m) => {
    if (!window.confirm(`Delete ${m.name}? Pages still using it will show a broken image.`)) return;
    try { await axios.delete(`${API}/admin/media/${m.id}`, { headers: authHeaders() }); await load(); } catch (e) { setError('Delete failed'); }
  };

  const copy = (url) => { navigator.clipboard?.writeText(url); setCopied(url); setTimeout(() => setCopied(''), 1500); };

  const Card = ({ m, removable }) => (
    <div className="group relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square">
      {m.type === 'video' ? <video src={asset(m.url)} className="w-full h-full object-cover" muted /> : <img src={asset(m.url)} alt={m.name} className="w-full h-full object-cover" loading="lazy" />}
      {m.type === 'video' && <span className="absolute top-2 left-2 bg-black/60 text-white rounded px-1.5 py-0.5 text-[10px] inline-flex items-center gap-1"><Film className="w-3 h-3" /> video</span>}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-white">
        <div className="text-[11px] truncate">{m.name}</div>
        <div className="mt-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button type="button" onClick={() => copy(m.url)} className="inline-flex items-center gap-1 rounded bg-white/20 hover:bg-white/30 px-2 py-1 text-[10px] font-semibold">{copied === m.url ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />} Copy URL</button>
          {removable && <button type="button" onClick={() => remove(m)} className="inline-flex items-center gap-1 rounded bg-red-600/80 hover:bg-red-600 px-2 py-1 text-[10px] font-semibold"><Trash2 className="w-3 h-3" /></button>}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="mr-auto">
          <h1 className="font-display font-bold text-2xl text-gray-900">Media Library</h1>
          <p className="text-sm text-gray-500">Upload photos and short videos once, then pick them anywhere in the editor.</p>
        </div>
        <button type="button" disabled={busy} onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-5 py-2.5 text-sm font-semibold">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} Upload files
        </button>
        <input ref={fileRef} type="file" multiple accept="image/*,video/mp4,video/webm" className="hidden" onChange={(e) => upload(e.target.files)} />
      </div>
      {error && <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-3">{error}</div>}

      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Uploaded ({items.length})</h2>
      {items.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-gray-200 p-10 text-center text-sm text-gray-400 mb-8">No uploads yet.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">{items.map((m) => <Card key={m.id || m.url} m={m} removable />)}</div>
      )}

      <h2 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Built-in brand files</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">{BUNDLED_MEDIA.map((m) => <Card key={m.url} m={m} />)}</div>
    </div>
  );
}
