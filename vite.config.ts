/// <reference types="vitest/config" />

import { defineConfig } from 'vite';

export default defineConfig({
  base: '/alchemists-cauldron/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
