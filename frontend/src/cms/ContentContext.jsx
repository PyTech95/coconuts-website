import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import DEFAULT_CONTENT from './defaultContent';
import { API, IS_DEMO, getToken, clearToken, authHeaders } from '../lib/api';

const DEMO_KEY = 'mc_site_content_v1';
const ContentContext = createContext(null);

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------
const isObj = (v) => v && typeof v === 'object' && !Array.isArray(v);

/** Defaults + saved → objects merge recursively, arrays/primitives from "saved" win. */
export function mergeContent(defaults, saved) {
  if (!isObj(saved)) return defaults;
  const out = { ...defaults };
  for (const k of Object.keys(saved)) {
    const d = defaults ? defaults[k] : undefined;
    const s = saved[k];
    if (isObj(d) && isObj(s)) out[k] = mergeContent(d, s);
    else out[k] = s;
  }
  return out;
}

const toPath = (p) => (Array.isArray(p) ? p : String(p).split('.').filter(Boolean));

export function getIn(obj, path, fallback) {
  let cur = obj;
  for (const k of toPath(path)) {
    if (cur == null) return fallback;
    cur = cur[k];
  }
  return cur === undefined ? fallback : cur;
}

/** Immutable set with structural sharing along the path. */
export function setIn(obj, path, value) {
  const keys = toPath(path);
  if (keys.length === 0) return value;
  const [k, ...rest] = keys;
  const isIndex = /^\d+$/.test(k);
  const base = obj == null ? (isIndex ? [] : {}) : Array.isArray(obj) ? [...obj] : { ...obj };
  base[isIndex ? Number(k) : k] = rest.length ? setIn(obj == null ? undefined : obj[k], rest, value) : value;
  return base;
}

export function deleteIn(obj, path) {
  const keys = toPath(path);
  const last = keys.pop();
  const parent = getIn(obj, keys);
  if (parent == null) return obj;
  let next;
  if (Array.isArray(parent)) { next = parent.filter((_, i) => String(i) !== String(last)); }
  else { next = { ...parent }; delete next[last]; }
  return keys.length ? setIn(obj, keys, next) : next;
}

