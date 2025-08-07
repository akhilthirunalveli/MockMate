import React from './utils/ReactWrapper.jsx'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Ensure DOM is ready and root element exists
const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

// Create root with error handling
let root;
try {
  root = createRoot(container);
} catch (error) {
  console.error('Failed to create React root:', error);
  throw error;
}

// Render with comprehensive error boundary
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
