import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, Clock } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';

const formatDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

const Blog = () => {
  const { get } = useContent();
  const posts = get('blog.posts', []);

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36">
        <Sec id="blog-page" label="Blog page" className="section-pad">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <T path="blog.pageKicker" as="span" className="text-pink-600 font-script text-2xl" />
              <h1 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
                <T path="blog.pageTitle" as="span" /> <T path="blog.pageTitleEm" as="em" className="text-green-700 not-italic" />
              </h1>
              <T path="blog.pageDesc" as="p" className="mt-3 text-gray-600 max-w-2xl mx-auto" />
              <ListTools path="blog.posts" label="blog posts" />
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((b, i) => {
                if (b.published === false) return null;
                return (
                  <Link
                    key={i}
                    to={`/blog/${b.slug}`}
                    data-testid={`blog-card-${b.slug}`}
                    className="coco-card group bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm flex flex-col"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <Img path={`blog.posts.${i}.image`} alt={b.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(b.date)}</span>
                        <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> <T path={`blog.posts.${i}.readTime`} as="span" /></span>
                      </div>
                      <T path={`blog.posts.${i}.title`} as="h2" className="mt-2 font-display font-bold text-lg text-gray-900 leading-snug" />
                      <T path={`blog.posts.${i}.excerpt`} as="p" className="mt-2 text-sm text-gray-600 leading-relaxed flex-1" />
                      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-pink-600">
                        <T path="blog.readMore" as="span" /> <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
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

export default Blog;
