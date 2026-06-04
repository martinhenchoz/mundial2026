import { defineStore } from 'pinia'
import { getMatches } from '../api/footballData'

const ARG = 'America/Argentina/Buenos_Aires'
const toArgDate = (d) => new Intl.DateTimeFormat('en-CA', { timeZone: ARG }).format(d)

export const useMatchesStore = defineStore('matches', {
  state: () => ({ allMatches: [], lastFetched: null, isLoading: false, error: null }),

  getters: {
    liveMatches: (s) => s.allMatches.filter(m => ['IN_PLAY','PAUSED'].includes(m.status)),

    upcomingMatches: (s) => s.allMatches
      .filter(m => m.status === 'SCHEDULED' && new Date(m.utcDate) > new Date())
      .sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate)).slice(0, 6),

    matchesByGroup: (s) => {
      const g = {}
      s.allMatches.filter(m => m.stage === 'GROUP_STAGE')
        .forEach(m => { (g[m.group] ??= []).push(m) })
      return g
    },

    matchesByRound: (s) => {
      const r = {}
      s.allMatches.filter(m => m.stage !== 'GROUP_STAGE')
        .forEach(m => { (r[m.stage] ??= []).push(m) })
      return r
    },

    matchesByDate: (s) => {
      const d = {}
      s.allMatches.forEach(m => {
        const key = new Intl.DateTimeFormat('es-AR', {
          timeZone: ARG, weekday: 'long', day: 'numeric', month: 'long',
        }).format(new Date(m.utcDate))
        ;(d[key] ??= []).push(m)
      })
      return d
    },

    pollingInterval: (s) => {
      if (s.allMatches.some(m => ['IN_PLAY','PAUSED'].includes(m.status))) return 60_000
      const today = toArgDate(new Date())
      const hasToday = s.allMatches.some(m =>
        m.status === 'SCHEDULED' && toArgDate(new Date(m.utcDate)) === today)
      return hasToday ? 5 * 60_000 : 30 * 60_000
    },

    firstMatch: (s) => s.allMatches.length
      ? [...s.allMatches].sort((a, b) => new Date(a.utcDate) - new Date(b.utcDate))[0]
      : null,
  },

  actions: {
    async fetchMatches() {
      this.isLoading = true; this.error = null
      try { const d = await getMatches(); this.allMatches = d.matches; this.lastFetched = Date.now() }
      catch (e) { this.error = e.message }
      finally { this.isLoading = false }
    },
  },
})
