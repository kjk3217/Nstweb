import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar, Footer } from './components/Layout';
import { HeroSection } from './components/sections/HeroSection';
import { WhyNSTSection } from './components/sections/WhyNSTSection';
import { ResultsSection } from './components/sections/ResultsSection';
import { ProcessSection } from './components/sections/ProcessSection';
import { ScientificSection } from './components/sections/ScientificSection';
import { PortfolioSection } from './components/sections/PortfolioSection';
import { ContactSection } from './components/sections/ContactSection';
import { FloatingActions } from './components/FloatingActions';
import AdminPage from './pages/AdminPage';
import { ContentProvider } from './context/ContentContext';

const MainPage = () => (
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

const App = () => {
  return (
    <ContentProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </BrowserRouter>
    </ContentProvider>
  );
};

export default App;
