import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, MessageCircle, CheckCircle2, Truck, Sparkles, Phone, Snowflake, Clock, Award, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { CITIES, BRAND, waLink, slugify } from '../data/mock';

const OCCASIONS = ['Weddings & Engagements', 'Haldi & Mehndi', 'Sangeet Nights', 'Birthday Parties', 'Corporate Events', 'Brand Promotions', 'Baraat Swagat'];
const OFFERINGS = [
  'Fresh A+ grade tender coconuts, delivered chilled',
  'Custom engraving — names, hashtags, logos & motifs',
  'Live coconut bar with trained CocoBoys (select plans)',
  'On-time delivery to your home, venue or banquet',
];
const STATS = [
  { Icon: Snowflake, label: 'Fresh & Chilled', sub: 'A+ grade coconuts' },
  { Icon: Award, label: 'Custom Engraved', sub: 'Names · logos · #tags' },
  { Icon: Clock, label: 'On-Time Delivery', sub: 'To your venue' },
];
const GALLERY = ['/images/brand/hero-2.jpg', '/images/brand/service-4.jpg', '/images/brand/service-5.jpg'];

const CityDetail = () => {
  const { city } = useParams();
  const match = CITIES.find((c) => slugify(c) === city);
  const name = match || (city ? city.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) : 'Your City');
  const others = CITIES.filter((c) => c !== match).slice(0, 8);

  useEffect(() => { window.scrollTo(0, 0); }, [city]);

  return (
    <div className="bg-white" data-testid="city-detail-page">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative min-h-[78vh] flex items-end overflow-hidden">
          <img src="/images/brand/hero-1.jpg" alt={`Personalized coconuts in ${name}`} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/70 to-black/40" />
          <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-6 pb-10 pt-28 text-white">
            <Link to="/cities" className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white">← All cities</Link>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5" /> Now serving {name}
            </div>
            <h1 data-testid="city-detail-title" className="mt-4 font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
              Personalized Coconuts<br className="hidden sm:block" /> in <span className="text-pink-300">{name}</span>
            </h1>
            <p className="mt-4 text-white/85 max-w-xl text-sm sm:text-base leading-relaxed">
              Fresh, hand-engraved coconuts delivered across {name} — the perfect premium welcome drink for weddings, haldi,
              corporate events and every celebration.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href={waLink(`Hi Mr. Coconetto! I'd like personalized coconuts in ${name}.`)} target="_blank" rel="noreferrer" data-testid="city-quote-btn">
                <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-full px-7 py-6 text-base font-semibold shadow-xl">
                  <MessageCircle className="w-5 h-5 mr-2" /> Get a Quote for {name}
                </Button>
              </a>
              <a href={`tel:${BRAND.phone}`}>
                <Button variant="outline" className="w-full sm:w-auto rounded-full px-7 py-6 text-base border-white/70 text-white hover:bg-white/10 bg-transparent">
                  <Phone className="w-5 h-5 mr-2" /> Call Us
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* Stats band */}
        <section className="bg-green-700">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5 grid grid-cols-3 gap-3">
            {STATS.map(({ Icon, label, sub }) => (
              <div key={label} className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left text-white">
                <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
                <div>
                  <div className="font-bold text-sm leading-tight">{label}</div>
                  <div className="text-[11px] text-white/70 leading-tight">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Offerings + occasions */}
        <section className="section-pad">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 grid md:grid-cols-2 gap-5">
            <div className="rounded-3xl border border-green-100 bg-green-50/60 p-6 sm:p-7">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-green-700" /> What we offer in {name}</h2>
              <ul className="mt-5 space-y-3.5">
                {OFFERINGS.map((o) => (
                  <li key={o} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> {o}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-3xl border border-pink-100 bg-pink-50/50 p-6 sm:p-7">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-gray-900 flex items-center gap-2"><Truck className="w-5 h-5 text-pink-600" /> Delivery & occasions</h2>
              <p className="mt-4 text-sm sm:text-base text-gray-700">We deliver across {name} with a minimum of <strong>100 coconuts</strong>. Popular occasions we serve here:</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {OCCASIONS.map((o) => (
                  <span key={o} className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700">{o}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="pb-4">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {GALLERY.map((src, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <img src={src} alt={`Mr. Coconetto in ${name} ${i + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA band */}
        <section className="section-pad">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-pink-600 text-white p-7 sm:p-10 text-center">
              <h2 className="font-display font-bold text-2xl sm:text-3xl">Planning an event in {name}?</h2>
              <p className="mt-2 text-white/90 text-sm sm:text-base">Share your date &amp; theme — we'll send a custom quote within minutes.</p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <a href={waLink(`Hi Mr. Coconetto! I'd like a quote for an event in ${name}.`)} target="_blank" rel="noreferrer">
                  <Button className="w-full sm:w-auto bg-white text-green-700 hover:bg-gray-50 rounded-full px-8 py-6 font-bold text-base"><MessageCircle className="w-5 h-5 mr-2" /> WhatsApp Us</Button>
                </a>
                <Link to="/customize">
                  <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 border-white text-white hover:bg-white/10 bg-transparent text-base">Customize Your Coconut</Button>
                </Link>
              </div>
            </div>

            {/* Other cities */}
            <div className="mt-10 text-center">
              <h3 className="font-display font-bold text-lg text-gray-900">We also serve</h3>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {others.map((c) => (
                  <Link key={c} to={`/cities/${slugify(c)}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-pink-50 border border-green-200 text-gray-800 text-sm font-medium hover:from-green-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-pink-500" /> {c}
                  </Link>
                ))}
                <Link to="/cities" className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-green-700 font-semibold text-sm hover:underline">All cities <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CityDetail;
