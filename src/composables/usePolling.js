import { getCurrentInstance, onUnmounted } from 'vue'

export function usePolling(callback, getInterval) {
  let timerId = null

  function restart() {
    if (timerId) clearInterval(timerId)
    callback()
    timerId = setInterval(callback, getInterval())
  }

  function stop() {
    if (timerId) { clearInterval(timerId); timerId = null }
  }

  if (getCurrentInstance()) onUnmounted(stop)
  return { restart, stop }
}
