import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Build 3 of 3: IIFE for all.js (core + bus combined, for <script> tag usage)
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, 'src/all-iife-entry.js'),
      name: 'XenonJS',
      formats: ['iife'],
      fileName: () => 'all.iife.js',
    },
    target: 'es2020',
    minify: false,
  },
});
