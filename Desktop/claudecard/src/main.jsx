import React from 'react';
import ReactDOM from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';

// Restore path + hash redirected via 404.html on GitHub Pages
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get('p');
const redirectHash = params.get('h');
if (redirectPath) {
  window.history.replaceState(null, '', redirectPath + (redirectHash || ''));
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </React.StrictMode>
);
