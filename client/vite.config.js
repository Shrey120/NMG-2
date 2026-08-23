import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Sends any request starting with /api to the Express server,
    // so the browser only ever talks to one address.
    proxy: { '/api': 'http://localhost:4100' },
  },
});
