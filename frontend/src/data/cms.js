// Editable website data. The default content lives in mock.js; changes saved in WordPress
// (window.MC_CONFIG.content.data) are applied on top before the first render.
import * as M from './mock';
import { CONFIG } from '../lib/api';

export const ALL_PAGES = '*';

// Every editable section, in the order it appears on the website, with child-friendly names.
export const SECTIONS = [
  { name: 'BRAND', emoji: '🏷️', title: 'Business name, logo & phone', help: 'Name, logo, phone / WhatsApp number and email used all over the website.', pages: [ALL_PAGES] },
  { name: 'NAV_LINKS', emoji: '🧭', title: 'Top menu', help: 'The links in the menu at the top of every page.', pages: [ALL_PAGES] },
  { name: 'SOCIAL', emoji: '📱', title: 'Instagram, Facebook & YouTube links', help: 'Where the social media buttons go.', pages: [ALL_PAGES] },
  { name: 'HERO_SLIDES', emoji: '🎞️', title: 'Big sliding pictures', help: 'The big pictures and videos at the top of the home page. Add, remove or reorder slides.', pages: ['/'] },
  { name: 'MARQUEE_ITEMS', emoji: '🏃', title: 'Moving words strip', help: 'The words that slide along the coloured strip under the menu.', pages: ['/'] },
  { name: 'HERO_FEATURES', emoji: '✅', title: 'Small points under the slider', help: 'The four short points under the big pictures.', pages: ['/'] },
  { name: 'HERO', emoji: '⭐', title: 'Home page heading & WhatsApp message', help: 'Main heading, button words and the message that opens in WhatsApp.', pages: ['/'] },
  { name: 'CUSTOMIZER', emoji: '🥥', title: 'Customize your coconut', help: 'Heading, words and the coconut picture of the customize section.', pages: ['/', '/customize'] },
  { name: 'ABOUT', emoji: '👋', title: 'About us', help: 'Story, promise points and pictures of the About Us section.', pages: ['/'] },
  { name: 'ABOUT_STATS', emoji: '🔢', title: 'About us numbers', help: 'The small number boxes in About Us.', pages: ['/'] },
  { name: 'FOUNDER', emoji: '🧑‍💼', title: 'Founder', help: 'Founder name, photo and short story.', pages: ['/'] },
  { name: 'EVENT_TYPES', emoji: '🎉', title: 'Events we do', help: 'The big event picture cards.', pages: ['/'] },
  { name: 'STATS', emoji: '📊', title: 'Big numbers', help: 'Numbers like 1000+ events served.', pages: ['/'] },
  { name: 'SERVICES', emoji: '🛎️', title: 'Services', help: 'Every service card. Each one also has its own story page.', pages: ['/', '/services'] },
  { name: 'PLANS', emoji: '💎', title: 'Plans & packages', help: 'Gold, Diamond and Platinum plans and what they include.', pages: ['/'] },
  { name: 'CITIES', emoji: '🏙️', title: 'Cities we serve', help: 'The list of cities. Each city gets its own page.', pages: ['/', '/cities'] },
  { name: 'OCCASIONS', emoji: '🎊', title: 'Occasions', help: 'The list of occasions.', pages: ['/'] },
  { name: 'WHY_CHOOSE', emoji: '🏆', title: 'Why choose us', help: 'Reasons to choose Mr. Coconetto.', pages: ['/'] },
  { name: 'TESTIMONIALS', emoji: '💬', title: 'What customers say', help: 'Customer reviews.', pages: ['/'] },
  { name: 'FAQS', emoji: '❓', title: 'Questions & answers', help: 'Frequently asked questions.', pages: ['/'] },
  { name: 'CONTACT', emoji: '📞', title: 'Contact form', help: 'Heading of the contact form and the event choices in it.', pages: ['/'] },
  { name: 'INSTAGRAM_FEED', emoji: '📸', title: 'Instagram pictures', help: 'The six pictures in the Instagram strip above the footer.', pages: ['/'] },
  { name: 'PRODUCTS', emoji: '🛍️', title: 'Products', help: 'Products shown on the Products page.', pages: ['/products'] },
  { name: 'CITY_PAGE', emoji: '🗺️', title: 'City page pictures', help: 'Big picture and gallery shown on every city page.', pages: ['/cities/'] },
].filter((s) => s.name in M);

