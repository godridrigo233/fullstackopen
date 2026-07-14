import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    loader: 'jsx', // 👈 Le decimos que lea JSX incluso si el archivo es .js
    include: /src\/.*\.js$/,
  },
})
