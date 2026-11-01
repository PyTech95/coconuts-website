import React from 'react';
import { Cpu, Award, Clock, Palette, Globe, Trophy } from 'lucide-react';
import { WHY_CHOOSE } from '../data/mock';

const iconMap = { Cpu, Award, Clock, Palette, Globe, Trophy };

const WhyChoose = () => {
  return (
    <section className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-pink-600 font-script text-2xl">Our Advantage</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            Why Choose <em className="text-green-700 not-italic">Mr. Coconetto?</em>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">6+ years of excellence, 1000+ events served — here's why India's top wedding planners trust us.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE.map((w) => {
            const Icon = iconMap[w.icon] || Award;
            return (
              <div key={w.num} className="group relative rounded-3xl p-7 bg-gradient-to-br from-green-50 to-pink-50 border border-green-100 hover:border-pink-300 transition-colors overflow-hidden">
                <div className="absolute -top-4 -right-4 text-8xl font-display font-black text-green-100 select-none">{w.num}</div>
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center text-pink-600 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="mt-4 font-display font-bold text-xl text-gray-900">{w.title}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{w.description}</p>
                  <span className="mt-4 inline-block px-3 py-1 rounded-full bg-white border border-pink-200 text-xs font-semibold text-pink-700">{w.tag}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
