import React, { useEffect, useState } from 'react';
import { ExternalLink, Pencil, Trash2, Plus, Loader2 } from 'lucide-react';
import { adminApi, CONFIG, errorText } from '../../lib/api';
import { useSiteContent } from '../../context/SiteContent';
import { ColourFields } from '../editor/EditorDialogs';
import { PageTitle, fmtDate } from './AdminLayout';
import { toast } from '../../hooks/use-toast';

export const AdminColours = () => (
  <div data-testid="admin-colours-page">
    <PageTitle title="🎨 Colours" sub="Pick a colour. Every button and background with that colour changes. Press Save at the bottom." />
    <div className="bg-white rounded-3xl border-2 border-gray-100 p-5 max-w-2xl"><ColourFields /></div>
  </div>
);

export const AdminHistory = () => {
  const { replaceAll, dirty } = useSiteContent();
  const [rows, setRows] = useState(null);
  const [busy, setBusy] = useState(null);
  const [ask, setAsk] = useState(null);
  const load = () => adminApi.get('/admin/history').then(setRows).catch(() => setRows([]));
  useEffect(() => { load(); }, []);

  const restore = async (id) => {
    setBusy(id);
    try {
      const data = await adminApi.post(`/admin/history/${id}/restore`, {});
      replaceAll(data, { asSaved: true });
      toast({ title: '⏪ Done!', description: 'The website is back to that version.' });
      load();
    } catch (err) {
      toast({ title: 'Could not go back', description: errorText(err), variant: 'destructive' });
    } finally { setBusy(null); setAsk(null); }
  };

  return (
    <div data-testid="admin-history-page">
      <PageTitle title="⏪ Undo / old versions" sub="Every time you press Save, the version before it is kept here (the last 30). Press “Go back” to make the website look like that again." />
      {dirty && <p className="mb-4 rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-3 text-sm text-yellow-900">You have changes that are not saved. Going back will throw them away.</p>}
      {rows === null ? <div className="py-16 text-center text-gray-400">Loading…</div> : rows.length === 0 ? (
        <div className="py-16 text-center text-gray-500 bg-white rounded-3xl border-2 border-gray-100">Nothing saved yet. After your first Save, older versions appear here.</div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-gray-100 divide-y divide-gray-100" data-testid="admin-history-list">
          {rows.map((h, i) => (
            <div key={h.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="font-bold text-gray-900">{fmtDate(h.time)}{i === 0 && <span className="ml-2 text-xs font-semibold text-green-700">(just before the last save)</span>}</div>
                <div className="text-sm text-gray-500">{h.changes} change{h.changes === 1 ? '' : 's'}{h.user ? ` · saved by ${h.user}` : ''}{h.note ? ` · ${h.note}` : ''}</div>
              </div>
              {ask === h.id ? (
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  Sure?
                  <button type="button" onClick={() => restore(h.id)} className="px-4 py-2 rounded-xl bg-green-600 text-white font-bold" data-testid={`admin-history-yes-${i}`}>{busy === h.id ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, go back'}</button>
                  <button type="button" onClick={() => setAsk(null)} className="px-3 py-2 rounded-xl border">No</button>
                </span>
              ) : (
                <button type="button" onClick={() => setAsk(h.id)} className="px-4 py-2.5 rounded-xl border-2 border-gray-200 font-bold text-sm hover:border-green-500" data-testid={`admin-history-restore-${i}`}>⏪ Go back to this</button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const AdminBlog = () => {
  const [posts, setPosts] = useState(null);
  const [ask, setAsk] = useState(null);
  const load = () => adminApi.get('/admin/blog').then(setPosts).catch(() => setPosts([]));
  useEffect(() => { load(); }, []);

  const remove = async (p) => {
    try { await adminApi.del(`/admin/blog/${p.id}`); toast({ title: 'Moved to the bin', description: 'You can bring it back from WordPress → Posts → Bin.' }); load(); } catch (err) {
      toast({ title: 'Could not delete', description: errorText(err), variant: 'destructive' });
    }
    setAsk(null);
  };

  return (
    <div data-testid="admin-blog-page">
      <PageTitle title="📰 Blog posts" sub="Articles are written in WordPress. Press “Write a new post”, type your article, add a picture with “Set featured image”, then press Publish."
        action={<a href={CONFIG.newPostUrl || '/wp-admin/post-new.php'} className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold" data-testid="admin-blog-new"><Plus className="w-5 h-5" /> Write a new post</a>} />
      {posts === null ? <div className="py-16 text-center text-gray-400">Loading…</div> : posts.length === 0 ? (
        <div className="py-16 text-center text-gray-500" data-testid="admin-blog-empty">No posts yet.</div>
      ) : (
        <div className="bg-white rounded-3xl border-2 border-gray-100 divide-y divide-gray-100" data-testid="admin-blog-list">
          {posts.map((p) => (
            <div key={p.id} className="flex flex-wrap sm:flex-nowrap items-center gap-4 p-3 sm:p-4" data-testid={`admin-blog-row-${p.slug}`}>
              <img src={p.image} alt="" className="w-24 h-16 rounded-xl object-cover bg-gray-100 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-bold text-gray-900">{p.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{fmtDate(p.date)} · {p.readTime}</div>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{p.published ? 'On the website' : 'Draft'}</span>
              <div className="flex items-center gap-1">
                {p.published && <a href={`/blog/${p.slug}`} target="_blank" rel="noreferrer" title="View" className="p-2.5 rounded-lg text-gray-500 hover:bg-gray-100"><ExternalLink className="w-5 h-5" /></a>}
                <a href={p.editUrl} title="Edit" className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border-2 border-gray-200 font-semibold text-sm hover:border-green-500" data-testid={`admin-blog-edit-${p.slug}`}><Pencil className="w-4 h-4" /> Edit</a>
                {ask === p.id ? (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700">Delete?
                    <button type="button" className="px-2 py-1 rounded bg-red-600 text-white" onClick={() => remove(p)}>Yes</button>
                    <button type="button" className="px-2 py-1 rounded border" onClick={() => setAsk(null)}>No</button>
                  </span>
                ) : (
                  <button type="button" onClick={() => setAsk(p.id)} title="Delete" className="p-2.5 rounded-lg text-gray-500 hover:text-red-600 hover:bg-red-50" data-testid={`admin-blog-delete-${p.slug}`}><Trash2 className="w-5 h-5" /></button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
