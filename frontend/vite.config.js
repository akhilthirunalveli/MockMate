import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  define: {
    __DEV__: false,
    'process.env.NODE_ENV': JSON.stringify('production')
  },
  resolve: {
    alias: {
      'react': 'react',
      'react-dom': 'react-dom',
      'react/jsx-runtime': 'react/jsx-runtime'
    },
    dedupe: ['react', 'react-dom']
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react/jsx-runtime'],
    force: true
  },
  plugins: [
    react({
      jsxRuntime: 'classic',
      jsxImportSource: 'react',
      babel: {
        presets: [],
        plugins: []
      }
    }), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['M.svg', 'vite.svg'],
      manifest: {
        name: 'MockMate - Interview Prep',
        short_name: 'MockMate',
        description: 'AI-powered interview preparation app',
        theme_color: '#000000',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          {
            src: 'M.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // Increase the maximum file size limit for precaching
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          },
          // Cache large JS chunks with network-first strategy
          {
            urlPattern: /\.(?:js|css)$/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      external: [],
      output: {
        manualChunks: (id) => {
          // Vendor libraries
          if (id.includes('node_modules')) {
            // React ecosystem - keep together for better compatibility
            if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler') || id.includes('react/jsx-runtime')) {
              return 'react';
            }
            // Router
            if (id.includes('react-router')) {
              return 'router';
            }
            // UI & Animation libraries
            if (id.includes('framer-motion') || id.includes('motion-')) {
              return 'animation';
            }
            if (id.includes('react-hot-toast') || id.includes('react-icons')) {
              return 'ui-libs';
            }
            // Charts
            if (id.includes('recharts') || id.includes('victory') || id.includes('d3-')) {
              return 'charts';
            }
            // PDF generation
            if (id.includes('jspdf') || id.includes('html2canvas')) {
              return 'pdf';
            }
            // Firebase
            if (id.includes('firebase') || id.includes('@firebase')) {
              return 'firebase';
            }
            // Syntax highlighting - split into smaller chunks
            if (id.includes('react-syntax-highlighter')) {
              if (id.includes('/dist/esm/languages/') || id.includes('/dist/esm/async-languages/')) {
                return 'syntax-languages';
              }
              if (id.includes('/dist/esm/styles/')) {
                return 'syntax-styles';
              }
              return 'syntax-core';
            }
            if (id.includes('highlight.js')) {
              if (id.includes('/lib/languages/')) {
                return 'highlight-languages';
              }
              return 'highlight-core';
            }
            if (id.includes('refractor')) {
              if (id.includes('/lang/')) {
                return 'refractor-languages';
              }
              return 'refractor-core';
            }
            // Markdown
            if (id.includes('react-markdown') || id.includes('remark') || id.includes('rehype') || 
                id.includes('mdast') || id.includes('hast') || id.includes('micromark') || 
                id.includes('unist') || id.includes('vfile')) {
              return 'markdown-core';
            }
            // Utilities
            if (id.includes('moment') || id.includes('axios')) {
              return 'utils';
            }
            // DOMPurify
            if (id.includes('dompurify')) {
              return 'security';
            }
            // Core utilities (lodash-like)
            if (id.includes('es-toolkit') || id.includes('core-js')) {
              return 'polyfills';
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
          if (id.includes('/components/')) {
            return 'components';
          }
          if (id.includes('/utils/')) {
            return 'app-utils';
          }
        }
      }
    },
    chunkSizeWarningLimit: 2000, // Increase warning limit to 2MB
    sourcemap: false, // Disable sourcemaps to reduce bundle size
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  server: {
    proxy: {
      '/api': 'https://mockmate-backend-r0jk.onrender.com', // or your backend port
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
