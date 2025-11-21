import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SiteProvider } from './SiteContext';
import { Navbar, Footer } from './components/Layout';
import { HeroSection } from './components/sections/HeroSection';
import { WhyNSTSection } from './components/sections/WhyNSTSection';
import { ResultsSection } from './components/sections/ResultsSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { ScientificSection } from './components/sections/ScientificSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { ContactSection } from './components/sections/ContactSection';
import { FloatingActions } from './components/FloatingActions';
import { AdminPage } from './pages/Admin';

const MainSite = () => (
  <>
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
  </>
);

const App = () => {
  return (
    <SiteProvider>
      <BrowserRouter>
        <div className="min-h-screen font-sans bg-white text-slate-900">
          <Routes>
            <Route path="/" element={<MainSite />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </SiteProvider>
  );
};

export default App;
