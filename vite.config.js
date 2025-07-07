import path, { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  root: '.',
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        pricing: resolve(__dirname, 'pricing.html'),
        about: resolve(__dirname, 'about.html'),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
});
