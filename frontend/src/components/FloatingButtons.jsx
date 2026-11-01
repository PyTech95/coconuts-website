import React from 'react';
import { Phone, MessageCircle, Instagram } from 'lucide-react';
import { BRAND, SOCIAL } from '../data/mock';

const FloatingButtons = () => {
  return (
    <div className="mc-floating fixed bottom-5 right-4 sm:bottom-6 sm:right-5 z-40 flex flex-col gap-2.5">
      <a
        href={SOCIAL.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        data-testid="floating-instagram"
        className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
        style={{ background: 'linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)' }}
      >
        <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white relative" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">Instagram</span>
      </a>
      <a
        href={`https://wa.me/${BRAND.phoneRaw}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white relative" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">WhatsApp Us</span>
      </a>
      <a
        href={`tel:${BRAND.phone}`}
        aria-label="Call"
        className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-600 hover:bg-pink-700 shadow-xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-30" />
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white relative" />
        <span className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">Call Now</span>
      </a>
    </div>
  );
};

export default FloatingButtons;
