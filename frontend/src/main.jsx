import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const container = document.getElementById('root');
const root = createRoot(container);

// Try without StrictMode to see if that's causing the Children property issue
root.render(<App />);
