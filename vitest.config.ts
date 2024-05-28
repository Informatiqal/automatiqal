/// <reference types="vitest" />

// Configure Vitest (https://vitest.dev/config)

import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    testTimeout: 30000,
    include: ['test/**/*.{test,spec}.ts'],
    exclude: [],
  },
})