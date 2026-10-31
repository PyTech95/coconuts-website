import React, { useEffect, useState } from 'react';
import { Routes, Route, NavLink, Link, useNavigate, Navigate, useParams } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, Images, LogOut, Save, Loader2, Eye, Paintbrush, Menu, X, Check, AlertTriangle, RotateCcw, ExternalLink,
  Newspaper, ShoppingBag, Sparkles, Settings2, Undo2, Redo2,
} from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { SECTIONS, SECTION_GROUPS } from '../cms/schema';
import { Field } from '../cms/FieldEditor';
import DEFAULT_CONTENT from '../cms/defaultContent';
import { getToken, clearToken, IS_DEMO } from '../lib/api';
import InboxView from './InboxView';
import MediaLibrary from './MediaLibrary';
import Dashboard from './Dashboard';

const SECTION_ICONS = { blog: Newspaper, products: ShoppingBag, hero: Sparkles, theme: Paintbrush };

export default function AdminLayout() {
  const navigate = useNavigate();
  const { dirty, saving, save, status, undo, redo, canUndo, canRedo } = useContent();
  const [menu, setMenu] = useState(false);
  const token = getToken();

  useEffect(() => {
    if (!IS_DEMO && !token) navigate('/admin/login?next=/admin', { replace: true });
  }, [token, navigate]);

  const logout = () => { clearToken(); navigate('/admin/login'); };

  const navCls = ({ isActive }) => `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${isActive ? 'bg-green-600 text-white font-semibold shadow' : 'text-gray-700 hover:bg-gray-100'}`;

  const sidebar = (
    <nav className="space-y-5 text-sm">
      <div className="space-y-1">
        <NavLink to="/admin" end className={navCls} onClick={() => setMenu(false)}><LayoutDashboard className="w-4 h-4" /> Dashboard</NavLink>
        <NavLink to="/admin/inbox" className={navCls} onClick={() => setMenu(false)}><Inbox className="w-4 h-4" /> Orders & Enquiries</NavLink>
        <NavLink to="/admin/media" className={navCls} onClick={() => setMenu(false)}><Images className="w-4 h-4" /> Media Library</NavLink>
        <Link to="/?edit=1" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm bg-pink-600 text-white font-semibold hover:bg-pink-700 shadow"><Paintbrush className="w-4 h-4" /> Open Live Editor</Link>
      </div>
      {SECTION_GROUPS.map((g) => (
        <div key={g}>
          <div className="px-3 mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">{g}</div>
          <div className="space-y-0.5">
            {SECTIONS.filter((s) => s.group === g).map((s) => {
              const Icon = SECTION_ICONS[s.id] || Settings2;
              return (
                <NavLink key={s.id} to={`/admin/content/${s.id}`} className={navCls} onClick={() => setMenu(false)}>
                  <Icon className="w-4 h-4 opacity-70" /> {s.label}
                </NavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-gray-50 cms-toolbar" data-testid="admin-page">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-gray-900 text-white">
        <div className="px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button type="button" className="lg:hidden p-2 -ml-2 rounded-md hover:bg-white/10" onClick={() => setMenu((m) => !m)}>{menu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
            <div className="min-w-0">
              <span className="font-script text-pink-400 text-lg leading-none block">Mr. Coconetto</span>
              <span className="font-display font-bold text-sm">Backend Editor {IS_DEMO && <span className="ml-1 text-[10px] font-bold uppercase bg-amber-400 text-amber-950 rounded px-1.5 py-0.5 align-middle">Preview mode</span>}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={undo} disabled={!canUndo} className="hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-lg hover:bg-white/10 disabled:opacity-30" title="Undo"><Undo2 className="w-4 h-4" /></button>
            <button type="button" onClick={redo} disabled={!canRedo} className="hidden sm:inline-flex w-9 h-9 items-center justify-center rounded-lg hover:bg-white/10 disabled:opacity-30" title="Redo"><Redo2 className="w-4 h-4" /></button>
            <button type="button" onClick={save} disabled={saving || !dirty} data-testid="admin-save" className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-500 disabled:opacity-40 px-4 py-2 text-sm font-semibold">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {saving ? 'Saving…' : dirty ? 'Save changes' : 'All saved'}
            </button>
            <a href="/" target="_blank" rel="noreferrer" className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/20 hover:bg-white/10 px-3 py-2 text-sm"><Eye className="w-4 h-4" /> View site</a>
            <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 px-3 py-2 text-sm"><LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span></button>
          </div>
        </div>
        {dirty && <div className="h-0.5 bg-gradient-to-r from-pink-500 via-amber-400 to-green-500 animate-pulse" />}
      </header>

      {status && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 rounded-full px-4 py-2 text-sm font-semibold shadow-xl flex items-center gap-2 ${status.type === 'ok' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {status.type === 'ok' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {status.msg}
        </div>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${menu ? 'block' : 'hidden'} lg:block fixed lg:sticky top-16 z-30 w-72 h-[calc(100vh-4rem)] overflow-y-auto cms-scroll bg-white border-r border-gray-200 p-4 shrink-0`}>
          {sidebar}
        </aside>
        {menu && <div className="fixed inset-0 top-16 z-20 bg-black/30 lg:hidden" onClick={() => setMenu(false)} />}

        {/* Main */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route index element={<Dashboard />} />
            <Route path="inbox" element={<InboxView />} />
            <Route path="media" element={<MediaLibrary />} />
            <Route path="content/:section" element={<SectionEditor />} />
            <Route path="blog" element={<Navigate to="/admin/content/blog" replace />} />
            <Route path="products" element={<Navigate to="/admin/content/products" replace />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
function SectionEditor() {
  const { section: id } = useParams();
  const section = SECTIONS.find((s) => s.id === id);
  const { set, dirty, save, saving } = useContent();
  if (!section) return <Navigate to="/admin" replace />;

  const resetSection = () => {
    if (window.confirm(`Reset "${section.label}" to the original default content? You can still undo before saving.`)) set(id, DEFAULT_CONTENT[id]);
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{section.group}</div>
          <h1 className="font-display font-bold text-2xl text-gray-900">{section.label}</h1>
          <p className="text-sm text-gray-500 mt-1">Changes apply when you press <b>Save changes</b>. Use the <Link to="/?edit=1" className="text-pink-600 font-semibold underline">Live Editor</Link> to edit directly on the page.</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={resetSection} className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"><RotateCcw className="w-3.5 h-3.5" /> Reset section</button>
          {id === 'blog' && <Link to="/blog" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"><ExternalLink className="w-3.5 h-3.5" /> View blog</Link>}
          {id === 'products' && <Link to="/products" target="_blank" className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-50"><ExternalLink className="w-3.5 h-3.5" /> View products</Link>}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-200 shadow-sm p-5 sm:p-6">
        {section.fields.map((f) => <Field key={f.key} def={f} path={`${id}.${f.key}`} />)}
      </div>

      {id === 'theme' && <ThemePreview />}

      <div className="sticky bottom-4 mt-6 flex justify-end">
        <button type="button" onClick={save} disabled={saving || !dirty} className="inline-flex items-center gap-2 rounded-full bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white px-6 py-3 text-sm font-semibold shadow-xl">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} {dirty ? 'Save changes' : 'All saved'}
        </button>
      </div>
    </div>
  );
}

function ThemePreview() {
  const { get } = useContent();
  const t = get('theme', {});
  return (
    <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-5">
      <div className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Preview</div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="rounded-xl p-4" style={{ background: t.pink50 }}>
          <div className="font-script text-2xl" style={{ color: t.pink600, fontFamily: `'${t.fontScript}'` }}>Client Love</div>
          <div className="font-bold text-xl text-gray-900" style={{ fontFamily: `'${t.fontDisplay}'` }}>Light pink section <em className="not-italic" style={{ color: t.green700 }}>heading</em></div>
          <p className="text-sm text-gray-600 mt-1" style={{ fontFamily: `'${t.fontBody}'` }}>Body text in the body font.</p>
          <button type="button" className="mt-3 rounded-full px-4 py-2 text-white text-sm font-semibold" style={{ background: t.green600 }}>Primary button</button>
        </div>
        <div className="rounded-xl p-4" style={{ background: t.green50 }}>
          <div className="font-script text-2xl" style={{ color: t.pink600, fontFamily: `'${t.fontScript}'` }}>What We Do</div>
          <div className="font-bold text-xl text-gray-900" style={{ fontFamily: `'${t.fontDisplay}'` }}>Light green section</div>
          <div className="mt-3 flex gap-2">
            <span className="rounded-full px-3 py-1 text-xs font-semibold text-white" style={{ background: t.pink600 }}>Pink tag</span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: t.green100, color: t.green700 }}>Green chip</span>
            <span className="rounded-full px-3 py-1 text-xs font-semibold" style={{ background: t.pink100, color: t.pink700 }}>Pink chip</span>
          </div>
        </div>
        <div className="rounded-xl p-4" style={{ background: t.beige }}><div className="text-sm font-semibold text-gray-800">About section background</div></div>
        <div className="rounded-xl p-4" style={{ background: t.dark }}><div className="text-sm font-semibold text-white">Plans section background</div></div>
      </div>
    </div>
  );
}
