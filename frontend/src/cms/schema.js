// ---------------------------------------------------------------------------
// Editor schema — describes every editable section of the site so the admin
// "Backend Editor" and the Live Editor's list manager can render forms
// automatically. Paths are relative to the section id (e.g. hero.slides).
//
// Field types: text | textarea | image | video | color | number | boolean |
//              select | icon | list | blocks | link
// ---------------------------------------------------------------------------
import { ICON_NAMES } from './icons';
import { slugify } from './defaultContent';

const t = (key, label, extra = {}) => ({ key, label, type: 'text', ...extra });
const ta = (key, label, extra = {}) => ({ key, label, type: 'textarea', ...extra });
const img = (key, label, extra = {}) => ({ key, label, type: 'image', ...extra });
const vid = (key, label, extra = {}) => ({ key, label, type: 'video', ...extra });
const color = (key, label, extra = {}) => ({ key, label, type: 'color', ...extra });
const bool = (key, label, extra = {}) => ({ key, label, type: 'boolean', ...extra });
const num = (key, label, extra = {}) => ({ key, label, type: 'number', ...extra });
const icon = (key, label = 'Icon') => ({ key, label, type: 'icon', options: ICON_NAMES });
const strList = (key, label, extra = {}) => ({ key, label, type: 'list', item: { type: 'string' }, newItem: () => 'New item', ...extra });
const list = (key, label, fields, newItem, extra = {}) => ({ key, label, type: 'list', item: { fields }, newItem, ...extra });

const KICKER = [t('kicker', 'Small heading (script text)'), t('title', 'Title'), t('titleEm', 'Title — highlighted part (green)')];

