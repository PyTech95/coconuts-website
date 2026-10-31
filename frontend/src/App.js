import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Customizer from './components/Customizer';
import AboutUs from './components/AboutUs';
import EventTypes from './components/EventTypes';
import Stats from './components/Stats';
import VideoSection from './components/VideoSection';
import Services from './components/Services';
import Plans from './components/Plans';
import Cities from './components/Cities';
import Occasions from './components/Occasions';
import WhyChoose from './components/WhyChoose';
import Testimonials from './components/Testimonials';
import FAQ from './components/FAQ';
import CTA from './components/CTA';
import Contact from './components/Contact';
import BlogTeaser from './components/BlogTeaser';
import Footer from './components/Footer';
import FloatingButtons from './components/FloatingButtons';
import Blog from './components/Blog';
import BlogPost from './components/BlogPost';
import Products from './components/Products';
import ProductDetail from './components/ProductDetail';
import CitiesPage from './components/CitiesPage';
import CustomizePage from './components/CustomizePage';
import CityDetail from './components/CityDetail';
import ServiceStory from './components/ServiceStory';
import InstagramFeed from './components/InstagramFeed';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import { Toaster } from './components/ui/toaster';
import { ContentProvider, useContent } from './cms/ContentContext';
import { EditorUIProvider } from './cms/Editable';
import EditorToolbar from './cms/EditorToolbar';

// The preview build (static hosting without server-side routing) uses hash URLs.
const Router = process.env.REACT_APP_ROUTER === 'hash' ? HashRouter : BrowserRouter;

const HomePage = () => (
  <div className="bg-white">
    <Header />
    <main>
      <Hero />
      <Customizer />
      <AboutUs />
      <EventTypes />
      <Stats />
      <VideoSection />
      <Services />
      <Plans />
      <Cities />
      <Occasions />
      <WhyChoose />
      <CTA />
      <Testimonials />
      <BlogTeaser />
      <FAQ />
      <Contact />
    </main>
    <InstagramFeed />
    <Footer />
    <FloatingButtons />
  </div>
);

/** Keeps <title> / meta description in sync with the editable SEO settings. */
const SeoHead = () => {
  const { get } = useContent();
  const { pathname } = useLocation();
  const title = get('seo.title');
  const desc = get('seo.description');
  const keywords = get('seo.keywords');
  useEffect(() => {
    if (pathname.startsWith('/blog/') || pathname.startsWith('/admin')) return;
    if (title) document.title = title;
    const setMeta = (name, val) => {
      if (!val) return;
      let el = document.querySelector(`meta[name="${name}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute('name', name); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    setMeta('description', desc);
    setMeta('keywords', keywords);
  }, [title, desc, keywords, pathname]);
  return null;
};

const ScrollToHash = () => {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth' }), 50);
    }
  }, [hash, pathname]);
  return null;
};

function App() {
  return (
    <div className="App">
      <Router>
        <ContentProvider>
          <EditorUIProvider>
            <SeoHead />
            <ScrollToHash />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/customize" element={<CustomizePage />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:slug" element={<ProductDetail />} />
              <Route path="/cities" element={<CitiesPage />} />
              <Route path="/cities/:city" element={<CityDetail />} />
              <Route path="/services/:slug" element={<ServiceStory />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminLayout />} />
            </Routes>
            <EditorToolbar />
          </EditorUIProvider>
        </ContentProvider>
      </Router>
      <Toaster />
    </div>
  );
}

export default App;
