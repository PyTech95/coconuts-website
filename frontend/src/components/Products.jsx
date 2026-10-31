import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Check, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';
import { getIcon } from '../cms/icons';
import { waLink } from '../lib/api';

const Products = () => {
  const { get } = useContent();
  const brand = get('brand', {});
  const items = get('products.items', []);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36">
        <Sec id="products-page" label="Products page" className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <T path="products.kicker" as="span" className="text-pink-600 font-script text-2xl" />
              <h1 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
                <T path="products.title" as="span" /> <T path="products.titleEm" as="em" className="text-green-700 not-italic" />
              </h1>
              <T path="products.desc" as="p" className="mt-3 text-gray-600 max-w-2xl mx-auto" />
              <ListTools path="products.items" label="products" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {items.map((p, i) => {
                const Icon = getIcon(p.icon);
                const base = `products.items.${i}`;
                return (
                  <article
                    key={i}
                    data-testid={`product-card-${p.slug}`}
                    className="coco-card group bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm flex flex-col"
                  >
                    <Link to={`/products/${p.slug}`} data-testid={`product-card-link-${p.slug}`} className="relative aspect-square overflow-hidden bg-gradient-to-br from-green-50 to-pink-50 flex items-center justify-center">
                      {p.image ? (
                        <Img path={`${base}.image`} alt={`${p.name} — ${brand.name || 'Mr. Coconetto'}`} loading="lazy" className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center text-green-700/70">
                          <Icon className="w-16 h-16" strokeWidth={1.3} />
                          <T path="products.comingSoon" as="span" className="mt-3 text-xs font-semibold uppercase tracking-widest text-gray-400" />
                        </div>
                      )}
                      <T path={`${base}.tagline`} as="span" className="absolute top-3 left-3 bg-pink-600 text-white text-[11px] font-bold px-3 py-1 rounded-full" />
                    </Link>
                    <div className="p-5 flex flex-col flex-1">
                      <T path={`${base}.name`} as="h2" className="font-display font-bold text-xl text-gray-900" />
                      {p.price ? <T path={`${base}.price`} as="div" className="mt-1 text-sm font-bold text-pink-600" /> : null}
                      <T path={`${base}.description`} as="p" className="mt-2 text-sm text-gray-600 leading-relaxed" />
                      <ul className="mt-3 space-y-1.5">
                        {(p.features || []).map((_, k) => (
                          <li key={k} className="flex items-start gap-2 text-sm text-gray-700">
                            <Check className="w-4 h-4 mt-0.5 text-green-600 shrink-0" /> <T path={`${base}.features.${k}`} as="span" />
                          </li>
                        ))}
                      </ul>
                      {p.note ? <T path={`${base}.note`} as="p" className="mt-4 text-sm font-script text-pink-600 leading-snug" /> : null}
                      <Link to={`/products/${p.slug}`} data-testid={`product-view-details-${p.slug}`} className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-green-700 hover:text-green-800 hover:gap-2 transition-all">
                        <T path="products.detailsLink" as="span" />
                      </Link>
                      <a href={waLink(brand.phoneRaw, `Hi Mr. Coconetto! I'm interested in: ${p.name}.`)} target="_blank" rel="noreferrer" className="mt-3 block">
                        <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                          <MessageCircle className="w-4 h-4 mr-2" /> <T path="products.enquireBtn" as="span" />
                        </Button>
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </Sec>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Products;
