import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    plugins: [react()],
    define: {
      'process.env': process.env
    },
    server: {
      host: true,
      port: parseInt(env.VITE_PORT)
    },
    base: './'
  };
});
