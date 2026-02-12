import ReactDOM from 'react-dom/client';
import App from '@/App/App';
import React from 'react';
import '@/styles/global.css';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  throw new Error('Root element not found ');
}