const hexToRgb = (hex) => {
  const h = String(hex || '').replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const n = parseInt(full, 16);
  if (Number.isNaN(n) || full.length !== 6) return null;
  return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

export const GOOGLE_FONTS = [
  'Poppins', 'Inter', 'Montserrat', 'Lato', 'Nunito', 'Raleway', 'Open Sans', 'Josefin Sans', 'Quicksand',
  'Playfair Display', 'Lora', 'Merriweather', 'Cormorant Garamond', 'DM Serif Display', 'Libre Baskerville',
  'Dancing Script', 'Great Vibes', 'Pacifico', 'Caveat', 'Satisfy', 'Sacramento',
];
export const SYSTEM_FONTS = ['Georgia', 'Arial', 'Verdana', 'Times New Roman', 'Trebuchet MS'];
const loadedFonts = new Set(['Poppins', 'Playfair Display', 'Dancing Script']);
export function ensureFont(family) {
  if (!family || loadedFonts.has(family) || SYSTEM_FONTS.includes(family) || !GOOGLE_FONTS.includes(family)) return;
  loadedFonts.add(family);
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family).replace(/%20/g, '+')}:wght@400;500;600;700;800&display=swap`;
  document.head.appendChild(link);
}

function applyTheme(theme) {
  if (!theme || typeof document === 'undefined') return;
  const root = document.documentElement.style;
  const map = {
    green500: '--c-green-500', green600: '--c-green-600', green700: '--c-green-700',
    pink500: '--c-pink-500', pink600: '--c-pink-600', pink700: '--c-pink-700',
    pink50: '--c-pink-50', pink100: '--c-pink-100', green50: '--c-green-50', green100: '--c-green-100',
    beige: '--c-beige', dark: '--c-dark', bodyBg: '--c-body-bg', bodyText: '--c-body-text',
  };
  for (const [k, v] of Object.entries(map)) {
    const rgb = hexToRgb(theme[k]);
    if (rgb) root.setProperty(v, rgb);
  }
  const fonts = { fontBody: '--font-body', fontDisplay: '--font-display', fontScript: '--font-script' };
  for (const [k, v] of Object.entries(fonts)) {
    if (theme[k]) { ensureFont(theme[k]); root.setProperty(v, `'${theme[k]}'`); }
  }
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export function ContentProvider({ children }) {
  const [content, setContent] = useState(DEFAULT_CONTENT);
  const [loaded, setLoaded] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selected, setSelected] = useState(null); // { path, kind, label }
  const [status, setStatus] = useState(null); // { type: 'ok'|'error', msg }
  const lastSaved = useRef(DEFAULT_CONTENT);
  const history = useRef({ past: [], future: [] });

  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const editRequested = searchParams.get('edit') === '1';
  const isAdmin = IS_DEMO || !!getToken();
  const editMode = editRequested && isAdmin;

  // Redirect to login when someone opens ?edit=1 without being signed in.
  useEffect(() => {
    if (editRequested && !isAdmin) {
      const next = encodeURIComponent(location.pathname + location.search);
      navigate(`/admin/login?next=${next}`, { replace: true });
    }
  }, [editRequested, isAdmin, location.pathname, location.search, navigate]);

  // ----- load -----
  const load = useCallback(async () => {
    let saved = null;
    try {
      if (IS_DEMO) {
        const raw = localStorage.getItem(DEMO_KEY);
        saved = raw ? JSON.parse(raw) : null;
      } else {
        const { data } = await axios.get(`${API}/content`, { timeout: 8000 });
        saved = data && data.content ? data.content : null;
      }
    } catch (e) {
      // Backend unreachable → defaults are used.
      saved = null;
    }
    const merged = mergeContent(DEFAULT_CONTENT, saved || {});
    lastSaved.current = merged;
    setContent(merged);
    setDirty(false);
    history.current = { past: [], future: [] };
    setLoaded(true);
  }, []);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { applyTheme(content.theme); }, [content.theme]);
  useEffect(() => {
    // Make sure fonts chosen in per-element styles are loaded.
    const styles = content.styles || {};
    Object.values(styles).forEach((s) => s && s.fontFamily && ensureFont(s.fontFamily));
  }, [content.styles]);

  // ----- mutations -----
  const pushHistory = useCallback((prev) => {
    const h = history.current;
    h.past.push(prev);
    if (h.past.length > 60) h.past.shift();
    h.future = [];
  }, []);

  const set = useCallback((path, value) => {
    setContent((prev) => {
      if (getIn(prev, path) === value) return prev;
      pushHistory(prev);
      return setIn(prev, path, value);
    });
    setDirty(true);
  }, [pushHistory]);

  const setMany = useCallback((updater) => {
    setContent((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : mergeContent(prev, updater);
      if (next === prev) return prev;
      pushHistory(prev);
      return next;
    });
    setDirty(true);
  }, [pushHistory]);

  const remove = useCallback((path) => {
    setContent((prev) => { pushHistory(prev); return deleteIn(prev, path); });
    setDirty(true);
  }, [pushHistory]);

  const setStyle = useCallback((id, patch) => {
    setContent((prev) => {
      pushHistory(prev);
      const cur = (prev.styles && prev.styles[id]) || {};
      const next = { ...cur, ...patch };
      Object.keys(next).forEach((k) => { if (next[k] === undefined || next[k] === '' || next[k] === null) delete next[k]; });
      const styles = { ...(prev.styles || {}) };
      if (Object.keys(next).length) styles[id] = next; else delete styles[id];
      return { ...prev, styles };
    });
    setDirty(true);
  }, [pushHistory]);

  const clearStyle = useCallback((id) => setStyle(id, {}), [setStyle]);

  const undo = useCallback(() => {
    const h = history.current;
    if (!h.past.length) return;
    setContent((cur) => { const prev = h.past.pop(); h.future.push(cur); return prev; });
    setDirty(true);
  }, []);
  const redo = useCallback(() => {
    const h = history.current;
    if (!h.future.length) return;
    setContent((cur) => { const next = h.future.pop(); h.past.push(cur); return next; });
    setDirty(true);
  }, []);

  const flash = (type, msg) => { setStatus({ type, msg }); setTimeout(() => setStatus(null), 3500); };

  const save = useCallback(async () => {
    setSaving(true);
    try {
      if (IS_DEMO) {
        localStorage.setItem(DEMO_KEY, JSON.stringify(content));
      } else {
        await axios.put(`${API}/content`, { content }, { headers: authHeaders() });
      }
      lastSaved.current = content;
      setDirty(false);
      flash('ok', 'Saved — changes are live.');
      return true;
    } catch (e) {
      const code = e.response?.status;
      if (code === 401) {
        clearToken();
        flash('error', 'Session expired. Please log in again.');
        navigate(`/admin/login?next=${encodeURIComponent(location.pathname + location.search)}`);
      } else if (IS_DEMO) {
        flash('error', 'Could not save in demo mode (browser storage full — large uploads are not stored in the demo).');
      } else {
        flash('error', 'Save failed. Please try again.');
      }
      return false;
    } finally {
      setSaving(false);
    }
  }, [content, navigate, location.pathname, location.search]);

  const discard = useCallback(() => {
    setContent(lastSaved.current);
    setDirty(false);
    history.current = { past: [], future: [] };
    setSelected(null);
  }, []);

  const resetToDefaults = useCallback(() => {
    setContent((prev) => { pushHistory(prev); return DEFAULT_CONTENT; });
    setDirty(true);
  }, [pushHistory]);

  const exitEdit = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.delete('edit');
    const qs = sp.toString();
    setSelected(null);
    navigate(`${location.pathname}${qs ? `?${qs}` : ''}${location.hash || ''}`, { replace: true });
  }, [location, navigate]);

  const enterEdit = useCallback(() => {
    const sp = new URLSearchParams(location.search);
    sp.set('edit', '1');
    navigate(`${location.pathname}?${sp.toString()}`);
  }, [location, navigate]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty) return undefined;
    const h = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', h);
    return () => window.removeEventListener('beforeunload', h);
  }, [dirty]);

  const value = useMemo(() => ({
    content, c: content, loaded, dirty, saving, status, selected, setSelected,
    editMode, isAdmin, enterEdit, exitEdit,
    get: (path, fallback) => getIn(content, path, fallback),
    styles: content.styles || {},
    set, setMany, remove, setStyle, clearStyle, undo, redo, save, discard, reload: load, resetToDefaults,
    canUndo: history.current.past.length > 0,
    canRedo: history.current.future.length > 0,
  }), [content, loaded, dirty, saving, status, selected, editMode, isAdmin, enterEdit, exitEdit, set, setMany, remove, setStyle, clearStyle, undo, redo, save, discard, load, resetToDefaults]);

  // Render nothing until the saved content has been fetched (max ~1.5s) to avoid a flash of default text.
  const [timedOut, setTimedOut] = useState(false);
  useEffect(() => { const t = setTimeout(() => setTimedOut(true), 1500); return () => clearTimeout(t); }, []);
  if (!loaded && !timedOut) return <div style={{ minHeight: '100vh', background: '#fff' }} />;

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used inside <ContentProvider>');
  return ctx;
}

export default ContentContext;
