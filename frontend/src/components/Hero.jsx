import React from 'react';
import { CheckCircle2, Cpu, MapPin, Star } from 'lucide-react';
import HeroSlider from './HeroSlider';
import { HERO, HERO_FEATURES, MARQUEE_ITEMS } from '../data/mock';

const iconMap = { Check: CheckCircle2, Cpu, MapPin, Star };

const Hero = () => {
  return (
    <section id="home" className="relative pt-[92px] md:pt-[104px] overflow-hidden bg-white">
      <h1 className="sr-only">{HERO.heading}</h1>

      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-pink-600 text-white py-2.5">
        <div
          className="flex whitespace-nowrap animate-marquee w-max"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 9%, black 91%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 9%, black 91%, transparent)' }}
        >
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span key={i} className="mx-4 sm:mx-6 inline-flex items-center gap-2 text-xs sm:text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
              {item}
            </span>
          ))}
        </div>
      </div>

      <HeroSlider />

      <div className="bg-white border-b border-pink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-wrap gap-x-8 gap-y-3" data-testid="hero-features">
          {HERO_FEATURES.map((f) => {
            const Icon = iconMap[f.icon] || CheckCircle2;
            return (
              <div key={f.text} className="inline-flex items-center gap-2 text-sm text-gray-700">
                <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center"><Icon className="w-4 h-4 text-green-700" /></span>
                <span className="font-medium">{f.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Hero;
