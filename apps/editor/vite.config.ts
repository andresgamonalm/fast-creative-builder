import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El editor y la API viven en el mismo origen. En desarrollo, Vite sirve el
// editor y reenvía /api al Worker de wrangler, así que el navegador ve una
// sola procedencia y las cookies de sesión funcionan igual que en producción.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8787',
        changeOrigin: false,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
