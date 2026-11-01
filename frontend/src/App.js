import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import ScrollReveal from './components/ScrollReveal';
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
import CitiesPage from './components/CitiesPage';
import CustomizePage from './components/CustomizePage';
import CityDetail from './components/CityDetail';
import ServiceStory from './components/ServiceStory';
import InstagramFeed from './components/InstagramFeed';
import AdminLogin from './components/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './components/admin/AdminDashboard';
import { AdminOrders, AdminEnquiries } from './components/admin/AdminLists';
import AdminContent from './components/admin/AdminContent';
import AdminSections from './components/admin/AdminSections';
import AdminPictures from './components/admin/AdminPictures';
import { AdminBlog, AdminColours, AdminHistory } from './components/admin/AdminExtras';
import LiveEditor from './components/editor/LiveEditor';
import { SiteContentProvider, LiveArea } from './context/SiteContent';
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
      <SiteContentProvider>
      <BrowserRouter>
        <ScrollReveal />
        <LiveEditor />
        <Routes>
          <Route path="/" element={<LiveArea><HomePage /></LiveArea>} />
          <Route path="/customize" element={<LiveArea><CustomizePage /></LiveArea>} />
          <Route path="/products" element={<LiveArea><Products /></LiveArea>} />
          <Route path="/cities" element={<LiveArea><CitiesPage /></LiveArea>} />
          <Route path="/cities/:city" element={<LiveArea><CityDetail /></LiveArea>} />
          <Route path="/services/:slug" element={<LiveArea><ServiceStory /></LiveArea>} />
          <Route path="/blog" element={<LiveArea><Blog /></LiveArea>} />
          <Route path="/blog/:slug" element={<LiveArea><BlogPost /></LiveArea>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sections" element={<AdminSections />} />
            <Route path="pictures" element={<AdminPictures />} />
            <Route path="words" element={<AdminContent />} />
            <Route path="content" element={<AdminContent />} />
            <Route path="colours" element={<AdminColours />} />
            <Route path="history" element={<AdminHistory />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="enquiries" element={<AdminEnquiries />} />
            <Route path="blog" element={<AdminBlog />} />
          </Route>
          <Route path="*" element={<LiveArea><HomePage /></LiveArea>} />
        </Routes>
      </BrowserRouter>
      </SiteContentProvider>
      <Toaster />
    </div>
  );
}

export default App;
