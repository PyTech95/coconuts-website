import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Check, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';
import { getIcon } from '../cms/icons';
import { waLink, tpl } from '../lib/api';

const ProductDetail = () => {
  const { slug } = useParams();
  const { get } = useContent();
  const brand = get('brand', {});
  const items = get('products.items', []);
  const index = items.findIndex((p) => p.slug === slug);
  const product = index >= 0 ? items[index] : null;
  const base = `products.items.${index}`;
  const [active, setActive] = useState(0);

  useEffect(() => { window.scrollTo(0, 0); setActive(0); }, [slug]);

  if (!product) {
    return (
      <div className="bg-white min-h-screen">
        <Header />
        <main className="pt-32 pb-24 text-center px-6" data-testid="product-not-found">
          <h1 className="font-display font-bold text-3xl text-gray-900">Product not found</h1>
          <Link to="/products" className="mt-4 inline-block text-pink-600 font-semibold">← Back to Products</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const gallery = product.gallery && product.gallery.length ? product.gallery : (product.image ? [product.image] : []);
  const usingGallery = !!(product.gallery && product.gallery.length);
  const Icon = getIcon(product.icon);
  const safeActive = Math.min(active, Math.max(gallery.length - 1, 0));

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36" data-testid={`product-detail-${product.slug}`}>
        <Sec id="product-detail" label="Product page" className="section-pad">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Link to="/products" data-testid="product-detail-back" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-pink-600 transition-colors">
              <ArrowLeft className="w-4 h-4" /> <T path="products.detailBack" as="span" />
            </Link>
            <ListTools path="products.items" label="products" className="ml-3" />

            <div className="mt-6 grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
              {/* Gallery */}
              <div>
                <div data-testid="product-detail-main-image" className="relative aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-green-50 to-pink-50 border border-green-100 flex items-center justify-center">
                  {gallery.length ? (
                    <Img path={usingGallery ? `${base}.gallery.${safeActive}` : `${base}.image`} alt={`${product.name} design ${safeActive + 1}`} className="w-full h-full object-contain p-3" />
                  ) : (
                    <Icon className="w-24 h-24 text-green-700/60" strokeWidth={1.2} />
                  )}
                  <T path={`${base}.tagline`} as="span" className="absolute top-4 left-4 bg-pink-600 text-white text-[11px] font-bold px-3 py-1 rounded-full" />
                </div>

                {gallery.length > 1 && (
                  <div className="mt-4 grid grid-cols-5 gap-3" data-testid="product-detail-thumbs">
                    {gallery.map((g, i) => (
                      <button
                        key={i}
                        type="button"
                        data-cms-allow
                        onClick={() => setActive(i)}
                        data-testid={`product-detail-thumb-${i}`}
                        className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${i === safeActive ? 'border-pink-500 ring-2 ring-pink-200' : 'border-gray-200 hover:border-pink-300'}`}
                      >
                        <Img path={`${base}.gallery.${i}`} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info */}
              <div>
                <T path="products.detailKicker" as="span" className="text-pink-600 font-script text-2xl" />
                <T path={`${base}.name`} as="h1" className="font-display font-bold text-3xl md:text-4xl text-gray-900 leading-tight" />
                {product.price ? <T path={`${base}.price`} as="div" className="mt-2 text-lg font-bold text-pink-600" /> : null}
                <T path={`${base}.description`} as="p" className="mt-3 text-gray-600 text-lg" />

                <ul className="mt-6 space-y-2.5">
                  {(product.features || []).map((_, k) => (
                    <li key={k} className="flex items-start gap-2.5 text-gray-700">
                      <Check className="w-5 h-5 mt-0.5 text-green-600 shrink-0" /> <T path={`${base}.features.${k}`} as="span" />
                    </li>
                  ))}
                </ul>

                {product.note ? <T path={`${base}.note`} as="p" className="mt-6 font-script text-pink-600 text-2xl" /> : null}

                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                  <a href={waLink(brand.phoneRaw, tpl(get('products.detailEnquireMsg', ''), { name: product.name }))} target="_blank" rel="noreferrer" data-testid="product-detail-whatsapp" className="flex-1">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full py-6 text-base font-semibold shadow-lg">
                      <MessageCircle className="w-5 h-5 mr-2" /> <T path="products.detailEnquireBtn" as="span" />
                    </Button>
                  </a>
                  <Link to="/customize" className="flex-1">
                    <Button variant="outline" className="w-full rounded-full py-6 text-base font-semibold border-pink-300 text-pink-700 hover:bg-pink-50">
                      <T path="products.detailCustomizeBtn" as="span" />
                    </Button>
                  </Link>
                </div>

                <T path="products.detailFootnote" as="p" className="mt-4 text-xs text-gray-500" />
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

export default ProductDetail;
