import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, Images, Undo2, Loader2, Link2, ImageOff, Check } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { adminApi, CONFIG, errorText } from '../../lib/api';
import { prepareImage } from '../../lib/prepareImage';
import { isVideo } from '../../data/cms';
import { toast } from '../../hooks/use-toast';

export const MediaPreview = ({ src, className = '' }) => {
  if (!src) {
    return (
      <div className={`flex flex-col items-center justify-center gap-1 bg-gray-100 text-gray-400 ${className}`}>
        <ImageOff className="w-6 h-6" /><span className="text-xs">No picture</span>
      </div>
    );
  }
  return isVideo(src)
    ? <video src={src} className={`object-cover bg-black ${className}`} muted autoPlay loop playsInline />
    : <img src={src} alt="" className={`object-cover bg-gray-100 ${className}`} />;
};

/** Grid of everything uploaded to the WordPress Media Library. */
export const LibraryDialog = ({ open, onClose, onPick, allowVideo = true }) => {
  const [items, setItems] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchPage = useCallback(async (p) => {
    const data = await adminApi.get(`/admin/media/${p}`);
    setPages(data.pages || 1);
    setItems((cur) => (p === 1 ? data.items : [...(cur || []), ...data.items]));
  }, []);

  useEffect(() => {
    if (!open) return;
    setItems(null); setPage(1);
    fetchPage(1).catch(() => setItems([]));
  }, [open, fetchPage]);

  const list = (items || []).filter((m) => allowVideo || m.type === 'image');

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent data-editor-ui data-no-edit className="max-w-3xl max-h-[88vh] overflow-y-auto" data-testid="media-library">
        <DialogHeader>
          <DialogTitle className="text-xl">🖼️ My pictures</DialogTitle>
          <DialogDescription>Tap a picture to use it. New uploads appear here too.</DialogDescription>
        </DialogHeader>
        {items === null && <div className="py-16 text-center text-gray-400"><Loader2 className="w-6 h-6 animate-spin inline" /></div>}
        {items && list.length === 0 && <div className="py-16 text-center text-gray-500">No pictures uploaded yet. Use “Upload a new picture” instead.</div>}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {list.map((m) => (
            <button key={m.id} type="button" onClick={() => { onPick(m.url); onClose(); }}
              className="group relative rounded-xl overflow-hidden border-2 border-transparent hover:border-green-500 focus:border-green-500 focus:outline-none" data-testid={`media-library-item-${m.id}`}>
              <MediaPreview src={m.type === 'video' ? m.url : m.thumb} className="w-full h-28" />
              <span className="absolute inset-x-0 bottom-0 bg-black/55 text-white text-[11px] px-2 py-1 truncate text-left">{m.title}</span>
              <span className="absolute top-2 right-2 hidden group-hover:flex w-7 h-7 rounded-full bg-green-600 text-white items-center justify-center"><Check className="w-4 h-4" /></span>
            </button>
          ))}
        </div>
        {page < pages && (
          <button type="button" className="mt-4 w-full py-3 rounded-xl border border-gray-200 font-semibold text-sm hover:bg-gray-50"
            onClick={() => { const n = page + 1; setPage(n); fetchPage(n); }}>Show more pictures</button>
        )}
      </DialogContent>
    </Dialog>
  );
};

/** Big, simple picture chooser: upload, pick from library, or put back the original. */
export const MediaPicker = ({ value, onChange, onReset, testid = 'media-picker', allowVideo = true, compact = false }) => {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const [library, setLibrary] = useState(false);
  const [showLink, setShowLink] = useState(false);
  const [url, setUrl] = useState('');

  const pick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const upload = file.type.startsWith('video/') ? file : await prepareImage(file);
      onChange(await adminApi.upload(upload));
      toast({ title: '✅ Picture added', description: 'Press Save when you are finished.' });
    } catch (err) {
      toast({ title: 'Upload did not work', description: errorText(err, 'Please try another photo.'), variant: 'destructive' });
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = '';
    }
  };

  const btn = 'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-60';
  const size = compact ? 'px-3 py-2 text-xs' : 'px-4 py-3 text-sm';

  return (
    <div className="space-y-3" data-testid={testid}>
      <MediaPreview src={value} className={`w-full rounded-xl ${compact ? 'h-32' : 'h-48'}`} />
      <div className={`grid gap-2 ${onReset ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
        <input ref={ref} type="file" accept={allowVideo ? 'image/*,video/mp4,video/webm,video/quicktime' : 'image/*'} className="hidden" onChange={pick} data-testid={`${testid}-file`} />
        {CONFIG.canUpload !== false && (
          <button type="button" onClick={() => ref.current?.click()} disabled={busy} className={`${btn} ${size} bg-green-600 hover:bg-green-700 text-white`} data-testid={`${testid}-upload-btn`}>
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />} {busy ? 'Uploading…' : `Upload new ${allowVideo ? 'photo / video' : 'photo'}`}
          </button>
        )}
        <button type="button" onClick={() => setLibrary(true)} className={`${btn} ${size} bg-white border-2 border-gray-200 hover:border-green-500 text-gray-800`} data-testid={`${testid}-library-btn`}>
          <Images className="w-4 h-4" /> My pictures
        </button>
        {onReset && (
          <button type="button" onClick={onReset} className={`${btn} ${size} bg-white border-2 border-gray-200 hover:border-pink-400 text-gray-700`} data-testid={`${testid}-reset`}>
            <Undo2 className="w-4 h-4" /> Original
          </button>
        )}
      </div>
      {!showLink ? (
        <button type="button" onClick={() => setShowLink(true)} className="text-xs text-gray-500 underline">Use a picture link from the internet instead</button>
      ) : (
        <div className="flex gap-2">
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 text-sm" data-testid={`${testid}-url`} />
          <button type="button" className={`${btn} px-3 py-2 text-sm border border-gray-200`} onClick={() => { if (url.trim()) { onChange(url.trim()); setUrl(''); setShowLink(false); } }} data-testid={`${testid}-url-apply`}>
            <Link2 className="w-4 h-4" /> Use
          </button>
        </div>
      )}
      <LibraryDialog open={library} onClose={() => setLibrary(false)} onPick={onChange} allowVideo={allowVideo} />
    </div>
  );
};
