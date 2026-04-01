import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Build 2 of 2: IIFE + UMD — single entry only (required by Rolldown)
// Outputs dist/index.iife.js (script tag / unpkg) and dist/index.umd.js (CJS/AMD)
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: false, // preserve the ES build from build 1
    lib: {
      entry: resolve(__dirname, 'src/index.js'),
      name: 'XenonJS',
      formats: ['iife', 'umd'],
      fileName: (format) => `index.${format}.js`,
    },
    target: 'es2020',
    minify: false,
  },
});
