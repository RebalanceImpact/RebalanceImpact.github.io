import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import fonts
import './styles/fonts.css';
// Import global styles
import './styles/globals.css';

// Initialize GTM
import { initGTM } from './config/analytics';
initGTM();

const rootElement = document.getElementById('root');

// We package your app into a variable to keep the logic below clean
const appContent = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If react-snap has already generated the HTML (Production/SEO)
if (rootElement.hasChildNodes()) {
  hydrateRoot(rootElement, appContent);
} else {
  // Otherwise, render normally (Local Development)
  const root = createRoot(rootElement);
  root.render(appContent);
}