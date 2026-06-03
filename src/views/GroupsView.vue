<template>
  <div class="p-4 md:p-6">
    <h1 class="text-text font-bold text-xl mb-6">Fase de Grupos</h1>
    <LoadingSpinner v-if="standings.isLoading && !standings.groups.length" />
    <ErrorMessage v-else-if="standings.error" :message="standings.error" @retry="load" />
    <div v-else class="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      <GroupCard v-for="g in standings.groups" :key="g.group" :group="g"
        :matches="matches.matchesByGroup[g.group] ?? []" />
    </div>
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useMatchesStore } from '../stores/matches'
import { useStandingsStore } from '../stores/standings'
import GroupCard from '../components/groups/GroupCard.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import ErrorMessage from '../components/shared/ErrorMessage.vue'
const matches = useMatchesStore(); const standings = useStandingsStore()
async function load() {
  await Promise.all([
    matches.allMatches.length ? null : matches.fetchMatches(),
    standings.groups.length ? null : standings.fetchStandings(),
  ])
}
onMounted(load)
</script>
