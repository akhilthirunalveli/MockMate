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
  define: {
    __REACT_DEVTOOLS_GLOBAL_HOOK__: 'undefined'
  }
})
