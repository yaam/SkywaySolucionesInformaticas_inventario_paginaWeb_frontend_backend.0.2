import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // REACT_APP_ se mantiene para no cambiar las variables ya configuradas en Vercel/Docker.
  envPrefix: ['VITE_', 'REACT_APP_'],
  server: { host: true, port: 3000 },
  preview: { port: 3000 },
  build: { outDir: 'build' },
});
