import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, MessageCircle, Nut, Utensils, FlaskConical, Stamp } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { PRODUCTS, waLink } from '../data/mock';

const iconMap = { Nut, Utensils, FlaskConical, Stamp };

const Products = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36">
        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-pink-600 font-script text-2xl">Our Products</span>
              <h1 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
                Personalized Coconuts <em className="text-green-700 not-italic">& More</em>
              </h1>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                From our signature engraved coconuts to stirrers, hip flasks and custom stamps — every detail, made yours.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS.map((p) => {
                const Icon = iconMap[p.icon] || Nut;
                return (
                  <article
                    key={p.slug}
                    data-testid={`product-card-${p.slug}`}
                    className="coco-card group bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm flex flex-col"
                  >
                    <Link to={`/products/${p.slug}`} data-testid={`product-card-link-${p.slug}`} className="block relative aspect-square overflow-hidden bg-gradient-to-br from-green-50 to-pink-50 flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={`${p.name} — Mr. Coconetto`} loading="lazy" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center text-green-700/70">
                          <Icon className="w-16 h-16" strokeWidth={1.3} />
                          <span className="mt-3 text-xs font-semibold uppercase tracking-widest text-gray-400">Photo coming soon</span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 bg-pink-600 text-white text-[11px] font-bold px-3 py-1 rounded-full">{p.tagline}</span>
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <Link to={`/products/${p.slug}`} className="font-display font-bold text-xl text-gray-900 hover:text-pink-600 transition-colors">{p.name}</Link>
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{p.description}</p>
                      <ul className="mt-3 space-y-1.5">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" /> {f}
                          </li>
                        ))}
                      </ul>
                      {p.note && (
                        <p className="mt-4 text-sm font-script text-pink-600 leading-snug">{p.note}</p>
                      )}
                      <Link to={`/products/${p.slug}`} data-testid={`product-view-details-${p.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 hover:gap-2 transition-all">
                        View details &amp; gallery →
                      </Link>
                      <a href={waLink(`Hi Mr. Coconetto! I'm interested in: ${p.name}.`)} target="_blank" rel="noreferrer" className="mt-3 block">
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                          <MessageCircle className="w-4 h-4 mr-2" /> Enquire on WhatsApp
                        </Button>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Products;
