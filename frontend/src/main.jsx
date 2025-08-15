import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root');

// Ensure container exists before proceeding
if (!container) {
  throw new Error('Root container not found');
}

const root = createRoot(container);

// Use try-catch to handle any rendering errors
try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error('Failed to render app:', error);
  // Fallback rendering without StrictMode
  root.render(<App />);
}
