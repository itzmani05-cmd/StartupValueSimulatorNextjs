import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    strictPort: false,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  },
  esbuild: {
    // Disable type checking during development to avoid plugin-react issues
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  }
});
