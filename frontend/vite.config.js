import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const target = process.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1'
  return {
    plugins: [react()],
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) return

            const modulePath = id.split('node_modules/')[1]
            const pathParts = modulePath.split('/')

            const packageName = pathParts[0].startsWith('@')
              ? `${pathParts[0]}-${pathParts[1]}`
              : pathParts[0]

            const normalizedPackageName = packageName.replace('@', '')

            if (normalizedPackageName === 'antd' && pathParts[2]) {
              return `vendor-antd-${pathParts[2]}`
            }

            return `vendor-${normalizedPackageName}`
          },
        },
      },
    },
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
  }
})
