import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// base: './' 使用相对路径，构建产物可以发布到任意静态站点
// （GitHub Pages 项目页 / Netlify / Vercel / 任意子路径）而无需修改代码。
export default defineConfig({
  plugins: [vue()],
  base: '/github-action-weather/',
})
