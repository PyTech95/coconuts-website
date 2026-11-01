import React, { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BRAND, HERO_SLIDES } from '../data/mock';
import { useSiteContent } from '../context/SiteContent';

const IMAGE_MS = 4000;
const VIDEO_MS = 6000;

const SpinBadge = () => (
  <div className="relative w-24 h-24 sm:w-28 sm:h-28" data-testid="hero-spin-badge">
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full animate-spin-slow">
      <defs>
        <path id="hero-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
      </defs>
      <text className="fill-white text-[8.5px] font-semibold uppercase tracking-[0.18em]">
        <textPath href="#hero-circle">Simply Original • Mr. Coconetto •</textPath>
      </text>
    </svg>
    <img src={BRAND.logo} alt="Mr. Coconetto logo" className="absolute inset-0 m-auto w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover bg-white p-1 shadow-lg" />
  </div>
);

const SlideText = ({ slide, index }) => (
  <motion.div
    key={index}
    initial="hidden"
    animate="show"
    exit="out"
    variants={{ show: { transition: { staggerChildren: 0.1, delayChildren: 0.25 } } }}
    className="max-w-lg"
  >
    {[
      <span key="t" className="inline-flex items-center gap-2 text-[11px] sm:text-xs font-semibold uppercase tracking-[0.25em] text-pink-200">
        <span className="w-6 h-px bg-pink-300" /> {slide.tag}
      </span>,
      <h2 key="h" className="mt-2 font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight text-white">{slide.title}</h2>,
      <p key="p" className="mt-2 text-sm sm:text-base text-white/85">{slide.text}</p>,
    ].map((el, i) => (
      <div key={i} className="overflow-hidden">
        <motion.div
          variants={{
            hidden: { y: '110%', opacity: 0 },
            show: { y: '0%', opacity: 1, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
            out: { y: '-110%', opacity: 0, transition: { duration: 0.3, ease: 'easeIn' } },
          }}
        >
          {el}
        </motion.div>
      </div>
    ))}
  </motion.div>
);

const SlideMedia = ({ slide, index, duration, src }) => (
  <motion.div
    key={index}
    className="absolute inset-0"
    initial={{ opacity: 0, scale: 1.15, clipPath: 'inset(0 0 0 100%)' }}
    animate={{ opacity: 1, scale: 1, clipPath: 'inset(0 0 0 0%)' }}
    exit={{ opacity: 0 }}
    transition={{ clipPath: { duration: 0.9, ease: [0.76, 0, 0.24, 1] }, opacity: { duration: 0.5 }, scale: { duration: duration / 1000 + 1, ease: 'linear' } }}
  >
    {/\.(mp4|webm|mov)(\?|$)/i.test(src) ? (
      <video src={src} data-no-edit className="w-full h-full object-cover pointer-events-none" muted autoPlay playsInline loop data-testid={`hero-slide-video-${index}`} />
    ) : (
      <img src={src} data-no-edit alt={slide.title} className="w-full h-full object-cover select-none pointer-events-none" data-testid={`hero-slide-image-${index}`} />
    )}
  </motion.div>
);

const HeroSlider = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = HERO_SLIDES.length;
  const slide = HERO_SLIDES[index];
  const { content } = useSiteContent();
  const src = content.images[`slide-${index}`] || slide.video || slide.image;
  const duration = slide.video ? VIDEO_MS : IMAGE_MS;
  const go = useCallback((n) => setIndex((n + count) % count), [count]);

  useEffect(() => {
    if (paused) return undefined;
    const t = setTimeout(() => go(index + 1), duration);
    return () => clearTimeout(t);
  }, [index, paused, go, duration]);

  return (
    <motion.div
      className="relative h-[80vh] min-h-[540px] max-h-[880px] w-full overflow-hidden bg-gray-900"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onPanEnd={(_, info) => { if (info.offset.x < -60) go(index + 1); if (info.offset.x > 60) go(index - 1); }}
      data-edit-group="hero-slides"
      data-testid="hero-slider"
    >
      <AnimatePresence initial={false}>
        <SlideMedia slide={slide} index={index} duration={duration} src={src} />
      </AnimatePresence>

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/25 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent pointer-events-none" />

      <div className="absolute inset-x-0 bottom-0 pb-20 sm:pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-end justify-between gap-6">
          <div data-testid="hero-slide-text" className="pr-14 sm:pr-0">
            <AnimatePresence mode="wait">
              <SlideText slide={slide} index={index} />
            </AnimatePresence>
          </div>
          <div className="hidden sm:block shrink-0"><SpinBadge /></div>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 pb-6 sm:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4 pr-20 sm:pr-6">
          <div className="flex items-center gap-2 flex-1 max-w-md">
            {HERO_SLIDES.map((s, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} data-testid={`hero-slider-dot-${i}`} className="relative h-1 flex-1 rounded-full bg-white/30 overflow-hidden">
                {i === index && (
                  <motion.span
                    key={`${index}-${paused}`}
                    className="absolute inset-y-0 left-0 bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: paused ? '0%' : '100%' }}
                    transition={{ duration: paused ? 0 : duration / 1000, ease: 'linear' }}
                  />
                )}
                {i < index && <span className="absolute inset-0 bg-white/80" />}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3 text-white">
            <span className="text-xs font-semibold tabular-nums tracking-widest" data-testid="hero-slider-counter">
              {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
            <button onClick={() => go(index - 1)} aria-label="Previous slide" data-testid="hero-slider-prev" className="hidden sm:flex w-10 h-10 rounded-full border border-white/40 backdrop-blur-md bg-white/10 hover:bg-white hover:text-gray-900 items-center justify-center transition-colors duration-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => go(index + 1)} aria-label="Next slide" data-testid="hero-slider-next" className="hidden sm:flex w-10 h-10 rounded-full border border-white/40 backdrop-blur-md bg-white/10 hover:bg-white hover:text-gray-900 items-center justify-center transition-colors duration-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeroSlider;
