import React from 'react';
import { STATS } from '../data/mock';

const Stats = () => {
  return (
    <section className="py-14 bg-gradient-to-r from-green-600 via-green-500 to-pink-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {STATS.map((s) => (
            <div key={s.label} className="text-white">
              <div className="font-display font-extrabold text-3xl md:text-4xl">{s.value}</div>
              <div className="text-sm md:text-base text-white/90 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
