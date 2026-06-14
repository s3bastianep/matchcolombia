import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('framer-motion')) return 'motion';
          if (id.includes('@tanstack')) return 'query';
          if (id.includes('react-leaflet') || id.includes('leaflet')) return 'maps';
          if (id.includes('@react-google-maps') || id.includes('@googlemaps')) return 'google-maps';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('lucide-react')) return 'icons';
          if (id.includes('react-dom') || id.includes('react-router') || /node_modules[\\/]react[\\/]/.test(id)) {
            return 'react-vendor';
          }
        },
      },
    },
  },
});
