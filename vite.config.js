import path from 'path';
import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  publicDir: 'public',

  root: '.',
  server: {
    open: true,
    middlewareMode: false,
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url === '/fbs') req.url = '/fbs/';
        if (req.url === '/lbs') req.url = '/lbs/';
        next();
      });
    },
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
        main: path.resolve(__dirname, 'index.html'),
        fbs: path.resolve(__dirname, 'public/fbs/index.html'),
        lbs: path.resolve(__dirname, 'public/lbs/index.html'),
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
