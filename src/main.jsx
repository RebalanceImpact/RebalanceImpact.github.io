import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Import fonts
import './styles/fonts.css';
// Import global styles
import './styles/globals.css';

// Initialize GTM
import { initGTM } from './config/analytics';
initGTM();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
