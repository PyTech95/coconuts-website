import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PenLine, Save, Undo2, Palette, X, Puzzle, Loader2, Settings, FileText } from 'lucide-react';
import { useSiteContent } from '../../context/SiteContent';
import { canEdit, errorText } from '../../lib/api';
import { originalHref, originalSrc, originalText } from '../../lib/overrides';
import { TextDialog, MediaDialog, SectionDialog, ThemeDialog } from './EditorDialogs';
import { toast } from '../../hooks/use-toast';

const PAGES = [
  ['/', 'Home page'], ['/customize', 'Customize page'], ['/products', 'Products page'], ['/cities', 'Cities page'], ['/blog', 'Blog page'],
];

const firstText = (el) => {
  const direct = Array.from(el.childNodes || []).find((n) => n.nodeType === 3 && n.nodeValue.trim());
  if (direct) return direct;
  if (el.closest('svg')) return null;
  // Buttons / links with an icon and one piece of text inside.
  if ((el.textContent || '').trim().length > 0 && (el.textContent || '').trim().length < 160 && el.querySelectorAll('img,video').length === 0) {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    let n = walker.nextNode();
    const found = [];
    while (n) { if (n.nodeValue.trim()) found.push(n); n = walker.nextNode(); }
    if (found.length === 1) return found[0];
  }
  return null;
};

const findTarget = (el) => {
  if (!el || el.closest('[data-editor-ui]')) return null;
  const a = el.closest('a[href]');
  const href = a ? originalHref(a) : null;
  const textNode = firstText(el);
  if (textNode) return { type: 'text', key: originalText(textNode), href };
  if (el.closest('[data-edit-group="hero-slides"]')) return { type: 'slider' };
  const media = el.closest('img,video') || el.querySelector?.(':scope > img, :scope > video, :scope > picture > img');
  if (media) return { type: 'media', key: originalSrc(media) };
  const sibling = el.parentElement?.querySelector(':scope > img, :scope > video');
  if (sibling) return { type: 'media', key: originalSrc(sibling) };
  return null;
};

const HINTS = { text: '✏️ Tap to change these words', media: '🖼️ Tap to change this picture', slider: '🎞️ Tap to change the slides' };

