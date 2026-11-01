import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SELECTOR = 'main :is(h1,h2,h3,h4,p,li,blockquote):not(#home *)';

const ScrollReveal = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith('/admin')) return undefined;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('reveal-in'); io.unobserve(e.target); }
      }),
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    const seen = new WeakSet();
    const scan = () => {
      document.querySelectorAll(SELECTOR).forEach((el) => {
        if (seen.has(el) || el.classList.contains('reveal-in')) return;
        seen.add(el);
        const sibs = Array.from(el.parentElement?.children || []);
        el.style.setProperty('--reveal-delay', `${Math.min(sibs.indexOf(el), 5) * 90}ms`);
        el.classList.add('reveal');
        io.observe(el);
      });
    };
    scan();
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, [pathname]);

  return null;
};

export default ScrollReveal;
