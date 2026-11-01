import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { BRAND, NAV_LINKS, waLink } from '../data/mock';

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50">
      {/* Top strip */}
      <div className="hidden md:block bg-gradient-to-r from-green-700 via-green-600 to-pink-600 text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> Delhi (HQ)</span>
            <a href={`mailto:${BRAND.email}`} className="inline-flex items-center gap-1.5 hover:underline"><Mail className="w-3.5 h-3.5" /> {BRAND.email}</a>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${BRAND.phone}`} className="inline-flex items-center gap-1.5 hover:underline"><Phone className="w-3.5 h-3.5" /> {BRAND.phone}</a>
            <a href={`https://wa.me/${BRAND.phoneRaw}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:underline">Support</a>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className={`transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/85 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <a href="/#home" className="flex items-center gap-3">
              <img src={BRAND.logo} alt={BRAND.name} className="w-[76px] h-[76px] sm:w-14 sm:h-14 object-contain" />
              <div className="leading-tight hidden sm:block whitespace-nowrap">
                <div className="font-script text-pink-600 text-lg -mb-1">Simply Original</div>
                <div className="font-display font-bold text-green-800 text-xl">Mr. Coconetto</div>
              </div>
            </a>

            <nav className="hidden xl:flex items-center gap-0.5">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="relative px-2.5 py-2 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors group whitespace-nowrap">
                  {link.label}
                  <span className="absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-gradient-to-r from-green-500 to-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
                </a>
              ))}
              {[{ to: '/customize', label: 'Customize' }, { to: '/products', label: 'Products' }, { to: '/cities', label: 'Cities' }, { to: '/blog', label: 'Blog' }].map((l) => (
                <Link key={l.to} to={l.to} className="relative px-2.5 py-2 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors group whitespace-nowrap">
                  {l.label}
                  <span className="absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-gradient-to-r from-green-500 to-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform" />
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a href={waLink('Hi Mr. Coconetto! I would like to request a quote for personalized coconuts.')} target="_blank" rel="noreferrer">
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 shadow-md whitespace-nowrap">Request a Quote</Button>
              </a>
              <button className="xl:hidden p-2 rounded-md text-gray-700" onClick={() => setMobileOpen(!mobileOpen)} aria-label="toggle menu">
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="xl:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col gap-1">
                {NAV_LINKS.map((link) => (
                  <a key={link.href} href={link.href} onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                    {link.label}
                  </a>
                ))}
                {[{ to: '/customize', label: 'Customize' }, { to: '/products', label: 'Products' }, { to: '/cities', label: 'Cities' }, { to: '/blog', label: 'Blog' }].map((l) => (
                  <Link key={l.to} to={l.to} onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                    {l.label}
                  </Link>
                ))}
                <a href={`tel:${BRAND.phone}`} className="px-3 py-2 rounded-md text-green-700 font-semibold inline-flex items-center gap-2"><Phone className="w-4 h-4" /> {BRAND.phone}</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
