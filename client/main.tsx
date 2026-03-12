import ReactDOM from 'react-dom/client';
import App from '@/App/App';
import React from 'react';
import '@/styles/global.css';
import { TooltipProvider } from '@/components/ui/tooltip';

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </React.StrictMode>
  );
} else {
  throw new Error('Root element not found ');
}
