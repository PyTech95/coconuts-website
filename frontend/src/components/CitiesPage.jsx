import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { useContent } from '../cms/ContentContext';
import { T, Sec, ListTools } from '../cms/Editable';
import { slugify } from '../cms/defaultContent';
import { waLink } from '../lib/api';

const CitiesPage = () => {
  const { get } = useContent();
  const brand = get('brand', {});
  const cities = get('cities.items', []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36">
        <Sec id="cities-page" label="Cities page" className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <T path="cities.pageKicker" as="span" className="text-pink-600 font-script text-2xl" />
              <h1 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
                <T path="cities.pageTitle" as="span" /> <T path="cities.pageTitleEm" as="em" className="text-green-700 not-italic" />
              </h1>
              <T path="cities.pageDesc" as="p" vars={{ count: cities.length }} className="mt-3 text-gray-600 max-w-2xl mx-auto" />
              <ListTools path="cities.items" label="cities" />
            </div>

            <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
              {cities.map((c, i) => (
                <Link
                  key={i}
                  to={`/cities/${slugify(c)}`}
                  data-testid={`city-${String(c).toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-pink-50 border border-green-200 text-gray-800 text-sm font-medium hover:from-green-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-pink-500" /> <T path="cities.chipPrefix" as="span" /> <T path={`cities.items.${i}`} as="span" />
                </Link>
              ))}
            </div>

            <Sec id="cities-cta" as="div" label="Cities CTA" className="mt-12 text-center rounded-3xl bg-gradient-to-r from-green-600 to-pink-600 text-white p-8 md:p-10 max-w-4xl mx-auto">
              <T path="cities.ctaTitle" as="h2" className="font-display font-bold text-2xl md:text-3xl" />
              <T path="cities.ctaDesc" as="p" className="mt-2 text-white/90" />
              <a href={waLink(brand.phoneRaw, get('cities.ctaMsg', ''))} target="_blank" rel="noreferrer" className="mt-5 inline-block">
                <Button className="bg-white text-green-700 hover:bg-gray-50 rounded-full px-7 font-bold">
                  <MessageCircle className="w-4 h-4 mr-2" /> <T path="cities.ctaBtn" as="span" />
                </Button>
              </a>
            </Sec>
          </div>
        </Sec>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CitiesPage;
