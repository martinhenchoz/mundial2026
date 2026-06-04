<template>
  <div class="p-4 md:p-6 space-y-6 max-w-4xl">
    <div class="flex items-start justify-between">
      <div>
        <h1 class="text-text font-bold text-xl">Dashboard</h1>
        <p class="text-text-muted text-xs mt-0.5">{{ todayStr }}</p>
      </div>
      <span v-if="store.liveMatches.length"
        class="bg-red/10 border border-red/40 text-red-light text-xs font-bold px-2 py-1 rounded">
        ● {{ store.liveMatches.length }} EN VIVO
      </span>
    </div>
    <LoadingSpinner v-if="store.isLoading && !store.allMatches.length" />
    <ErrorMessage v-else-if="store.error" :message="store.error" @retry="restart" />
    <template v-else>
      <CountdownCard v-if="showCountdown" :match="store.firstMatch" />
      <template v-else>
        <StatsGrid />
        <section v-if="store.liveMatches.length">
          <h2 class="text-text-muted text-[10px] font-semibold tracking-widest uppercase mb-3">En vivo</h2>
          <div class="grid md:grid-cols-2 gap-3">
            <LiveMatchCard v-for="m in store.liveMatches" :key="m.id" :match="m" />
          </div>
        </section>
        <section>
          <h2 class="text-text-muted text-[10px] font-semibold tracking-widest uppercase mb-3">Próximos</h2>
          <div v-if="store.upcomingMatches.length" class="space-y-2">
            <UpcomingMatch v-for="m in store.upcomingMatches" :key="m.id" :match="m" />
          </div>
          <p v-else class="text-text-disabled text-sm">No hay partidos próximos.</p>
        </section>
      </template>
    </template>
  </div>
</template>
<script setup>
import { computed, onMounted } from 'vue'
import { useMatchesStore } from '../stores/matches'
import { useScorersStore } from '../stores/scorers'
import { usePolling } from '../composables/usePolling'
import CountdownCard from '../components/dashboard/CountdownCard.vue'
import StatsGrid from '../components/dashboard/StatsGrid.vue'
import LiveMatchCard from '../components/dashboard/LiveMatchCard.vue'
import UpcomingMatch from '../components/dashboard/UpcomingMatch.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import ErrorMessage from '../components/shared/ErrorMessage.vue'

const store = useMatchesStore(); const sc = useScorersStore()

const todayStr = computed(() => new Intl.DateTimeFormat('es-AR', {
  timeZone: 'America/Argentina/Buenos_Aires', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
}).format(new Date()))

const showCountdown = computed(() => {
  const m = store.firstMatch
  return m?.status === 'SCHEDULED' && new Date(m.utcDate) > new Date()
})

const { restart } = usePolling(
  async () => { await store.fetchMatches(); await sc.fetchScorers() },
  () => store.pollingInterval
)
onMounted(restart)
</script>
