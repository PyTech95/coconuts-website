import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, MessageCircle, CheckCircle2, Truck, Sparkles, Phone, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';
import { getIcon } from '../cms/icons';
import { slugify } from '../cms/defaultContent';
import { waLink } from '../lib/api';

const CityDetail = () => {
  const { city } = useParams();
  const { get } = useContent();
  const brand = get('brand', {});
  const cities = get('cities.items', []);
  const stats = get('cityDetail.stats', []);
  const offerings = get('cityDetail.offerings', []);
  const occasions = get('cityDetail.occasions', []);
  const gallery = get('cityDetail.gallery', []);

  const match = cities.find((c) => slugify(c) === city);
  const name = match || (city ? city.replace(/-/g, ' ').replace(/\b\w/g, (m) => m.toUpperCase()) : 'Your City');
  const others = cities.filter((c) => c !== match).slice(0, 8);
  const vars = { city: name };

  useEffect(() => { window.scrollTo(0, 0); }, [city]);

  return (
    <div className="bg-white" data-testid="city-detail-page">
      <Header />
      <main>
        {/* Hero */}
        <Sec id="city-hero" label="City hero" className="relative min-h-[78vh] flex items-end overflow-hidden">
          <Img path="cityDetail.heroImage" alt={`Personalized coconuts in ${name}`} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/70 to-black/40" />
          <div className="relative w-full max-w-6xl mx-auto px-5 sm:px-6 pb-10 pt-28 text-white">
            <Link to="/cities" className="inline-flex items-center gap-1 text-sm font-semibold text-white/80 hover:text-white"><T path="cityDetail.backLabel" as="span" /></Link>
            <div className="mt-4 inline-flex items-center gap-1.5 bg-pink-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
              <MapPin className="w-3.5 h-3.5" /> <T path="cityDetail.servingLabel" as="span" vars={vars} />
            </div>
            <h1 data-testid="city-detail-title" className="mt-4 font-display font-extrabold text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
              <T path="cityDetail.title" as="span" /><br className="hidden sm:block" /> <T path="cityDetail.titleAfter" as="span" /> <span className="text-pink-300">{name}</span>
            </h1>
            <T path="cityDetail.desc" as="p" vars={vars} className="mt-4 text-white/85 max-w-xl text-sm sm:text-base leading-relaxed" />
            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <a href={waLink(brand.phoneRaw, `Hi Mr. Coconetto! I'd like personalized coconuts in ${name}.`)} target="_blank" rel="noreferrer" data-testid="city-quote-btn">
                <Button className="w-full sm:w-auto bg-green-500 hover:bg-green-600 text-white rounded-full px-7 py-6 text-base font-semibold shadow-xl">
                  <MessageCircle className="w-5 h-5 mr-2" /> <T path="cityDetail.quoteBtn" as="span" vars={vars} />
                </Button>
              </a>
              <a href={`tel:${brand.phone}`}>
                <Button variant="outline" className="w-full sm:w-auto rounded-full px-7 py-6 text-base border-white/70 text-white hover:bg-white/10 bg-transparent">
                  <Phone className="w-5 h-5 mr-2" /> <T path="cityDetail.callBtn" as="span" />
                </Button>
              </a>
            </div>
          </div>
        </Sec>

        {/* Stats band */}
        <Sec id="city-stats" label="City stats band" className="bg-green-700">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 py-5 grid grid-cols-3 gap-3">
            {stats.map((s, i) => {
              const Icon = getIcon(s.icon);
              return (
                <div key={i} className="flex flex-col sm:flex-row items-center sm:items-start gap-2 text-center sm:text-left text-white">
                  <span className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0"><Icon className="w-5 h-5" /></span>
                  <div>
                    <T path={`cityDetail.stats.${i}.label`} as="div" className="font-bold text-sm leading-tight" />
                    <T path={`cityDetail.stats.${i}.sub`} as="div" className="text-[11px] text-white/70 leading-tight" />
                  </div>
                </div>
              );
            })}
            <ListTools path="cityDetail.stats" label="stats" />
          </div>
        </Sec>

        {/* Offerings + occasions */}
        <Sec id="city-offer" label="City offerings" className="section-pad">
          <div className="max-w-6xl mx-auto px-5 sm:px-6 grid md:grid-cols-2 gap-5">
            <div className="rounded-3xl border border-green-100 bg-green-50/60 p-6 sm:p-7">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-gray-900 flex items-center gap-2"><Sparkles className="w-5 h-5 text-green-700" /> <T path="cityDetail.offerTitle" as="span" vars={vars} /></h2>
              <ul className="mt-5 space-y-3.5">
                {offerings.map((_, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-gray-700">
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" /> <T path={`cityDetail.offerings.${i}`} as="span" />
                  </li>
                ))}
              </ul>
              <ListTools path="cityDetail.offerings" label="offerings" />
            </div>
            <div className="rounded-3xl border border-pink-100 bg-pink-50/50 p-6 sm:p-7">
              <h2 className="font-display font-bold text-xl sm:text-2xl text-gray-900 flex items-center gap-2"><Truck className="w-5 h-5 text-pink-600" /> <T path="cityDetail.deliveryTitle" as="span" /></h2>
              <T path="cityDetail.deliveryDesc" as="p" vars={vars} className="mt-4 text-sm sm:text-base text-gray-700" />
              <div className="mt-4 flex flex-wrap gap-2">
                {occasions.map((_, i) => (
                  <T key={i} path={`cityDetail.occasions.${i}`} as="span" className="inline-flex items-center px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-700" />
                ))}
              </div>
              <ListTools path="cityDetail.occasions" label="occasions" />
            </div>
          </div>
        </Sec>

        {/* Gallery */}
        <Sec id="city-gallery" label="City gallery" className="pb-4">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
              {gallery.map((_, k) => (
                <div key={k} className="aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                  <Img path={`cityDetail.gallery.${k}`} alt={`Mr. Coconetto in ${name} ${k + 1}`} loading="lazy" className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" />
                </div>
              ))}
            </div>
            <ListTools path="cityDetail.gallery" label="gallery images" />
          </div>
        </Sec>

        {/* CTA band */}
        <Sec id="city-cta" label="City CTA" className="section-pad">
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className="rounded-3xl bg-gradient-to-r from-green-600 to-pink-600 text-white p-7 sm:p-10 text-center">
              <T path="cityDetail.ctaTitle" as="h2" vars={vars} className="font-display font-bold text-2xl sm:text-3xl" />
              <T path="cityDetail.ctaDesc" as="p" className="mt-2 text-white/90 text-sm sm:text-base" />
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <a href={waLink(brand.phoneRaw, `Hi Mr. Coconetto! I'd like a quote for an event in ${name}.`)} target="_blank" rel="noreferrer">
                  <Button className="w-full sm:w-auto bg-white text-green-700 hover:bg-gray-50 rounded-full px-8 py-6 font-bold text-base"><MessageCircle className="w-5 h-5 mr-2" /> <T path="cityDetail.ctaWa" as="span" /></Button>
                </a>
                <Link to="/customize">
                  <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 border-white text-white hover:bg-white/10 bg-transparent text-base"><T path="cityDetail.ctaCustomize" as="span" /></Button>
                </Link>
              </div>
            </div>

            {/* Other cities */}
            <div className="mt-10 text-center">
              <T path="cityDetail.alsoServe" as="h3" className="font-display font-bold text-lg text-gray-900" />
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {others.map((c) => (
                  <Link key={c} to={`/cities/${slugify(c)}`} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-green-50 to-pink-50 border border-green-200 text-gray-800 text-sm font-medium hover:from-green-600 hover:to-pink-600 hover:text-white hover:border-transparent transition-colors">
                    <MapPin className="w-3.5 h-3.5 text-pink-500" /> {c}
                  </Link>
                ))}
                <Link to="/cities" className="inline-flex items-center gap-1 px-4 py-2 rounded-full text-green-700 font-semibold text-sm hover:underline"><T path="cityDetail.allCitiesLabel" as="span" /> <ArrowRight className="w-4 h-4" /></Link>
              </div>
            </div>
          </div>
        </Sec>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CityDetail;
