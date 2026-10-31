// Backwards-compatible shim. All content now lives in src/cms/defaultContent.js
// and is edited through the CMS (useContent()). Components should read from
// useContent(); these static exports are only the *defaults* and are kept so
// any legacy import keeps compiling.
import DEFAULT_CONTENT, { slugify } from '../cms/defaultContent';
import { waLink as wa } from '../lib/api';

export { slugify };
export const BRAND = { ...DEFAULT_CONTENT.brand, heroVideo: DEFAULT_CONTENT.video.src };
export const SOCIAL = DEFAULT_CONTENT.social;
export const waLink = (msg) => wa(DEFAULT_CONTENT.brand.phoneRaw, msg);
export const PRODUCTS = DEFAULT_CONTENT.products.items;
export const NAV_LINKS = DEFAULT_CONTENT.header.navLinks;
export const HERO = DEFAULT_CONTENT.hero;
export const CUSTOMIZER = DEFAULT_CONTENT.customizer;
export const MARQUEE_ITEMS = DEFAULT_CONTENT.hero.marquee;
export const HERO_FEATURES = DEFAULT_CONTENT.hero.features;
export const EVENT_TYPES = DEFAULT_CONTENT.eventTypes.items;
export const STATS = DEFAULT_CONTENT.stats.items;
export const SERVICES = DEFAULT_CONTENT.services.items;
export const PLANS = DEFAULT_CONTENT.plans.items;
export const CITIES = DEFAULT_CONTENT.cities.items;
export const WHY_CHOOSE = DEFAULT_CONTENT.whyChoose.items;
export const OCCASIONS = DEFAULT_CONTENT.occasions.items;
export const TESTIMONIALS = DEFAULT_CONTENT.testimonials.items;
export const FAQS = DEFAULT_CONTENT.faqs.items;
export const ABOUT = DEFAULT_CONTENT.about;
export const ABOUT_STATS = DEFAULT_CONTENT.about.stats;
export const FOUNDER = DEFAULT_CONTENT.about.founder;
export const CONTACT = DEFAULT_CONTENT.contact;
export const BLOGS = DEFAULT_CONTENT.blog.posts;
