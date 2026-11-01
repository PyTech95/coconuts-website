import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { BRAND, waLink } from '../data/mock';

const CTA = () => {
  return (
    <section className="py-16 bg-blush">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-pink-500 p-10 md:p-14 text-center text-white shadow-2xl">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <h3 className="relative font-display font-bold text-3xl md:text-4xl">Ready to make your event unforgettable?</h3>
          <p className="relative mt-3 text-white/90 max-w-2xl mx-auto">Trusted by 1000+ events across India for fresh, personalized coconuts. Get a custom quote for your celebration today.</p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <a href={`tel:${BRAND.phone}`} className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50">
              <Phone className="w-4 h-4" /> Call {BRAND.phone}
            </a>
            <a href={waLink('Hi Mr. Coconetto! I would like a custom quote for personalized coconuts.')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-pink-700 hover:bg-pink-800 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              <MessageCircle className="w-4 h-4" /> Get a Quote on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
