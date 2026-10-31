import React, { useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, MessageCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { useContent } from '../cms/ContentContext';
import { T, Img, Vid, Sec, ListTools } from '../cms/Editable';
import { waLink } from '../lib/api';

const formatDate = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return d;
  return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

/** One content block of a post. `base` = "blog.posts.<i>.content.<k>" */
const Block = ({ block, base }) => {
  switch (block.type) {
    case 'h':
      return <T path={`${base}.text`} as="h2" className="font-display font-bold text-2xl text-gray-900 mt-8 mb-3" />;
    case 'ul':
      return (
        <ul className="list-disc pl-6 space-y-2 my-4 text-gray-700">
          {(block.items || []).map((_, j) => (
            <T key={j} path={`${base}.items.${j}`} as="li" />
          ))}
        </ul>
      );
    case 'quote':
      return <T path={`${base}.text`} as="blockquote" className="my-6 border-l-4 border-pink-400 pl-5 py-1 italic text-lg text-gray-700 leading-relaxed" />;
    case 'img':
      return (
        <figure className="my-6">
          <div className="rounded-2xl overflow-hidden shadow-md">
            <Img path={`${base}.src`} alt={block.caption || ''} className="w-full h-auto object-cover" loading="lazy" />
          </div>
          {(block.caption || '') !== '' && <T path={`${base}.caption`} as="figcaption" className="mt-2 text-center text-xs text-gray-500" />}
        </figure>
      );
    case 'video':
      return (
        <figure className="my-6">
          <div className="rounded-2xl overflow-hidden shadow-md bg-black aspect-video">
            <Vid path={`${base}.src`} controls playsInline className="w-full h-full object-contain" />
          </div>
          {(block.caption || '') !== '' && <T path={`${base}.caption`} as="figcaption" className="mt-2 text-center text-xs text-gray-500" />}
        </figure>
      );
    default:
      return <T path={`${base}.text`} as="p" className="text-gray-700 leading-relaxed my-4" />;
  }
};

const BlogPost = () => {
  const { slug } = useParams();
  const { get } = useContent();
  const brand = get('brand', {});
  const posts = get('blog.posts', []);
  const i = posts.findIndex((b) => b.slug === slug);
  const post = i >= 0 ? posts[i] : null;

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) document.title = `${post.title} | ${brand.name || 'Mr. Coconetto'}`;
  }, [post, brand.name]);

  if (!post) return <Navigate to="/blog" replace />;

  const base = `blog.posts.${i}`;
  const related = posts
    .map((b, k) => ({ b, k }))
    .filter(({ b }) => b.slug !== slug && b.published !== false)
    .slice(0, 3);

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36">
        <Sec id="blog-post" as="div" label="Blog post">
          <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
            <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700">
              <ArrowLeft className="w-4 h-4" /> <T path="blog.backLabel" as="span" />
            </Link>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mt-6">
              <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(post.date)}</span>
              <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> <T path={`${base}.readTime`} as="span" /></span>
              <ListTools path="blog.posts" label="blog posts" className="!my-0" />
            </div>
            <T path={`${base}.title`} as="h1" data-testid="blogpost-title" className="mt-3 font-display font-extrabold text-3xl md:text-4xl text-gray-900 leading-tight" />
            <div className="mt-6 rounded-3xl overflow-hidden shadow-lg">
              <Img path={`${base}.image`} alt={post.title} className="w-full h-full object-cover" />
            </div>
            <div className="mt-6">
              {(post.content || []).map((block, k) => <Block key={k} block={block} base={`${base}.content.${k}`} />)}
            </div>

            <div className="mt-10 rounded-2xl bg-gradient-to-r from-green-600 to-pink-600 text-white p-6 md:p-8 text-center">
              <T path="blog.ctaTitle" as="h3" className="font-display font-bold text-xl md:text-2xl" />
              <a
                href={waLink(brand.phoneRaw, `Hi Mr. Coconetto! I read "${post.title}" and would like a quote.`)}
                target="_blank"
                rel="noreferrer"
                data-testid="blogpost-cta"
                className="mt-4 inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50"
              >
                <MessageCircle className="w-4 h-4" /> <T path="blog.ctaBtn" as="span" />
              </a>
            </div>
          </article>
        </Sec>

        {/* Related */}
        <Sec id="blog-related" label="Related posts" data-testid="blogpost-related" className="section-pad bg-green-50 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <T path="blog.relatedTitle" as="h2" className="font-display font-bold text-2xl text-gray-900 mb-6" />
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map(({ b, k }) => (
                <Link key={k} to={`/blog/${b.slug}`} className="coco-card group bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm">
                  <div className="aspect-[16/10] overflow-hidden">
                    <Img path={`blog.posts.${k}.image`} alt={b.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <T path={`blog.posts.${k}.title`} as="h3" className="font-display font-bold text-base text-gray-900 leading-snug" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Sec>
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default BlogPost;
