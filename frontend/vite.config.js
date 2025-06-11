import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    outDir: 'dist'
  },
  server: {
    fs: {
      strict: false,
    }
  },
  // Ensures 404s are redirected to index.html
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
