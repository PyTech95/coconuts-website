import React, { useState } from 'react';
import axios from 'axios';
import { Phone, MessageCircle, Send, MapPin, CalendarDays, Hash } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '../hooks/use-toast';
import { BRAND, CONTACT, waLink } from '../data/mock';

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

const initialForm = {
  name: '',
  whatsapp: '',
  eventDate: '',
  location: '',
  quantity: '',
  eventType: '',
  customization: '',
};

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const update = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const buildMessage = () =>
    `Hi Mr. Coconetto! I'd like a quote for personalized coconuts.\n\n` +
    `Name: ${form.name || '-'}\n` +
    `WhatsApp: ${form.whatsapp || '-'}\n` +
    `Event Type: ${form.eventType || '-'}\n` +
    `Event Date: ${form.eventDate || '-'}\n` +
    `Location: ${form.location || '-'}\n` +
    `Quantity: ${form.quantity || '-'}\n` +
    `Customization: ${form.customization || '-'}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.whatsapp) {
      toast({ title: 'Please add your name and WhatsApp number', variant: 'destructive' });
      return;
    }
    setSubmitting(true);
    try {
      await axios.post(`${API}/enquiries`, form);
    } catch (err) {
      // Non-blocking: even if saving fails, still open WhatsApp so the lead isn't lost.
      console.error('Enquiry save failed', err);
    } finally {
      setSubmitting(false);
      toast({ title: 'Opening WhatsApp with your details…' });
      window.open(waLink(buildMessage()), '_blank');
    }
  };

  const field = 'w-full px-4 py-3 rounded-xl bg-white border border-green-200 text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500';

  return (
    <section id="contact" data-testid="contact-section" className="section-pad bg-gradient-to-b from-green-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Left: intro + quick actions */}
          <div className="lg:col-span-2">
            <span className="text-pink-600 font-script text-2xl">Contact Us</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900 leading-tight">
              {CONTACT.heading}
            </h2>
            <p className="mt-4 text-gray-600 leading-relaxed">{CONTACT.subheading}</p>

            <div className="mt-6 space-y-3">
              <a
                href={waLink(BRAND ? 'Hi Mr. Coconetto! I would like a quote for personalized coconuts.' : '')}
                target="_blank"
                rel="noreferrer"
                data-testid="contact-whatsapp-btn"
                className="flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-5 py-3.5 rounded-xl font-semibold shadow-md transition-colors"
              >
                <MessageCircle className="w-5 h-5" /> Get Quote on WhatsApp
              </a>
              <a
                href={`tel:${BRAND.phone}`}
                data-testid="contact-call-btn"
                className="flex items-center gap-3 bg-white border border-pink-300 text-pink-700 hover:bg-pink-50 px-5 py-3.5 rounded-xl font-semibold shadow-sm transition-colors"
              >
                <Phone className="w-5 h-5" /> Call Us · {BRAND.phone}
              </a>
              <div className="flex items-center gap-3 text-gray-600 pt-1">
                <MapPin className="w-5 h-5 text-green-700" /> Delhi (HQ) · Pan-India Delivery
              </div>
            </div>
          </div>

          {/* Right: enquiry form */}
          <form
            onSubmit={handleSubmit}
            data-testid="enquiry-form"
            className="lg:col-span-3 bg-white rounded-3xl border border-green-100 shadow-lg p-6 md:p-8 grid sm:grid-cols-2 gap-4"
          >
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600">Name *</label>
              <input data-testid="enquiry-name" className={field} placeholder="Your name" value={form.name} onChange={update('name')} />
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600">WhatsApp Number *</label>
              <input data-testid="enquiry-whatsapp" className={field} placeholder="+91 …" value={form.whatsapp} onChange={update('whatsapp')} />
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> Event Date</label>
              <input data-testid="enquiry-date" type="date" className={field} value={form.eventDate} onChange={update('eventDate')} />
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Location / City</label>
              <input data-testid="enquiry-location" className={field} placeholder="e.g. Delhi" value={form.location} onChange={update('location')} />
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600 flex items-center gap-1"><Hash className="w-3.5 h-3.5" /> Quantity</label>
              <input data-testid="enquiry-quantity" className={field} placeholder="e.g. 200 coconuts" value={form.quantity} onChange={update('quantity')} />
            </div>
            <div className="sm:col-span-1">
              <label className="text-xs font-semibold text-gray-600">Event Type</label>
              <select data-testid="enquiry-eventtype" className={field} value={form.eventType} onChange={update('eventType')}>
                <option value="">Select event type</option>
                {CONTACT.eventTypes.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold text-gray-600">Customization Details</label>
              <textarea data-testid="enquiry-customization" rows={3} className={field} placeholder="Names, hashtag, logo, theme colours…" value={form.customization} onChange={update('customization')} />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={submitting} data-testid="enquiry-submit" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-6 text-base font-semibold">
                {submitting ? 'Sending…' : (<><Send className="w-4 h-4 mr-2" /> Send Enquiry & Get Quote on WhatsApp</>)}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