export const sectionByName = (name) => SECTIONS.find((s) => s.name === name);

export const sectionsForPath = (path) => SECTIONS.filter((s) => s.pages.some((p) => p === ALL_PAGES || (p === '/' ? path === '/' : path.startsWith(p))));

const clone = (v) => (v === undefined ? v : JSON.parse(JSON.stringify(v)));

export const DEFAULTS = Object.fromEntries(SECTIONS.map((s) => [s.name, clone(M[s.name])]));

/** The value the website is showing right now for a section. */
export const getSection = (name) => M[name];

const sameKind = (a, b) => Array.isArray(a) === Array.isArray(b) && typeof a === typeof b && b !== null;

const replaceInPlace = (target, value) => {
  if (Array.isArray(target)) {
    target.splice(0, target.length, ...clone(value));
  } else {
    Object.keys(target).forEach((k) => { delete target[k]; });
    Object.assign(target, clone(value));
  }
};

const digits = (s) => String(s || '').replace(/\D/g, '');

/** Applies saved section data to the live website data (mutates the exported objects). */
export const applyData = (data = {}) => {
  SECTIONS.forEach(({ name }) => {
    const def = DEFAULTS[name];
    const saved = data && data[name];
    let next = def;
    if (saved !== undefined && sameKind(def, saved)) {
      next = Array.isArray(def) ? saved : { ...def, ...saved };
    }
    replaceInPlace(M[name], next);
  });
  // The WhatsApp link number always follows the phone number.
  if (M.BRAND) {
    const d = digits(M.BRAND.phone);
    if (d) M.BRAND.phoneRaw = d.length === 10 ? `91${d}` : d;
  }
};

// ---------- helpers used by the editors ----------

export const MEDIA_RE = /\.(jpe?g|png|webp|gif|svg|avif|mp4|webm|mov)(\?|#|$)/i;
export const VIDEO_RE = /\.(mp4|webm|mov)(\?|#|$)/i;
const MEDIA_KEYS = /^(image|images|img|photo|photos|picture|logo|video|videos|mascot|product|poster|avatar|cover|thumbnail|gallery|heroVideo|heroImage|src|background)$/i;

export const isMediaField = (key, value) =>
  MEDIA_KEYS.test(String(key || '')) || (typeof value === 'string' && (MEDIA_RE.test(value) || value.startsWith('/images/') || value.startsWith('/videos/')));

export const isVideo = (src = '') => VIDEO_RE.test(String(src || ''));

/** Walks every text in a value: cb(path, text). */
export const eachString = (value, cb, path = []) => {
  if (typeof value === 'string') cb(path, value);
  else if (Array.isArray(value)) value.forEach((v, i) => eachString(v, cb, [...path, i]));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => eachString(v, cb, [...path, k]));
};

/** Copy of `value` with every text equal to `from` (ignoring spaces at the ends) changed to `to`. */
export const replaceString = (value, from, to) => {
  const want = String(from).trim();
  let hit = false;
  const walk = (v) => {
    if (typeof v === 'string') {
      if (v.trim() === want) { hit = true; return v.replace(want, to); }
      return v;
    }
    if (Array.isArray(v)) return v.map(walk);
    if (v && typeof v === 'object') return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, walk(x)]));
    return v;
  };
  const out = walk(value);
  return hit ? out : null;
};

/** Sections whose current data contains this exact text. */
export const sectionsContaining = (text) => {
  const want = String(text || '').trim();
  if (!want) return [];
  return SECTIONS.filter(({ name }) => {
    let found = false;
    eachString(M[name], (_, s) => { if (!found && s.trim() === want) found = true; });
    return found;
  });
};

