import React from 'react';
import { Phone, MessageCircle, Instagram } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Sec } from '../cms/Editable';
import { waLink } from '../lib/api';

const FloatingButtons = () => {
  const { get } = useContent();
  const brand = get('brand', {});
  const social = get('social', {});

  return (
    <Sec id="floating" as="div" label="Floating buttons" className="fixed bottom-5 right-4 sm:bottom-6 sm:right-5 z-40 flex flex-col gap-2.5">
      <a
        href={social.instagram}
        target="_blank"
        rel="noreferrer"
        aria-label="Instagram"
        data-testid="floating-instagram"
        className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-xl flex items-center justify-center transition-transform hover:scale-110"
        style={{ background: 'linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)' }}
      >
        <Instagram className="w-5 h-5 sm:w-6 sm:h-6 text-white relative" />
        <T path="floating.instagramLabel" as="span" className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block" />
      </a>
      <a
        href={waLink(brand.phoneRaw)}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
        className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-green-500 hover:bg-green-600 shadow-xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-30" />
        <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 text-white relative" />
        <T path="floating.whatsappLabel" as="span" className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block" />
      </a>
      <a
        href={`tel:${brand.phone}`}
        aria-label="Call"
        className="group relative w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-pink-600 hover:bg-pink-700 shadow-xl flex items-center justify-center transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 rounded-full bg-pink-500 animate-ping opacity-30" />
        <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-white relative" />
        <T path="floating.callLabel" as="span" className="absolute right-14 top-1/2 -translate-y-1/2 whitespace-nowrap bg-gray-900 text-white text-xs px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block" />
      </a>
    </Sec>
  );
};

export default FloatingButtons;
