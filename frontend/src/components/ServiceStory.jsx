import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Palette, Package, MessageCircle, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';
import { slugify } from '../cms/defaultContent';
import { waLink } from '../lib/api';

const ServiceStory = () => {
  const { slug } = useParams();
  const { get } = useContent();
  const brand = get('brand', {});
  const services = get('services.items', []);
  const i = services.findIndex((s) => slugify(s.title) === slug);
  const service = i >= 0 ? services[i] : null;

  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  if (!service) {
    return (
      <div className="bg-white">
        <Header />
        <main className="pt-36 pb-24 text-center px-6">
          <h1 className="font-display font-bold text-3xl text-gray-900">Story not found</h1>
          <Link to="/#services" className="mt-4 inline-block text-green-700 font-semibold">← Back to services</Link>
        </main>
        <Footer />
      </div>
    );
  }

  const base = `services.items.${i}`;
  const related = services
    .map((s, k) => ({ s, k }))
    .filter(({ s }) => s.title !== service.title)
    .slice(0, 3);
  const vars = {
    tag: String(service.tag || '').toLowerCase(),
    description: service.description || '',
    customization: String(service.customization || '').toLowerCase(),
  };

  return (
    <div className="bg-white" data-testid="service-story-page">
      <Header />
      <main className="pt-24 md:pt-28">
        <Sec id="service-hero" label="Service hero" className="relative h-[42vh] min-h-[320px] overflow-hidden">
          <Img path={`${base}.image`} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-8 text-white">
            <T path={`${base}.tag`} as="span" className="inline-flex w-fit items-center bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full" />
            <T path={`${base}.title`} as="h1" data-testid="service-story-title" className="mt-3 font-display font-extrabold text-3xl md:text-5xl max-w-3xl" />
          </div>
        </Sec>

        <Sec id="service-story" label="Service story" className="section-pad">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link to="/#services" className="text-sm font-semibold text-green-700 hover:text-green-800"><T path="services.storyBackLabel" as="span" /></Link>
              <ListTools path="services.items" label="services" className="!my-0" />
            </div>

            <div className="mt-6 space-y-5 text-gray-700 leading-relaxed">
              <T path="services.storyIntro" as="p" vars={vars} className="text-lg text-gray-800" />
              <T path="services.storyBody" as="p" vars={vars} />
              <T path="services.storyOutro" as="p" vars={vars} />
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5 flex items-start gap-3">
                <Palette className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                <div><T path="services.storyCustomizationLabel" as="div" className="font-semibold text-gray-900 text-sm" /><T path={`${base}.customization`} as="div" className="text-sm text-gray-600" /></div>
              </div>
              <div className="rounded-2xl border border-pink-100 bg-pink-50/40 p-5 flex items-start gap-3">
                <Package className="w-5 h-5 text-pink-600 mt-0.5 shrink-0" />
                <div><T path="services.storyMinOrderLabel" as="div" className="font-semibold text-gray-900 text-sm" /><T path={`${base}.minOrder`} as="div" className="text-sm text-gray-600" /></div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-green-600 to-pink-600 text-white p-7 text-center">
              <T path="services.storyCtaTitle" as="h2" vars={vars} className="font-display font-bold text-2xl" />
              <T path="services.storyCtaDesc" as="p" className="mt-2 text-white/90 text-sm" />
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a href={waLink(brand.phoneRaw, `Hi Mr. Coconetto! I'd like a quote for: ${service.title}.`)} target="_blank" rel="noreferrer">
                  <Button className="bg-white text-green-700 hover:bg-gray-50 rounded-full px-7 font-bold"><MessageCircle className="w-4 h-4 mr-2" /> <T path="services.storyWaBtn" as="span" /></Button>
                </a>
                <Link to="/customize"><Button variant="outline" className="rounded-full px-7 border-white text-white hover:bg-white/10 bg-transparent"><T path="services.storyCustomizeBtn" as="span" /></Button></Link>
              </div>
            </div>

            <div className="mt-14">
              <T path="services.storyMoreTitle" as="h3" className="font-display font-bold text-xl text-gray-900 mb-4" />
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map(({ s, k }) => (
                  <Link key={k} to={`/services/${slugify(s.title)}`} className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="aspect-[4/3] overflow-hidden"><Img path={`services.items.${k}.image`} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                    <div className="p-3">
                      <T path={`services.items.${k}.title`} as="div" className="text-sm font-semibold text-gray-900 line-clamp-2" />
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green-700"><T path="services.storyReadMore" as="span" /> <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </Link>
                ))}
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

export default ServiceStory;
