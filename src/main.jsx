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

// react-snap saves the live DOM, where React's separate text nodes (e.g. `© {year} Rebalance`)
// merge into one when the HTML is re-parsed, so hydration finds the wrong text and throws.
// Put a comment between adjacent text nodes, as React's own server renderer does.
// react-snap calls snapSaveState just before it saves the page.
if (navigator.userAgent === 'ReactSnap') {
  window.snapSaveState = () => {
    const walker = document.createTreeWalker(rootElement, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    while (walker.nextNode()) textNodes.push(walker.currentNode);
    textNodes
      .filter((node) => node.nextSibling && node.nextSibling.nodeType === Node.TEXT_NODE)
      .forEach((node) => node.after(document.createComment(' ')));
    return {};
  };
}

// We package your app into a variable to keep the logic below clean
const appContent = (
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// If react-snap has already generated the HTML (Production/SEO).
// react-snap itself always renders fresh: it can be served a page it already saved under
// another route (the GitHub Pages /404.html redirect lands on the saved home page).
if (rootElement.hasChildNodes() && navigator.userAgent !== 'ReactSnap') {
  hydrateRoot(rootElement, appContent);
} else {
  // Otherwise, render normally (Local Development)
  const root = createRoot(rootElement);
  root.render(appContent);
}