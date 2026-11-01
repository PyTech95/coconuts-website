import React, { useEffect, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, MessageSquare, FileText, PenLine, LogOut, ExternalLink, Menu, X, Puzzle, Images, Palette, History, Type, Save, Loader2, Undo2,
} from 'lucide-react';
import { CONFIG, canEdit, errorText, goToLogin } from '../../lib/api';
import { useSiteContent } from '../../context/SiteContent';
import { toast } from '../../hooks/use-toast';

const NAV = [
  { to: '/admin', label: 'Start here', icon: LayoutDashboard, end: true },
  { to: '/admin/sections', label: 'Sections', icon: Puzzle },
  { to: '/admin/pictures', label: 'Pictures', icon: Images },
  { to: '/admin/words', label: 'Changed words', icon: Type },
  { to: '/admin/colours', label: 'Colours', icon: Palette },
  { to: '/admin/blog', label: 'Blog posts', icon: FileText },
  { to: '/admin/orders', label: 'Orders', icon: Package },
  { to: '/admin/enquiries', label: 'Enquiries', icon: MessageSquare },
  { to: '/admin/history', label: 'Undo / old versions', icon: History },
];

export const useOpenLiveEditor = () => {
  const navigate = useNavigate();
  const { setEditing } = useSiteContent();
  return () => { setEditing(true); navigate('/'); window.scrollTo(0, 0); };
};

/** Green bar that appears whenever something is changed but not saved yet. */
export const SaveBar = () => {
  const { dirty, save, discard, undo, canUndo } = useSiteContent();
  const [busy, setBusy] = useState(false);
  if (!dirty) return null;
  const doSave = async () => {
    setBusy(true);
    try { await save(); toast({ title: '🎉 Saved!', description: 'Everyone can see your changes now.' }); } catch (err) {
      toast({ title: 'Could not save', description: errorText(err, 'Please log in again and retry.'), variant: 'destructive' });
    } finally { setBusy(false); }
  };
  return (
    <div className="sticky bottom-3 z-40 mt-8" data-testid="admin-save-bar">
      <div className="flex flex-wrap items-center justify-between gap-3 bg-gray-900 text-white rounded-2xl px-4 py-3 shadow-2xl">
        <span className="font-semibold">You have changes that are not saved yet.</span>
        <div className="flex flex-wrap gap-2">
          {canUndo && <button type="button" onClick={undo} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm"><Undo2 className="w-4 h-4" /> Undo</button>}
          <button type="button" onClick={discard} className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 font-bold text-sm" data-testid="admin-discard">Throw away</button>
          <button type="button" onClick={doSave} disabled={busy} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-500 hover:bg-green-600 font-bold" data-testid="admin-save">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
          </button>
        </div>
      </div>
    </div>
  );
};

const AdminLayout = () => {
  const openEditor = useOpenLiveEditor();
  const [menu, setMenu] = useState(false);
  const { dirty } = useSiteContent();
  const allowed = canEdit();

  useEffect(() => { if (!allowed) goToLogin(); }, [allowed]);
  useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  if (!allowed) return <div className="min-h-screen flex items-center justify-center text-gray-500" data-testid="admin-loading">Opening the WordPress login…</div>;

  const aside = (
    <div className="flex flex-col h-full p-5 overflow-y-auto">
      <div className="mb-6 px-2">
        <span className="font-script text-pink-400 text-xl leading-none block">Mr. Coconetto</span>
        <span className="font-display font-bold text-white">Website Admin</span>
      </div>
      <button type="button" onClick={openEditor} data-testid="admin-open-live-editor" className="mb-5 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-gradient-to-r from-green-600 to-pink-600 text-white font-bold shadow-lg hover:brightness-110">
        <PenLine className="w-5 h-5" /> Edit the website
      </button>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} onClick={() => setMenu(false)} data-testid={`admin-nav-${label.toLowerCase().replace(/[^a-z]+/g, '-')}`}
            className={({ isActive }) => `flex items-center gap-3 px-4 py-2.5 rounded-xl text-[15px] font-medium transition-colors ${isActive ? 'bg-green-600 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'}`}>
            <Icon className="w-5 h-5" /> {label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto pt-6 border-t border-white/10 space-y-1">
        <div className="px-2 text-xs text-white/50 truncate" data-testid="admin-user-email">{CONFIG.user?.name} · {CONFIG.user?.email}</div>
        <a href="/" className="flex items-center gap-2 px-2 py-2 text-sm text-white/75 hover:text-white"><ExternalLink className="w-4 h-4" /> View website</a>
        <a href={CONFIG.wpAdmin || '/wp-admin/'} className="flex items-center gap-2 px-2 py-2 text-sm text-white/75 hover:text-white"><LayoutDashboard className="w-4 h-4" /> WordPress dashboard</a>
        <a href={CONFIG.logoutUrl || '/wp-login.php?action=logout'} data-testid="admin-logout" className="flex items-center gap-2 px-2 py-2 text-sm text-pink-300 hover:text-pink-200"><LogOut className="w-4 h-4" /> Log out</a>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f6f5f2] flex" data-no-edit data-testid="admin-panel">
      <aside className="hidden lg:block w-72 shrink-0 bg-[#0d0710] sticky top-0 h-screen">{aside}</aside>
      {menu && (
        <div className="fixed inset-0 z-50 lg:hidden" onClick={() => setMenu(false)}>
          <div className="absolute inset-0 bg-black/50" />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#0d0710]" onClick={(e) => e.stopPropagation()}>{aside}</aside>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <header className="lg:hidden sticky top-0 z-30 bg-[#0d0710] text-white h-14 flex items-center justify-between px-4">
          <button type="button" onClick={() => setMenu(!menu)} data-testid="admin-menu-toggle" className="inline-flex items-center gap-2 font-semibold">{menu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />} Menu</button>
          <span className="font-display font-bold text-sm">Website Admin</span>
          <button type="button" onClick={openEditor} className="text-pink-300" aria-label="Edit the website"><PenLine className="w-6 h-6" /></button>
        </header>
        <main className="p-4 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
          <SaveBar />
        </main>
      </div>
    </div>
  );
};

export const PageTitle = ({ title, sub, action }) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
    <div>
      <h1 className="font-display font-bold text-2xl sm:text-3xl text-gray-900">{title}</h1>
      {sub && <p className="text-[15px] text-gray-600 mt-1 max-w-2xl">{sub}</p>}
    </div>
    {action}
  </div>
);

export const fmtDate = (iso) => {
  if (!iso) return '—';
  try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return iso; }
};

export default AdminLayout;
