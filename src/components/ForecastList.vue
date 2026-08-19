<script setup>
import { computed } from 'vue'
import { weatherIcon, weekLabel } from '../utils/weather'

const props = defineProps({
  /** 未来几天预报（高德 forecasts[0].casts） */
  forecasts: { type: Array, default: () => [] },
})

/** 首条标记为“今天”，其余显示星期 */
const marked = computed(() =>
  props.forecasts.map((cast, index) => ({
    ...cast,
    isToday: index === 0,
    weekText: index === 0 ? '今天' : weekLabel(cast.week),
  })),
)
</script>

<template>
  <section class="forecast">
    <h3 class="title">未来几天</h3>

    <p v-if="forecasts.length === 0" class="empty">暂无预报数据</p>

    <ul v-else class="forecast-list">
      <li v-for="day in marked" :key="day.date" class="forecast-item">
        <div class="day">
          <span class="week">{{ day.weekText }}</span>
          <span class="date">{{ day.date.slice(5) }}</span>
        </div>

        <div class="weather" :title="`白天：${day.dayweather}；夜间：${day.nightweather}`">
          <span class="icon">{{ weatherIcon(day.dayweather) }}</span>
          <span class="text">{{ day.dayweather }}</span>
        </div>

        <div class="wind">
          <span class="wind-text">{{ day.daywind }}风</span>
          <span class="wind-power">{{ day.daypower }}</span>
        </div>

        <div class="temp">
          <span class="day-temp">{{ day.daytemp }}°</span>
          <span class="night-temp">{{ day.nighttemp }}°</span>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.forecast {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: 20px;
  padding: 20px 20px 8px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(10px);
}

.title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
}

.empty {
  color: var(--text-dim);
  font-size: 14px;
  text-align: center;
  padding: 16px 0 20px;
}

.forecast-list {
  list-style: none;
}

.forecast-item {
  display: grid;
  grid-template-columns: 64px 1fr 1fr auto;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.forecast-item:first-child {
  border-top: none;
}

.day {
  display: flex;
  flex-direction: column;
}

.week {
  font-weight: 600;
}

.date {
  font-size: 12px;
  color: var(--text-dim);
}

.weather {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.weather .icon {
  font-size: 22px;
}

.wind {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: var(--text-dim);
}

.wind-power {
  font-size: 12px;
}

.temp {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  white-space: nowrap;
}

.day-temp {
  font-weight: 700;
}

.night-temp {
  color: var(--text-dim);
}

@media (max-width: 520px) {
  .forecast-item {
    grid-template-columns: 56px 1fr 1fr auto;
    gap: 8px;
  }
  .wind {
    display: none;
  }
}
</style>
