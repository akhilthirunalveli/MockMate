import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Check React availability
if (typeof React === 'undefined' || typeof React.forwardRef !== 'function') {
  console.error('React is not properly loaded or forwardRef is missing');
  throw new Error('React loading error: forwardRef not available');
}

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
  try {
    root.render(<App />);
  } catch (fallbackError) {
    console.error('Fallback rendering also failed:', fallbackError);
    // Final fallback - show error message
    container.innerHTML = `
      <div style="
        display: flex; 
        justify-content: center; 
        align-items: center; 
        height: 100vh; 
        background: #000; 
        color: white; 
        font-family: system-ui;
        text-align: center;
        padding: 20px;
      ">
        <div>
          <h2>Application Error</h2>
          <p>Unable to load the application. Please refresh the page.</p>
          <button onclick="location.reload()" style="
            padding: 12px 24px; 
            background: #007bff; 
            color: white; 
            border: none; 
            border-radius: 6px; 
            cursor: pointer; 
            margin-top: 20px;
          ">
            Refresh Page
          </button>
        </div>
      </div>
    `;
  }
}
