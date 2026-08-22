import React from 'react';
import { Phone, CheckCircle2, Cpu, MapPin, Star, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { BRAND, HERO, HERO_FEATURES, MARQUEE_ITEMS, EVENT_TYPES, waLink } from '../data/mock';
import { useSiteContent } from '../context/SiteContent';
import { EditableText } from './admin/Editable';

const iconMap = { Check: CheckCircle2, Cpu, MapPin, Star };

const Hero = () => {
  const { content } = useSiteContent();
  const hero = { ...HERO, ...(content?.hero || {}) };
  return (
    <section id="home" className="relative pt-28 md:pt-32 pb-14 md:pb-20 overflow-hidden bg-gradient-to-b from-pink-50 via-white to-green-50">
      {/* Decorative blobs */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-pink-200/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-green-200/40 rounded-full blur-3xl pointer-events-none" />

      {/* Marquee ribbon */}
      <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-pink-600 text-white py-2.5 mb-8 md:mb-12">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          {/* Left: Text */}
          <div className="animate-fade-up order-2 lg:order-1">
            <EditableText path="hero.badge" as="span" className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-pink-200 text-pink-700 text-xs font-semibold shadow-sm">
              {hero.badge}
            </EditableText>
            <h1 className="mt-5 font-display font-extrabold text-[1.7rem] leading-[1.18] sm:text-4xl sm:leading-[1.1] md:text-5xl lg:text-[3.2rem] lg:leading-[1.08] text-gray-900">
              <EditableText path="hero.titleLine1" as="span">{hero.titleLine1}</EditableText>
              <br />
              <EditableText path="hero.titleAccent" as="span" className="text-gradient-pink-green">{hero.titleAccent}</EditableText>
              <br />
              <EditableText path="hero.titleLine3" as="span" className="text-green-700">{hero.titleLine3}</EditableText>
            </h1>
            <EditableText path="hero.subheading" as="p" className="mt-4 text-lg font-script text-pink-600">{hero.subheading}</EditableText>
            <EditableText path="hero.description" as="p" multiline className="mt-4 text-gray-600 max-w-xl leading-relaxed">
              {hero.description}
            </EditableText>
            <EditableText path="hero.brandLine" as="p" className="mt-4 font-display font-bold text-green-800">{hero.brandLine}</EditableText>

            <div className="mt-7 flex flex-wrap gap-3">
              <a href={waLink(hero.whatsappMsg)} target="_blank" rel="noreferrer" data-testid="hero-whatsapp-btn">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white rounded-full px-7 shadow-lg">
                  <MessageCircle className="w-4 h-4 mr-2" /> {hero.primaryCta}
                </Button>
              </a>
              <a href="#services" data-testid="hero-work-btn">
                <Button size="lg" variant="outline" className="rounded-full px-7 border-pink-400 text-pink-700 hover:bg-pink-50">
                  {hero.secondaryCta}
                </Button>
              </a>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
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

          {/* Right: 3-Image Collage */}
          <div className="relative animate-fade-up order-1 lg:order-2">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 h-[500px] sm:h-[520px] md:h-[580px] lg:h-[600px]">
              {/* Tall image (left) - Wedding */}
              <div className="relative rounded-3xl overflow-hidden shadow-xl group border-4 border-white">
                <img
                  src={EVENT_TYPES[0].image}
                  alt={EVENT_TYPES[0].title}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <span className="absolute top-3 left-3 bg-white/95 text-pink-600 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">✦ Featured</span>
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="font-display font-bold text-lg sm:text-xl">{EVENT_TYPES[0].title}</div>
                  <div className="text-xs sm:text-sm text-white/85 mt-0.5">{EVENT_TYPES[0].subtitle}</div>
                </div>
              </div>

              {/* Right stack: Corporate + Sangeet */}
              <div className="grid grid-rows-2 gap-3 sm:gap-4">
                <div className="relative rounded-3xl overflow-hidden shadow-xl group border-4 border-white">
                  <img
                    src={EVENT_TYPES[1].image}
                    alt={EVENT_TYPES[1].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="font-display font-bold text-sm sm:text-base">{EVENT_TYPES[1].title}</div>
                    <div className="text-[11px] sm:text-xs text-white/90 mt-0.5">{EVENT_TYPES[1].subtitle}</div>
                  </div>
                </div>

                <div className="relative rounded-3xl overflow-hidden shadow-xl group border-4 border-white">
                  <img
                    src={EVENT_TYPES[2].image}
                    alt={EVENT_TYPES[2].title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="font-display font-bold text-sm sm:text-base leading-tight">{EVENT_TYPES[2].title}</div>
                    <div className="text-[11px] sm:text-xs text-white/90 mt-0.5">{EVENT_TYPES[2].subtitle}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating chips - only visible on md+ */}
            <div className="hidden md:flex absolute -left-4 lg:-left-6 top-8 bg-white shadow-2xl rounded-2xl p-2.5 pr-4 items-center gap-3 animate-float z-10">
              <img src={BRAND.logo} alt="logo" className="w-10 h-10 object-contain" />
              <div className="text-left leading-tight">
                <div className="text-[10px] text-gray-500 font-script">Simply Original</div>
                <div className="font-bold text-green-700 text-sm">Mr. Coconetto</div>
              </div>
            </div>

            <div className="hidden md:flex absolute -left-4 lg:-left-6 bottom-6 bg-white shadow-2xl rounded-2xl p-2.5 pr-4 items-center gap-3 animate-float z-10" style={{ animationDelay: '1.5s' }}>
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">A+</div>
              <div className="text-left leading-tight">
                <div className="text-[10px] text-gray-500">Grade</div>
                <div className="font-bold text-gray-800 text-sm">Chilled & Fresh</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