const Btn = ({ icon: Icon, label, onClick, testid, tone = 'dark', busy, badge }) => {
  const tones = {
    dark: 'bg-white/10 hover:bg-white/20 text-white',
    save: 'bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-900/40',
    saved: 'bg-white/10 text-white/60',
    stop: 'bg-pink-600 hover:bg-pink-700 text-white',
  };
  return (
    <button type="button" onClick={onClick} data-testid={testid}
      className={`relative inline-flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl text-[11px] sm:text-sm font-bold transition-colors min-w-[56px] ${tones[tone]}`}>
      {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <Icon className="w-5 h-5" />}
      <span>{label}</span>
      {badge ? <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-yellow-300 text-gray-900 text-[11px] font-extrabold flex items-center justify-center">{badge}</span> : null}
    </button>
  );
};

const LiveEditor = () => {
  const { editing, setEditing, dirty, save, discard, undo, canUndo } = useSiteContent();
  const { pathname, search } = useLocation();
  const navigate = useNavigate();
  const [target, setTarget] = useState(null);
  const [panel, setPanel] = useState(null);
  const [sectionName, setSectionName] = useState(null);
  const [saving, setSaving] = useState(false);
  const [askStop, setAskStop] = useState(false);
  const [hover, setHover] = useState(null);
  const isAdmin = canEdit();
  const active = isAdmin && editing && !pathname.startsWith('/admin');
  const dialogOpen = !!target || !!panel || askStop;

  // wp-admin "Edit the website" button opens /?mc-edit=1
  useEffect(() => {
    if (!isAdmin) return;
    const p = new URLSearchParams(search);
    if (p.has('mc-edit')) {
      setEditing(true);
      p.delete('mc-edit');
      const q = p.toString();
      window.history.replaceState(null, '', `${pathname}${q ? `?${q}` : ''}${window.location.hash}`);
    }
  }, [isAdmin, search, pathname, setEditing]);

  const doSave = useCallback(async () => {
    setSaving(true);
    try {
      await save();
      toast({ title: '🎉 Saved!', description: 'Everyone can see your changes now.' });
      return true;
    } catch (err) {
      toast({ title: 'Could not save', description: err?.response?.status === 403 ? 'You were logged out. Please log in to WordPress again, then press Save.' : errorText(err), variant: 'destructive' });
      return false;
    } finally { setSaving(false); }
  }, [save]);

  // Click anything on the page to change it.
  useEffect(() => {
    if (!active) return undefined;
    document.body.classList.add('mc-editing');
    const onClick = (e) => {
      if (dialogOpen || e.target.closest('[data-editor-ui]') || e.target.closest('[role="dialog"]')) return;
      e.preventDefault();
      e.stopPropagation();
      const t = findTarget(e.target);
      setHover(null);
      if (!t) { toast({ title: 'Tap right on the words or the picture you want to change.' }); return; }
      if (t.type === 'slider') { setSectionName('HERO_SLIDES'); setPanel('section'); } else setTarget(t);
    };
    const onOver = (e) => {
      if (dialogOpen) return;
      const t = findTarget(e.target);
      if (!t) { setHover(null); return; }
      const box = (t.type === 'slider' ? e.target.closest('[data-edit-group="hero-slides"]') : e.target).getBoundingClientRect();
      setHover({ kind: t.type, top: Math.max(8, box.top - 30), left: Math.max(8, Math.min(box.left, window.innerWidth - 250)) });
    };
    const onScroll = () => setHover(null);
    document.addEventListener('click', onClick, true);
    document.addEventListener('mouseover', onOver, true);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      document.removeEventListener('click', onClick, true);
      document.removeEventListener('mouseover', onOver, true);
      window.removeEventListener('scroll', onScroll);
      document.body.classList.remove('mc-editing');
    };
  }, [active, dialogOpen]);

  // Keyboard: Ctrl+S saves, Ctrl+Z undoes.
  useEffect(() => {
    if (!active) return undefined;
    const onKey = (e) => {
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key.toLowerCase() === 's') { e.preventDefault(); if (dirty) doSave(); }
      if (mod && e.key.toLowerCase() === 'z' && !dialogOpen && !/input|textarea|select/i.test(document.activeElement?.tagName || '')) { e.preventDefault(); undo(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [active, dirty, doSave, undo, dialogOpen]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty || !isAdmin) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty, isAdmin]);

  if (!isAdmin || pathname.startsWith('/admin')) return null;

  if (!editing) {
    return (
      <div data-editor-ui data-no-edit className="fixed left-4 z-[90] flex items-center gap-2" style={{ bottom: 'calc(16px + env(safe-area-inset-bottom, 0px))' }}>
        <button type="button" onClick={() => setEditing(true)} data-testid="live-editor-open"
          className="inline-flex items-center gap-2 px-5 py-3.5 rounded-full bg-gradient-to-r from-green-600 to-pink-600 text-white text-base font-bold shadow-2xl hover:brightness-110">
          <PenLine className="w-5 h-5" /> Edit this website
        </button>
        <a href="/admin" title="Admin panel" className="w-12 h-12 rounded-full bg-gray-900 text-white flex items-center justify-center shadow-2xl hover:bg-gray-800" data-testid="live-editor-admin">
          <Settings className="w-5 h-5" />
        </a>
      </div>
    );
  }

  const stop = () => { if (dirty) setAskStop(true); else setEditing(false); };

  return (
    <>
      {hover && !dialogOpen && (
        <div data-editor-ui className="fixed z-[96] pointer-events-none px-3 py-1.5 rounded-full bg-gray-900 text-white text-xs font-bold shadow-lg" style={{ top: hover.top, left: hover.left }}>
          {HINTS[hover.kind]}
        </div>
      )}

      <div data-editor-ui data-no-edit className={`fixed inset-x-0 z-[95] flex justify-center px-2 pointer-events-none transition-opacity ${dialogOpen ? 'opacity-0 invisible' : ''}`} style={{ bottom: 'calc(10px + env(safe-area-inset-bottom, 0px))' }}>
        <div className="pointer-events-auto flex flex-col gap-2 items-center max-w-full">
          <div className="hidden md:block px-4 py-1.5 rounded-full bg-white text-gray-800 text-sm font-semibold shadow-lg ring-1 ring-black/5">
            ✏️ Editing mode — tap any <b>words</b> or <b>picture</b> to change it, then press <b className="text-green-700">Save</b>.
          </div>
          <div className="flex items-center gap-1 sm:gap-1.5 bg-gray-900/95 backdrop-blur-md p-1.5 rounded-3xl shadow-2xl ring-1 ring-white/10 overflow-x-auto max-w-full" data-testid="live-editor-toolbar">
            <label className="relative inline-flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-[11px] sm:text-sm font-bold min-w-[56px] cursor-pointer">
              <FileText className="w-5 h-5" />
              <span>{(PAGES.find(([p]) => p === pathname) || [null, 'Page'])[1].replace(' page', '')} ▾</span>
              <select value={PAGES.some(([p]) => p === pathname) ? pathname : ''} onChange={(e) => e.target.value && navigate(e.target.value)}
                aria-label="Go to page" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" data-testid="live-editor-page">
                {!PAGES.some(([p]) => p === pathname) && <option value="">This page</option>}
                {PAGES.map(([p, l]) => <option key={p} value={p}>{l}</option>)}
              </select>
            </label>
            <Btn icon={Undo2} label="Undo" onClick={undo} testid="live-editor-undo" tone={canUndo ? 'dark' : 'saved'} />
            <Btn icon={Puzzle} label="Sections" onClick={() => { setSectionName(null); setPanel('section'); }} testid="live-editor-sections" />
            <Btn icon={Palette} label="Colours" onClick={() => setPanel('theme')} testid="live-editor-theme" />
            <Btn icon={Save} label={dirty ? 'Save' : 'Saved'} onClick={dirty ? doSave : undefined} busy={saving} testid="live-editor-save" tone={dirty ? 'save' : 'saved'} badge={dirty ? '!' : null} />
            <Btn icon={X} label="Stop" onClick={stop} testid="live-editor-exit" tone="stop" />
          </div>
        </div>
      </div>

      {askStop && (
        <div data-editor-ui data-no-edit className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4" data-testid="live-editor-stop-dialog">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-900">Save your changes?</h2>
            <p className="mt-2 text-gray-600">You changed the website but did not press Save yet.</p>
            <div className="mt-5 grid gap-2">
              <button type="button" className="py-3.5 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-lg" data-testid="live-editor-stop-save"
                onClick={async () => { if (await doSave()) { setAskStop(false); setEditing(false); } }}>💾 Save and stop</button>
              <button type="button" className="py-3 rounded-xl border-2 border-gray-200 font-bold text-gray-700" data-testid="live-editor-stop-discard"
                onClick={() => { discard(); setAskStop(false); setEditing(false); }}>🗑️ Throw my changes away</button>
              <button type="button" className="py-3 rounded-xl font-semibold text-gray-500" onClick={() => setAskStop(false)}>Keep editing</button>
            </div>
          </div>
        </div>
      )}

      <TextDialog target={target?.type === 'text' ? target : null} onClose={() => setTarget(null)}
        onOpenSection={(n) => { setTarget(null); setSectionName(n); setPanel('section'); }} />
      <MediaDialog target={target?.type === 'media' ? target : null} onClose={() => setTarget(null)}
        onOpenSection={(n) => { setTarget(null); setSectionName(n); setPanel('section'); }} />
      <SectionDialog open={panel === 'section'} initial={sectionName} onClose={() => { setPanel(null); setSectionName(null); }} />
      <ThemeDialog open={panel === 'theme'} onClose={() => setPanel(null)} />
    </>
  );
};

export default LiveEditor;
