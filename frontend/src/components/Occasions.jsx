import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { OCCASIONS } from '../data/mock';

const Occasions = () => {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? OCCASIONS : OCCASIONS.slice(0, 20);

  return (
    <section className="section-pad bg-gradient-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-8">
          <span className="text-pink-600 font-script text-2xl">Every Celebration</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            Coconut Ideas for <em className="text-green-700 not-italic">Every Occasion</em>
          </h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From weddings and corporate meetings to intimate get-togethers — our carved, stamped and personalized coconuts add fun and tropical vibes to any event. Try our personalized coconut water to keep you refreshed and energized throughout your celebrations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {visible.map((o) => (
            <a key={o} href="#" className="group px-4 py-3 rounded-xl bg-white border border-green-100 hover:border-pink-300 hover:shadow-md text-sm text-gray-700 hover:text-pink-700 transition-all">
              {o}
            </a>
          ))}
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => setExpanded(!expanded)} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold shadow-lg">
            {expanded ? 'Show Less' : `View All ${OCCASIONS.length}+ Occasions`} <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default Occasions;
