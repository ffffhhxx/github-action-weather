// 天气查询代理：部署在 Cloudflare Workers，转发高德天气 Web 服务 API
// 高德 Key 保存在 Worker 环境变量 AMAP_KEY 中，前端代码不包含任何密钥
const WEATHER_PROXY_API = 'https://frosty-rain-6353.858252352.workers.dev'

// 访问口令：Worker 会校验该参数，防止陌生人直接调用代理。
// 注意：口令写在公开页面源码里，只能提高调用门槛，不是真正的安全。
// 修改时需与 Worker 代码里的 ACCESS_TOKEN 保持一致。
const ACCESS_TOKEN = '18433644348245afebc76371'

/** 默认城市（秦皇岛市）adcode */
export const DEFAULT_CITY = '130300'

/**
 * 请求单次天气数据
 * @param {string} city 城市 adcode（如 110000=北京）
 * @param {'base'|'all'} extensions 返回内容：base=仅实时天气(lives)，all=仅预报(forecasts)
 */
async function requestWeather(city, extensions) {
  const params = new URLSearchParams({ city, extensions, token: ACCESS_TOKEN })
  const response = await fetch(`${WEATHER_PROXY_API}?${params}`)

  if (!response.ok) {
    throw new Error(`请求失败：HTTP ${response.status}`)
  }

  const data = await response.json()
  if (data.status !== '1') {
    throw new Error(data.info || '天气接口返回异常')
  }

  return data
}

/**
 * 获取「实时天气 + 未来预报」的完整数据。
 *
 * 注意：高德接口在 extensions=base 时只返回 lives（实况），
 * 在 extensions=all 时只返回 forecasts（预报），因此需要并行请求两次后合并。
 *
 * @param {string} city 城市 adcode
 * @returns {Promise<{lives: Array, forecasts: Array}>}
 */
export async function fetchWeather(city = DEFAULT_CITY) {
  const [base, all] = await Promise.all([
    requestWeather(city, 'base'),
    requestWeather(city, 'all'),
  ])

  return {
    lives: base.lives || [],
    forecasts: all.forecasts || [],
  }
}
