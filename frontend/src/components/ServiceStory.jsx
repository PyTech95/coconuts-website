import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Palette, Package, MessageCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { SERVICES, waLink, slugify } from '../data/mock';

const ServiceStory = () => {
  const { slug } = useParams();
  const service = SERVICES.find((s) => slugify(s.title) === slug);

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

  const related = SERVICES.filter((s) => s.title !== service.title).slice(0, 3);
  const story = [
    `When it comes to ${service.tag.toLowerCase()} celebrations, the little details make the biggest impression. ${service.description}`,
    `Every coconut is hand-selected for its freshness and water content, chilled to perfection, and then carefully engraved by our team. We work with ${service.customization.toLowerCase()} so the final result feels made just for your moment — never generic, always memorable.`,
    `From the first sip to the last photo, guests remember a welcome that felt thoughtful and premium. That's exactly what a Mr. Coconetto coconut delivers — a refreshing, Instagram-worthy touch that fits right into your theme and décor.`,
  ];

  return (
    <div className="bg-white" data-testid="service-story-page">
      <Header />
      <main className="pt-24 md:pt-28">
        <section className="relative h-[42vh] min-h-[320px] overflow-hidden">
          <img src={service.image} alt={service.title} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 h-full flex flex-col justify-end pb-8 text-white">
            <span className="inline-flex w-fit items-center bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full">{service.tag}</span>
            <h1 data-testid="service-story-title" className="mt-3 font-display font-extrabold text-3xl md:text-5xl max-w-3xl">{service.title}</h1>
          </div>
        </section>

        <section className="section-pad">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Link to="/#services" className="text-sm font-semibold text-green-700 hover:text-green-800">← All services</Link>

            <div className="mt-6 space-y-5 text-gray-700 leading-relaxed">
              {story.map((p, i) => (<p key={i} className={i === 0 ? 'text-lg text-gray-800' : ''}>{p}</p>))}
            </div>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-green-100 bg-green-50/50 p-5 flex items-start gap-3">
                <Palette className="w-5 h-5 text-green-700 mt-0.5 shrink-0" />
                <div><div className="font-semibold text-gray-900 text-sm">Customization</div><div className="text-sm text-gray-600">{service.customization}</div></div>
              </div>
              <div className="rounded-2xl border border-pink-100 bg-pink-50/40 p-5 flex items-start gap-3">
                <Package className="w-5 h-5 text-pink-600 mt-0.5 shrink-0" />
                <div><div className="font-semibold text-gray-900 text-sm">Order Minimum</div><div className="text-sm text-gray-600">{service.minOrder}</div></div>
              </div>
            </div>

            <div className="mt-8 rounded-3xl bg-gradient-to-r from-green-600 to-pink-600 text-white p-7 text-center">
              <h2 className="font-display font-bold text-2xl">Ready to plan your {service.tag.toLowerCase()}?</h2>
              <p className="mt-2 text-white/90 text-sm">Tell us your date and theme — we'll craft a quote for you.</p>
              <div className="mt-5 flex flex-wrap justify-center gap-3">
                <a href={waLink(`Hi Mr. Coconetto! I'd like a quote for: ${service.title}.`)} target="_blank" rel="noreferrer">
                  <Button className="bg-white text-green-700 hover:bg-gray-50 rounded-full px-7 font-bold"><MessageCircle className="w-4 h-4 mr-2" /> Get a Quote on WhatsApp</Button>
                </a>
                <Link to="/customize"><Button variant="outline" className="rounded-full px-7 border-white text-white hover:bg-white/10 bg-transparent">Customize Your Coconut</Button></Link>
              </div>
            </div>

            <div className="mt-14">
              <h3 className="font-display font-bold text-xl text-gray-900 mb-4">More services</h3>
              <div className="grid sm:grid-cols-3 gap-4">
                {related.map((r) => (
                  <Link key={r.title} to={`/services/${slugify(r.title)}`} className="group rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
                    <div className="aspect-[4/3] overflow-hidden"><img src={r.image} alt={r.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" /></div>
                    <div className="p-3">
                      <div className="text-sm font-semibold text-gray-900 line-clamp-2">{r.title}</div>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-green-700">Read story <ArrowRight className="w-3 h-3" /></span>
                    </div>
                  </Link>
                ))}
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

export default ServiceStory;
