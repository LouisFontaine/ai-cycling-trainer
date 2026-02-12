import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@ai-cycling-trainer/shared-types': path.resolve(
        __dirname,
        '../../packages/shared-types/src',
      ),
      '@ai-cycling-trainer/shared-utils': path.resolve(
        __dirname,
        '../../packages/shared-utils/src',
      ),
    },
  },
  server: {
    host: process.env.API_URL ? '0.0.0.0' : 'localhost',
    port: 3001,
    proxy: {
      '/api': {
        target: process.env.API_URL || 'http://localhost:3000',
        changeOrigin: true,
      },
    },
    hmr: {
      host: 'localhost',
      port: 3001,
    },
    watch: {
      usePolling: true,
      interval: 1000,
    },
  },
});
