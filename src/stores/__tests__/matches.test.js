import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useMatchesStore } from '../matches'

const m = (o) => ({
  id: 1, status: 'SCHEDULED', stage: 'GROUP_STAGE', group: 'GROUP_A',
  utcDate: '2026-06-11T21:00:00Z',
  homeTeam: { id: 1, tla: 'ARG' }, awayTeam: { id: 2, tla: 'MEX' },
  score: { fullTime: { home: null, away: null } }, ...o,
})

describe('useMatchesStore', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('liveMatches retorna solo IN_PLAY y PAUSED', () => {
    const store = useMatchesStore()
    store.allMatches = [m({ id: 1, status: 'IN_PLAY' }), m({ id: 2 }), m({ id: 3, status: 'PAUSED', group: 'GROUP_B' })]
    expect(store.liveMatches.map(x => x.id)).toEqual([1, 3])
  })

  it('matchesByGroup agrupa por grupo correctamente', () => {
    const store = useMatchesStore()
    store.allMatches = [m({ id: 1, group: 'GROUP_A' }), m({ id: 2, group: 'GROUP_A' }), m({ id: 3, group: 'GROUP_B' })]
    expect(store.matchesByGroup['GROUP_A']).toHaveLength(2)
    expect(store.matchesByGroup['GROUP_B']).toHaveLength(1)
  })

  it('matchesByRound excluye GROUP_STAGE', () => {
    const store = useMatchesStore()
    store.allMatches = [m({ id: 1 }), m({ id: 2, stage: 'ROUND_OF_32', group: null })]
    expect(store.matchesByRound['GROUP_STAGE']).toBeUndefined()
    expect(store.matchesByRound['ROUND_OF_32']).toHaveLength(1)
  })

  it('pollingInterval es 60000 cuando hay partido en vivo', () => {
    const store = useMatchesStore()
    store.allMatches = [m({ status: 'IN_PLAY' })]
    expect(store.pollingInterval).toBe(60_000)
  })

  it('pollingInterval es 1800000 cuando no hay partidos hoy', () => {
    const store = useMatchesStore()
    store.allMatches = [m({ utcDate: '2025-01-01T21:00:00Z' })]
    expect(store.pollingInterval).toBe(30 * 60_000)
  })
})
