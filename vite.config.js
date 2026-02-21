import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for GitHub Pages: github.com/Siddhant-Sarkar73/lensmatch-india
  base: '/lensmatch-india/',
  // Only scan root index.html — prevents phase1-archive/index.html from being picked up
  optimizeDeps: {
    entries: ['index.html'],
  },
})
