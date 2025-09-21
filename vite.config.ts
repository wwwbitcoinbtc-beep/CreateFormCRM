import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert'; // Import the mkcert plugin

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      // Add the mkcert plugin and enable HTTPS
      plugins: [react(), mkcert()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        https: true, // Enable HTTPS
        port: 9002, // Explicitly define the port
        proxy: {
          // Proxy API requests to the backend server
          '/api/': {
            target: 'http://localhost:3001',
            changeOrigin: true,
            secure: false, // Allow proxying to self-signed HTTP backend
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
          // Proxy WebSocket connections
          '/socket.io': {
            target: 'ws://localhost:3001',
            ws: true,
          },
        }
      }
    };
});
