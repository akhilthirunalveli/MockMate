import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    nodePolyfills({
      // simple-peer needs crypto, events, util polyfills
      include: ['buffer', 'process', 'events', 'util', 'stream']
    })
  ],
  server: {
    host: true, // Expose to local network
    port: 5174,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  define: {
    global: 'window'
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
