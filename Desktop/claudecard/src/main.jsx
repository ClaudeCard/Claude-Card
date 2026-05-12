import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Restore path redirected via 404.html on GitHub Pages
const params = new URLSearchParams(window.location.search);
const redirectPath = params.get('p');
if (redirectPath) {
  window.history.replaceState(null, '', redirectPath);
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
