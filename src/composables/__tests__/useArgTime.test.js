import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useArgTime } from '../useArgTime'

describe('useArgTime', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-06-11T20:00:00Z')) // 17:00 ARG (UTC-3)
  })
  afterEach(() => vi.useRealTimers())

  const { formatMatchTime, formatTime } = useArgTime()

  it('formatea partido del mismo día como "Hoy · HH:MM"', () => {
    expect(formatMatchTime('2026-06-11T21:00:00Z')).toBe('Hoy · 18:00')
  })

  it('formatea partido de otro día con fecha incluida', () => {
    const result = formatMatchTime('2026-06-12T21:00:00Z')
    expect(result).not.toContain('Hoy')
    expect(result).toContain('18:00')
  })

  it('formatTime convierte UTC a hora ARG (UTC-3)', () => {
    expect(formatTime('2026-06-11T00:00:00Z')).toBe('21:00')
  })
})
