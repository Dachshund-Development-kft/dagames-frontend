import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['b046-178-164-158-167.ngrok-free.app'],
  },

  plugins: [
    react(),
  ],
})
