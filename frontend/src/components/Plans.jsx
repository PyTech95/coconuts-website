import React from 'react';
import { Check, Package, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { PLANS, BRAND, waLink } from '../data/mock';

const THEME = {
  'Gold Plan': {
    ring: 'border-amber-400/40',
    glow: 'shadow-[0_0_55px_-12px_rgba(251,191,36,0.55)]',
    title: 'from-amber-200 to-yellow-500',
    btn: 'from-amber-400 to-yellow-500 text-amber-950',
    dot: 'text-amber-300',
    chipBg: 'bg-amber-400/10 border-amber-400/30 text-amber-200',
  },
  'Diamond Plan': {
    ring: 'border-cyan-400/50',
    glow: 'shadow-[0_0_65px_-10px_rgba(34,211,238,0.6)]',
    title: 'from-cyan-200 to-sky-500',
    btn: 'from-cyan-400 to-sky-500 text-cyan-950',
    dot: 'text-cyan-300',
    chipBg: 'bg-cyan-400/10 border-cyan-400/30 text-cyan-200',
  },
  'Platinum Plan': {
    ring: 'border-pink-400/50',
    glow: 'shadow-[0_0_60px_-12px_rgba(244,114,182,0.55)]',
    title: 'from-pink-200 to-rose-500',
    btn: 'from-pink-500 to-rose-500 text-white',
    dot: 'text-pink-300',
    chipBg: 'bg-pink-400/10 border-pink-400/30 text-pink-200',
  },
};

const Plans = () => {
  return (
    <section id="plans" className="section-pad relative overflow-hidden bg-[#0d0710]">
      {/* neon glows */}
      <div className="pointer-events-none absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="text-center mb-12">
          <span className="uppercase tracking-[0.35em] text-xs font-bold text-pink-400">Our Plans</span>
          <h2 className="mt-2 font-display font-bold text-3xl md:text-5xl text-white">
            Choose Your <span className="bg-gradient-to-r from-pink-400 to-rose-500 bg-clip-text text-transparent">Perfect Plan</span>
          </h2>
          <p className="mt-3 text-white/60 max-w-2xl mx-auto">
            Every plan includes a minimum of 100 personalized coconuts. All A+ grade, fresh &amp; chilled. For a custom quote,{' '}
            <a href={`https://wa.me/${BRAND.phoneRaw}`} className="text-pink-400 underline">WhatsApp us →</a>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((p) => {
            const t = THEME[p.name] || THEME['Gold Plan'];
            return (
              <div
                key={p.name}
                data-testid={`plan-card-${p.name.toLowerCase().split(' ')[0]}`}
                className={`relative rounded-3xl p-7 bg-white/[0.03] backdrop-blur-sm border ${t.ring} ${t.glow} transition-all hover:-translate-y-1 ${p.highlight ? 'md:-translate-y-4' : ''}`}
              >
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 bg-gradient-to-r from-cyan-400 to-sky-500 text-cyan-950 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <Sparkles className="w-3.5 h-3.5" /> {p.badge}
                  </div>
                )}

                <div className={`inline-block rounded-xl px-4 py-2 bg-gradient-to-r ${t.title} bg-clip-text text-transparent`}>
                  <h3 className="font-display font-bold text-2xl">{p.name}</h3>
                </div>
                <p className="text-xs uppercase tracking-wider text-white/50 mt-1">{p.subtitle}</p>
                <p className="mt-4 text-white/70 italic text-sm">“{p.description}”</p>

                <div className="mt-5 space-y-3">
                  <div className="text-[11px] uppercase tracking-wider font-bold text-white/40">What's included</div>
                  {p.features.map((f) => (
                    <div key={f} className="flex items-start gap-3">
                      <span className={`mt-0.5 w-5 h-5 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 ${t.dot}`}><Check className="w-3.5 h-3.5" /></span>
                      <span className="text-sm text-white/80">{f}</span>
                    </div>
                  ))}
                </div>

                {p.note && (
                  <div className="mt-4 p-3 rounded-xl bg-white/5 text-white/60 text-xs border border-white/10">
                    <strong className="text-white/80">Note:</strong> {p.note}
                  </div>
                )}

                <p className="mt-4 text-sm text-white/60">{p.footer}</p>

                <div className={`mt-5 inline-flex items-center gap-1.5 text-sm font-semibold rounded-full border px-3 py-1 ${t.chipBg}`}>
                  <Package className="w-4 h-4" /> {p.minimum}
                </div>

                <a
                  href={waLink(`Hi Mr. Coconetto! I'm interested in the *${p.name}* (${p.subtitle}). Please share a quote.`)}
                  target="_blank"
                  rel="noreferrer"
                  data-testid={`plan-cta-${p.name.toLowerCase().split(' ')[0]}`}
                  className="block mt-5"
                >
                  <Button className={`w-full rounded-full font-bold bg-gradient-to-r ${t.btn} hover:brightness-110 border-0`}>Get a Quote → {p.name}</Button>
                </a>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-white/50 mt-8">All prices are indicative. <a href={`https://wa.me/${BRAND.phoneRaw}`} className="text-pink-400 underline">Contact us for a custom quote →</a></p>
      </div>
    </section>
  );
};

export default Plans;
