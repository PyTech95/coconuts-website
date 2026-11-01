import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { CITIES, waLink, slugify } from '../data/mock';

const CitiesPage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36">
        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-pink-600 font-script text-2xl">Pan-India Presence</span>
              <h1 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
                Personalized Coconuts, <em className="text-green-700 not-italic">Delivered Across India</em>
              </h1>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                We deliver fresh, customized coconuts to <strong className="text-green-700">{CITIES.length}+ cities</strong> — from metros to destination-wedding hubs.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5 max-w-4xl mx-auto">
              {CITIES.map((c) => (
                <Link
                  key={c}
                  to={`/cities/${slugify(c)}`}
                  data-testid={`city-${c.toLowerCase()}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-pink-50 border border-green-200 text-gray-800 text-sm font-medium hover:from-green-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-colors"
                >
                  <MapPin className="w-3.5 h-3.5 text-pink-500" /> Personalized Coconut {c}
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center rounded-3xl bg-gradient-to-r from-green-600 to-pink-600 text-white p-8 md:p-10 max-w-4xl mx-auto">
              <h2 className="font-display font-bold text-2xl md:text-3xl">Don't see your city?</h2>
              <p className="mt-2 text-white/90">We serve destination weddings and events nationwide. Ask us about your location.</p>
              <a href={waLink('Hi Mr. Coconetto! Do you deliver personalized coconuts to my city?')} target="_blank" rel="noreferrer" className="mt-5 inline-block">
                <Button className="bg-white text-green-700 hover:bg-gray-50 rounded-full px-7 font-bold">
                  <MessageCircle className="w-4 h-4 mr-2" /> Check Availability on WhatsApp
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CitiesPage;
