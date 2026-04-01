import { defineConfig } from 'vite';
import { resolve } from 'node:path';

// Build 1 of 2: ES modules — multiple entry points (index, bus, all)
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.js'),
        bus: resolve(__dirname, 'src/bus.js'),
        all: resolve(__dirname, 'src/all.js'),
      },
      formats: ['es'],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        chunkFileNames: 'chunks/[name].js',
        manualChunks: undefined,
      },
    },
    target: 'es2020',
    minify: false,
  },
});