import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import handleRiverWaterQualityApi from './api/river-water-quality.js'

// 부산 하천 수질 API 미들웨어 플러그인 (로컬 개발 서버용)
function busanRiverApiPlugin(env) {
  const handler = async (req, res, next) => {
    const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)
    if (url.pathname === '/api/river-water-quality') {
      if (env.BUSAN_RIVER_API_KEY && !process.env.BUSAN_RIVER_API_KEY) {
        process.env.BUSAN_RIVER_API_KEY = env.BUSAN_RIVER_API_KEY
      }
      return handleRiverWaterQualityApi(req, res)
    }
    next()
  }

  return {
    name: 'busan-river-api-plugin',
    configureServer(server) {
      server.middlewares.use(handler)
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler)
    }
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), busanRiverApiPlugin(env)]
  }
})


