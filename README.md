# ⛅ 天气助手（github-action-weather）

基于 Vite + Vue 3 的天气展示页面，调用**高德地图开放平台**的天气查询 Web 服务 API，展示实时天气与未来几天预报。

## 功能

- 实时天气：城市、气温、天气现象、风向风力、湿度、数据更新时间
- 未来几天预报（`extensions=all`，默认返回 4 天）
- **省市下拉联动选择**：选择省份后自动列出该省地级市（数据写死在 [src/data/regions.js](src/data/regions.js)，来源 `AMap_adcode_citycode.xlsx`，默认河北省秦皇岛市）
- 通过 URL 参数 `?city=adcode` 直接指定城市（如 `?city=110000` 为北京）
- 加载 / 错误状态与刷新功能
- 响应式布局，`base: './'` 相对路径构建，可发布到任意静态托管

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

| 项 | 值 |
| --- | --- |
| 接口 | `GET https://restapi.amap.com/v3/weather/weatherInfo` |
| 参数 | `city`（城市 adcode）、`key`（高德 Key）、`extensions`（`base` 实况 / `all` 实况+预报） |

相关代码在 [src/api/weather.js](src/api/weather.js)，城市可在 URL 中通过 `?city=` 指定。

## 发布到 GitHub Pages（可选）

1. 在 GitHub 新建仓库并推送本目录代码。
2. 仓库 `Settings → Pages → Build and deployment`，Source 选择 `GitHub Actions`。
3. 提交时触发构建部署；也可选用 `workflow_dispatch` 手动触发。

> 本项目使用相对路径 `base: './'`，仓库部署在项目子路径（`https://<用户名>.github.io/<仓库名>/`）下无需修改配置。

## 安全提示

当前高德 Key 直接写在前端代码中（[src/api/weather.js](src/api/weather.js)），会暴露给访问者。个人项目 / 展示用途可接受；如 Key 有调用配额限制或需要更高安全性，建议改为通过服务端代理转发请求，将 Key 保存在服务端环境变量中。

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
