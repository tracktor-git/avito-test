import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';
import Checker from 'vite-plugin-checker';

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    svgr(),
    Checker({ typescript: true }),
  ],
  base: mode === 'production' ? '/testlab-react/' : '/',
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').at(1);

          let type; /* eslint-disable-line */

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            type = 'img';
          } else if (/ttf|woff|eot/i.test(extType || '')) {
            type = 'fonts';
          } else {
            type = extType;
          }

          return `assets/${type}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
}));
