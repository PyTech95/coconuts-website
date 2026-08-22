import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LogOut, Package, MessageSquare, RefreshCw, Phone, Calendar, MapPin, ImageOff,
  Box, FileText, Search, Trash2, Plus, Upload, Home, Save, X,
} from 'lucide-react';
import { Button } from './ui/button';
import { uploadToStorage } from '../context/SiteContent';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const fmtDate = (iso) => { try { return new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }); } catch { return iso || '—'; } };
const ORDER_STATUSES = ['new', 'in-progress', 'ready', 'delivered', 'cancelled'];
const statusColor = { new: 'bg-blue-100 text-blue-700', 'in-progress': 'bg-amber-100 text-amber-700', ready: 'bg-purple-100 text-purple-700', delivered: 'bg-green-100 text-green-700', cancelled: 'bg-gray-200 text-gray-600' };

const Input = ({ label, ...props }) => (
  <label className="block">
    <span className="text-xs font-semibold text-gray-500">{label}</span>
    <input {...props} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
  </label>
);
const Area = ({ label, ...props }) => (
  <label className="block">
    <span className="text-xs font-semibold text-gray-500">{label}</span>
    <textarea {...props} className="mt-1 w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
  </label>
);

const ImageField = ({ label, value, onChange, testid }) => {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const pick = async (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    setBusy(true);
    try { const url = await uploadToStorage(f); onChange(url); } catch { /* */ } finally { setBusy(false); if (ref.current) ref.current.value = ''; }
  };
  return (
    <div>
      <span className="text-xs font-semibold text-gray-500">{label}</span>
      <div className="mt-1 flex items-center gap-3">
        {value ? <img src={value} alt="" className="w-14 h-14 rounded-lg object-cover border" /> : <div className="w-14 h-14 rounded-lg bg-gray-100 border flex items-center justify-center"><ImageOff className="w-5 h-5 text-gray-300" /></div>}
        <button type="button" data-testid={testid} onClick={() => ref.current?.click()} className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200">
          <Upload className="w-3.5 h-3.5" /> {busy ? 'Uploading…' : 'Upload'}
        </button>
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} />
      </div>
      <input value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="or paste image URL" className="mt-2 w-full px-3 py-1.5 rounded-lg border border-gray-200 text-xs" />
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const token = typeof window !== 'undefined' ? localStorage.getItem('mc_admin_token') : null;
  const headers = { Authorization: `Bearer ${token}` };
  const [tab, setTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [products, setProducts] = useState([]);
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  const flash = (m) => { setToast(m); setTimeout(() => setToast(''), 2200); };
  const logout = useCallback(() => { localStorage.removeItem('mc_admin_token'); navigate('/admin/login'); }, [navigate]);

  const load = useCallback(async () => {
    if (!token) { navigate('/admin/login'); return; }
    setLoading(true);
    try {
      const [o, e, p, c] = await Promise.all([
        axios.get(`${API}/admin/orders`, { headers }),
        axios.get(`${API}/admin/enquiries`, { headers }),
        axios.get(`${API}/products`),
        axios.get(`${API}/content`),
      ]);
      setOrders(o.data || []); setEnquiries(e.data || []); setProducts(p.data || []); setContent(c.data || {});
    } catch (err) { if (err.response?.status === 401) logout(); }
    finally { setLoading(false); }
  }, [token]); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  const setOrderStatus = async (id, status) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    try { await axios.patch(`${API}/admin/orders/${id}`, { status }, { headers }); } catch { /* */ }
  };
  const delOrder = async (id) => { setOrders((p) => p.filter((o) => o.id !== id)); await axios.delete(`${API}/admin/orders/${id}`, { headers }); };
  const delEnquiry = async (id) => { setEnquiries((p) => p.filter((e) => e.id !== id)); await axios.delete(`${API}/admin/enquiries/${id}`, { headers }); };

  const saveProduct = async (prod) => {
    const body = { ...prod, features: Array.isArray(prod.features) ? prod.features : String(prod.features || '').split('\n').filter(Boolean) };
    if (prod.id) { const { data } = await axios.put(`${API}/admin/products/${prod.id}`, body, { headers }); setProducts((p) => p.map((x) => (x.id === data.id ? data : x))); }
    else { const { data } = await axios.post(`${API}/admin/products`, body, { headers }); setProducts((p) => [...p, data]); }
    flash('Product saved ✓');
  };
  const delProduct = async (id) => { if (!window.confirm('Delete this product?')) return; setProducts((p) => p.filter((x) => x.id !== id)); await axios.delete(`${API}/admin/products/${id}`, { headers }); flash('Product deleted'); };
  const addProduct = () => setProducts((p) => [...p, { name: 'New Product', slug: '', icon: 'Nut', tagline: '', description: '', features: [], gallery: [], image: '', _new: true }]);

  const saveContent = async (patch) => { setContent((c) => ({ ...c, ...patch })); await axios.put(`${API}/content`, patch, { headers }); flash('Saved ✓'); };

  const TabBtn = ({ id, icon: Icon, label, count }) => (
    <button onClick={() => setTab(id)} data-testid={`dash-tab-${id}`} className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-semibold transition ${tab === id ? 'bg-green-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}>
      <Icon className="w-4 h-4" /> {label}{count != null && <span className={`ml-1 px-1.5 rounded-full text-xs ${tab === id ? 'bg-white/25' : 'bg-gray-100'}`}>{count}</span>}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50" data-testid="admin-dashboard-page">
      <header className="sticky top-0 z-20 bg-[#0d0710] text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div><span className="font-script text-pink-400 text-lg leading-none block">Mr. Coconetto</span><span className="font-display font-bold text-sm">Admin Dashboard</span></div>
          <div className="flex items-center gap-2">
            <Button onClick={() => navigate('/')} variant="outline" size="sm" className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent"><Home className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">View Site</span></Button>
            <Button onClick={load} variant="outline" size="sm" data-testid="dash-refresh" className="rounded-full border-white/20 text-white hover:bg-white/10 bg-transparent"><RefreshCw className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Refresh</span></Button>
            <Button onClick={logout} size="sm" data-testid="dash-logout" className="rounded-full bg-pink-600 hover:bg-pink-700"><LogOut className="w-4 h-4 sm:mr-1.5" /><span className="hidden sm:inline">Logout</span></Button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-wrap gap-2 mb-5">
          <TabBtn id="orders" icon={Package} label="Orders" count={orders.length} />
          <TabBtn id="enquiries" icon={MessageSquare} label="Enquiries" count={enquiries.length} />
          <TabBtn id="products" icon={Box} label="Products" count={products.length} />
          <TabBtn id="content" icon={FileText} label="Content" />
          <TabBtn id="seo" icon={Search} label="SEO" />
        </div>

        {loading ? <div className="py-24 text-center text-gray-400" data-testid="dash-loading">Loading…</div> : (
          <>
            {tab === 'orders' && (
              orders.length === 0 ? <div className="py-24 text-center text-gray-400" data-testid="dash-orders-empty">No orders yet.</div> : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="dash-orders-list">
                  {orders.map((o) => (
                    <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border flex items-center justify-center overflow-hidden shrink-0">{o.logo_url ? <img src={o.logo_url} alt="logo" className="w-full h-full object-contain" /> : <ImageOff className="w-5 h-5 text-gray-300" />}</div>
                        <div className="min-w-0 flex-1"><div className="font-display font-bold text-pink-600">{o.order_number}</div><div className="text-sm font-semibold text-gray-900 whitespace-pre-line leading-tight">{o.print_text}</div></div>
                        <button onClick={() => delOrder(o.id)} data-testid={`order-delete-${o.id}`} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {o.event_name}</div>
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <a href={`tel:${o.mobile}`} className="hover:text-green-700">{o.mobile}</a></div>
                        <div className="text-xs text-gray-400">{fmtDate(o.created_at)}</div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${statusColor[o.status] || statusColor.new}`}>{o.status || 'new'}</span>
                        <select value={o.status || 'new'} onChange={(e) => setOrderStatus(o.id, e.target.value)} data-testid={`order-status-${o.id}`} className="text-xs border border-gray-200 rounded-lg px-2 py-1 ml-auto">
                          {ORDER_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === 'enquiries' && (
              enquiries.length === 0 ? <div className="py-24 text-center text-gray-400" data-testid="dash-enquiries-empty">No enquiries yet.</div> : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="dash-enquiries-list">
                  {enquiries.map((e) => (
                    <div key={e.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                      <div className="flex justify-between"><div className="font-display font-bold text-gray-900">{e.name}</div><button onClick={() => delEnquiry(e.id)} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button></div>
                      <div className="mt-2 space-y-1.5 text-sm text-gray-600">
                        <div className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> <a href={`tel:${e.whatsapp}`} className="hover:text-green-700">{e.whatsapp}</a></div>
                        {e.eventType && <div className="flex items-center gap-2"><Calendar className="w-4 h-4 text-gray-400" /> {e.eventType}{e.eventDate ? ` · ${e.eventDate}` : ''}</div>}
                        {e.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {e.location}</div>}
                        {e.customization && <div className="text-xs text-gray-500 border-t border-gray-100 pt-2 mt-2">{e.customization}</div>}
                        <div className="text-xs text-gray-400">{fmtDate(e.created_at)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {tab === 'products' && (
              <div data-testid="dash-products">
                <div className="flex justify-between items-center mb-4"><h2 className="font-display font-bold text-lg">Products</h2><Button onClick={addProduct} data-testid="product-add" className="rounded-full bg-green-600 hover:bg-green-700"><Plus className="w-4 h-4 mr-1.5" /> Add Product</Button></div>
                <div className="space-y-4">
                  {products.map((prod, idx) => <ProductEditor key={prod.id || `new-${idx}`} product={prod} onSave={saveProduct} onDelete={delProduct} />)}
                </div>
              </div>
            )}

            {tab === 'content' && content && <ContentEditor content={content} onSave={saveContent} />}
            {tab === 'seo' && content && <SeoEditor seo={content.seo || {}} onSave={(seo) => saveContent({ seo })} />}
          </>
        )}
      </main>

      {toast && <div data-testid="dash-toast" className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-4 py-2 rounded-full shadow-lg z-50">{toast}</div>}
    </div>
  );
};

const ProductEditor = ({ product, onSave, onDelete }) => {
  const [p, setP] = useState({ ...product, features: (product.features || []).join('\n') });
  const [open, setOpen] = useState(!!product._new);
  const set = (k, v) => setP((prev) => ({ ...prev, [k]: v }));
  const setGallery = (i, v) => setP((prev) => { const g = [...(prev.gallery || [])]; g[i] = v; return { ...prev, gallery: g }; });
  const addGallery = (url) => setP((prev) => ({ ...prev, gallery: [...(prev.gallery || []), url] }));
  const removeGallery = (i) => setP((prev) => ({ ...prev, gallery: (prev.gallery || []).filter((_, x) => x !== i) }));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4" data-testid={`product-editor-${product.slug || 'new'}`}>
      <div className="flex items-center gap-3">
        {p.image ? <img src={p.image} alt="" className="w-12 h-12 rounded-lg object-cover border" /> : <div className="w-12 h-12 rounded-lg bg-gray-100 border" />}
        <div className="flex-1 min-w-0"><div className="font-semibold text-gray-900 truncate">{p.name}</div><div className="text-xs text-gray-400">{p.tagline}</div></div>
        <button onClick={() => setOpen(!open)} className="text-sm font-semibold text-green-700">{open ? 'Close' : 'Edit'}</button>
        {p.id && <button onClick={() => onDelete(p.id)} data-testid={`product-delete-${p.slug}`} className="text-gray-300 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>}
      </div>
      {open && (
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <Input label="Name" value={p.name || ''} onChange={(e) => set('name', e.target.value)} data-testid="product-name-input" />
          <Input label="Tagline" value={p.tagline || ''} onChange={(e) => set('tagline', e.target.value)} />
          <Input label="Icon (Nut, Utensils, FlaskConical, Stamp, CupSoda)" value={p.icon || ''} onChange={(e) => set('icon', e.target.value)} />
          <Input label="Note (script line)" value={p.note || ''} onChange={(e) => set('note', e.target.value)} />
          <Area label="Description" rows={2} value={p.description || ''} onChange={(e) => set('description', e.target.value)} className="md:col-span-2" />
          <Area label="Features (one per line)" rows={5} value={p.features || ''} onChange={(e) => set('features', e.target.value)} className="md:col-span-2" />
          <div className="md:col-span-2"><ImageField label="Main image" value={p.image} onChange={(v) => set('image', v)} testid="product-image-upload" /></div>
          <div className="md:col-span-2">
            <div className="flex items-center justify-between"><span className="text-xs font-semibold text-gray-500">Gallery</span><GalleryAdder onAdd={addGallery} /></div>
            <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
              {(p.gallery || []).map((g, i) => <div key={i} className="relative group"><img src={g} alt="" className="w-full aspect-square object-cover rounded-lg border" /><button onClick={() => removeGallery(i)} className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button></div>)}
            </div>
          </div>
          <div className="md:col-span-2"><Button onClick={() => onSave({ ...p, features: String(p.features).split('\n').map((s) => s.trim()).filter(Boolean) })} data-testid="product-save" className="rounded-full bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-1.5" /> Save Product</Button></div>
        </div>
      )}
    </div>
  );
};

const GalleryAdder = ({ onAdd }) => {
  const ref = useRef(null);
  const pick = async (e) => { const f = e.target.files?.[0]; if (!f) return; try { const url = await uploadToStorage(f); onAdd(url); } catch { /* */ } if (ref.current) ref.current.value = ''; };
  return (<><button type="button" onClick={() => ref.current?.click()} data-testid="gallery-add" className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-lg bg-gray-100 hover:bg-gray-200"><Upload className="w-3 h-3" /> Add image</button><input ref={ref} type="file" accept="image/*" className="hidden" onChange={pick} /></>);
};

const ContentEditor = ({ content, onSave }) => {
  const [c, setC] = useState(content);
  const sec = (section, k, v) => setC((prev) => ({ ...prev, [section]: { ...(prev[section] || {}), [k]: v } }));
  const S = ({ section, k, label, area }) => area
    ? <Area label={label} rows={3} value={c[section]?.[k] || ''} onChange={(e) => sec(section, k, e.target.value)} />
    : <Input label={label} value={c[section]?.[k] || ''} onChange={(e) => sec(section, k, e.target.value)} />;
  return (
    <div data-testid="dash-content" className="space-y-6">
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-display font-bold mb-3">Brand</h3>
        <div className="grid md:grid-cols-2 gap-4"><S section="brand" k="name" label="Brand name" /><S section="brand" k="tagline" label="Tagline" /><S section="brand" k="phone" label="Phone" /><S section="brand" k="email" label="Email" /></div>
      </div>
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-display font-bold mb-3">Hero (top of homepage)</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <S section="hero" k="badge" label="Badge" /><S section="hero" k="subheading" label="Subheading" />
          <S section="hero" k="titleLine1" label="Title line 1" /><S section="hero" k="titleAccent" label="Title accent (pink)" />
          <S section="hero" k="titleLine3" label="Title line 3 (green)" /><S section="hero" k="brandLine" label="Brand line" />
          <S section="hero" k="primaryCta" label="Primary button" /><S section="hero" k="secondaryCta" label="Secondary button" />
          <div className="md:col-span-2"><S section="hero" k="description" label="Description" area /></div>
        </div>
      </div>
      <div className="bg-white rounded-2xl border p-5">
        <h3 className="font-display font-bold mb-3">About</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <S section="about" k="label" label="Label" /><S section="about" k="script" label="Script line" />
          <S section="about" k="titleLine1" label="Title line 1" /><S section="about" k="titleLine2" label="Title line 2" />
          <div className="md:col-span-2"><S section="about" k="intro" label="Intro" area /></div>
          <div className="md:col-span-2"><S section="about" k="story" label="Story" area /></div>
          <ImageField label="Mascot image" value={c.about?.mascot} onChange={(v) => sec('about', 'mascot', v)} testid="content-mascot-upload" />
          <ImageField label="Product image" value={c.about?.product} onChange={(v) => sec('about', 'product', v)} testid="content-product-upload" />
        </div>
      </div>
      <Button onClick={() => onSave({ brand: c.brand, hero: c.hero, about: c.about })} data-testid="content-save" className="rounded-full bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-1.5" /> Save Content</Button>
    </div>
  );
};

const SeoEditor = ({ seo, onSave }) => {
  const [s, setS] = useState(seo);
  return (
    <div data-testid="dash-seo" className="bg-white rounded-2xl border p-5 max-w-2xl space-y-4">
      <h3 className="font-display font-bold">SEO / Meta tags</h3>
      <Input label="Meta title" value={s.title || ''} onChange={(e) => setS({ ...s, title: e.target.value })} data-testid="seo-title-input" />
      <Area label="Meta description" rows={3} value={s.description || ''} onChange={(e) => setS({ ...s, description: e.target.value })} />
      <Input label="Keywords (comma-separated)" value={s.keywords || ''} onChange={(e) => setS({ ...s, keywords: e.target.value })} />
      <Button onClick={() => onSave(s)} data-testid="seo-save" className="rounded-full bg-green-600 hover:bg-green-700"><Save className="w-4 h-4 mr-1.5" /> Save SEO</Button>
    </div>
  );
};

export default AdminDashboard;
