import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { API, CONFIG, adminApi, canEdit, EDIT_KEY } from '../lib/api';
import { applyTheme, setOverrides, startOverrides } from '../lib/overrides';
import {
  DEFAULTS, applyData, eachString, getAt, getSection, replaceString, sectionsContaining, setAt,
} from '../data/cms';

const Ctx = createContext(null);
const KEYS = ['texts', 'images', 'links', 'theme', 'data'];
const clone = (v) => JSON.parse(JSON.stringify(v));
const normalize = (c) => Object.fromEntries(KEYS.map((k) => [k, (c && c[k] && typeof c[k] === 'object' && !Array.isArray(c[k])) ? c[k] : {}]));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const readEditFlag = () => {
  try { return localStorage.getItem(EDIT_KEY) === '1'; } catch { return false; }
};
const writeEditFlag = (on) => {
  try { if (on) localStorage.setItem(EDIT_KEY, '1'); else localStorage.removeItem(EDIT_KEY); } catch { /* private mode */ }
};

/** Puts default text back wherever the section currently shows `text`. */
const resetStringInSection = (name, text) => {
  const want = String(text).trim();
  let value = getSection(name);
  eachString(value, (path, s) => {
    if (s.trim() !== want) return;
    const def = getAt(DEFAULTS[name], path);
    if (typeof def === 'string') value = setAt(value, path, def);
  });
  return value;
};

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => normalize(clone(CONFIG.content || {})));
  const saved = useRef(normalize(clone(CONFIG.content || {})));
  const [editing, setEditingState] = useState(() => canEdit() && readEditFlag());
  const [dataVersion, setDataVersion] = useState(0);
  const undoStack = useRef([]);
  const [undoCount, setUndoCount] = useState(0);

  const dirty = !same(content, saved.current);

  // Re-draw the page after section data changed, keeping the scroll position.
  const redraw = useCallback(() => {
    const y = window.scrollY;
    setDataVersion((v) => v + 1);
    [0, 60, 250, 600, 1200].forEach((t) => setTimeout(() => window.scrollTo(0, y), t));
  }, []);

  useEffect(() => { startOverrides(); }, []);
  useEffect(() => {
    setOverrides(content.texts, content.images, content.links);
    applyTheme(content.theme);
  }, [content]);

  const contentRef = useRef(content);
  contentRef.current = content;

  /** Every change goes through here so it can be undone. */
  const change = useCallback((fn, { redrawPage = false } = {}) => {
    const cur = contentRef.current;
    const next = fn(clone(cur));
    if (same(next, cur)) return;
    undoStack.current.push(cur);
    if (undoStack.current.length > 60) undoStack.current.shift();
    setUndoCount(undoStack.current.length);
    if (!same(next.data, cur.data)) applyData(next.data);
    contentRef.current = next;
    setContent(next);
    if (redrawPage) redraw();
  }, [redraw]);

  const undo = useCallback(() => {
    const prev = undoStack.current.pop();
    setUndoCount(undoStack.current.length);
    if (!prev) return;
    setContent(prev);
    applyData(prev.data);
    redraw();
  }, [redraw]);

  const replaceAll = useCallback((next, { asSaved = false } = {}) => {
    const n = normalize(next);
    if (asSaved) saved.current = clone(n);
    undoStack.current = [];
    setUndoCount(0);
    setContent(n);
    applyData(n.data);
    redraw();
  }, [redraw]);

  const load = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/content`, { params: { t: Date.now() } });
      replaceAll(data, { asSaved: true });
    } catch { /* keep what we have */ }
  }, [replaceAll]);

  const discard = useCallback(() => replaceAll(clone(saved.current)), [replaceAll]);

  const save = useCallback(async () => {
    const data = await adminApi.put('/admin/content', content);
    saved.current = normalize(clone(data));
    setContent(normalize(clone(data)));
    return data;
  }, [content]);

  // ----- words -----
  const setText = useCallback((key, value) => change((c) => {
    const k = String(key).trim();
    const prev = c.texts[k];
    // If these words were already changed once, update that change instead of stacking a new one.
    const chained = Object.keys(c.texts).filter((o) => o !== k && String(c.texts[o]).trim() === k);
    if (value == null || value === k) delete c.texts[k];
    else if (chained.length) chained.forEach((o) => { if (value === o) delete c.texts[o]; else c.texts[o] = value; });
    else c.texts[k] = value;
    // The same words inside a section are changed too, so the section editor shows them.
    if (value != null) {
      [k, prev].filter(Boolean).forEach((from) => {
        sectionsContaining(from).forEach(({ name }) => {
          const base = c.data[name] !== undefined ? c.data[name] : getSection(name);
          const next = replaceString(base, from, value);
          if (next) c.data[name] = next;
        });
      });
    }
    return c;
  }), [change]);

  const resetText = useCallback((key) => change((c) => {
    const k = String(key).trim();
    delete c.texts[k];
    Object.keys(c.texts).forEach((orig) => { if (String(c.texts[orig]).trim() === k) delete c.texts[orig]; });
    sectionsContaining(k).forEach(({ name }) => {
      const next = resetStringInSection(name, k);
      if (same(next, DEFAULTS[name])) delete c.data[name]; else c.data[name] = next;
    });
    return c;
  }, { redrawPage: true }), [change]);

  // ----- pictures & videos -----
  const setImage = useCallback((key, value) => change((c) => {
    const chained = Object.keys(c.images).filter((o) => o !== key && c.images[o] === key);
    if (!value || value === key) delete c.images[key];
    else if (chained.length) chained.forEach((o) => { if (value === o) delete c.images[o]; else c.images[o] = value; });
    else c.images[key] = value;
    if (value) {
      sectionsContaining(key).forEach(({ name }) => {
        const base = c.data[name] !== undefined ? c.data[name] : getSection(name);
        const next = replaceString(base, key, value);
        if (next) c.data[name] = next;
      });
    }
    return c;
  }, { redrawPage: true }), [change]);

  const resetImage = useCallback((key) => change((c) => {
    delete c.images[key];
    Object.keys(c.images).forEach((orig) => { if (c.images[orig] === key) delete c.images[orig]; });
    sectionsContaining(key).forEach(({ name }) => {
      const next = resetStringInSection(name, key);
      if (same(next, DEFAULTS[name])) delete c.data[name]; else c.data[name] = next;
    });
    return c;
  }, { redrawPage: true }), [change]);

  // ----- button links -----
  const setLink = useCallback((key, value) => change((c) => {
    if (!value || value === key) delete c.links[key]; else c.links[key] = value;
    return c;
  }), [change]);

  // ----- whole sections -----
  const setSection = useCallback((name, value) => change((c) => {
    if (same(value, DEFAULTS[name])) delete c.data[name]; else c.data[name] = value;
    return c;
  }, { redrawPage: true }), [change]);

  const resetSection = useCallback((name) => change((c) => { delete c.data[name]; return c; }, { redrawPage: true }), [change]);

  const setTheme = useCallback((theme) => change((c) => { c.theme = theme || {}; return c; }), [change]);

  const setEditing = useCallback((on) => { writeEditFlag(on); setEditingState(on); }, []);

  const value = useMemo(() => ({
    content, dirty, editing, setEditing, load, save, discard, undo, canUndo: undoCount > 0, dataVersion,
    setText, resetText, setImage, resetImage, setLink, setSection, resetSection, setTheme, replaceAll,
  }), [content, dirty, editing, setEditing, load, save, discard, undo, undoCount, dataVersion,
    setText, resetText, setImage, resetImage, setLink, setSection, resetSection, setTheme, replaceAll]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useSiteContent = () => useContext(Ctx);

/** Re-mounts the public pages when section data changes so lists redraw instantly. */
export const LiveArea = ({ children }) => {
  const { dataVersion } = useSiteContent();
  return <React.Fragment key={dataVersion}>{children}</React.Fragment>;
};
