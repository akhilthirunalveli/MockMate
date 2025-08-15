import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  define: {
    global: 'globalThis',
  },
  plugins: [
    react({
      include: "**/*.{jsx,tsx}",
      exclude: /node_modules/,
      jsxRuntime: 'automatic'
    }), 
    tailwindcss()
  ],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // Keep React ecosystem together for better compatibility
          if (id.includes('node_modules')) {
            // Core React libraries - keep together and prioritize
            if (id.includes('react/') || id.includes('react-dom/') || id.includes('scheduler/')) {
              return 'react-vendor';
            }
            
            // React Router
            if (id.includes('react-router') || id.includes('@remix-run/router')) {
              return 'react-router';
            }
            
            // Animation libraries (can be large)
            if (id.includes('framer-motion')) {
              return 'framer-motion';
            }
            
            // Chart libraries (heavy)
            if (id.includes('recharts') || id.includes('d3-') || id.includes('victory')) {
              return 'charts';
            }
            
            // PDF generation (heavy)
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf-utils';
            }
            
            // Syntax highlighting
            if (id.includes('react-syntax-highlighter') || id.includes('highlight.js')) {
              return 'syntax-highlighting';
            }
            
            // Markdown processing
            if (id.includes('react-markdown') || id.includes('remark-') || id.includes('rehype-') || 
                id.includes('mdast-') || id.includes('hast-') || id.includes('micromark') || 
                id.includes('unist-') || id.includes('vfile')) {
              return 'markdown';
            }
            
            // UI libraries
            if (id.includes('react-hot-toast') || id.includes('react-icons') || id.includes('@heroicons/react')) {
              return 'ui-libs';
            }
            
            // Utilities
            if (id.includes('axios')) {
              return 'http-client';
            }
            
            if (id.includes('moment')) {
              return 'date-utils';
            }
            
            // Firebase
            if (id.includes('firebase')) {
              return 'firebase';
            }
            
            // Vercel analytics
            if (id.includes('@vercel/')) {
              return 'vercel-utils';
            }
            
            // Tailwind CSS
            if (id.includes('tailwindcss') || id.includes('@tailwindcss/')) {
              return 'tailwind';
            }
            
            // All other vendor libraries
            return 'vendor';
          }
          
          // Application code chunking
          if (id.includes('/pages/InterviewPrep/')) {
            return 'interview-prep';
          }
          if (id.includes('/pages/Home/') || id.includes('/pages/admin')) {
            return 'dashboard';
          }
          if (id.includes('/pages/Auth/')) {
            return 'auth-pages';
          }
          if (id.includes('/components/')) {
            return 'components';
          }
          if (id.includes('/utils/') || id.includes('/context/')) {
            return 'app-utils';
          }
        }
      }
    },
    chunkSizeWarningLimit: 800, // Lower warning limit to catch issues earlier
    sourcemap: false,
    minify: 'esbuild',
    target: ['es2020', 'chrome80', 'safari13'],
    cssCodeSplit: true,
    assetsInlineLimit: 2048 // Reduce inline limit to decrease bundle size
  },
  server: {
    port: 5174,
    proxy: {
      '/api': 'https://mockmate-backend-r0jk.onrender.com', // Local backend on port 8000
    },
    headers: {
      'Cross-Origin-Embedder-Policy': 'cross-origin',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  },
})
