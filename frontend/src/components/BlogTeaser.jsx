import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';

const BlogTeaser = () => {
  const { get } = useContent();
  const allPosts = get('blog.posts', []);
  // Keep the original index so edit paths point at the right post.
  const posts = allPosts
    .map((b, i) => ({ ...b, _i: i }))
    .filter((b) => b.published !== false)
    .slice(0, 3);

  return (
    <Sec id="blog" label="Blog teaser" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <T path="blog.kicker" as="span" className="text-pink-600 font-script text-2xl" />
            <h2 className="font-display font-bold text-3xl md:text-4xl text-gray-900">
              <T path="blog.title" as="span" /> <T path="blog.titleEm" as="em" className="text-green-700 not-italic" />
            </h2>
            <ListTools path="blog.posts" label="blog posts" />
          </div>
          <Link to="/blog" data-testid="blog-viewall" className="inline-flex items-center gap-1 text-sm font-semibold text-pink-600 hover:text-pink-700">
            <T path="blog.viewAll" as="span" /> <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {posts.map((b) => (
            <Link key={b._i} to={`/blog/${b.slug}`} className="coco-card group bg-white rounded-3xl overflow-hidden border border-green-100 shadow-sm">
              <div className="aspect-[16/10] overflow-hidden">
                <Img path={`blog.posts.${b._i}.image`} alt={b.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              </div>
              <div className="p-5">
                <T path={`blog.posts.${b._i}.title`} as="h3" className="font-display font-bold text-lg text-gray-900 leading-snug" />
                <T path={`blog.posts.${b._i}.excerpt`} as="p" className="mt-2 text-sm text-gray-600 line-clamp-2" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Sec>
  );
};

export default BlogTeaser;
