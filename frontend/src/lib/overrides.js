// DOM override engine: swaps original texts / media srcs for admin-edited values.
const state = { texts: {}, images: {}, links: {} };
const linkMeta = new WeakMap();
const textMeta = new WeakMap();
const mediaMeta = new WeakMap();
const SKIP = 'script,style,noscript,textarea,input,select,option,[data-no-edit]';
let observer = null;

const skippable = (node) => {
  const el = node.nodeType === 3 ? node.parentElement : node;
  return !el || !!el.closest(SKIP);
};

const applyText = (node) => {
  if (skippable(node)) return;
  const cur = node.nodeValue;
  let meta = textMeta.get(node);
  if (!meta || cur !== meta.applied) { meta = { orig: cur, applied: cur }; textMeta.set(node, meta); }
  const key = meta.orig.trim();
  if (!key) return;
  const rep = state.texts[key];
  const target = rep != null ? meta.orig.replace(key, rep) : meta.orig;
  meta.applied = target;
  if (cur !== target) node.nodeValue = target;
};

const applyMedia = (el) => {
  if (skippable(el)) return;
  const cur = el.getAttribute('src');
  if (cur == null) return;
  let meta = mediaMeta.get(el);
  if (!meta || cur !== meta.applied) { meta = { orig: cur, applied: cur }; mediaMeta.set(el, meta); }
  const target = state.images[meta.orig] || meta.orig;
  meta.applied = target;
  if (cur !== target) el.setAttribute('src', target);
};

const BAD_URL = /^\s*(javascript|vbscript|data:text\/html)/i;

const applyLink = (el) => {
  if (skippable(el)) return;
  const cur = el.getAttribute('href');
  if (cur == null) return;
  let meta = linkMeta.get(el);
  if (!meta || cur !== meta.applied) { meta = { orig: cur, applied: cur }; linkMeta.set(el, meta); }
  const rep = state.links[meta.orig];
  const target = rep && !BAD_URL.test(rep) ? rep : meta.orig;
  meta.applied = target;
  if (cur !== target) el.setAttribute('href', target);
};

const applyTree = (root) => {
  if (!root) return;
  if (root.nodeType === 3) { applyText(root); return; }
  if (root.nodeType !== 1) return;
  if (root.matches('img,video,source')) applyMedia(root);
  if (root.matches('a[href]')) applyLink(root);
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let n = walker.nextNode();
  while (n) { applyText(n); n = walker.nextNode(); }
  root.querySelectorAll('img,video,source').forEach(applyMedia);
  root.querySelectorAll('a[href]').forEach(applyLink);
};

export const setOverrides = (texts, images, links) => {
  state.texts = texts || {};
  state.images = images || {};
  state.links = links || {};
  applyTree(document.body);
};

export const startOverrides = () => {
  if (observer) return;
  observer = new MutationObserver((muts) => {
    muts.forEach((m) => {
      if (m.type === 'characterData') applyText(m.target);
      else if (m.type === 'attributes') { if (m.attributeName === 'href') applyLink(m.target); else applyMedia(m.target); }
      else m.addedNodes.forEach(applyTree);
    });
  });
  observer.observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['src', 'href'] });
  applyTree(document.body);
};

export const originalText = (node) => (textMeta.get(node)?.orig ?? node.nodeValue).trim();
export const originalSrc = (el) => mediaMeta.get(el)?.orig ?? el.getAttribute('src');
export const originalHref = (el) => linkMeta.get(el)?.orig ?? el.getAttribute('href');

// ---- Theme colours ----
const hexToRgb = (hex) => {
  const h = hex.replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (rgb, to, amt) => rgb.map((c) => Math.round(c + (to - c) * amt));
const SHADES = { 50: 0.94, 100: 0.86, 200: 0.72, 300: 0.52, 400: 0.3, 500: 0.12, 600: 0, 700: -0.2, 800: -0.38, 900: -0.52, 950: -0.72 };

const setPalette = (name, hex) => {
  const root = document.documentElement.style;
  Object.entries(SHADES).forEach(([k, amt]) => {
    if (!hex) { root.removeProperty(`--${name}-${k}`); return; }
    const base = hexToRgb(hex);
    const rgb = amt >= 0 ? mix(base, 255, amt) : mix(base, 0, -amt);
    root.setProperty(`--${name}-${k}`, rgb.join(' '));
  });
};

export const applyTheme = (theme = {}) => {
  setPalette('green', theme.green);
  setPalette('pink', theme.pink);
  const root = document.documentElement.style;
  if (theme.blush) root.setProperty('--blush', theme.blush); else root.removeProperty('--blush');
};
