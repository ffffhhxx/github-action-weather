// 高德地图开放平台 - 天气查询 Web 服务 API
// 文档: https://lbs.amap.com/api/webservice/guide/api/weatherinfo
const AMAP_WEATHER_API = 'https://restapi.amap.com/v3/weather/weatherInfo'
const AMAP_KEY = 'd4ac4aa5a867ce45dae5402ada30307b'

/** 默认城市（秦皇岛市）adcode */
export const DEFAULT_CITY = '130300'

/**
 * 请求单次天气数据
 * @param {string} city 城市 adcode（如 110000=北京）
 * @param {'base'|'all'} extensions 返回内容：base=仅实时天气(lives)，all=仅预报(forecasts)
 */
async function requestWeather(city, extensions) {
  const params = new URLSearchParams({ city, key: AMAP_KEY, extensions })
  const response = await fetch(`${AMAP_WEATHER_API}?${params}`)

  if (!response.ok) {
    throw new Error(`请求失败：HTTP ${response.status}`)
  }

  const data = await response.json()
  if (data.status !== '1') {
    throw new Error(data.info || '高德接口返回异常')
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
