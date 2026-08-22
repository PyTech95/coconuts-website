import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Type, Sparkles, Phone, CheckCircle2, MessageCircle, Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { CUSTOMIZER, waLink } from '../data/mock';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const Customizer = () => {
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
  const [logoPos, setLogoPos] = useState({ x: 50, y: 40 });
  const [logoScale, setLogoScale] = useState(0.55);
  const previewRef = useRef(null);
  const draggingRef = useRef(false);

  useEffect(() => {
    const move = (e) => {
      if (!draggingRef.current || !previewRef.current) return;
      if (e.cancelable) e.preventDefault();
      const rect = previewRef.current.getBoundingClientRect();
      const p = e.touches ? e.touches[0] : e;
      const x = ((p.clientX - rect.left) / rect.width) * 100;
      const y = ((p.clientY - rect.top) / rect.height) * 100;
      setLogoPos({ x: Math.max(12, Math.min(88, x)), y: Math.max(12, Math.min(88, y)) });
    };
    const up = () => { draggingRef.current = false; };
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

  const startLogoDrag = () => { draggingRef.current = true; };

  const resetLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoPreview('');
    setLogoUrl('');
    setLogoPath('');
    setLogoPos({ x: 50, y: 40 });
    setLogoScale(0.55);
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
      setLogoUrl(`${process.env.REACT_APP_BACKEND_URL}${res.data.url}`);
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
    <section id="customize" data-testid="customizer-section" className="section-pad bg-gradient-to-b from-pink-50/60 to-white overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="uppercase tracking-[0.3em] text-xs font-bold text-pink-600">{CUSTOMIZER.label}</span>
          <h2 className="mt-2 font-display font-extrabold text-4xl md:text-5xl text-gray-900">
            {CUSTOMIZER.title} <span className="font-script text-pink-600 font-normal">{CUSTOMIZER.script}</span>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">{CUSTOMIZER.subtitle}</p>
          <p className="mt-3 text-xs text-gray-500 max-w-2xl mx-auto bg-green-50 border border-green-100 rounded-full px-4 py-2 inline-block">
            🥥 {CUSTOMIZER.engraveNote}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 items-stretch">
          {/* Live preview */}
          <div data-testid="coconut-preview" className="relative rounded-3xl overflow-hidden bg-black shadow-2xl min-h-[380px] md:min-h-[520px]">
            <span className="absolute top-4 left-4 z-10 inline-flex items-center gap-1.5 bg-white/95 text-pink-600 text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full">
              <Sparkles className="w-3.5 h-3.5" /> Live Preview
            </span>
            <div ref={previewRef} className="relative w-full h-full flex items-center justify-center p-6">
              <img
                src={CUSTOMIZER.image}
                alt="Personalized coconut live preview"
                className="absolute inset-0 w-full h-full object-contain"
                draggable={false}
              />
              {/* Draggable + resizable logo (rendered black & white as it will be engraved) */}
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Your logo preview"
                  data-testid="preview-logo"
                  onPointerDown={startLogoDrag}
                  onTouchStart={startLogoDrag}
                  className="absolute z-20 object-contain cursor-move select-none touch-none drop-shadow"
                  style={{
                    left: `${logoPos.x}%`,
                    top: `${logoPos.y}%`,
                    width: `${logoScale * 52}%`,
                    transform: 'translate(-50%, -50%)',
                    filter: 'grayscale(1) contrast(1.2) brightness(0.96)',
                    mixBlendMode: 'multiply',
                  }}
                  draggable={false}
                />
              )}
              {logoPreview && (
                <div data-testid="logo-resize-control" className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 bg-white/95 rounded-full px-3 py-1.5 shadow-lg">
                  <span className="text-[11px] font-medium text-gray-500 whitespace-nowrap">Drag to move · Size</span>
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
                </div>
              )}
              {/* Engraved overlay anchored on the coconut's white body */}
              <div
                className="absolute flex flex-col items-center justify-center text-center pointer-events-none px-2 overflow-hidden"
                style={{ top: '42%', left: '22%', right: '22%', bottom: '16%' }}
              >
                <div
                  data-testid="preview-print-text"
                  className="font-script leading-tight break-words w-full whitespace-pre-line"
                  style={{
                    color: '#4a2f16',
                    fontSize: 'clamp(2rem, 6.2vw, 4rem)',
                    textShadow: '0 1px 2px rgba(255,255,255,0.4)',
                  }}
                >
                  {printText || (logoPreview ? '' : 'Your Text')}
                </div>
                {eventName && (
                  <div
                    data-testid="preview-event-name"
                    className="mt-1.5 font-display font-semibold break-words w-full"
                    style={{ color: '#5b3f24', fontSize: 'clamp(0.8rem, 2vw, 1.2rem)' }}
                  >
                    {eventName}
                  </div>
                )}
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
                <h3 className="mt-4 font-display font-bold text-2xl text-gray-900">Order Received!</h3>
                <p className="mt-1 text-gray-600">Your order number is</p>
                <p className="mt-1 font-display font-extrabold text-3xl text-pink-600 tracking-wide">{order.order_number}</p>
                <p className="mt-3 text-sm text-gray-600 max-w-sm">
                  We've opened WhatsApp so you can confirm production &amp; payment. Our team will also call you shortly.
                </p>
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
                  <MessageCircle className="w-4 h-4" /> Open WhatsApp
                </a>
                <Button onClick={() => { setOrder(null); setPrintText(''); setEventName(''); setMobile(''); resetLogo(); }} variant="outline" className="mt-3 rounded-full border-pink-300 text-pink-700 hover:bg-pink-50">
                  Design Another Coconut
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} data-testid="order-form" className="space-y-5">
                <div>
                  <label className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-bold text-gray-800">
                    <span className="inline-flex items-center gap-2"><Type className="w-4 h-4 text-pink-600" /> Print on Coconut</span>
                    <span className="w-full sm:w-auto text-xs font-normal text-gray-400">(optional if you add a logo · press Enter for a new line · max {CUSTOMIZER.maxChars})</span>
                  </label>
                  <textarea
                    data-testid="order-print-text"
                    rows={3}
                    className={`${field} mt-2 resize-none`}
                    placeholder={"e.g.\nRadha\nand\nRupesh"}
                    maxLength={CUSTOMIZER.maxChars}
                    value={printText}
                    onChange={(e) => setPrintText(e.target.value)}
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">{printText.length}/{CUSTOMIZER.maxChars}</div>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <Sparkles className="w-4 h-4 text-pink-600" /> Event Name <span className="text-pink-600">*</span>
                  </label>
                  <input
                    data-testid="order-event-name"
                    className={`${field} mt-2`}
                    placeholder="e.g. Priya & Rohan's Sangeet"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-bold text-gray-800">
                    <Phone className="w-4 h-4 text-pink-600" /> Mobile Number <span className="text-pink-600">*</span>
                  </label>
                  <input
                    data-testid="order-mobile"
                    className={`${field} mt-2`}
                    placeholder="+91 98xxxxxxxx"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                  />
                </div>

                <div>
                  <label className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm font-bold text-gray-800">
                    <span className="inline-flex items-center gap-2"><ImageIcon className="w-4 h-4 text-pink-600" /> Add a Logo / Image</span>
                    <span className="w-full sm:w-auto text-xs font-normal text-gray-400">(optional — PNG, JPG · max 5MB)</span>
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
                      <Upload className="w-4 h-4" /> Upload your logo or artwork
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
                  <p className="text-xs text-gray-500 flex-1">
                    You'll get an order number instantly. We'll call you to confirm production &amp; payment.
                  </p>
                  <Button type="submit" disabled={submitting} data-testid="order-submit" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-8 py-6 font-semibold shadow-lg">
                    {submitting ? 'Submitting…' : (<><MessageCircle className="w-4 h-4 mr-2" /> Submit Order</>)}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Customizer;
