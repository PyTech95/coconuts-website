import { useEffect } from 'react';
import { useSiteContent } from '../context/SiteContent';

// Applies SEO meta (title + description + keywords) from editable content.
const Seo = () => {
  const { content } = useSiteContent();
  const seo = content?.seo;
  useEffect(() => {
    if (!seo) return;
    if (seo.title) document.title = seo.title;
    const set = (name, val) => {
      if (!val) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    set('description', seo.description);
    set('keywords', seo.keywords);
  }, [seo]);
  return null;
};

export default Seo;
