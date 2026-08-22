import React from 'react';
import { EVENT_TYPES } from '../data/mock';

const EventTypes = () => {
  return (
    <section className="py-14 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-3 gap-6">
          {EVENT_TYPES.map((e) => (
            <div key={e.title} className="coco-card group relative rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-pink-50 border border-green-100">
              <div className="aspect-[4/3] overflow-hidden">
                <img src={e.image} alt={e.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-xl text-green-800">{e.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{e.subtitle}</p>
              </div>
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-pink-600 text-xs font-bold px-3 py-1 rounded-full shadow">Popular</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventTypes;
