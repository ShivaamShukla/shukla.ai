import React from 'react';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Pricing from '../components/Pricing';
import Showcase from '../components/Showcase';
import FAQs from '../components/FAQs';
import Footer from '../components/Footer';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <Showcase />
      <Pricing />
      <FAQs />
      <Footer />
    </div>
  );
};

export default Home;