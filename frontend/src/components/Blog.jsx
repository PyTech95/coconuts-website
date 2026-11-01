import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { useBlogs } from '../hooks/useBlogs';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

const Blog = () => {
  const posts = useBlogs();
  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36">
        <section className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <span className="text-pink-600 font-script text-2xl">The Coconut Journal</span>
              <h1 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
                Ideas & Guides on <em className="text-green-700 not-italic">Personalized Coconuts</em>
              </h1>
              <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
                Tips, inspiration and everything you need to know about customized coconuts for weddings, events and celebrations across India.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {!posts && [0, 1, 2].map((i) => <div key={i} className="h-80 rounded-3xl bg-gray-100 animate-pulse" />)}
              {posts?.length === 0 && <p className="text-gray-500" data-testid="blog-empty">No articles yet.</p>}
              {(posts || []).map((b) => (
                <Link
                  key={b.slug}
                  to={`/blog/${b.slug}`}
                  data-testid={`blog-card-${b.slug}`}
                  className="coco-card group bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm flex flex-col"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={b.image} alt={b.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(b.date)}</span>
                      <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {b.readTime}</span>
                    </div>
                    <h2 className="mt-2 font-display font-bold text-lg text-gray-900 leading-snug">{b.title}</h2>
                    <p className="mt-2 text-sm text-gray-600 leading-relaxed flex-1">{b.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pink-600">
                      Read more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default Blog;
