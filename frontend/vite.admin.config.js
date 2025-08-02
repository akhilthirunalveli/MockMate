import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['M.svg', 'vite.svg'],
      manifest: {
        name: 'MockMate Admin',
        short_name: 'Admin',
        description: 'MockMate Admin Dashboard',
        theme_color: '#dc3545',
        background_color: '#000000',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/admin/',
        start_url: '/admin/',
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
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\./,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'admin-api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 hours
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    proxy: {
      '/api': 'http://localhost:8000',
    },
  },
  build: {
    outDir: 'dist-admin',
    rollupOptions: {
      input: 'admin.html'
    }
  }
})
