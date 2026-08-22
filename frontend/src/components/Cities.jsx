import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { CITIES, slugify } from '../data/mock';

const Cities = () => {
  return (
    <section id="cities" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-pink-600 font-script text-2xl">Pan-India Presence</span>
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            Cities <em className="text-green-700 not-italic">We Serve</em>
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Delivering fresh, personalized coconuts across <strong className="text-green-700">{CITIES.length}+ cities</strong> nationwide — including destination-wedding hubs.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {CITIES.map((c) => (
            <Link key={c} to={`/cities/${slugify(c)}`} data-testid={`city-chip-${slugify(c)}`} className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-pink-50 border border-green-200 text-gray-800 text-sm font-medium hover:from-green-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-colors">
              <MapPin className="w-3.5 h-3.5 text-pink-500 group-hover:text-white" /> {c}
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/cities" data-testid="cities-viewall" className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800">
            See all cities & check delivery <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Cities;
