<script setup>
import { computed, onMounted, ref } from 'vue'
import { fetchWeather, DEFAULT_CITY } from './api/weather'
import WeatherCard from './components/WeatherCard.vue'
import ForecastList from './components/ForecastList.vue'

// 支持通过 URL 参数 ?city=adcode 指定城市（如 ?city=110000 为北京），默认秦皇岛
const routeCity = new URLSearchParams(window.location.search).get('city')
const city = ref(routeCity || DEFAULT_CITY)

const loading = ref(true)
const error = ref('')
const weather = ref(null)

async function loadWeather() {
  loading.value = true
  error.value = ''
  try {
    const data = await fetchWeather(city.value)
    if (!data.lives.length) {
      throw new Error(`未获取到城市「${city.value}」的实况天气，请检查 adcode 是否正确`)
    }
    weather.value = data
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

const life = computed(() => weather.value?.lives?.[0] || null)
const forecast = computed(() => weather.value?.forecasts?.[0]?.casts || [])

onMounted(loadWeather)
</script>

<template>
  <div class="app">
    <header class="header">
      <h1 class="title">⛅ 天气助手</h1>
      <p class="subtitle">数据来源：高德地图开放平台 · 天气服务</p>
    </header>

    <main class="content">
      <!-- 加载中 -->
      <div v-if="loading" class="status">
        <div class="spinner" aria-hidden="true"></div>
        <p>正在获取天气数据…</p>
      </div>

      <!-- 请求失败 -->
      <div v-else-if="error" class="status status-error">
        <p class="error-text">😢 {{ error }}</p>
        <p class="hint">请检查网络后重试</p>
        <button class="btn" @click="loadWeather">重新加载</button>
      </div>

      <!-- 正常展示 -->
      <template v-else>
        <div class="toolbar">
          <span class="city-badge">📍 {{ life.city }}</span>
          <button class="btn" @click="loadWeather" :disabled="loading">刷新</button>
        </div>

        <WeatherCard :life="life" />
        <ForecastList :forecasts="forecast" />
      </template>
    </main>

    <footer class="footer">
      <p>支持 URL 参数切换城市：<code>?city=adcode</code>，例如 <code>?city=110000</code>（北京）</p>
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

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.city-badge {
  font-size: 14px;
  font-weight: 600;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid var(--card-border);
  padding: 6px 12px;
  border-radius: 999px;
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
