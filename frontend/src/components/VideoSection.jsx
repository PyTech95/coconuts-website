import React, { useState } from 'react';
import { Play, X, Youtube } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Vid, Sec } from '../cms/Editable';

const VideoSection = () => {
  const { get, editMode } = useContent();
  const [open, setOpen] = useState(false);
  const youtubeUrl = get('video.youtubeUrl', '');

  return (
    <Sec id="video" label="Video section" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <T path="video.kicker" as="span" className="text-pink-600 font-script text-2xl" />
          <h2 className="mt-1 font-display font-bold text-3xl md:text-5xl text-gray-900 leading-tight">
            <T path="video.title" as="span" /> <T path="video.titleEm" as="em" className="text-green-700 not-italic" /> <T path="video.titleAfter" as="span" />
          </h2>
          <T path="video.desc" as="p" className="mt-4 text-gray-600 leading-relaxed" />
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white rounded-full px-6 py-3 shadow-lg transition-colors">
              <Play className="w-4 h-4" /> <T path="video.watchBtn" as="span" />
            </button>
            <a href={youtubeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium">
              <Youtube className="w-5 h-5" /> <T path="video.youtubeLabel" as="span" />
            </a>
          </div>
        </div>

        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-video bg-black">
            <Vid path="video.src" posterPath="video.poster" className="w-full h-full object-cover" muted loop autoPlay playsInline />
            {!editMode && (
              <button onClick={() => setOpen(true)} className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/30 transition-colors">
                <span className="w-20 h-20 rounded-full bg-white/95 flex items-center justify-center shadow-2xl animate-soft-pulse">
                  <Play className="w-8 h-8 text-pink-600 ml-1" />
                </span>
              </button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <Vid path="video.src" className="w-full h-full object-contain" controls autoPlay />
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center hover:bg-white">
              <X className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      )}
    </Sec>
  );
};

export default VideoSection;
