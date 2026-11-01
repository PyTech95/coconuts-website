import React from 'react';
import { PARTNERS } from '../data/mock';

const Partners = () => {
  const row1 = PARTNERS.slice(0, 16);
  const row2 = PARTNERS.slice(16);

  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-pink-600 font-script text-2xl">Our Prestigious Partners</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            Worked at <em className="text-green-700 not-italic">India's Finest</em> Hotels & Venues
          </h2>
        </div>

        <div className="space-y-4">
          <div className="overflow-hidden py-2">
            <div className="flex whitespace-nowrap animate-marquee">
              {[...row1, ...row1].map((p, i) => (
                <span key={i} className="mx-3 inline-flex px-5 py-3 bg-gradient-to-r from-green-50 to-pink-50 border border-green-100 rounded-xl text-gray-800 font-semibold text-sm">{p}</span>
              ))}
            </div>
          </div>
          <div className="overflow-hidden py-2">
            <div className="flex whitespace-nowrap animate-marquee" style={{ animationDirection: 'reverse' }}>
              {[...row2, ...row2].map((p, i) => (
                <span key={i} className="mx-3 inline-flex px-5 py-3 bg-gradient-to-r from-pink-50 to-green-50 border border-pink-100 rounded-xl text-gray-800 font-semibold text-sm">{p}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
