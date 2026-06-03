import { defineStore } from 'pinia'
import { getScorers } from '../api/footballData'

export const useScorersStore = defineStore('scorers', {
  state: () => ({ scorers: [], isLoading: false, error: null }),
  actions: {
    async fetchScorers() {
      this.isLoading = true; this.error = null
      try { const d = await getScorers(); this.scorers = d.scorers }
      catch (e) { this.error = e.message }
      finally { this.isLoading = false }
    },
  },
})
