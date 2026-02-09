import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';

import { Header, Footer } from './components/layout';
import { trackPageView } from './config/analytics';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ESGServicesPage from './pages/ESGServicesPage';
import NewToESGPage from './pages/NewToESGPage';
import DataKPIsPage from './pages/DataKPIsPage';
import NewsMediaPage from './pages/NewsMediaPage';
import SustainableReportingPage from './pages/SustainableReportingPage';
import NotFoundPage from './pages/NotFoundPage';

function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there's a hash, scroll to that element
    if (hash) {
      // Small delay to ensure the element is rendered
      setTimeout(() => {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      // No hash, scroll to top
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
}

function App() {
  const location = useLocation();

  // Track page views for SPA navigation
  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname]);

  return (
    <HelmetProvider>
      <div className="min-h-screen flex flex-col bg-cream">
        <ScrollToTop />
        <Header />
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/esg-services" element={<ESGServicesPage />} />
            <Route path="/new-to-esg-reporting" element={<NewToESGPage />} />
            <Route path="/data-kpis" element={<DataKPIsPage />} />
            <Route path="/news-media" element={<NewsMediaPage />} />
            <Route path="/sustainable-reporting" element={<SustainableReportingPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
        <Footer />
      </div>
    </HelmetProvider>
  );
}

export default App;
