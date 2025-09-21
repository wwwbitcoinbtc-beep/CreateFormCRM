import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';
import type { ConfigEnv } from 'vite';
import * as path from 'path';

export default defineConfig((configEnv) => {
  const mode = configEnv.mode;
  const command = configEnv.command;
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), mkcert()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      }
    },
    server: {
      https: true,
      port: 9002,
      proxy: {
        '/api/': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
        '/socket.io': {
          target: 'ws://localhost:3001',
          ws: true,
        }
      }
    }
  }
});
