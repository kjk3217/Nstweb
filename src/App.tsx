import React from 'react';
import { Navbar, Footer } from './components/Layout';
import { HeroSection } from './components/sections/HeroSection';
import { WhyNSTSection } from './components/sections/WhyNSTSection';
import { ResultsSection } from './components/sections/ResultsSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { ScientificSection } from './components/sections/ScientificSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { ContactSection } from './components/sections/ContactSection';
import { FloatingActions } from './components/FloatingActions';

const App = () => {
  return (
    <div className="min-h-screen font-sans bg-white text-slate-900">
      <Navbar />
      
      <main>
        <HeroSection />
        <WhyNSTSection />
        <ResultsSection />
        <ProcessSection />
        <ScientificSection />
        <PortfolioSection />
        <ContactSection />
      </main>

      <Footer />
      <FloatingActions />
    </div>
  );
};

export default App;
