import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Sec } from '../cms/Editable';
import { waLink } from '../lib/api';

const CTA = () => {
  const { get } = useContent();
  const brand = get('brand', {});

  return (
    <Sec id="cta" label="Call to action" className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-green-600 via-green-500 to-pink-500 p-10 md:p-14 text-center text-white shadow-2xl">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
          <T path="cta.title" as="h3" className="relative font-display font-bold text-3xl md:text-4xl" />
          <T path="cta.desc" as="p" className="relative mt-3 text-white/90 max-w-2xl mx-auto" />
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <a href={`tel:${brand.phone}`} className="inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50">
              <Phone className="w-4 h-4" /> <T path="cta.callLabel" as="span" /> <T path="brand.phone" as="span" />
            </a>
            <a href={waLink(brand.phoneRaw, get('cta.waMsg', ''))} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 bg-pink-700 hover:bg-pink-800 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              <MessageCircle className="w-4 h-4" /> <T path="cta.waLabel" as="span" />
            </a>
          </div>
        </div>
      </div>
    </Sec>
  );
};

export default CTA;
