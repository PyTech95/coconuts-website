import React from 'react';
import { Leaf, Star } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';
import { getIcon } from '../cms/icons';

const AboutUs = () => {
  const { get } = useContent();
  const points = get('about.points', []);
  const badges = get('about.badges', []);
  const stats = get('about.stats', []);
  const founder = get('about.founder', {});

  return (
    <Sec id="about" label="About us" data-testid="about-section" className="bg-beige">
      {/* Top: content + mascot */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 lg:gap-14 px-4 sm:px-6 pt-16 md:pt-24 pb-10 items-center">
        {/* Left content */}
        <div data-testid="about-content">
          <div className="flex items-center gap-3">
            <T path="about.label" as="span" className="uppercase tracking-[0.25em] text-xs font-bold text-green-800" />
            <span className="h-px w-16 bg-green-800/40" />
          </div>

          <h2 className="mt-5 font-display font-extrabold text-4xl md:text-5xl lg:text-[3.25rem] leading-[1.05] text-gray-900">
            <T path="about.titleLine1" as="span" />
            <br />
            <T path="about.titleLine2" as="span" />
          </h2>
          <T path="about.script" as="p" className="font-script text-green-700 text-4xl md:text-5xl mt-2 inline-block border-b-2 border-green-600/60 pb-1" />

          <T path="about.intro" as="p" className="mt-6 text-gray-600 leading-relaxed max-w-xl font-semibold" />
          <T path="about.story" as="p" className="mt-3 text-gray-600 leading-relaxed max-w-xl" />

          <div className="mt-8 space-y-6">
            {points.map((p, i) => {
              const Icon = getIcon(p.icon, Leaf);
              return (
                <div key={i} data-testid={`about-point-${String(p.title || '').toLowerCase().replace(/\s+/g, '-')}`} className="flex gap-4">
                  <div className="shrink-0 w-12 h-12 rounded-full bg-green-700 text-white flex items-center justify-center shadow-md">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <T path={`about.points.${i}.title`} as="h3" className="font-display font-bold text-lg text-gray-900 uppercase tracking-wide" />
                    <T path={`about.points.${i}.description`} as="p" className="mt-1 text-sm text-gray-600 leading-relaxed max-w-md" />
                  </div>
                </div>
              );
            })}
            <ListTools path="about.points" label="about points" />
          </div>

          {/* Badges */}
          <div className="mt-9 pt-7 border-t border-green-800/10 grid grid-cols-4 gap-4 max-w-md">
            {badges.map((b, i) => {
              const Icon = getIcon(b.icon, Leaf);
              return (
                <div key={i} className="flex flex-col items-center text-center gap-2">
                  <Icon className="w-6 h-6 text-green-800" strokeWidth={1.6} />
                  <T path={`about.badges.${i}.label`} as="span" className="text-[11px] font-bold tracking-widest uppercase text-gray-700" />
                </div>
              );
            })}
          </div>
          <ListTools path="about.badges" label="badges" />
        </div>

        {/* Right mascot */}
        <div data-testid="about-mascot" className="relative">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-b from-sky-100 via-emerald-50 to-green-100 shadow-xl ring-1 ring-green-900/5">
            <Img
              path="about.mascot"
              alt="Mr. Coconetto mascot"
              className="w-full h-full object-contain"
              loading="lazy"
            />
          </div>
          {/* Real engraved-coconut accent */}
          <Img
            path="about.product"
            alt="Personalised Mr. Coconetto coconut"
            className="hidden sm:block absolute -bottom-6 -left-6 w-28 md:w-36 rounded-2xl bg-white shadow-2xl ring-4 ring-white rotate-[-6deg]"
            loading="lazy"
          />
          <div className="hidden sm:flex absolute -top-4 right-6 items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 animate-pulse" />
            <T path="about.chip" as="span" className="text-xs font-bold text-gray-800" />
          </div>
        </div>
      </div>

      {/* Bottom dark-green band: stats + founder */}
      <Sec id="about-stats" as="div" label="About stats band" className="bg-[#173d1f] text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 px-4 sm:px-6 py-10 md:py-12 items-center">
          {/* Stats */}
          <div data-testid="about-stats" className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s, i) => {
              const Icon = getIcon(s.icon, Star);
              return (
                <div key={i} className="flex flex-col gap-1">
                  <Icon className="w-6 h-6 text-yellow-400" />
                  <T path={`about.stats.${i}.value`} as="div" className="font-display font-extrabold text-2xl md:text-3xl text-yellow-400" />
                  <T path={`about.stats.${i}.label`} as="div" className="text-xs md:text-sm text-white/80 leading-tight" />
                </div>
              );
            })}
            <ListTools path="about.stats" label="about stats" />
          </div>

          {/* Founder card */}
          <div data-testid="founder-card" className="bg-beige text-gray-900 rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5 sm:items-center text-center sm:text-left shadow-2xl">
            <Img
              path="about.founder.photo"
              alt={`${founder.name || ''} — Founder, Mr. Coconetto`}
              className="w-24 h-28 md:w-28 md:h-32 rounded-xl object-cover shrink-0 mx-auto sm:mx-0"
              loading="lazy"
            />
            <div>
              <T path="about.founder.kicker" as="p" className="font-script text-green-700 text-2xl leading-none" />
              <T path="about.founder.name" as="h3" className="font-display font-bold text-2xl mt-1" />
              <T path="about.founder.role" as="p" className="text-sm font-bold text-green-800" />
              <T path="about.founder.bio" as="p" className="mt-2 text-sm text-gray-600 leading-relaxed" />
              <T path="about.founder.name" as="p" className="font-script text-xl text-gray-900 mt-2" />
            </div>
          </div>
        </div>
      </Sec>
    </Sec>
  );
};

export default AboutUs;
