import { defineStore } from 'pinia'
import { getStandings } from '../api/footballData'

export const useStandingsStore = defineStore('standings', {
  state: () => ({ groups: [], isLoading: false, error: null }),
  actions: {
    async fetchStandings() {
      this.isLoading = true; this.error = null
      try {
        const d = await getStandings()
        this.groups = d.standings.filter(s => s.type === 'TOTAL')
          .sort((a, b) => a.group.localeCompare(b.group))
      } catch (e) { this.error = e.message }
      finally { this.isLoading = false }
    },
  },
})
