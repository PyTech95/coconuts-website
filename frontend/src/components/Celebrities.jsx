import React from 'react';
import { Crown, Sparkles, ArrowRight } from 'lucide-react';
import { CELEBRITIES, BIG_EVENTS } from '../data/mock';

const Celebrities = () => {
  return (
    <section id="celebrities" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 text-pink-600 font-script text-2xl"><Crown className="w-6 h-6" /> Proud to Have Served</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            India's Biggest <em className="text-green-700 not-italic">Celebrities</em> & Grand Events
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">From marquee celebrities to India's most prestigious national & international events — we've been there.</p>
        </div>

        {/* Big events strip */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {BIG_EVENTS.map((e) => (
            <span key={e} className="px-4 py-2 rounded-full bg-gradient-to-r from-pink-50 to-green-50 border border-pink-200 text-sm font-medium text-gray-800">{e}</span>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {CELEBRITIES.map((c, i) => (
            <div key={i} className="coco-card group relative rounded-3xl overflow-hidden bg-gradient-to-br from-pink-100 to-green-100 aspect-[3/4]">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              {c.tag && (
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-pink-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                  <Sparkles className="w-3 h-3" /> {c.tag}
                </span>
              )}
              <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                <div className="font-display font-bold text-lg">{c.name}</div>
                <div className="text-xs text-white/85">{c.role}</div>
              </div>
            </div>
          ))}
          {/* Placeholder "many more" */}
          <div className="rounded-3xl bg-gradient-to-br from-green-600 to-pink-600 text-white p-6 flex flex-col items-center justify-center text-center aspect-[3/4]">
            <Sparkles className="w-10 h-10 mb-3" />
            <div className="font-display font-bold text-2xl">+ Many More</div>
            <div className="text-sm opacity-90 mt-1">Celebrities, Politicians & Sports Stars</div>
            <a href="#" className="mt-4 inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full text-sm font-semibold">View All <ArrowRight className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Celebrities;
