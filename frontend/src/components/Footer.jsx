import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';
import { waLink } from '../lib/api';

const Footer = () => {
  const { get } = useContent();
  const brand = get('brand', {});
  const social = get('social', {});
  const navLinks = get('header.navLinks', []);
  const pageLinks = get('header.pageLinks', []);
  const cities = get('cities.items', []).slice(0, 12);
  const legal = get('footer.legal', []);

  const socials = [
    { Icon: Instagram, href: social.instagram, label: 'Instagram', style: { background: 'linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)' }, cls: '' },
    { Icon: Facebook, href: social.facebook, label: 'Facebook', style: {}, cls: 'bg-[#1877F2] hover:brightness-110' },
    { Icon: Youtube, href: social.youtube, label: 'YouTube', style: {}, cls: 'bg-[#FF0000] hover:brightness-110' },
  ];

  return (
    <Sec id="footer" as="footer" label="Footer" className="bg-gradient-to-b from-green-900 to-green-950 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white p-1">
                <Img path="brand.logo" alt={brand.name} className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <T path="brand.tagline" as="div" className="font-script text-pink-300 text-lg -mb-1" />
                <T path="brand.name" as="div" className="font-display font-bold text-xl" />
              </div>
            </div>
            <T path="footer.about" as="p" className="mt-4 text-sm text-white/70 leading-relaxed" />
            <div className="mt-5 flex gap-3">
              {socials.map(({ Icon, href, label, style, cls }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  data-testid={`social-${label.toLowerCase()}`}
                  style={style}
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-transform hover:scale-110 shadow-md ${cls}`}
                >
                  <Icon className="w-5 h-5 text-white" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <T path="footer.quickLinksTitle" as="h4" className="font-display font-bold text-lg mb-4" />
            <ul className="space-y-2 text-sm">
              {navLinks.map((l, i) => (
                <li key={`nav-${i}`}><a href={l.href} className="text-white/70 hover:text-pink-300 transition-colors"><T path={`header.navLinks.${i}.label`} as="span" /></a></li>
              ))}
              <li><Link to="/customize" className="text-white/70 hover:text-pink-300 transition-colors"><T path="footer.customizeLink" as="span" /></Link></li>
              {pageLinks.filter((l) => l.href !== '/customize').map((l, i) => {
                const idx = pageLinks.indexOf(l);
                return (
                  <li key={`page-${i}`}><Link to={l.href} className="text-white/70 hover:text-pink-300 transition-colors"><T path={`header.pageLinks.${idx}.label`} as="span" /></Link></li>
                );
              })}
            </ul>
          </div>

          <div>
            <T path="footer.citiesTitle" as="h4" className="font-display font-bold text-lg mb-4" />
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {cities.map((c, i) => (
                <Link key={i} to="/cities" className="text-white/70 hover:text-pink-300 transition-colors"><T path={`cities.items.${i}`} as="span" /></Link>
              ))}
            </div>
          </div>

          <div>
            <T path="footer.contactTitle" as="h4" className="font-display font-bold text-lg mb-4" />
            <div className="space-y-3 text-sm">
              <a href={`tel:${brand.phone}`} className="flex items-start gap-3 text-white/80 hover:text-pink-300">
                <Phone className="w-4 h-4 mt-0.5 text-pink-400" />
                <T path="brand.phone" as="span" />
              </a>
              <a href={`mailto:${brand.email}`} className="flex items-start gap-3 text-white/80 hover:text-pink-300">
                <Mail className="w-4 h-4 mt-0.5 text-pink-400" />
                <T path="brand.email" as="span" />
              </a>
              <div className="flex items-start gap-3 text-white/80">
                <MapPin className="w-4 h-4 mt-0.5 text-pink-400" />
                <T path="brand.address" as="span" />
              </div>
            </div>

            <a
              href={waLink(brand.phoneRaw, get('footer.waMsg', ''))}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-full transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> <T path="footer.waBtn" as="span" />
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <T path="footer.copyright" as="div" vars={{ year: new Date().getFullYear() }} />
          <div className="flex items-center gap-5">
            {legal.map((l, i) => (
              <a key={i} href={l.href} className="hover:text-pink-300"><T path={`footer.legal.${i}.label`} as="span" /></a>
            ))}
            <ListTools path="footer.legal" label="legal links" className="!my-0 !py-1.5 !px-3" />
          </div>
        </div>
      </div>
    </Sec>
  );
};

export default Footer;
