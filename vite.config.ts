import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/main.ts',
      formats: ['es'],
      name: 'TampermonkeyScript',
      fileName: () => `script.user.js`,
    },
    rollupOptions: {
      output: {
        format: 'iife',
        extend: true,
        entryFileNames: `script.user.js`,
      },
    },
  },
});