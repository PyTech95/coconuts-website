import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Type, Sparkles, Phone, CheckCircle2, MessageCircle, Upload, X, Image as ImageIcon, Minus, Plus } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec } from '../cms/Editable';
import { API, BACKEND_URL, waLink as wa } from '../lib/api';

const Customizer = () => {
  const { get } = useContent();
  const brand = get('brand', {});
  const maxChars = Number(get('customizer.maxChars', 60)) || 60;
  const waLink = (msg) => wa(brand.phoneRaw, msg);
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const [printText, setPrintText] = useState('');
  const [eventName, setEventName] = useState('');
  const [mobile, setMobile] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [order, setOrder] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoPath, setLogoPath] = useState('');
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoPos, setLogoPos] = useState({ x: 50, y: 64 });
  const [logoScale, setLogoScale] = useState(0.62);
  const [textPos, setTextPos] = useState({ x: 50, y: 44 });
  const [textScale, setTextScale] = useState(1);
  const previewRef = useRef(null);
  const draggingRef = useRef(null); // 'logo' | 'text' | null

  useEffect(() => {
    const move = (e) => {
      if (!draggingRef.current || !previewRef.current) return;
      if (e.cancelable) e.preventDefault();
      const rect = previewRef.current.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      const x = ((p.clientX - rect.left) / rect.width) * 100;
      const y = ((p.clientY - rect.top) / rect.height) * 100;
      const clamped = { x: Math.max(12, Math.min(88, x)), y: Math.max(10, Math.min(90, y)) };
      if (draggingRef.current === 'text') setTextPos(clamped);
      else setLogoPos(clamped);
    };
    const up = () => { draggingRef.current = null; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('touchmove', move, { passive: false });
    window.addEventListener('touchend', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('touchmove', move);
      window.removeEventListener('touchend', up);
    };
  }, []);

  const startDrag = (target) => (e) => { e.stopPropagation(); draggingRef.current = target; };

  const resetLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview('');
    setLogoUrl('');
    setLogoPath('');
    setLogoPos({ x: 50, y: 64 });
    setLogoScale(0.62);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
      toast({ title: 'Unsupported file', description: 'Please upload a PNG, JPG, GIF or WEBP image.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'Image too large', description: 'Please upload an image under 5 MB.', variant: 'destructive' });
      return;
    }
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview(URL.createObjectURL(file));
    setLogoUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      const res = await axios.post(`${API}/upload-logo`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setLogoPath(res.data.path);
      setLogoUrl(`${BACKEND_URL}${res.data.url}`);
      toast({ title: 'Logo added', description: 'Your logo will be engraved by our team.' });
    } catch (err) {
      console.error('Logo upload failed', err);
      toast({ title: 'Logo upload failed', description: 'Please try a different image or continue without one.', variant: 'destructive' });
      resetLogo();
    } finally {
      setLogoUploading(false);
    }
  };

  const field =
    'w-full px-4 py-3 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-pink-500';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eventName.trim() || !mobile.trim()) {
      toast({ title: 'Please fill in the required fields', description: 'Event name and mobile number are required.', variant: 'destructive' });
      return;
    }
    if (!printText.trim() && !logoPreview) {
      toast({ title: 'Add text or a logo', description: 'Enter print text or upload a logo to place your order.', variant: 'destructive' });
      return;
    }
    if (logoUploading) {
      toast({ title: 'Logo still uploading', description: 'Please wait a moment for the logo to finish uploading.' });
      return;
    }
    setSubmitting(true);
    let orderNumber = null;
    try {
      const res = await axios.post(`${API}/orders`, {
        print_text: printText.trim(),
        event_name: eventName.trim(),
        mobile: mobile.trim(),
        logo_url: logoUrl,
        logo_path: logoPath,
      });
      orderNumber = res.data.order_number;
      setOrder(res.data);
      toast({ title: `Order placed! ${orderNumber}`, description: 'Opening WhatsApp to confirm your order…' });
    } catch (err) {
      console.error('Order failed', err);
      toast({ title: 'Could not place the order', description: 'Please try again or reach us on WhatsApp.', variant: 'destructive' });
      setSubmitting(false);
      return;
    }
    setSubmitting(false);
    const msg =
      `New Coconut Order 🥥\n` +
      `Order No: ${orderNumber}\n` +
      `Print on Coconut: ${printText.trim() || (logoUrl ? '(logo only)' : '—')}\n` +
      `Event: ${eventName.trim()}\n` +
      `Mobile: ${mobile.trim()}` +
      (logoUrl ? `\nLogo: ${logoUrl}` : '');
    window.open(waLink(msg), '_blank');
  };

  return (
    <Sec id="customize" label="Customize your coconut" data-testid="customizer-section" className="section-pad bg-gradient-to-b from-pink-50/60 to-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <T path="customizer.label" as="span" className="uppercase tracking-[0.3em] text-xs font-bold text-pink-600" />
          <h2 className="mt-2 font-display font-extrabold text-4xl md:text-5xl text-gray-900">
            <T path="customizer.title" as="span" /> <T path="customizer.script" as="span" className="font-script text-pink-600 font-normal" />
          </h2>
          <T path="customizer.subtitle" as="p" className="mt-3 text-gray-600 max-w-2xl mx-auto" />
          <p className="mt-3 text-xs text-gray-500 max-w-2xl mx-auto bg-green-50 border border-green-100 rounded-full px-4 py-2 inline-block">
            🥥 <T path="customizer.engraveNote" as="span" />
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Live preview */}
          <div data-testid="coconut-preview" className="relative rounded-3xl overflow-hidden bg-black shadow-2xl min-h-[380px] md:min-h-[520px]">
            <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-white/95 text-pink-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> <T path="customizer.ui.previewBadge" as="span" />
            </span>
            <div ref={previewRef} className="relative w-full h-full flex items-center justify-center p-6">
              <Img
                path="customizer.image"
                alt="Personalized coconut live preview"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
              {/* Draggable + resizable photo/logo — rendered as a warm sepia engraving burnt into the coconut */}
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Your logo preview"
                  data-testid="preview-logo"
                  onPointerDown={startDrag('logo')}
                  onTouchStart={startDrag('logo')}
                  className="absolute z-20 object-contain cursor-move select-none touch-none"
                  style={{
                    left: `${logoPos.x}%`,
                    top: `${logoPos.y}%`,
                    width: `${logoScale * 52}%`,
                    transform: 'translate(-50%, -50%)',
                    filter: 'sepia(1) saturate(2.4) hue-rotate(-18deg) brightness(0.72) contrast(1.3)',
                    mixBlendMode: 'multiply',
                    opacity: 0.92,
                  }}
                  draggable={false}
                />
              )}

              {/* Engraved text — draggable (move up/down/side) + resizable, warm burnt tone */}
              <div
                data-testid="preview-text-block"
                onPointerDown={startDrag('text')}
                onTouchStart={startDrag('text')}
                className="absolute z-20 flex flex-col items-center text-center px-1 cursor-move select-none touch-none"
                style={{
                  left: `${textPos.x}%`,
                  top: `${textPos.y}%`,
                  width: '66%',
                  transform: 'translate(-50%, -50%)',
                  mixBlendMode: 'multiply',
                }}
              >
                <div
                  data-testid="preview-print-text"
                  className="font-script leading-tight break-words w-full whitespace-pre-line"
                  style={{
                    color: '#4a2c10',
                    fontSize: `clamp(${1.4 * textScale}rem, ${4.6 * textScale}vw, ${3.2 * textScale}rem)`,
                    textShadow: '0 1px 0 rgba(120,80,40,0.25)',
                  }}
                >
                  {printText || (logoPreview ? '' : 'Your Text')}
                </div>
                {eventName && (
                  <div
                    data-testid="preview-event-name"
                    className="mt-1.5 font-display font-semibold break-words w-full"
                    style={{ color: '#5b3f24', fontSize: `clamp(${0.7 * textScale}rem, ${1.7 * textScale}vw, ${1.05 * textScale}rem)` }}
                  >
                    {eventName}
                  </div>
                )}
              </div>

              {/* Controls: make text (and logo) small / big + drag to reposition */}
              <div data-testid="preview-controls" className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex flex-col gap-2 bg-white/95 rounded-2xl px-3 py-2.5 shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-semibold text-gray-600 w-[46px] shrink-0">Text</span>
                  <button
                    type="button"
                    aria-label="Make text smaller"
                    data-testid="text-size-minus"
                    onClick={() => setTextScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)))}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 flex items-center justify-center active:scale-95 transition"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <input
                    type="range"
                    min="0.5"
                    max="1.9"
                    step="0.05"
                    value={textScale}
                    onChange={(e) => setTextScale(parseFloat(e.target.value))}
                    data-testid="text-resize-slider"
                    className="w-24 accent-pink-600"
                  />
                  <button
                    type="button"
                    aria-label="Make text bigger"
                    data-testid="text-size-plus"
                    onClick={() => setTextScale((s) => Math.min(1.9, +(s + 0.15).toFixed(2)))}
                    className="w-7 h-7 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 flex items-center justify-center active:scale-95 transition"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {logoPreview && (
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-gray-600 w-[46px] shrink-0">Logo</span>
                    <button
                      type="button"
                      aria-label="Make logo smaller"
                      data-testid="logo-size-minus"
                      onClick={() => setLogoScale((s) => Math.max(0.3, +(s - 0.1).toFixed(2)))}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 flex items-center justify-center active:scale-95 transition"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="0.3"
                      max="1.2"
                      step="0.05"
                      value={logoScale}
                      onChange={(e) => setLogoScale(parseFloat(e.target.value))}
                      data-testid="logo-resize-slider"
                      className="w-24 accent-pink-600"
                    />
                    <button
                      type="button"
                      aria-label="Make logo bigger"
                      data-testid="logo-size-plus"
                      onClick={() => setLogoScale((s) => Math.min(1.2, +(s + 0.1).toFixed(2)))}
                      className="w-7 h-7 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 flex items-center justify-center active:scale-95 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <T path="customizer.ui.dragHint" as="span" className="text-[10px] text-gray-400 text-center" />
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="rounded-3xl bg-white border border-gray-100 shadow-xl p-6 md:p-8">
            {order ? (
              <div data-testid="order-success" className="h-full flex flex-col items-center justify-center text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-100 text-green-700 flex items-center justify-center">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <T path="customizer.ui.successTitle" as="h3" className="mt-4 font-display font-bold text-2xl text-gray-900" />
                <T path="customizer.ui.successSub" as="p" className="mt-1 text-gray-600" />
                <p className="mt-1 font-display font-extrabold text-3xl text-pink-600 tracking-wide">{order.order_number}</p>
                <T path="customizer.ui.successText" as="p" className="mt-3 text-sm text-gray-600 max-w-sm" />
                <a
                  href={waLink(
                    `New Coconut Order 🥥\nOrder No: ${order.order_number}\nPrint on Coconut: ${order.print_text}\nEvent: ${order.event_name}\nMobile: ${order.mobile}` +
                    (order.logo_url ? `\nLogo: ${order.logo_url}` : '')
                  )}
                  target="_blank"
                  rel="noreferrer"
                  data-testid="order-success-whatsapp"
                  className="mt-5 inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 text-sm font-semibold shadow-lg"
                >
                  <MessageCircle className="w-4 h-4" /> <T path="customizer.ui.openWhatsapp" as="span" />
                </a>
                <Button onClick={() => { setOrder(null); setPrintText(''); setEventName(''); setMobile(''); resetLogo(); }} variant="outline" className="mt-3 rounded-full border-pink-300 text-pink-700 hover:bg-pink-50">
                  <T path="customizer.ui.designAnother" as="span" />
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} data-testid="order-form" className="space-y-5">
                <div>
                  <label className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-bold text-gray-800">
                    <span className="inline-flex items-center gap-2"><Type className="w-4 h-4 text-pink-600" /> <T path="customizer.ui.printLabel" as="span" /></span>
                    <T path="customizer.ui.printHint" as="span" vars={{ max: maxChars }} className="w-full sm:w-auto text-xs font-normal text-gray-400" />
                  </label>
                  <textarea
                    data-testid="order-print-text"
                    rows={3}
                    className={`${field} mt-2 resize-none`}
                    placeholder={get('customizer.ui.printPlaceholder', 'e.g.\nRadha\nand\nRupesh')}
                    maxLength={maxChars}
                    value={printText}
                    onChange={(e) => setPrintText(e.target.value)}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{printText.length}/{maxChars}</div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <Sparkles className="w-4 h-4 text-pink-600" /> <T path="customizer.ui.eventLabel" as="span" /> <span className="text-pink-600">*</span>
                  </label>
                  <input
                    data-testid="order-event-name"
                    className={`${field} mt-2`}
                    placeholder={get('customizer.ui.eventPlaceholder', '')}
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <Phone className="w-4 h-4 text-pink-600" /> <T path="customizer.ui.mobileLabel" as="span" /> <span className="text-pink-600">*</span>
                  </label>
                  <input
                    data-testid="order-mobile"
                    className={`${field} mt-2`}
                    placeholder={get('customizer.ui.mobilePlaceholder', '')}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div>
                  <label className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-bold text-gray-800">
                    <span className="inline-flex items-center gap-2"><ImageIcon className="w-4 h-4 text-pink-600" /> <T path="customizer.ui.logoLabel" as="span" /></span>
                    <T path="customizer.ui.logoHint" as="span" className="w-full sm:w-auto text-xs font-normal text-gray-400" />
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/gif,image/webp"
                    onChange={handleLogoChange}
                    data-testid="order-logo-input"
                    className="hidden"
                  />
                  {!logoPreview ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      data-testid="order-logo-trigger"
                      className="mt-2 w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl border-2 border-dashed border-pink-200 text-pink-600 hover:bg-pink-50 text-sm font-medium transition-colors"
                    >
                      <Upload className="w-4 h-4" /> <T path="customizer.ui.uploadBtn" as="span" />
                    </button>
                  ) : (
                    <div className="mt-2 flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-gray-50">
                      <img src={logoPreview} alt="Logo preview" className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-100" />
                      <div className="flex-1 text-sm text-gray-700">
                        {logoUploading ? 'Uploading…' : 'Logo ready ✓'}
                      </div>
                      <button type="button" onClick={resetLogo} data-testid="order-logo-remove" aria-label="Remove logo" className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-pink-600 hover:border-pink-300">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                  <T path="customizer.ui.footnote" as="p" className="text-xs text-gray-500 flex-1" />
                  <Button type="submit" disabled={submitting} data-testid="order-submit" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 font-semibold shadow-lg">
                    {submitting ? get('customizer.ui.submitting', 'Submitting…') : (<><MessageCircle className="w-4 h-4 mr-2" /> <T path="customizer.ui.submitBtn" as="span" /></>)}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </Sec>
  );
};

export default Customizer;
