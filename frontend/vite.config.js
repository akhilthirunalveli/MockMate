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
    },
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    force: true
  },
  build: {
    rollupOptions: {
      external: [],
      output: {
        format: 'es',
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          // Keep React as a single chunk to prevent loading issues
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
          // Router
          'react-router': ['react-router-dom'],
          // Large libraries
          'framer-motion': ['framer-motion'],
          'charts': ['recharts'],
          'pdf-utils': ['jspdf', 'html2canvas'],
          'syntax-highlighting': ['react-syntax-highlighter'],
          'markdown': ['react-markdown', 'remark-gfm'],
          'ui-libs': ['react-hot-toast', 'react-icons', '@heroicons/react'],
          'firebase': ['firebase'],
          'vercel-utils': ['@vercel/analytics', '@vercel/speed-insights'],
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
