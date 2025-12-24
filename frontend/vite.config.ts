import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { vitePluginFtp } from './vite-plugin-ftp'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Автоматическая загрузка на FTP после билда
    vitePluginFtp('../secrets/ftp.json'),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('recharts')) return 'recharts'
          if (id.includes('react-router')) return 'router'
          if (id.includes('react-dom') || id.includes('react')) return 'react'
          if (id.includes('@tanstack')) return 'tanstack'
          if (id.includes('date-fns')) return 'date-fns'
          if (id.includes('react-hook-form') || id.includes('@hookform')) return 'forms'
          if (id.includes('zod')) return 'zod'
          return 'vendor'
        },
      },
    },
  },
})

