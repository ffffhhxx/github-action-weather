/** 天气现象 -> emoji 图标映射 */
const WEATHER_ICONS = {
  晴: '☀️',
  晴间多云: '⛅',
  局部多云: '⛅',
  多云: '⛅',
  阴: '☁️',
  小雨: '🌦️',
  阵雨: '🌦️',
  小到中雨: '🌦️',
  中雨: '🌧️',
  大雨: '🌧️',
  中到大雨: '🌧️',
  暴雨: '🌧️',
  大雨到暴雨: '🌧️',
  雷阵雨: '⛈️',
  雷阵雨伴有冰雹: '⛈️',
  雨夹雪: '🌨️',
  小雪: '🌨️',
  小到中雪: '🌨️',
  中雪: '❄️',
  大雪: '❄️',
  暴雪: '❄️',
  雪: '❄️',
  雾: '🌫️',
  霾: '🌫️',
  浮尘: '🌪️',
  扬沙: '🌪️',
  沙尘暴: '🌪️',
  强沙尘暴: '🌪️',
}

/** 取天气现象对应的 emoji，未知天气返回默认图标 */
export function weatherIcon(weather) {
  return WEATHER_ICONS[weather] || '🌡️'
}

/** 星期数字（1-7，1=周一）转中文 */
const WEEK_CN = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

export function weekLabel(week) {
  const n = Number(week)
  if (Number.isInteger(n) && n >= 1 && n <= 7) {
    return WEEK_CN[n - 1]
  }
  return ''
}