export const SECTIONS = [
  {
    id: 'brand', label: 'Brand & Contact Info', group: 'General',
    fields: [
      t('name', 'Brand name'), t('tagline', 'Tagline'), t('brandLine', 'Brand line (with emoji)'),
      img('logo', 'Logo'), t('phone', 'Phone (display)'), t('phoneRaw', 'WhatsApp number (digits only, with country code)'),
      t('email', 'Email'), t('address', 'Address (short)'), t('addressLong', 'Address (long)'),
    ],
  },
  {
    id: 'social', label: 'Social Links', group: 'General',
    fields: [t('instagram', 'Instagram URL'), t('instagramHandle', 'Instagram handle'), t('facebook', 'Facebook URL'), t('youtube', 'YouTube URL')],
  },
  {
    id: 'seo', label: 'SEO (title & description)', group: 'General',
    fields: [t('title', 'Page title'), ta('description', 'Meta description'), ta('keywords', 'Meta keywords')],
  },
  {
    id: 'header', label: 'Header & Navigation', group: 'Home page',
    fields: [
      t('supportLabel', 'Top strip — support link'), t('quoteBtn', 'Quote button label'), ta('quoteMsg', 'Quote button WhatsApp message'),
      list('navLinks', 'Menu links (anchors)', [t('label', 'Label'), t('href', 'Link (e.g. /#about)')], () => ({ label: 'New link', href: '/#home' })),
      list('pageLinks', 'Page links', [t('label', 'Label'), t('href', 'Page (e.g. /blog)')], () => ({ label: 'New page', href: '/' })),
    ],
  },
  {
    id: 'hero', label: 'Hero Slider', group: 'Home page',
    fields: [
      list('slides', 'Slides', [
        { key: 'type', label: 'Type', type: 'select', options: ['image', 'video'] },
        { key: 'src', label: 'Image / Video file', type: 'media' },
        img('poster', 'Poster image (videos only, optional)'),
        t('kicker', 'Small label'), t('title', 'Title line 1'), t('titleAccent', 'Title line 2 (highlighted)'),
        ta('subtitle', 'Subtitle'), num('duration', 'Duration in seconds (images; max for videos)'),
      ], () => ({ id: `s${Date.now()}`, type: 'image', src: '/images/brand/hero-2.jpg', kicker: 'New slide', title: 'Headline', titleAccent: 'Highlight', subtitle: '', duration: 6 })),
      t('brandLine', 'Brand line'), t('primaryCta', 'Primary button (WhatsApp)'), ta('whatsappMsg', 'WhatsApp message'),
      t('secondaryCta', 'Secondary button'), t('secondaryHref', 'Secondary button link'),
      list('chips', 'Floating glass chips (top-right, desktop)', [icon('icon'), t('text', 'Text')], () => ({ icon: 'Star', text: 'New chip' })),
      strList('marquee', 'Scrolling ribbon items'),
      list('features', 'Feature chips', [icon('icon'), t('text', 'Text')], () => ({ icon: 'Check', text: 'New feature' })),
    ],
  },
  {
    id: 'customizer', label: 'Customize Your Coconut', group: 'Home page',
    fields: [t('label', 'Label'), t('title', 'Title'), t('script', 'Script word'), ta('subtitle', 'Subtitle'), img('image', 'Coconut image'), num('maxChars', 'Max print characters'), ta('engraveNote', 'Note under preview'),
      { key: 'ui', label: 'Form & preview labels', type: 'group', fields: [
        t('previewBadge', 'Preview badge'), t('dragHint', 'Drag hint'), t('printLabel', 'Print field label'), t('printHint', 'Print field hint ({max})'), ta('printPlaceholder', 'Print placeholder'),
        t('eventLabel', 'Event label'), t('eventPlaceholder', 'Event placeholder'), t('mobileLabel', 'Mobile label'), t('mobilePlaceholder', 'Mobile placeholder'),
        t('logoLabel', 'Logo label'), t('logoHint', 'Logo hint'), t('uploadBtn', 'Upload button'), ta('footnote', 'Footnote'), t('submitBtn', 'Submit button'), t('submitting', 'Submitting text'),
        t('successTitle', 'Success title'), t('successSub', 'Success sub-title'), ta('successText', 'Success text'), t('openWhatsapp', 'Open WhatsApp button'), t('designAnother', 'Design another button'),
      ] }],
  },
  {
    id: 'eventTypes', label: 'Event Types (3 cards)', group: 'Home page',
    fields: [t('badge', 'Corner badge'), list('items', 'Cards', [t('title', 'Title'), t('subtitle', 'Subtitle'), img('image', 'Image')], () => ({ title: 'New event', subtitle: '', image: '/images/brand/hero-2.jpg' }))],
  },
  {
    id: 'stats', label: 'Stats Band', group: 'Home page',
    fields: [list('items', 'Stats', [t('value', 'Value'), t('label', 'Label')], () => ({ value: '0', label: 'New stat' }))],
  },
  {
    id: 'about', label: 'About Us', group: 'Home page',
    fields: [
      t('label', 'Label'), t('titleLine1', 'Title line 1'), t('titleLine2', 'Title line 2'), t('script', 'Script line'),
      ta('intro', 'Intro'), ta('story', 'Story'), img('mascot', 'Mascot image'), img('product', 'Product image'), t('chip', 'Floating chip text'),
      list('points', 'Points', [icon('icon'), t('title', 'Title'), ta('description', 'Description')], () => ({ icon: 'Sparkles', title: 'New point', description: '' })),
      list('badges', 'Badges', [icon('icon'), t('label', 'Label')], () => ({ icon: 'Star', label: 'New' })),
      list('stats', 'Stats (dark band)', [icon('icon'), t('value', 'Value'), t('label', 'Label')], () => ({ icon: 'Star', value: '0', label: 'New' })),
      { key: 'founder', label: 'Founder', type: 'group', fields: [t('kicker', 'Kicker'), t('name', 'Name'), t('role', 'Role'), img('photo', 'Photo'), ta('bio', 'Bio')] },
    ],
  },
  {
    id: 'video', label: 'Video Section', group: 'Home page',
    fields: [t('kicker', 'Kicker'), t('title', 'Title before'), t('titleEm', 'Title highlighted'), t('titleAfter', 'Title after'), ta('desc', 'Description'), t('watchBtn', 'Watch button'), t('youtubeLabel', 'YouTube link label'), t('youtubeUrl', 'YouTube URL'), vid('src', 'Video file'), img('poster', 'Poster image')],
  },
  {
    id: 'services', label: 'Services', group: 'Home page',
    fields: [
      ...KICKER, ta('desc', 'Description'), t('quoteBtn', 'Quote button'), t('storyBtn', 'Story button'), t('customizationLabel', '"Customization:" label'),
      list('items', 'Service cards', [t('tag', 'Tag'), t('title', 'Title'), img('image', 'Image'), ta('description', 'Description'), t('customization', 'Customization'), t('minOrder', 'Minimum order')],
        () => ({ tag: 'New', title: 'New Service', image: '/images/brand/service-1.jpg', description: '', customization: '', minOrder: 'Min. 100 coconuts' })),
      ta('storyIntro', 'Story page — intro ({tag}, {description})'), ta('storyBody', 'Story page — body ({customization})'), ta('storyOutro', 'Story page — outro'),
      t('storyCtaTitle', 'Story page — CTA title ({tag})'), t('storyCtaDesc', 'Story page — CTA text'),
      t('storyBackLabel', 'Story page — back link'), t('storyCustomizationLabel', 'Story page — customization label'), t('storyMinOrderLabel', 'Story page — minimum label'),
      t('storyWaBtn', 'Story page — WhatsApp button'), t('storyCustomizeBtn', 'Story page — customize button'), t('storyMoreTitle', 'Story page — more services title'), t('storyReadMore', 'Story page — read story label'),
    ],
  },
  {
    id: 'plans', label: 'Plans / Pricing', group: 'Home page',
    fields: [
      t('kicker', 'Kicker'), t('title', 'Title'), t('titleEm', 'Title highlighted'), ta('desc', 'Description'), t('descLink', 'Description link text'),
      t('includedLabel', '"What\'s included" label'), t('noteLabel', 'Note label'), t('btnPrefix', 'Button prefix'), t('footnote', 'Footnote'), t('footnoteLink', 'Footnote link text'),
      list('items', 'Plans', [
        t('name', 'Name'), { key: 'theme', label: 'Colour theme', type: 'select', options: ['gold', 'diamond', 'platinum'] }, t('subtitle', 'Subtitle'),
        bool('highlight', 'Highlight (raised card)'), t('badge', 'Badge text'), ta('description', 'Description'), strList('features', 'Features'),
        ta('note', 'Note'), ta('footer', 'Footer text'), t('minimum', 'Minimum'), t('price', 'Price (optional)'),
      ], () => ({ name: 'New Plan', theme: 'gold', subtitle: '', highlight: false, badge: '', description: '', features: ['Feature'], note: '', footer: '', minimum: 'Minimum 100 Coconuts' })),
    ],
  },
  {
    id: 'products', label: 'Products', group: 'Pages',
    fields: [
      ...KICKER, ta('desc', 'Description'), t('enquireBtn', 'Enquire button'), t('comingSoon', '"Photo coming soon" text'),
      t('detailsLink', '"View details" link text'), t('detailKicker', 'Detail page — kicker'), t('detailBack', 'Detail page — back link'), t('detailEnquireBtn', 'Detail page — WhatsApp button'),
      t('detailCustomizeBtn', 'Detail page — customize button'), ta('detailFootnote', 'Detail page — footnote'), ta('detailEnquireMsg', 'Detail page — WhatsApp message ({name})'),
      list('items', 'Products', [t('name', 'Name'), t('slug', 'Slug (URL id)'), icon('icon'), t('tagline', 'Tagline / badge'), img('image', 'Main image'),
        { key: 'gallery', label: 'Gallery images', type: 'list', item: { type: 'image' }, newItem: () => '' },
        t('price', 'Price (optional)'), ta('description', 'Description'), strList('features', 'Features'), t('note', 'Note (script line, optional)')],
        () => ({ slug: `product-${Date.now().toString(36)}`, icon: 'Gift', name: 'New Product', tagline: 'New', image: '', gallery: [], price: '', description: '', features: ['Feature 1'], note: '' }),
        { itemLabel: (it) => it.name }),
    ],
  },
  {
    id: 'blog', label: 'Blog', group: 'Pages',
    fields: [
      t('kicker', 'Home teaser — kicker'), t('title', 'Home teaser — title'), t('titleEm', 'Home teaser — highlighted'), t('viewAll', 'View all link'),
      t('pageKicker', 'Blog page — kicker'), t('pageTitle', 'Blog page — title'), t('pageTitleEm', 'Blog page — highlighted'), ta('pageDesc', 'Blog page — description'),
      t('readMore', 'Read more label'), t('backLabel', 'Back label'), t('relatedTitle', 'Related posts title'), t('ctaTitle', 'Post CTA title'), t('ctaBtn', 'Post CTA button'),
      list('posts', 'Posts', [
        t('title', 'Title'), t('slug', 'Slug (URL)'), bool('published', 'Published'), img('image', 'Cover image'), t('date', 'Date (YYYY-MM-DD)'), t('readTime', 'Read time'),
        ta('excerpt', 'Excerpt'), strList('keywords', 'Keywords'), { key: 'content', label: 'Content', type: 'blocks' },
      ], () => {
        const d = new Date().toISOString().slice(0, 10);
        return { slug: `new-post-${Date.now().toString(36)}`, title: 'New Blog Post', excerpt: '', image: '/images/brand/hero-1.jpg', date: d, readTime: '3 min read', published: true, keywords: [], content: [{ type: 'p', text: 'Start writing…' }] };
      }, { itemLabel: (it) => it.title, big: true }),
    ],
  },
  {
    id: 'cities', label: 'Cities', group: 'Pages',
    fields: [
      ...KICKER, ta('desc', 'Description ({count} = number of cities)'), t('viewAll', 'View all link'), strList('items', 'Cities'),
      t('pageKicker', 'Cities page — kicker'), t('pageTitle', 'Cities page — title'), t('pageTitleEm', 'Cities page — highlighted'), ta('pageDesc', 'Cities page — description'),
      t('chipPrefix', 'Chip prefix'), t('ctaTitle', 'CTA title'), ta('ctaDesc', 'CTA text'), t('ctaBtn', 'CTA button'), ta('ctaMsg', 'CTA WhatsApp message'),
    ],
  },
  {
    id: 'cityDetail', label: 'City Detail Page', group: 'Pages',
    fields: [
      img('heroImage', 'Hero image'), t('backLabel', 'Back label'), t('servingLabel', 'Serving label ({city})'), t('title', 'Title'), t('titleAfter', 'Title — word before city'),
      ta('desc', 'Description ({city})'), t('quoteBtn', 'Quote button ({city})'), t('callBtn', 'Call button'),
      list('stats', 'Stats band', [icon('icon'), t('label', 'Label'), t('sub', 'Sub label')], () => ({ icon: 'Star', label: 'New', sub: '' })),
      t('offerTitle', 'Offerings title ({city})'), strList('offerings', 'Offerings'), t('deliveryTitle', 'Delivery title'), ta('deliveryDesc', 'Delivery text ({city})'),
      strList('occasions', 'Occasions'), { key: 'gallery', label: 'Gallery images', type: 'list', item: { type: 'image' }, newItem: () => '/images/brand/hero-2.jpg' },
      t('ctaTitle', 'CTA title ({city})'), ta('ctaDesc', 'CTA text'), t('ctaWa', 'CTA WhatsApp button'), t('ctaCustomize', 'CTA customize button'), t('alsoServe', 'Also serve title'), t('allCitiesLabel', '"All cities" link'),
    ],
  },
  {
    id: 'occasions', label: 'Occasions', group: 'Home page',
    fields: [...KICKER, ta('desc', 'Description'), t('showLess', 'Show less label'), t('viewAll', 'View all label ({count})'), strList('items', 'Occasions')],
  },
  {
    id: 'whyChoose', label: 'Why Choose Us', group: 'Home page',
    fields: [...KICKER, ta('desc', 'Description'), list('items', 'Cards', [t('num', 'Number'), icon('icon'), t('title', 'Title'), ta('description', 'Description'), t('tag', 'Tag')], () => ({ num: '07', icon: 'Star', title: 'New', description: '', tag: '' }))],
  },
  {
    id: 'cta', label: 'Call-to-Action Band', group: 'Home page',
    fields: [t('title', 'Title'), ta('desc', 'Text'), t('callLabel', 'Call button prefix'), t('waLabel', 'WhatsApp button'), ta('waMsg', 'WhatsApp message')],
  },
  {
    id: 'testimonials', label: 'Testimonials', group: 'Home page',
    fields: [t('kicker', 'Kicker'), t('title', 'Title'), t('titleEm', 'Title highlighted'), t('titleAfter', 'Title after'), list('items', 'Testimonials', [t('name', 'Name'), t('city', 'City'), ta('text', 'Quote')], () => ({ name: 'Happy Client', city: 'Delhi', text: '' }))],
  },
  {
    id: 'faqs', label: 'FAQs', group: 'Home page',
    fields: [...KICKER, list('items', 'Questions', [t('q', 'Question'), ta('a', 'Answer')], () => ({ q: 'New question?', a: '' }))],
  },
  {
    id: 'contact', label: 'Contact & Enquiry Form', group: 'Home page',
    fields: [t('kicker', 'Kicker'), t('heading', 'Heading'), ta('subheading', 'Sub heading'), t('waBtn', 'WhatsApp button'), ta('waMsg', 'WhatsApp message'), t('callBtn', 'Call button prefix'), t('submitBtn', 'Submit button'), strList('eventTypes', 'Event type options'),
      { key: 'form', label: 'Form labels & placeholders', type: 'group', fields: [
        t('nameLabel', 'Name label'), t('namePlaceholder', 'Name placeholder'), t('whatsappLabel', 'WhatsApp label'), t('whatsappPlaceholder', 'WhatsApp placeholder'), t('dateLabel', 'Date label'),
        t('locationLabel', 'Location label'), t('locationPlaceholder', 'Location placeholder'), t('quantityLabel', 'Quantity label'), t('quantityPlaceholder', 'Quantity placeholder'),
        t('eventTypeLabel', 'Event type label'), t('eventTypePlaceholder', 'Event type placeholder'), t('customizationLabel', 'Customization label'), t('customizationPlaceholder', 'Customization placeholder'), t('sending', 'Sending text'),
      ] }],
  },
  {
    id: 'instagram', label: 'Instagram Feed', group: 'Home page',
    fields: [...KICKER, ta('desc', 'Description'), { key: 'posts', label: 'Post images', type: 'list', item: { type: 'image' }, newItem: () => '/images/brand/hero-1.jpg' }],
  },
  {
    id: 'footer', label: 'Footer', group: 'General',
    fields: [ta('about', 'About text'), t('quickLinksTitle', 'Quick links title'), t('citiesTitle', 'Cities title'), t('contactTitle', 'Contact title'), t('customizeLink', 'Customize link'), t('waBtn', 'WhatsApp button'), ta('waMsg', 'WhatsApp message'), t('copyright', 'Copyright ({year})'), list('legal', 'Legal links', [t('label', 'Label'), t('href', 'Link')], () => ({ label: 'New', href: '#' }))],
  },
  {
    id: 'floating', label: 'Floating Buttons', group: 'General',
    fields: [t('instagramLabel', 'Instagram tooltip'), t('whatsappLabel', 'WhatsApp tooltip'), t('callLabel', 'Call tooltip')],
  },
  {
    id: 'theme', label: 'Theme — Colours & Fonts', group: 'Design',
    fields: [
      color('green600', 'Primary green'), color('green500', 'Primary green — light'), color('green700', 'Primary green — dark'),
      color('pink600', 'Accent pink'), color('pink500', 'Accent pink — light'), color('pink700', 'Accent pink — dark'),
      color('pink50', 'Light pink background'), color('pink100', 'Pink tint (chips)'), color('green50', 'Light green background'), color('green100', 'Green tint (icons)'),
      color('beige', 'About section background'), color('dark', 'Plans section background'), color('bodyBg', 'Page background'), color('bodyText', 'Body text colour'),
      { key: 'fontBody', label: 'Body font', type: 'font' }, { key: 'fontDisplay', label: 'Heading font', type: 'font' }, { key: 'fontScript', label: 'Script font', type: 'font' },
    ],
  },
];

export const SECTION_GROUPS = ['General', 'Home page', 'Pages', 'Design'];

/** Find the list definition for an absolute path such as "services.items". */
export function getListDef(absPath) {
  const [sectionId, ...rest] = String(absPath).split('.');
  const section = SECTIONS.find((s) => s.id === sectionId);
  if (!section) return null;
  let fields = section.fields;
  let def = null;
  for (let i = 0; i < rest.length; i++) {
    const key = rest[i];
    def = (fields || []).find((f) => f.key === key);
    if (!def) return null;
    if (def.type === 'group') fields = def.fields;
    else if (def.type === 'list' && i < rest.length - 1) { fields = def.item?.fields || []; i++; /* skip index */ }
  }
  return def && def.type === 'list' ? { ...def, label: def.label, section } : null;
}

export const makeSlug = slugify;
