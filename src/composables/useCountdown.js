import { ref, onMounted, onUnmounted } from 'vue'

export function useCountdown(targetDate) {
  const days = ref(0)
  const hours = ref(0)
  const minutes = ref(0)
  const seconds = ref(0)
  const done = ref(false)

  function tick() {
    const diff = new Date(targetDate) - new Date()
    if (diff <= 0) {
      done.value = true
      days.value = hours.value = minutes.value = seconds.value = 0
      return
    }
    days.value    = Math.floor(diff / 86_400_000)
    hours.value   = Math.floor((diff % 86_400_000) / 3_600_000)
    minutes.value = Math.floor((diff % 3_600_000) / 60_000)
    seconds.value = Math.floor((diff % 60_000) / 1_000)
  }

  let timer
  onMounted(() => { tick(); timer = setInterval(tick, 1000) })
  onUnmounted(() => clearInterval(timer))

  return { days, hours, minutes, seconds, done }
}
