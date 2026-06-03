<template>
  <div class="p-4 md:p-6 space-y-8 max-w-2xl">
    <h1 class="text-text font-bold text-xl">Estadísticas</h1>
    <LoadingSpinner v-if="loading" />
    <ErrorMessage v-else-if="error" :message="error" @retry="load" />
    <template v-else>
      <ScorersList :scorers="sc.scorers" />
      <GoalkeeperStats :standings="st.groups" />
    </template>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useScorersStore } from '../stores/scorers'
import { useStandingsStore } from '../stores/standings'
import ScorersList from '../components/stats/ScorersList.vue'
import GoalkeeperStats from '../components/stats/GoalkeeperStats.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import ErrorMessage from '../components/shared/ErrorMessage.vue'
const sc = useScorersStore(); const st = useStandingsStore()
const loading = computed(() => sc.isLoading || st.isLoading)
const error = computed(() => sc.error || st.error)
async function load() {
  await Promise.all([
    sc.scorers.length ? null : sc.fetchScorers(),
    st.groups.length ? null : st.fetchStandings(),
  ])
}
onMounted(load)
</script>
