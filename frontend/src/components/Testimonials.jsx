import React, { useState, useEffect } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../data/mock';

const Testimonials = () => {
  const [index, setIndex] = useState(0);
  const perView = 3;
  const maxIndex = Math.max(0, TESTIMONIALS.length - perView);

  const prev = () => setIndex((i) => (i <= 0 ? maxIndex : i - 1));
  const next = () => setIndex((i) => (i >= maxIndex ? 0 : i + 1));

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, 1650);
    return () => clearInterval(id);
  }, [maxIndex]);

  return (
    <section id="testimonials" className="section-pad bg-gradient-to-b from-white to-pink-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-pink-600 font-script text-2xl">Client Love</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            What Our <em className="text-green-700 not-italic">Guests</em> Say
          </h2>
        </div>

        <div className="relative">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${index * (100 / perView)}%)` }}>
              {TESTIMONIALS.map((t, i) => (
                <div key={i} className="w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3">
                  <div className="h-full rounded-3xl bg-white p-7 border border-green-100 shadow-md relative">
                    <Quote className="absolute top-5 right-5 w-8 h-8 text-pink-100" />
                    <div className="flex gap-0.5 text-yellow-400 mb-3">
                      {[...Array(5)].map((_, s) => <Star key={s} className="w-4 h-4 fill-current" />)}
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">{t.text}</p>
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-green-400 flex items-center justify-center text-white font-bold">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 text-sm">{t.name}</div>
                        <div className="text-xs text-gray-500">{t.city}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={prev} className="w-11 h-11 rounded-full bg-white border border-green-200 hover:bg-green-50 flex items-center justify-center transition-colors">
              <ChevronLeft className="w-5 h-5 text-green-700" />
            </button>
            <div className="flex gap-1.5">
              {[...Array(maxIndex + 1)].map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full transition-all ${i === index ? 'bg-pink-600 w-6' : 'bg-gray-300'}`} />
              ))}
            </div>
            <button onClick={next} className="w-11 h-11 rounded-full bg-white border border-green-200 hover:bg-green-50 flex items-center justify-center transition-colors">
              <ChevronRight className="w-5 h-5 text-green-700" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
