import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import AdminInbox from './components/AdminInbox';
import { Toaster } from './components/ui/toaster';

const HomePage = () => {
  return (
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
};

function App() {
  return (
    <div className="App">
      <BrowserRouter>
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
          <Route path="/admin" element={<AdminInbox />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </div>
  );
}

export default App;
