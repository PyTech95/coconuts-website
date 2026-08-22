import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { BLOGS } from '../data/mock';

const BlogTeaser = () => {
  const posts = BLOGS.slice(0, 3);
  return (
    <section id="blog" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-pink-600 font-script text-2xl">From the Blog</span>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900">
              Personalized Coconut <em className="text-green-700 not-italic">Ideas & Guides</em>
            </h2>
          </div>
          <Link to="/blog" data-testid="blog-viewall" className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700">
            View all articles <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {posts.map((b) => (
            <Link key={b.slug} to={`/blog/${b.slug}`} className="coco-card group bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={b.image} alt={b.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-gray-900 leading-snug">{b.title}</h3>
                <p className="mt-2 text-sm text-gray-600 line-clamp-2">{b.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogTeaser;
