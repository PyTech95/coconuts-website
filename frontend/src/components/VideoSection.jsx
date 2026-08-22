import React, { useState } from 'react';
import { Play, X, Youtube } from 'lucide-react';
import { BRAND } from '../data/mock';

const VideoSection = () => {
  const [open, setOpen] = useState(false);
  return (
    <section id="video" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="text-pink-600 font-script text-2xl">See Us In Action</span>
          <h2 className="mt-1 font-display font-bold text-3xl md:text-5xl text-gray-900 leading-tight">
            Our <em className="text-green-700 not-italic">Customized Coconut Bar</em> Experience
          </h2>
          <p className="mt-4 text-gray-600 leading-relaxed">
            Watch how Mr. Coconetto transforms every event into a fresh, personalized experience — from precision custom engraving to chilled coconuts served by our trained CocoBoys.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 shadow-lg transition-colors">
              <Play className="w-4 h-4" /> Watch Now
            </button>
            <a href="https://www.youtube.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
              <Youtube className="w-5 h-5" /> Watch on YouTube
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black">
            <video src={BRAND.heroVideo} className="w-full h-full object-cover" muted loop autoPlay playsInline />
            <button onClick={() => setOpen(true)} className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
              <span className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl animate-soft-pulse">
                <Play className="w-8 h-8 text-pink-600 ml-1" />
              </span>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <video src={BRAND.heroVideo} className="w-full h-full object-contain" controls autoPlay />
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default VideoSection;
