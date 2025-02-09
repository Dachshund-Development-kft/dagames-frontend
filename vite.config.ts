import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    allowedHosts: ['0c0f-193-226-227-88.ngrok-free.app'],
  },

  plugins: [
    react(),
  ],
})
