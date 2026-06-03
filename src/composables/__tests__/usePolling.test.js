import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { usePolling } from '../usePolling'

describe('usePolling', () => {
  beforeEach(() => vi.useFakeTimers())
  afterEach(() => vi.useRealTimers())

  it('llama al callback inmediatamente en restart', () => {
    const cb = vi.fn()
    const { restart, stop } = usePolling(cb, () => 1000)
    restart(); expect(cb).toHaveBeenCalledTimes(1); stop()
  })

  it('llama al callback de nuevo después del intervalo', () => {
    const cb = vi.fn()
    const { restart, stop } = usePolling(cb, () => 1000)
    restart(); vi.advanceTimersByTime(2500)
    expect(cb).toHaveBeenCalledTimes(3); stop()
  })

  it('stop cancela futuras llamadas', () => {
    const cb = vi.fn()
    const { restart, stop } = usePolling(cb, () => 1000)
    restart(); stop(); vi.advanceTimersByTime(3000)
    expect(cb).toHaveBeenCalledTimes(1)
  })
})
