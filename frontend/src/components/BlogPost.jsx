import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API } from '../lib/api';
import { useBlogs } from '../hooks/useBlogs';
import { useParams, Link, Navigate } from 'react-router-dom';
import { ArrowLeft, CalendarDays, Clock, MessageCircle } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import { waLink } from '../data/mock';

const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

const Block = ({ block }) => {
  if (block.type === 'h') return <h2 className="font-display font-bold text-2xl text-gray-900 mt-8 mb-3">{block.text}</h2>;
  if (block.type === 'ul')
    return (
      <ul className="list-disc pl-6 space-y-2 my-4 text-gray-700">
        {block.items.map((it, i) => <li key={i}>{it}</li>)}
      </ul>
    );
  return <p className="text-gray-700 leading-relaxed my-4">{block.text}</p>;
};

const BlogPost = () => {
  const { slug } = useParams();
  const all = useBlogs();
  const [post, setPost] = useState(undefined);

  useEffect(() => {
    setPost(undefined);
    axios.get(`${API}/blog/${slug}`).then(({ data }) => setPost(data)).catch(() => setPost(null));
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (post) document.title = `${post.title} | Mr. Coconetto`;
  }, [post]);

  if (post === null) return <Navigate to="/blog" replace />;
  if (!post) return <div className="min-h-screen"><Header /></div>;

  const related = (all || []).filter((b) => b.slug !== slug).slice(0, 3);

  return (
    <div className="bg-white">
      <Header />
      <main className="pt-28 md:pt-36">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 pb-8">
          <Link to="/blog" className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700">
            <ArrowLeft className="w-4 h-4" /> Back to Blog
          </Link>
          <div className="flex items-center gap-4 text-xs text-gray-500 mt-6">
            <span className="inline-flex items-center gap-1"><CalendarDays className="w-3.5 h-3.5" /> {formatDate(post.date)}</span>
            <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
          </div>
          <h1 data-testid="blogpost-title" className="mt-3 font-display font-extrabold text-3xl md:text-4xl text-gray-900 leading-tight">{post.title}</h1>
          <div className="mt-6 rounded-3xl overflow-hidden shadow-lg">
            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="mt-6">
            {post.html
              ? <div className="mc-article" dangerouslySetInnerHTML={{ __html: post.html }} />
              : (post.content || []).map((block, i) => <Block key={i} block={block} />)}
          </div>

          <div className="mt-10 rounded-2xl bg-gradient-to-r from-green-600 to-pink-600 text-white p-6 md:p-8 text-center">
            <h3 className="font-display font-bold text-xl md:text-2xl">Planning an event? Get a personalized coconut quote.</h3>
            <a
              href={waLink(`Hi Mr. Coconetto! I read "${post.title}" and would like a quote.`)}
              target="_blank"
              rel="noreferrer"
              data-testid="blogpost-cta"
              className="mt-4 inline-flex items-center gap-2 bg-white text-green-700 px-6 py-3 rounded-full font-bold shadow-lg hover:bg-gray-50"
            >
              <MessageCircle className="w-4 h-4" /> Get a Quote on WhatsApp
            </a>
          </div>
        </article>

        {/* Related */}
        <section data-testid="blogpost-related" className="section-pad bg-green-50 mt-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="font-display font-bold text-2xl text-gray-900 mb-6">Read Next</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {related.map((b) => (
                <Link key={b.slug} to={`/blog/${b.slug}`} className="coco-card group bg-white rounded-2xl overflow-hidden border border-green-100 shadow-sm">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img src={b.image} alt={b.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-display font-bold text-base text-gray-900 leading-snug">{b.title}</h3>
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

export default BlogPost;
