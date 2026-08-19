<script setup>
import { computed } from 'vue'
import { weatherIcon } from '../utils/weather'

const props = defineProps({
  /** 实时天气数据（高德 lives[0]） */
  life: { type: Object, required: true },
})

const icon = computed(() => weatherIcon(props.life.weather))
</script>

<template>
  <section class="weather-card">
    <header class="location">
      <h2 class="city">{{ life.city }}</h2>
      <span class="province">{{ life.province }}</span>
    </header>

    <div class="main">
      <div class="icon" :aria-hidden="true">{{ icon }}</div>
      <div class="temp">
        {{ life.temperature }}<span class="unit">°C</span>
      </div>
      <div class="weather">{{ life.weather }}</div>
    </div>

    <div class="details">
      <div class="detail">
        <span class="label">风向</span>
        <span class="value">{{ life.winddirection }}风 {{ life.windpower }}</span>
      </div>
      <div class="detail">
        <span class="label">湿度</span>
        <span class="value">{{ life.humidity }}%</span>
      </div>
    </div>

    <footer class="report-time">数据更新于 {{ life.reporttime }}</footer>
  </section>
</template>

<style scoped>
.weather-card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 24px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.location {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.city {
  font-size: 22px;
  font-weight: 700;
}

.province {
  font-size: 13px;
  color: var(--text-dim);
}

.main {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 20px 0 16px;
  gap: 4px;
}

.icon {
  font-size: 64px;
  line-height: 1;
}

.temp {
  font-size: 56px;
  font-weight: 700;
  line-height: 1.1;
}

.temp .unit {
  font-size: 22px;
  font-weight: 500;
  color: var(--text-dim);
}

.weather {
  font-size: 16px;
  color: var(--text-dim);
}

.details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 12px;
}

.label {
  font-size: 12px;
  color: var(--text-dim);
}

.value {
  font-size: 15px;
  font-weight: 600;
}

.report-time {
  margin-top: 16px;
  text-align: center;
  font-size: 12px;
  color: var(--text-dim);
}
</style>
