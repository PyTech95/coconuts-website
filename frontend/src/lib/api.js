import axios from 'axios';

// Everything comes from WordPress. The theme prints window.MC_CONFIG into the page.
export const CONFIG = (typeof window !== 'undefined' && window.MC_CONFIG) || {};
export const API = (CONFIG.api || process.env.REACT_APP_API_URL || '/wp-json/mc/v1').replace(/\/$/, '');
export const EDIT_KEY = 'mc_live_edit';

/** True when the visitor is logged in to WordPress as an editor. */
export const canEdit = () => !!(CONFIG.canEdit && CONFIG.nonce);

const editorHeaders = () => (CONFIG.nonce ? { 'X-WP-Nonce': CONFIG.nonce } : {});

export const fileUrl = (url) => url;

export const errorText = (err, fallback = 'Something went wrong. Please try again.') =>
  err?.response?.data?.message || err?.response?.data?.detail || fallback;

export const adminApi = {
  get: (p) => axios.get(`${API}${p}`, { headers: editorHeaders() }).then((r) => r.data),
  post: (p, body) => axios.post(`${API}${p}`, body, { headers: editorHeaders() }).then((r) => r.data),
  put: (p, body) => axios.put(`${API}${p}`, body, { headers: editorHeaders() }).then((r) => r.data),
  del: (p) => axios.delete(`${API}${p}`, { headers: editorHeaders() }).then((r) => r.data),
  upload: async (file) => {
    const fd = new FormData();
    fd.append('file', file, file.name);
    const data = await axios.post(`${API}/admin/upload`, fd, { headers: editorHeaders() }).then((r) => r.data);
    return data.url;
  },
};

export const goToLogin = () => {
  window.location.href = CONFIG.loginUrl || '/wp-login.php?redirect_to=' + encodeURIComponent(window.location.href);
};
