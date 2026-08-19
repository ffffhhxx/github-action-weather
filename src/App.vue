<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchWeather } from './api/weather'
import { REGIONS } from './data/regions'
import WeatherCard from './components/WeatherCard.vue'
import ForecastList from './components/ForecastList.vue'

// 省 / 市 选项（数据写死在 src/data/regions.js，来源 AMap_adcode_citycode.xlsx）
const provinceOptions = computed(() => REGIONS.map(([name]) => name))
const cityOptions = computed(() => {
  const prov = REGIONS.find(([name]) => name === selectedProvince.value)
  return prov ? prov[2] : []
})

// 当前选中省市
const selectedProvince = ref('')
const selectedCity = ref('')

// 当前选中市的 adcode（用于高德天气接口）
const cityAdcode = computed(() => {
  const city = cityOptions.value.find(([name]) => name === selectedCity.value)
  return city ? city[1] : ''
})

const loading = ref(true)
const error = ref('')
const weather = ref(null)

// 当前城市实况 / 未来几天预报（供模板使用）
const life = computed(() => weather.value?.lives?.[0] || null)
const forecast = computed(() => weather.value?.forecasts?.[0]?.casts || [])

async function loadWeather() {
  if (!cityAdcode.value) return
  loading.value = true
  error.value = ''
  try {
    const data = await fetchWeather(cityAdcode.value)
    // 部分区域（如港澳台）接口返回 lives 但无天气字段，同样视为无数据
    if (!data.lives.length || !data.lives[0].weather) {
      throw new Error(`暂未获取到「${selectedCity.value}」的实况天气，请换个城市试试`)
    }
    weather.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function onProvinceChange() {
  // 切换省份后，自动选中该省第一个市并加载天气
  selectedCity.value = cityOptions.value[0]?.[0] || ''
  loadWeather()
}

function onCityChange() {
  loadWeather()
}

function initSelection() {
  // 优先从 URL 参数 ?city=adcode 恢复（如 ?city=110000）
  const routeCity = new URLSearchParams(window.location.search).get('city')
  if (routeCity) {
    for (const [pname, , cities] of REGIONS) {
      for (const [cname, cadcode] of cities) {
        if (cadcode === routeCity) {
          selectedProvince.value = pname
          selectedCity.value = cname
          return
        }
      }
    }
  }
  // 默认河北省秦皇岛市
  selectedProvince.value = '河北省'
  selectedCity.value = '秦皇岛市'
}

onMounted(() => {
  initSelection()
  loadWeather()
})
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">⛅ 天气助手</h1>
      <p class="subtitle">数据来源：高德地图开放平台 · 天气服务</p>
    </header>

    <main class="content">
      <!-- 省市选择 -->
      <div class="selector">
        <select v-model="selectedProvince" class="select" @change="onProvinceChange" aria-label="选择省份">
          <option v-for="name in provinceOptions" :key="name" :value="name">{{ name }}</option>
        </select>

        <select v-model="selectedCity" class="select" @change="onCityChange" aria-label="选择城市">
          <option v-for="c in cityOptions" :key="c[1]" :value="c[0]">{{ c[0] }}</option>
        </select>

        <button class="btn" @click="loadWeather" :disabled="loading">刷新</button>
      </div>

      <!-- 加载中 -->
      <div v-if="loading" class="status">
        <div class="spinner" aria-hidden="true"></div>
        <p>正在获取 {{ selectedProvince }}·{{ selectedCity }} 的天气数据…</p>
      </div>

      <!-- 请求失败 -->
      <div v-else-if="error" class="status status-error">
        <p class="error-text">😢 {{ error }}</p>
        <p class="hint">请检查网络后重试</p>
        <button class="btn" @click="loadWeather">重新加载</button>
      </div>

      <!-- 正常展示 -->
      <template v-else>
        <WeatherCard :life="life" />
        <ForecastList :forecasts="forecast" />
      </template>
    </main>

    <footer class="footer">
      <p>数据来源：高德地图开放平台</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  max-width: 640px;
  margin: 0 auto;
  padding: 32px 16px 48px;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  text-align: center;
  margin-bottom: 24px;
}

.title {
  font-size: 26px;
  font-weight: 700;
}

.subtitle {
  margin-top: 6px;
  font-size: 13px;
  color: var(--text-dim);
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.selector {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.select {
  appearance: none;
  -webkit-appearance: none;
  flex: 1;
  min-width: 140px;
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  color: var(--text-main);
  font-size: 14px;
  padding: 9px 14px;
  border-radius: 999px;
  cursor: pointer;
  transition: border-color 0.2s ease;
  background-image: linear-gradient(45deg, transparent 50%, var(--text-dim) 50%),
    linear-gradient(135deg, var(--text-dim) 50%, transparent 50%);
  background-position: calc(100% - 18px) 50%, calc(100% - 13px) 50%;
  background-size: 5px 5px;
  background-repeat: no-repeat;
  padding-right: 34px;
}

.select:hover {
  border-color: var(--accent);
}

.select:focus-visible {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(56, 189, 248, 0.25);
}

.select option {
  background: #1e293b;
  color: #f8fafc;
}

.btn {
  appearance: none;
  border: 1px solid var(--card-border);
  background: rgba(255, 255, 255, 0.12);
  color: var(--text-main);
  font-size: 14px;
  padding: 8px 18px;
  border-radius: 999px;
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  white-space: nowrap;
}

.btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.btn:active:not(:disabled) {
  transform: scale(0.97);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.status {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 0;
  color: var(--text-dim);
  font-size: 15px;
  text-align: center;
}

.error-text {
  color: #fca5a5;
  font-weight: 600;
}

.hint {
  font-size: 13px;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.footer {
  margin-top: 32px;
  text-align: center;
  font-size: 12px;
  color: var(--text-dim);
}

.footer code {
  background: rgba(255, 255, 255, 0.1);
  padding: 1px 6px;
  border-radius: 6px;
}
</style>
