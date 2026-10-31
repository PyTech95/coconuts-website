import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Sec, ListTools } from '../cms/Editable';
import { slugify } from '../cms/defaultContent';

const Cities = () => {
  const { get } = useContent();
  const items = get('cities.items', []);

  return (
    <Sec id="cities" label="Cities" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <T path="cities.kicker" as="span" className="text-pink-600 font-script text-2xl" />
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            <T path="cities.title" as="span" /> <T path="cities.titleEm" as="em" className="text-green-700 not-italic" />
          </h2>
          <T path="cities.desc" as="p" vars={{ count: items.length }} className="mt-3 text-gray-600 max-w-2xl mx-auto" />
          <ListTools path="cities.items" label="cities" />
        </div>

        <div className="flex flex-wrap justify-center gap-2.5">
          {items.map((c, i) => (
            <Link key={i} to={`/cities/${slugify(c)}`} data-testid={`city-chip-${slugify(c)}`} className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-pink-50 border border-green-200 text-gray-800 text-sm font-medium hover:from-green-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-colors">
              <MapPin className="w-3.5 h-3.5 text-pink-500 group-hover:text-white" /> <T path={`cities.items.${i}`} as="span" />
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link to="/cities" data-testid="cities-viewall" className="inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800">
            <T path="cities.viewAll" as="span" /> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </Sec>
  );
};

export default Cities;
