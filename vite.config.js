import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: { port: 5173, strictPort: true },
  preview: { port: 4173, strictPort: true },
  build: {
    rollupOptions: {
      output: { manualChunks: id => id.includes('/node_modules/phaser/') ? 'phaser' : undefined }
    }
  }
});
