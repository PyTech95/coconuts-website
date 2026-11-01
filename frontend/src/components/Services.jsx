import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Package, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { SERVICES, waLink, slugify } from '../data/mock';

const Services = () => {
  return (
    <section id="services" className="section-pad bg-blush">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <span className="text-pink-600 font-script text-2xl">What We Do</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            Personalized Coconuts for <em className="text-green-700 not-italic">Every Occasion</em>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            From weddings and Haldi to corporate events and brand promotions — customized coconuts, crafted for your celebration.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s) => (
            <article
              key={s.title}
              data-testid={`service-card-${s.tag.toLowerCase()}`}
              className="coco-card group bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={s.image}
                  alt={`${s.title} — Mr. Coconetto`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">{s.tag}</span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display font-bold text-xl text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">{s.description}</p>

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-700">
                    <Palette className="w-4 h-4 mt-0.5 text-green-700 shrink-0" />
                    <span><span className="font-semibold">Customization:</span> {s.customization}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <Package className="w-4 h-4 mt-0.5 text-green-700 shrink-0" />
                    <span className="font-semibold text-green-700">{s.minOrder}</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <a
                    href={waLink(`Hi Mr. Coconetto! I'd like a quote for: ${s.title}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="block flex-1"
                  >
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                      Get a Quote
                    </Button>
                  </a>
                  <Link to={`/services/${slugify(s.title)}`} data-testid={`service-story-${s.tag.toLowerCase()}`} className="block flex-1">
                    <Button size="sm" variant="outline" className="w-full rounded-full border-pink-300 text-pink-700 hover:bg-pink-50">
                      <BookOpen className="w-4 h-4 mr-1.5" /> Read Full Story
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
