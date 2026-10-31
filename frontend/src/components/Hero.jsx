import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, ChevronLeft, ChevronRight, Pause, Play, ArrowDown, Film } from 'lucide-react';
import { Button } from './ui/button';
import { useContent } from '../cms/ContentContext';
import { T, Img, Vid, Sec, ListTools, styleFromOverride } from '../cms/Editable';
import { getIcon } from '../cms/icons';
import { asset, waLink } from '../lib/api';

const clamp = (n, lo, hi) => Math.min(Math.max(n, lo), hi);

/** Title line with a word-by-word reveal (falls back to the plain editable text while editing). */
const StaggerText = ({ path, className, wordClass = '', delay = 0, editMode, get, styles }) => {
  if (editMode) return <T path={path} as="span" className={`${className} ${wordClass}`} />;
  const text = String(get(path, '') || '');
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span className={className} style={styleFromOverride(styles[path])}>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span className="hero-word-wrap">
            <span className={`hero-word ${wordClass}`} style={{ animationDelay: `${delay + i * 70}ms` }}>{w}</span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </React.Fragment>
      ))}
    </span>
  );
};

const Hero = () => {
  const { get, editMode, styles } = useContent();
  const slides = get('hero.slides', []);
  const brand = get('brand', {});
  const chips = get('hero.chips', []);
  const n = slides.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hover, setHover] = useState(false);
  const [tick, setTick] = useState(0);
  const timer = useRef(null);
  const sectionRef = useRef(null);

  const safeIndex = n ? ((index % n) + n) % n : 0;
  const slide = slides[safeIndex] || {};
  const duration = clamp(Number(slide.duration) || 6, 2, 30); // seconds
  const isVideo = slide.type === 'video';
  const halted = paused || hover || editMode || n <= 1;

  const goTo = useCallback((i) => { setIndex(n ? ((i % n) + n) % n : 0); setTick((t) => t + 1); }, [n]);
  const next = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex]);
  const prev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex]);

  // Auto-advance. Videos also advance on "ended" — whichever comes first.
  useEffect(() => {
    clearTimeout(timer.current);
    if (halted) return undefined;
    timer.current = setTimeout(next, duration * 1000);
    return () => clearTimeout(timer.current);
  }, [safeIndex, halted, duration, tick, next]);

  // Preload the next slide's image / poster.
  useEffect(() => {
    const nx = slides[(safeIndex + 1) % Math.max(n, 1)];
    if (!nx) return;
    const src = nx.type === 'video' ? nx.poster : nx.src;
    if (src) { const im = new Image(); im.src = asset(src); }
  }, [safeIndex, slides, n]);

  // Keyboard arrows
  useEffect(() => {
    const h = (e) => {
      if (e.target && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.target && e.target.isContentEditable) return;
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [next, prev]);

  // Subtle mouse parallax on the media (desktop only, no re-render)
  const onMove = (e) => {
    const el = sectionRef.current;
    if (!el || window.matchMedia('(pointer: coarse)').matches) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--px', (((e.clientX - r.left) / r.width) - 0.5) * 2);
    el.style.setProperty('--py', (((e.clientY - r.top) / r.height) - 0.5) * 2);
  };

  const features = get('hero.features', []);
  const marquee = get('hero.marquee', []);
  const waMsg = get('hero.whatsappMsg', '');
  const secondaryHref = get('hero.secondaryHref', '#services');
  const slidePath = `hero.slides.${safeIndex}`;
  const kbClass = safeIndex % 2 === 0 ? 'hero-kb-in' : 'hero-kb-out';
  const progressKey = `${safeIndex}-${tick}`;
  const mediaStyle = useMemo(() => ({ '--kb-duration': `${duration + 1.5}s` }), [duration]);
  const navBtn = 'w-11 h-11 rounded-full border border-white/40 bg-black/30 backdrop-blur flex items-center justify-center hover:bg-white hover:text-gray-900 transition-colors';

  return (
    <>
      <Sec
        id="home"
        label="Hero slider"
        className={`relative w-full h-[88vh] min-h-[600px] max-h-[980px] overflow-hidden bg-gray-950 text-white ${halted && !editMode ? 'hero-paused' : ''}`}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => { setHover(false); const el = sectionRef.current; if (el) { el.style.setProperty('--px', 0); el.style.setProperty('--py', 0); } }}
        onMouseMove={onMove}
        aria-roledescription="carousel"
        ref={sectionRef}
      >
        {/* ---- media layer ---- */}
        <AnimatePresence initial={false}>
          <motion.div
            key={`${slide.id || 'slide'}-${safeIndex}-${tick}`}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          >
            <div className="absolute inset-0 hero-parallax">
              {isVideo ? (
                <Vid
                  path={`${slidePath}.src`}
                  posterPath={`${slidePath}.poster`}
                  className="absolute inset-0 w-full h-full object-cover"
                  autoPlay
                  muted
                  playsInline
                  preload="auto"
                  onEnded={() => { if (!halted) next(); }}
                  onError={() => { if (!halted) setTimeout(next, 400); }}
                />
              ) : (
                <Img
                  path={`${slidePath}.src`}
                  alt={slide.title || brand.name}
                  className={`absolute inset-0 w-full h-full object-cover ${kbClass}`}
                  style={mediaStyle}
                  fetchPriority="high"
                />
              )}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* ---- overlays ---- */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-black/35 to-black/15" />
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-black/60 via-black/10 to-transparent" />
        <div className="absolute inset-0 pointer-events-none hero-grain opacity-[0.07]" />
        <div className="absolute -bottom-40 -left-40 w-[560px] h-[560px] rounded-full bg-pink-600/25 blur-3xl pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full bg-green-500/20 blur-3xl pointer-events-none" />

        {/* big faded slide number */}
        {n > 1 && (
          <div key={`num-${progressKey}`} className="hero-text-in-2 hidden lg:block absolute top-32 right-10 font-display font-black text-[11rem] leading-none text-white/[0.06] select-none pointer-events-none tabular-nums">
            {String(safeIndex + 1).padStart(2, '0')}
          </div>
        )}

        {/* floating glass chips (desktop) */}
        <div className="hidden lg:flex absolute top-36 right-8 flex-col items-end gap-3 z-20">
          {chips.map((c, i) => {
            const Icon = getIcon(c.icon);
            return (
              <div key={i} className="animate-float inline-flex items-center gap-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 shadow-xl" style={{ animationDelay: `${i * 1.2}s` }}>
                <span className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-pink-500 flex items-center justify-center shadow"><Icon className="w-4 h-4 text-white" /></span>
                <T path={`hero.chips.${i}.text`} as="span" className="text-sm font-semibold" />
              </div>
            );
          })}
          {editMode && <ListTools path="hero.chips" label="chips" />}
        </div>

        {editMode && (
          <div className="absolute top-36 left-4 sm:left-6 z-40">
            <ListTools path="hero.slides" label="slides" />
          </div>
        )}

        {/* ---- content ---- */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-20 sm:pb-24 lg:pb-32">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 lg:gap-12">
              {/* Left: text */}
              <div key={progressKey} className="max-w-3xl pointer-events-auto">
                <div className="hero-text-in flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/25 text-xs sm:text-sm font-semibold tracking-wide">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                    <T path={`${slidePath}.kicker`} as="span" />
                  </span>
                  {isVideo && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-pink-600/90 text-[11px] font-bold uppercase tracking-wider">
                      <Film className="w-3 h-3" /> Video
                    </span>
                  )}
                </div>
                <h1 className="mt-4 font-display font-extrabold leading-[1.05] text-[2rem] sm:text-5xl lg:text-6xl xl:text-[3.9rem] drop-shadow-[0_6px_24px_rgba(0,0,0,.45)]">
                  <StaggerText path={`${slidePath}.title`} className="block" delay={120} editMode={editMode} get={get} styles={styles} />
                  <span className="relative inline-block pb-2">
                    <T path={`${slidePath}.titleAccent`} as="span" className="hero-text-in-2 block text-gradient-pink-green" />
                    <svg className="hero-underline absolute left-0 -bottom-0.5 w-full h-3" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true">
                      <path d="M2 9 C 50 2, 150 2, 198 9" fill="none" stroke="url(#heroUnderline)" strokeWidth="3" strokeLinecap="round" />
                      <defs><linearGradient id="heroUnderline" x1="0" x2="1"><stop offset="0" stopColor="#ec4899" /><stop offset="1" stopColor="#4ade80" /></linearGradient></defs>
                    </svg>
                  </span>
                </h1>
                <T path={`${slidePath}.subtitle`} as="p" className="hero-text-in-3 mt-4 text-sm sm:text-lg text-white/85 max-w-xl leading-relaxed" />
                <T path="hero.brandLine" as="p" className="hero-text-in-4 mt-3 font-script text-xl sm:text-2xl text-pink-200" />
              </div>

              {/* Right: buttons + arrows */}
              <div className="pointer-events-auto flex flex-col items-start lg:items-end gap-4 shrink-0">
                <div className="flex flex-wrap lg:flex-col xl:flex-row gap-3">
                  <a href={waLink(brand.phoneRaw, waMsg)} target="_blank" rel="noreferrer" data-testid="hero-whatsapp-btn">
                    <Button size="lg" className="hero-cta-glow bg-green-600 hover:bg-green-700 text-white rounded-full px-7 h-12">
                      <MessageCircle className="w-4 h-4 mr-2" /> <T path="hero.primaryCta" as="span" />
                    </Button>
                  </a>
                  <a href={secondaryHref} data-testid="hero-work-btn">
                    <Button size="lg" variant="outline" className="rounded-full px-7 h-12 border-white/70 bg-white/10 backdrop-blur text-white hover:bg-white hover:text-green-800">
                      <T path="hero.secondaryCta" as="span" /> <ArrowDown className="w-4 h-4 ml-2" />
                    </Button>
                  </a>
                </div>
                {n > 1 && (
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={prev} aria-label="Previous slide" data-cms-allow className={navBtn}><ChevronLeft className="w-5 h-5" /></button>
                    <button type="button" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Play' : 'Pause'} data-cms-allow className={navBtn}>
                      {paused ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
                    </button>
                    <button type="button" onClick={next} aria-label="Next slide" data-cms-allow className={navBtn}><ChevronRight className="w-5 h-5" /></button>
                    <span className="ml-2 text-xs font-semibold tabular-nums text-white/70">{String(safeIndex + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ---- thumbnails (desktop) ---- */}
        {n > 1 && (
          <div className="hidden lg:flex absolute bottom-8 inset-x-0 justify-center gap-3 px-6 z-20">
            {slides.map((s, i) => {
              const thumb = s.type === 'video' ? (s.poster || '') : s.src;
              const active = i === safeIndex;
              return (
                <button
                  key={s.id || i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  data-cms-allow
                  className={`group relative w-24 h-14 rounded-xl overflow-hidden border transition-all duration-500 ${active ? 'border-white scale-110 shadow-[0_10px_30px_-8px_rgba(0,0,0,.8)]' : 'border-white/30 opacity-70 hover:opacity-100 hover:border-white/70'}`}
                >
                  {thumb ? <img src={asset(thumb)} alt="" className="w-full h-full object-cover" loading="lazy" /> : <div className="w-full h-full bg-gray-800 flex items-center justify-center"><Film className="w-4 h-4 text-white/60" /></div>}
                  {s.type === 'video' && <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 flex items-center justify-center"><Play className="w-2.5 h-2.5 text-white ml-px" /></span>}
                  {active && (
                    <span className="absolute inset-x-0 bottom-0 h-1 bg-white/30">
                      <span key={progressKey} className="hero-progress absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-green-400" style={{ '--slide-duration': `${duration}s` }} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* ---- dots / progress (mobile & tablet) ---- */}
        {n > 1 && (
          <div className="lg:hidden absolute bottom-6 sm:bottom-8 inset-x-0 flex justify-center gap-2 px-6 z-20">
            {slides.map((s, i) => (
              <button
                key={s.id || i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                data-cms-allow
                className={`relative h-1.5 rounded-full overflow-hidden transition-all duration-500 ${i === safeIndex ? 'w-16 bg-white/30' : 'w-6 bg-white/40 hover:bg-white/70'}`}
              >
                {i === safeIndex && (
                  <span key={progressKey} className="hero-progress absolute inset-y-0 left-0 bg-white rounded-full" style={{ '--slide-duration': `${duration}s` }} />
                )}
              </button>
            ))}
          </div>
        )}
      </Sec>

      {/* ---- marquee ribbon ---- */}
      <Sec id="hero-ribbon" as="div" label="Scrolling ribbon" className="relative overflow-hidden bg-gradient-to-r from-green-600 to-pink-600 text-white py-2.5">
        {editMode && <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10"><ListTools path="hero.marquee" label="ribbon items" /></div>}
        <div
          className="flex whitespace-nowrap animate-marquee w-max"
          style={{ WebkitMaskImage: 'linear-gradient(to right, transparent, black 9%, black 91%, transparent)', maskImage: 'linear-gradient(to right, transparent, black 9%, black 91%, transparent)' }}
        >
          {[...marquee, ...marquee].map((item, i) => (
            <span key={i} className="mx-4 sm:mx-6 inline-flex items-center gap-2 text-xs sm:text-sm font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-white/80 shrink-0" />
              {i < marquee.length ? <T path={`hero.marquee.${i}`} as="span" /> : item}
            </span>
          ))}
        </div>
      </Sec>

      {/* ---- feature strip ---- */}
      <Sec id="hero-features" as="div" label="Feature strip" className="bg-white border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {features.map((f, i) => {
            const Icon = getIcon(f.icon);
            return (
              <div key={i} className="inline-flex items-center gap-2 text-sm text-gray-700">
                <span className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center"><Icon className="w-4 h-4 text-green-700" /></span>
                <T path={`hero.features.${i}.text`} as="span" className="font-medium" />
              </div>
            );
          })}
          <ListTools path="hero.features" label="feature chips" />
        </div>
      </Sec>
    </>
  );
};

export default Hero;
