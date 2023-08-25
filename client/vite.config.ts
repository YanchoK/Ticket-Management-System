import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000, // Change this to your desired port
    proxy: {
      '/api': {
        target: 'http://localhost:3000/', // The target URL of your API
        changeOrigin: true,
      },
    },
  },
})
