import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import axios from 'axios';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const Ctx = createContext(null);
export const useSiteContent = () => useContext(Ctx) || {};

const mergeDeep = (base, patch) => {
  const out = { ...(base || {}) };
  Object.keys(patch || {}).forEach((k) => {
    if (patch[k] && typeof patch[k] === 'object' && !Array.isArray(patch[k]) && typeof out[k] === 'object') {
      out[k] = mergeDeep(out[k], patch[k]);
    } else {
      out[k] = patch[k];
    }
  });
  return out;
};

const buildPatch = (path, value) => {
  const keys = path.split('.');
  const patch = {};
  let cur = patch;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value;
    else { cur[k] = {}; cur = cur[k]; }
  });
  return patch;
};

export const uploadToStorage = async (file) => {
  const fd = new FormData();
  fd.append('file', file);
  const { data } = await axios.post(`${API}/upload-logo`, fd);
  return `${process.env.REACT_APP_BACKEND_URL}${data.url}`;
};

export const SiteContentProvider = ({ children }) => {
  const [content, setContent] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [token, setToken] = useState(() => (typeof window !== 'undefined' ? localStorage.getItem('mc_admin_token') : null));

  const refresh = useCallback(async () => {
    try { const { data } = await axios.get(`${API}/content`); setContent(data); } catch { /* keep fallback */ }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const syncToken = useCallback(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('mc_admin_token') : null;
    setToken(t);
    if (!t) setEditMode(false);
    return t;
  }, []);

  const saveContent = useCallback(async (path, value) => {
    const patch = buildPatch(path, value);
    setContent((prev) => mergeDeep(prev, patch));
    const t = typeof window !== 'undefined' ? localStorage.getItem('mc_admin_token') : null;
    try { await axios.put(`${API}/content`, patch, { headers: { Authorization: `Bearer ${t}` } }); }
    catch (e) { /* silent */ }
  }, []);

  const value = {
    content, setContent, refresh, editMode,
    setEditMode: (v) => { const t = syncToken(); if (t) setEditMode(v); },
    token, syncToken, saveContent, uploadImage: uploadToStorage,
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};
