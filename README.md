# ⛅ 天气助手（github-action-weather）

基于 Vite + Vue 3 的天气展示页面，调用**高德地图开放平台**的天气查询 Web 服务 API，展示实时天气与未来几天预报。

## 功能

- 实时天气：城市、气温、天气现象、风向风力、湿度、数据更新时间
- 未来几天预报（`extensions=all`，默认返回 4 天）
- **省市下拉联动选择**：选择省份后自动列出该省地级市（数据写死在 [src/data/regions.js](src/data/regions.js)，来源 `AMap_adcode_citycode.xlsx`，默认河北省秦皇岛市）
- 通过 URL 参数 `?city=adcode` 直接指定城市（如 `?city=110000` 为北京）
- 加载 / 错误状态与刷新功能
- **密钥安全**：高德 Key 保存在 Cloudflare Workers 环境变量中，由 Worker 代理转发请求，前端代码不包含任何密钥
- 响应式布局，`base: '/github-action-weather/'` 与 GitHub Pages 项目页地址一致

## 本地运行

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（默认 http://localhost:5173）
npm run dev
```

浏览器打开终端提示的地址即可，例如 <http://localhost:5173>。

切换城市：页面顶部的省 / 市下拉框选择即可；也支持 URL 参数：<http://localhost:5173/?city=110000>（北京）。

## 生产构建

```bash
npm run build   # 产物输出到 dist/
npm run preview # 本地预览构建产物
```

`dist/` 目录即为可发布的静态站点。

## 接口说明

前端通过 **Cloudflare Workers 代理** 获取天气，再由代理转发到高德：

| 项 | 值 |
| --- | --- |
| 前端请求 | `GET https://frosty-rain-6353.858252352.workers.dev` |
| 前端参数 | `city`（城市 adcode）、`extensions`（`base` 实况 / `all` 实况+预报）、`token`（访问口令） |
| 代理转发 | `GET https://restapi.amap.com/v3/weather/weatherInfo` |
| 密钥位置 | 高德 Key 存于 Worker 环境变量 `AMAP_KEY`，前端不接触 |

相关代码在 [src/api/weather.js](src/api/weather.js)，城市可在 URL 中通过 `?city=` 指定。

## 发布到 GitHub Pages（可选）

1. 在 GitHub 新建仓库并推送本目录代码。
2. 仓库 `Settings → Pages → Build and deployment`，Source 选择 `GitHub Actions`。
3. 提交时触发构建部署；也可选用 `workflow_dispatch` 手动触发。

> 本项目使用绝对路径 `base: '/github-action-weather/'`，对应 GitHub Pages 项目页（`https://<用户名>.github.io/github-action-weather/`）。如需部署到别的子路径，改 [vite.config.js](vite.config.js) 里的 `base` 即可。

## 安全提示

高德 Key 现保存在 Cloudflare Workers 的环境变量 `AMAP_KEY` 中，前端代码不再包含密钥。Worker 还会校验访问口令 `token`（与前端 [src/api/weather.js](src/api/weather.js) 中的 `ACCESS_TOKEN` 一致），防止陌生人直接调用代理消耗额度；注意口令写在公开页面源码中，只是提高门槛，并非真正安全。

> ⚠️ 早期版本曾把 Key 明文写在前端并提交到公开仓库，该旧 Key 已暴露且仍在 git 历史中。**建议去高德控制台重新生成一把新 Key**，并把新 Key 更新到 Worker 的 `AMAP_KEY` 环境变量，使旧 Key 作废。

## 目录结构

```
.
├── index.html
├── vite.config.js
├── package.json
└── src/
    ├── main.js          # 应用入口
    ├── style.css        # 全局样式
    ├── App.vue          # 页面主逻辑（省市选择、数据请求、状态管理）
    ├── api/
    │   └── weather.js   # 高德天气 API 封装
    ├── data/
    │   └── regions.js   # 省市行政区划数据（写死，来源 AMap_adcode_citycode.xlsx）
    ├── utils/
    │   └── weather.js   # 天气图标 / 星期 映射工具
    └── components/
        ├── WeatherCard.vue    # 当前天气卡片
        └── ForecastList.vue   # 未来几天预报列表
```
