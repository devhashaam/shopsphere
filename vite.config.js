import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The app is served from https://devhashaam.github.io/shopsphere/
export default defineConfig({
  base: '/shopsphere/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})
