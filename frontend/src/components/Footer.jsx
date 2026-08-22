import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube, MessageCircle } from 'lucide-react';
import { BRAND, NAV_LINKS, CITIES, SOCIAL, waLink } from '../data/mock';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-green-900 to-green-950 text-white pt-16 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-white p-1">
                <img src={BRAND.logo} alt={BRAND.name} className="w-full h-full object-contain" />
              </div>
              <div className="leading-tight">
                <div className="font-script text-pink-300 text-lg -mb-1">Simply Original</div>
                <div className="font-display font-bold text-xl">Mr. Coconetto</div>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/70 leading-relaxed">India's premium personalized coconut brand for weddings, haldi, mehndi, corporate events and every occasion worth celebrating — customized coconuts delivered fresh, pan-India.</p>
            <div className="mt-5 flex gap-3">
              {[
                { Icon: Instagram, href: SOCIAL.instagram, label: 'Instagram', style: { background: 'linear-gradient(45deg,#feda75,#fa7e1e,#d62976,#962fbf,#4f5bd5)' }, cls: '' },
                { Icon: Facebook, href: SOCIAL.facebook, label: 'Facebook', style: {}, cls: 'bg-[#1877F2] hover:brightness-110' },
                { Icon: Youtube, href: SOCIAL.youtube, label: 'YouTube', style: {}, cls: 'bg-[#FF0000] hover:brightness-110' },
              ].map(({ Icon, href, label, style, cls }) => (
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
            <h4 className="font-display font-bold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {NAV_LINKS.map((l) => (
                <li key={l.href}><a href={l.href} className="text-white/70 hover:text-pink-300 transition-colors">{l.label}</a></li>
              ))}
              <li><Link to="/customize" className="text-white/70 hover:text-pink-300 transition-colors">Customize Your Coconut</Link></li>
              <li><Link to="/products" className="text-white/70 hover:text-pink-300 transition-colors">Products</Link></li>
              <li><Link to="/cities" className="text-white/70 hover:text-pink-300 transition-colors">Cities</Link></li>
              <li><Link to="/blog" className="text-white/70 hover:text-pink-300 transition-colors">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Personalized Coconuts Across India</h4>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
              {CITIES.slice(0, 12).map((c) => (
                <Link key={c} to="/cities" className="text-white/70 hover:text-pink-300 transition-colors">{c}</Link>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-4">Get in Touch</h4>
            <div className="space-y-3 text-sm">
              <a href={`tel:${BRAND.phone}`} className="flex items-start gap-3 text-white/80 hover:text-pink-300">
                <Phone className="w-4 h-4 mt-0.5 text-pink-400" />
                <span>{BRAND.phone}</span>
              </a>
              <a href={`mailto:${BRAND.email}`} className="flex items-start gap-3 text-white/80 hover:text-pink-300">
                <Mail className="w-4 h-4 mt-0.5 text-pink-400" />
                <span>{BRAND.email}</span>
              </a>
              <div className="flex items-start gap-3 text-white/80">
                <MapPin className="w-4 h-4 mt-0.5 text-pink-400" />
                <span>Delhi (HQ)</span>
              </div>
            </div>

            <a
              href={waLink('Hi Mr. Coconetto! I would like a quote for personalized coconuts.')}
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-3 rounded-full transition-colors"
            >
              <MessageCircle className="w-4 h-4" /> Get a Quote on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/60">
          <div>© {new Date().getFullYear()} Mr. Coconetto. All Rights Reserved.</div>
          <div className="flex gap-5">
            <a href="#" className="hover:text-pink-300">Privacy Policy</a>
            <a href="#" className="hover:text-pink-300">Terms of Service</a>
            <a href="#" className="hover:text-pink-300">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
