import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { useCountdown } from '../useCountdown'

function withSetup(composable) {
  let result
  const wrapper = mount(defineComponent({
    setup() { result = composable(); return () => null },
    template: '<div />',
  }))
  return [result, wrapper]
}

describe('useCountdown', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('calcula días, horas, minutos y segundos correctamente', () => {
    const now = Date.now()
    vi.setSystemTime(now)
    const target = new Date(now + 7 * 86_400_000 + 14 * 3_600_000 + 23 * 60_000 + 45_000)
    const [result, wrapper] = withSetup(() => useCountdown(target.toISOString()))
    expect(result.days.value).toBe(7)
    expect(result.hours.value).toBe(14)
    expect(result.minutes.value).toBe(23)
    expect(result.seconds.value).toBe(45)
    expect(result.done.value).toBe(false)
    wrapper.unmount()
  })

  it('done es true cuando la fecha objetivo ya pasó', () => {
    const now = Date.now()
    vi.setSystemTime(now)
    const past = new Date(now - 1000)
    const [result, wrapper] = withSetup(() => useCountdown(past.toISOString()))
    expect(result.done.value).toBe(true)
    wrapper.unmount()
  })

  it('decrementa segundos después de 1 segundo', () => {
    const now = Date.now()
    vi.setSystemTime(now)
    const target = new Date(now + 65_000) // 1 min 5 seg
    const [result, wrapper] = withSetup(() => useCountdown(target.toISOString()))
    expect(result.seconds.value).toBe(5)
    vi.advanceTimersByTime(1000)
    expect(result.seconds.value).toBe(4)
    wrapper.unmount()
  })
})
