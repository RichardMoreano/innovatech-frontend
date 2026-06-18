import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setupTests.ts'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'html'],
      all: true,
      include: ['src/services/**/*.ts', 'src/components/**/*', 'src/axios.ts'],
      exclude: ['src/**/*.d.ts', 'src/test-utils/**/*'],
      thresholds: {
        statements: 85,
        branches: 80,
        functions: 85,
        lines: 85,
      }
    },
  },
});