import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import FloatingButtons from './FloatingButtons';
import Customizer from './Customizer';

const CustomizePage = () => {
  useEffect(() => { window.scrollTo(0, 0); }, []);
  return (
    <div className="bg-white" data-testid="customize-page">
      <Header />
      <main className="pt-24 md:pt-28">
        <Customizer />
      </main>
      <Footer />
      <FloatingButtons />
    </div>
  );
};

export default CustomizePage;
