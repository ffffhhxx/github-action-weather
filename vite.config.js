import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: '/github-action-weather/' 与 GitHub Pages 项目页地址保持一致
// （https://FFFFHHHXX.github.io/github-action-weather/），部署到别的子路径时改这里即可
export default defineConfig({
  plugins: [vue()],
  base: '/github-action-weather/',
})
