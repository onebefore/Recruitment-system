import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'; // 引入path模块

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  build: {
    target: 'esnext',
    outDir: 'dist',
    assetsDir: 'assets',
    publicDir: 'public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './public/index.html') // 确保路径正确
      }
    }
  },
  server: {
    host: '127.0.0.1',
    port: 5174, // 修改为你想使用的端口
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/uploads': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/uploads/, '') // Uncomment if your backend doesn't expect /uploads in the path
      }
    },
    // 新增配置：确保根路径正确指向 index.html
    appType: 'spa',
  }
});