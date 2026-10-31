import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { X, Upload, Link2, Images, Film, Loader2, Check } from 'lucide-react';
import { useContent } from './ContentContext';
import { useEditorUI } from './Editable';
import { API, IS_DEMO, authHeaders, asset } from '../lib/api';
import { inputCls } from './FieldEditor';

// Files shipped with the site (frontend/public). Uploaded files are added to the library automatically.
export const BUNDLED_MEDIA = [
  { url: '/images/brand/mr-coconetto-logo.png', name: 'mr-coconetto-logo.png', type: 'image' },
  ...['hero-1', 'hero-2', 'hero-3', 'service-1', 'service-2', 'service-3', 'service-4', 'service-5', 'service-6'].map((n) => ({ url: `/images/brand/${n}.jpg`, name: `${n}.jpg`, type: 'image' })),
  { url: '/videos/hero-clip-1.mp4', name: 'hero-clip-1.mp4', type: 'video' },
  { url: '/videos/hero-clip-2.mp4', name: 'hero-clip-2.mp4', type: 'video' },
];

const MAX_DEMO_BYTES = 2.5 * 1024 * 1024;

export default function MediaPicker() {
  const { picker, closePicker } = useEditorUI();
  const { set, get } = useContent();
  const [tab, setTab] = useState('upload');
  const [url, setUrl] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [library, setLibrary] = useState([]);
  const [drag, setDrag] = useState(false);
  const fileRef = useRef(null);

  const kind = picker?.kind || 'image';
  const accept = kind === 'video' ? 'video/mp4,video/webm,video/quicktime' : kind === 'any' ? 'image/*,video/mp4,video/webm' : 'image/*';

  useEffect(() => {
    if (!picker) return;
    setTab('upload'); setUrl(''); setError(''); setBusy(false);
    (async () => {
      let uploaded = [];
      if (!IS_DEMO) {
        try { const { data } = await axios.get(`${API}/admin/media`, { headers: authHeaders() }); uploaded = data || []; } catch { uploaded = []; }
      }
      setLibrary([...uploaded, ...BUNDLED_MEDIA]);
    })();
  }, [picker]);

  if (!picker) return null;

  const finish = (value) => {
    if (picker.onPick) picker.onPick(value); else set(picker.path, value);
    closePicker();
  };

  const upload = async (file) => {
    if (!file) return;
    setError('');
    const isVid = file.type.startsWith('video/');
    if (kind === 'image' && isVid) { setError('Please choose an image file.'); return; }
    if (kind === 'video' && !isVid) { setError('Please choose a video file (MP4 / WebM).'); return; }
    setBusy(true);
    try {
      if (IS_DEMO) {
        if (file.size > MAX_DEMO_BYTES) throw new Error(`Demo mode stores files in your browser — please use a file under 2.5 MB (this one is ${(file.size / 1024 / 1024).toFixed(1)} MB). On the live site uploads go to the server.`);
        const dataUrl = await new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(r.result); r.onerror = rej; r.readAsDataURL(file); });
        finish(dataUrl);
      } else {
        const fd = new FormData();
        fd.append('file', file);
        const { data } = await axios.post(`${API}/admin/upload`, fd, { headers: { ...authHeaders() }, timeout: 180000 });
        finish(data.url);
      }
    } catch (e) {
      setError(e.response?.data?.detail || e.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const filtered = library.filter((m) => kind === 'any' || m.type === kind);
  const current = picker.path ? get(picker.path, '') : '';

  return (
    <div className="cms-toolbar fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4" onClick={closePicker}>
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
          <div>
            <div className="font-bold text-gray-900">{kind === 'video' ? 'Choose a video' : kind === 'any' ? 'Choose image or video' : 'Choose an image'}</div>
            <div className="text-[11px] text-gray-400 truncate max-w-md">{picker.path}</div>
          </div>
          <button type="button" onClick={closePicker} className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"><X className="w-5 h-5" /></button>
        </div>

        <div className="flex gap-1 px-5 pt-3">
          {[['upload', Upload, 'Upload'], ['library', Images, 'Library'], ['url', Link2, 'Paste URL']].map(([id, Icon, label]) => (
            <button key={id} type="button" onClick={() => setTab(id)} className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${tab === id ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        <div className="p-5 min-h-[280px]">
          {tab === 'upload' && (
            <div
              className={`rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${drag ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'}`}
              onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
              onDragLeave={() => setDrag(false)}
              onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files[0]); }}
            >
              {busy ? (
                <div className="flex flex-col items-center gap-2 text-gray-600"><Loader2 className="w-8 h-8 animate-spin text-green-600" /> Uploading…</div>
              ) : (
                <>
                  <div className="mx-auto w-14 h-14 rounded-full bg-white shadow flex items-center justify-center text-green-600">{kind === 'video' ? <Film className="w-6 h-6" /> : <Upload className="w-6 h-6" />}</div>
                  <p className="mt-3 text-sm text-gray-700 font-medium">Drag & drop here, or</p>
                  <button type="button" onClick={() => fileRef.current?.click()} className="mt-2 inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 text-white px-5 py-2 text-sm font-semibold">Browse files</button>
                  <input ref={fileRef} type="file" accept={accept} className="hidden" onChange={(e) => upload(e.target.files[0])} />
                  <p className="mt-3 text-[11px] text-gray-400">{kind === 'video' ? 'MP4 or WebM · short clips (3–10 s) work best in the hero · up to 60 MB' : 'JPG, PNG, WEBP or GIF · up to 15 MB'}</p>
                  {IS_DEMO && <p className="mt-1 text-[11px] text-amber-600 font-medium">Preview mode: files are kept in this browser only (max 2.5 MB).</p>}
                </>
              )}
              {current && !busy && (
                <div className="mt-5 flex items-center justify-center gap-3 text-xs text-gray-500">
                  <span>Current:</span>
                  {/\.(mp4|webm|mov)(\?|$)/i.test(current) || current.startsWith('data:video') ? <video src={asset(current)} className="h-12 rounded" muted /> : <img src={asset(current)} alt="" className="h-12 rounded object-cover" />}
                </div>
              )}
            </div>
          )}

          {tab === 'library' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto cms-scroll pr-1">
              {filtered.map((m) => (
                <button key={m.url} type="button" onClick={() => finish(m.url)} className={`group relative aspect-square rounded-xl overflow-hidden border-2 ${current === m.url ? 'border-green-600' : 'border-transparent hover:border-pink-400'} bg-gray-100`} title={m.name}>
                  {m.type === 'video' ? <video src={asset(m.url)} className="w-full h-full object-cover" muted /> : <img src={asset(m.url)} alt={m.name} className="w-full h-full object-cover" loading="lazy" />}
                  {m.type === 'video' && <span className="absolute top-1.5 left-1.5 bg-black/60 text-white rounded px-1.5 py-0.5 text-[10px] inline-flex items-center gap-1"><Film className="w-3 h-3" /> video</span>}
                  {current === m.url && <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center"><Check className="w-3 h-3" /></span>}
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent text-white text-[10px] px-1.5 py-1 truncate text-left">{m.name}</span>
                </button>
              ))}
              {filtered.length === 0 && <div className="col-span-full text-sm text-gray-400 py-10 text-center">Nothing in the library yet — upload a file first.</div>}
            </div>
          )}

          {tab === 'url' && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Direct link to the {kind === 'video' ? 'video' : 'image'}</label>
              <input className={inputCls} placeholder={kind === 'video' ? 'https://…/clip.mp4' : 'https://…/photo.jpg'} value={url} onChange={(e) => setUrl(e.target.value)} />
              {url && (
                <div className="mt-4 rounded-xl overflow-hidden bg-gray-100 max-h-56 flex items-center justify-center">
                  {kind === 'video' || /\.(mp4|webm|mov)(\?|$)/i.test(url) ? <video src={url} className="max-h-56" controls muted /> : <img src={url} alt="preview" className="max-h-56 object-contain" onError={() => setError('Could not load that URL.')} />}
                </div>
              )}
              <button type="button" disabled={!url} onClick={() => finish(url.trim())} className="mt-4 inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white px-5 py-2 text-sm font-semibold">Use this {kind === 'video' ? 'video' : 'image'}</button>
            </div>
          )}

          {error && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</div>}
        </div>
      </div>
    </div>
  );
}
