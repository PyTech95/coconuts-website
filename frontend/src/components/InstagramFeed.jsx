import React from 'react';
import { Instagram, ArrowUpRight } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';

const InstagramFeed = () => {
  const { get } = useContent();
  const social = get('social', {});
  const posts = get('instagram.posts', []);

  return (
    <Sec id="instagram" label="Instagram feed" data-testid="instagram-feed" className="section-pad bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <T path="instagram.kicker" as="span" className="text-pink-600 font-script text-2xl" />
            <h2 className="font-display font-bold text-3xl md:text-5xl text-gray-900">
              <T path="instagram.title" as="span" /> <T path="instagram.titleEm" as="em" className="text-green-700 not-italic" />
            </h2>
            <T path="instagram.desc" as="p" className="mt-2 text-gray-600" />
            <ListTools path="instagram.posts" label="Instagram images" />
          </div>
          <a
            href={social.instagram}
            target="_blank"
            rel="noreferrer"
            data-testid="instagram-follow-btn"
            className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-white font-semibold shadow-lg transition-transform hover:scale-[1.03]"
            style={{ background: 'linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)' }}
          >
            <Instagram className="w-5 h-5" /> <T path="social.instagramHandle" as="span" />
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {posts.map((src, i) => (
            <a
              key={i}
              href={social.instagram}
              target="_blank"
              rel="noreferrer"
              data-testid={`instagram-post-${i}`}
              className="group relative aspect-square rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
            >
              <Img path={`instagram.posts.${i}`} alt={`Instagram post ${i + 1}`} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                <Instagram className="w-7 h-7 text-white drop-shadow" />
              </div>
              <ArrowUpRight className="absolute top-2 right-2 w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </a>
          ))}
        </div>
      </div>
    </Sec>
  );
};

export default InstagramFeed;
