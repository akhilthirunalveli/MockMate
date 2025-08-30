import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      // Add explicit configuration for React plugin
      include: "**/*.{jsx,tsx}",
      babel: {
        plugins: []
      }
    }),
    tailwindcss()
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})
