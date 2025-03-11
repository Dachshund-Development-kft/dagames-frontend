import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['a192-94-21-207-249.ngrok-free.app'],
  },

  plugins: [
    react(),
  ],
})