/** Every picture / video used in the sections: [{ section, path, src }]. */
export const allSectionMedia = () => {
  const out = [];
  SECTIONS.forEach(({ name }) => {
    eachString(M[name], (path, s) => {
      const key = path[path.length - 1];
      const parentKey = typeof key === 'number' ? path[path.length - 2] : key;
      if (isMediaField(parentKey, s)) out.push({ section: name, path, src: s });
    });
    // empty picture slots (e.g. products without a photo)
    const walkNull = (v, path) => {
      if (v === null && isMediaField(path[path.length - 1], null)) out.push({ section: name, path, src: '' });
      else if (Array.isArray(v)) v.forEach((x, i) => walkNull(x, [...path, i]));
      else if (v && typeof v === 'object') Object.entries(v).forEach(([k, x]) => walkNull(x, [...path, k]));
    };
    walkNull(M[name], []);
  });
  return out;
};

export const getAt = (obj, path) => path.reduce((o, k) => (o == null ? o : o[k]), obj);

export const setAt = (obj, path, value) => {
  if (!path.length) return value;
  const [k, ...rest] = path;
  const copy = Array.isArray(obj) ? [...obj] : { ...obj };
  copy[k] = setAt(obj ? obj[k] : undefined, rest, value);
  return copy;
};

// Field names → words a child understands.
const LABELS = {
  name: 'Name', title: 'Heading', subtitle: 'Small heading', tag: 'Small label', text: 'Words', description: 'Description',
  image: 'Picture', video: 'Video', photo: 'Photo', logo: 'Logo', mascot: 'Mascot picture', product: 'Product picture',
  features: 'Points', points: 'Points', promise: 'Promise points', q: 'Question', a: 'Answer', city: 'City', label: 'Words',
  value: 'Number', icon: 'Icon', href: 'Link (where it goes)', link: 'Link', url: 'Link', phone: 'Phone / WhatsApp number',
  email: 'Email', tagline: 'Tagline', brandLine: 'Brand line', heroVideo: 'Video (video section)', heading: 'Heading',
  subheading: 'Small heading', badge: 'Badge', primaryCta: 'Main button words', secondaryCta: 'Second button words',
  whatsappMsg: 'WhatsApp message', customization: 'What we can customize', minOrder: 'Minimum order', note: 'Note',
  footer: 'Bottom line', minimum: 'Minimum', highlight: 'Show as the special one', num: 'Number', role: 'Role',
  bio: 'Short story', story: 'Story', intro: 'Intro', script: 'Handwriting words', titleLine1: 'Heading line 1',
  titleLine2: 'Heading line 2', badges: 'Badges', eventTypes: 'Event choices', instagram: 'Instagram link',
  facebook: 'Facebook link', youtube: 'YouTube link', maxChars: 'Most letters allowed', engraveNote: 'Tip under heading',
};

export const fieldLabel = (key) => {
  if (typeof key === 'number') return `${key + 1}`;
  if (LABELS[key]) return LABELS[key];
  return String(key).replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').replace(/^./, (c) => c.toUpperCase());
};

// Fields worked out automatically — not shown in the editor.
export const HIDDEN_FIELDS = new Set(['phoneRaw', 'slug', 'id']);

export const LONG_FIELDS = /^(text|description|a|answer|bio|story|intro|subtitle|subheading|note|footer|whatsappMsg|engraveNote|quote)$/;

export const itemTitle = (item, i) => {
  if (typeof item === 'string') return item;
  if (!item || typeof item !== 'object') return `Item ${i + 1}`;
  return item.title || item.name || item.q || item.label || item.tag || item.text || item.value || `Item ${i + 1}`;
};

export const slugify = (s) => String(s).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

// Apply what WordPress saved before anything renders.
applyData(CONFIG.content?.data || {});
