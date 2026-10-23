import { defineConfig } from 'vite';

// `base` must match the GitHub Pages path: https://<user>.github.io/alchemists-cauldron/
export default defineConfig({
  base: '/alchemists-cauldron/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});
