import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [vue()],
    test: { environment: 'jsdom', globals: true },
    server: {
      proxy: {
        '/api': {
          target: 'https://api.football-data.org/v4',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          headers: { 'X-Auth-Token': env.VITE_API_KEY ?? '' },
        },
      },
    },
  }
})
