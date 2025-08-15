import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react({
      fastRefresh: false
    }),
    tailwindcss()
  ],
  server: {
    port: 5174,
    proxy: {
      '/api': 'http://localhost:8000'
    }
  },
  // Removed define for __REACT_DEVTOOLS_GLOBAL_HOOK__ because replacing that
  // identifier at build time can produce invalid runtime code and cause
  // "Cannot set property __REACT_DEVTOOLS_GLOBAL_HOOK__ of #<Window>"
  // errors when code attempts to read/write the hook on window.
})
