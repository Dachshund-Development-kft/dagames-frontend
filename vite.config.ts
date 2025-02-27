import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['3e17-91-82-82-38.ngrok-free.app'],
  },

  plugins: [
    react(),
  ],
})
