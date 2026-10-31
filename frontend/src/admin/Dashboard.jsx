import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Paintbrush, Newspaper, ShoppingBag, Sparkles, Inbox, Images, Palette, ArrowRight, MessageSquare, Package } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { API, IS_DEMO, authHeaders } from '../lib/api';

export default function Dashboard() {
  const { get, dirty } = useContent();
  const [counts, setCounts] = useState({ orders: '—', enquiries: '—' });

  useEffect(() => {
    if (IS_DEMO) { setCounts({ orders: 2, enquiries: 1 }); return; }
    (async () => {
      try {
        const headers = authHeaders();
        const [o, e] = await Promise.all([axios.get(`${API}/admin/orders`, { headers }), axios.get(`${API}/admin/enquiries`, { headers })]);
        setCounts({ orders: (o.data || []).length, enquiries: (e.data || []).length });
      } catch { setCounts({ orders: '—', enquiries: '—' }); }
    })();
  }, []);

  const posts = get('blog.posts', []);
  const products = get('products.items', []);
  const slides = get('hero.slides', []);

  const tiles = [
    { to: '/?edit=1', icon: Paintbrush, title: 'Live Editor', desc: 'Click on any text, image or section of the website and edit it in place — fonts, colours, backgrounds, images, videos.', accent: 'bg-pink-600', cta: 'Open live editor' },
    { to: '/admin/content/hero', icon: Sparkles, title: 'Hero Slider', desc: `${slides.length} slides · add images or short videos, headlines and buttons.`, accent: 'bg-green-600', cta: 'Edit slides' },
    { to: '/admin/content/blog', icon: Newspaper, title: 'Blog', desc: `${posts.length} posts · write, publish, unpublish, reorder.`, accent: 'bg-amber-500', cta: 'Manage posts' },
    { to: '/admin/content/products', icon: ShoppingBag, title: 'Products', desc: `${products.length} products · names, photos, prices, features.`, accent: 'bg-sky-600', cta: 'Manage products' },
    { to: '/admin/media', icon: Images, title: 'Media Library', desc: 'Upload photos & videos once, reuse them everywhere.', accent: 'bg-violet-600', cta: 'Open library' },
    { to: '/admin/content/theme', icon: Palette, title: 'Theme', desc: 'Brand colours, light background tints and fonts for the whole site.', accent: 'bg-gray-800', cta: 'Edit theme' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-bold text-2xl text-gray-900">Welcome back 👋</h1>
        <p className="text-sm text-gray-500 mt-1">Everything on the website — header to footer — is editable from here or directly on the page.</p>
        {dirty && <div className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5">● You have unsaved changes — press "Save changes" at the top.</div>}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <Link to="/admin/inbox" className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <span className="w-12 h-12 rounded-xl bg-green-50 text-green-700 flex items-center justify-center"><Package className="w-6 h-6" /></span>
          <div><div className="text-3xl font-display font-bold text-gray-900">{counts.orders}</div><div className="text-xs text-gray-500">Orders received</div></div>
          <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
        </Link>
        <Link to="/admin/inbox" className="rounded-2xl bg-white border border-gray-200 p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
          <span className="w-12 h-12 rounded-xl bg-pink-50 text-pink-700 flex items-center justify-center"><MessageSquare className="w-6 h-6" /></span>
          <div><div className="text-3xl font-display font-bold text-gray-900">{counts.enquiries}</div><div className="text-xs text-gray-500">Enquiries</div></div>
          <ArrowRight className="w-4 h-4 text-gray-300 ml-auto" />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {tiles.map((t) => (
          <Link key={t.to} to={t.to} className="group rounded-2xl bg-white border border-gray-200 p-5 hover:shadow-lg hover:-translate-y-0.5 transition-all">
            <span className={`w-11 h-11 rounded-xl ${t.accent} text-white flex items-center justify-center shadow`}><t.icon className="w-5 h-5" /></span>
            <div className="mt-4 font-bold text-gray-900">{t.title}</div>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">{t.desc}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 group-hover:gap-2 transition-all">{t.cta} <ArrowRight className="w-4 h-4" /></span>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-5">
        <div className="font-bold text-gray-900 mb-2 flex items-center gap-2"><Inbox className="w-4 h-4 text-gray-400" /> How editing works</div>
        <ol className="text-sm text-gray-600 space-y-1.5 list-decimal pl-5">
          <li><b>Live Editor</b> (pink button) — opens the website with editing turned on. Click text to type, click images to replace, hover a section and click its chip to change the background colour. Press <b>Save</b> in the bottom bar.</li>
          <li><b>Backend Editor</b> (this panel) — forms for every section: add / remove / reorder slides, services, plans, products, blog posts, FAQs, testimonials, cities… Press <b>Save changes</b> at the top.</li>
          <li>Both editors work on the same content. Saved changes go live on the website immediately.</li>
        </ol>
      </div>
    </div>
  );
}
