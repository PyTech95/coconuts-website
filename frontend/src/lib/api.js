// Central API configuration.
// REACT_APP_BACKEND_URL is set in frontend/.env on the server (e.g. https://api.example.com).
// If it is empty the app talks to the same origin (/api), which works when the
// backend is reverse-proxied under the same domain.
export const BACKEND_URL = (process.env.REACT_APP_BACKEND_URL || '').replace(/\/$/, '');
export const API = `${BACKEND_URL}/api`;

// Demo / preview build: no backend, content + login are simulated in the browser.
export const IS_DEMO = process.env.REACT_APP_DEMO === '1';

export const TOKEN_KEY = 'mc_admin_token';
export const getToken = () => {
  try { return localStorage.getItem(TOKEN_KEY); } catch { return null; }
};
export const setToken = (t) => { try { localStorage.setItem(TOKEN_KEY, t); } catch {} };
export const clearToken = () => { try { localStorage.removeItem(TOKEN_KEY); } catch {} };
export const authHeaders = () => {
  const t = getToken();
  return t ? { Authorization: `Bearer ${t}` } : {};
};

// Resolve an asset path. Content stores site-relative paths like
// "/images/brand/hero-1.jpg"; in a build served from a sub-folder (PUBLIC_URL)
// they are prefixed so they still resolve.
const PUBLIC_URL = (process.env.PUBLIC_URL || '').replace(/\/$/, '');
export const asset = (src) => {
  if (!src) return '';
  if (/^(https?:|data:|blob:)/i.test(src)) return src;
  if (src.startsWith('/api/')) return `${BACKEND_URL}${src}`;
  if (src.startsWith('/')) return `${PUBLIC_URL}${src}`;
  return src;
};

// Build a WhatsApp deep link with an optional prefilled message.
export const waLink = (phoneRaw, msg) =>
  `https://wa.me/${phoneRaw}${msg ? `?text=${encodeURIComponent(msg)}` : ''}`;

// Replace {placeholders} in content strings, e.g. "Now serving {city}".
export const tpl = (str, vars = {}) =>
  String(str ?? '').replace(/\{(\w+)\}/g, (m, k) => (vars[k] !== undefined ? vars[k] : m));
