import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const target = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // Proxy API calls to backend during development
        '/api': {
          target: target.replace(/\/$/, ''),
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '/api'),
        },
      },
    },
    define: {
      'process.env': process.env,
    },
  }
})
