import React from 'react';
import { Link } from 'react-router-dom';
import { Palette, Package, BookOpen } from 'lucide-react';
import { Button } from './ui/button';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';
import { slugify } from '../cms/defaultContent';
import { waLink } from '../lib/api';

const Services = () => {
  const { get } = useContent();
  const brand = get('brand', {});
  const items = get('services.items', []);

  return (
    <Sec id="services" label="Services" className="section-pad bg-gradient-to-b from-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <T path="services.kicker" as="span" className="text-pink-600 font-script text-2xl" />
          <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
            <T path="services.title" as="span" /> <T path="services.titleEm" as="em" className="text-green-700 not-italic" />
          </h2>
          <T path="services.desc" as="p" className="mt-3 text-gray-600 max-w-2xl mx-auto" />
          <ListTools path="services.items" label="services" />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((s, i) => (
            <article
              key={i}
              data-testid={`service-card-${String(s.tag || '').toLowerCase()}`}
              className="coco-card group bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Img
                  path={`services.items.${i}.image`}
                  alt={`${s.title} — ${brand.name || ''}`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                <T path={`services.items.${i}.tag`} as="span" className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full" />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <T path={`services.items.${i}.title`} as="h3" className="font-display font-bold text-xl text-gray-900" />
                <T path={`services.items.${i}.description`} as="p" className="mt-2 text-sm text-gray-600 leading-relaxed" />

                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-start gap-2 text-gray-700">
                    <Palette className="w-4 h-4 mt-0.5 text-green-700 shrink-0" />
                    <span><T path="services.customizationLabel" as="span" className="font-semibold" /> <T path={`services.items.${i}.customization`} as="span" /></span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <Package className="w-4 h-4 mt-0.5 text-green-700 shrink-0" />
                    <T path={`services.items.${i}.minOrder`} as="span" className="font-semibold text-green-700" />
                  </div>
                </div>

                <div className="mt-5 flex flex-col sm:flex-row gap-2">
                  <a
                    href={waLink(brand.phoneRaw, `Hi Mr. Coconetto! I'd like a quote for: ${s.title}.`)}
                    target="_blank"
                    rel="noreferrer"
                    className="block flex-1"
                  >
                    <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">
                      <T path="services.quoteBtn" as="span" />
                    </Button>
                  </a>
                  <Link to={`/services/${slugify(s.title)}`} data-testid={`service-story-${String(s.tag || '').toLowerCase()}`} className="block flex-1">
                    <Button size="sm" variant="outline" className="w-full rounded-full border-pink-300 text-pink-700 hover:bg-pink-50">
                      <BookOpen className="w-4 h-4 mr-1.5" /> <T path="services.storyBtn" as="span" />
                    </Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </Sec>
  );
};

export default Services;
