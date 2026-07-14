import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path' 
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3003',
        changeOrigin: true,
      },
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: path.resolve(__dirname, './testSetup.js'),
  }
})