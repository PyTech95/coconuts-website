import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { useContent } from '../cms/ContentContext';
import { T, Img, Sec, ListTools } from '../cms/Editable';
import { waLink } from '../lib/api';

const underline = 'absolute left-2.5 right-2.5 -bottom-0.5 h-0.5 bg-gradient-to-r from-green-500 to-pink-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform';

const Header = () => {
  const { get, editMode } = useContent();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const brand = get('brand', {});
  const navLinks = get('header.navLinks', []);
  const pageLinks = get('header.pageLinks', []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50" data-testid="site-header">
      {/* Top strip */}
      <Sec id="topstrip" as="div" label="Top strip" className="hidden md:block bg-gradient-to-r from-green-700 via-green-600 to-pink-600 text-white text-xs">
        <div className="max-w-7xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" /> <T path="brand.address" /></span>
            <a href={`mailto:${brand.email}`} className="inline-flex items-center gap-1.5 hover:underline"><Mail className="w-3.5 h-3.5" /> <T path="brand.email" /></a>
          </div>
          <div className="flex items-center gap-4">
            <a href={`tel:${brand.phone}`} className="inline-flex items-center gap-1.5 hover:underline"><Phone className="w-3.5 h-3.5" /> <T path="brand.phone" /></a>
            <a href={waLink(brand.phoneRaw)} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 hover:underline"><T path="header.supportLabel" /></a>
          </div>
        </div>
      </Sec>

      {/* Main nav */}
      <Sec id="header" as="div" label="Header" className={`transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            <a href="/#home" className="flex items-center gap-3">
              <Img path="brand.logo" alt={brand.name} className="w-[88px] h-[88px] sm:w-[68px] sm:h-[68px] object-contain" />
              <div className="leading-tight hidden sm:block whitespace-nowrap">
                <T path="brand.tagline" as="div" className="font-script text-pink-600 text-lg -mb-1" />
                <T path="brand.name" as="div" className="font-display font-bold text-green-800 text-xl" />
              </div>
            </a>

            <nav className="hidden xl:flex items-center gap-0.5">
              {navLinks.map((link, i) => (
                <a key={`${link.href}-${i}`} href={link.href} className="relative px-2.5 py-2 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors group whitespace-nowrap">
                  <T path={`header.navLinks.${i}.label`} />
                  <span className={underline} />
                </a>
              ))}
              {pageLinks.map((l, i) => (
                <Link key={`${l.href}-${i}`} to={l.href} className="relative px-2.5 py-2 text-sm font-medium text-gray-700 hover:text-green-700 transition-colors group whitespace-nowrap">
                  <T path={`header.pageLinks.${i}.label`} />
                  <span className={underline} />
                </Link>
              ))}
              {editMode && <ListTools path="header.navLinks" label="menu" className="!my-0 !ml-2 !py-1.5 !px-3" />}
            </nav>

            <div className="flex items-center gap-2">
              <a href={waLink(brand.phoneRaw, get('header.quoteMsg', ''))} target="_blank" rel="noreferrer">
                <Button className="bg-green-600 hover:bg-green-700 text-white rounded-full px-5 shadow-md whitespace-nowrap"><T path="header.quoteBtn" /></Button>
              </a>
              <button className="xl:hidden p-2 rounded-md text-gray-700" onClick={() => setMobileOpen(!mobileOpen)} aria-label="toggle menu" data-cms-allow>
                {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {mobileOpen && (
            <div className="xl:hidden py-4 border-t border-gray-100">
              <div className="flex flex-col gap-1">
                {navLinks.map((link, i) => (
                  <a key={`${link.href}-${i}`} href={link.href} onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                    <T path={`header.navLinks.${i}.label`} />
                  </a>
                ))}
                {pageLinks.map((l, i) => (
                  <Link key={`${l.href}-${i}`} to={l.href} onClick={() => setMobileOpen(false)} className="px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700 font-medium">
                    <T path={`header.pageLinks.${i}.label`} />
                  </Link>
                ))}
                <a href={`tel:${brand.phone}`} className="px-3 py-2 rounded-md text-green-700 font-semibold inline-flex items-center gap-2"><Phone className="w-4 h-4" /> <T path="brand.phone" /></a>
              </div>
            </div>
          )}
        </div>
      </Sec>
    </header>
  );
};

export default Header;
