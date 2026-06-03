<template>
  <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
    <div v-for="stat in stats" :key="stat.label"
      class="bg-surface-2 border border-border rounded-lg p-3 text-center">
      <p class="text-text-disabled text-[9px] uppercase tracking-widest mb-1.5">{{ stat.label }}</p>
      <p :class="['font-bold text-sm', stat.color]">{{ stat.value }}</p>
      <p v-if="stat.sub" class="text-text-muted text-[10px] mt-0.5">{{ stat.sub }}</p>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useMatchesStore } from '../../stores/matches'
import { useScorersStore } from '../../stores/scorers'
const m = useMatchesStore(); const sc = useScorersStore()
const stats = computed(() => {
  const fin = m.allMatches.filter(x => x.status === 'FINISHED')
  const goals = fin.reduce((s, x) => s + (x.score?.fullTime?.home ?? 0) + (x.score?.fullTime?.away ?? 0), 0)
  const top = sc.scorers[0]
  return [
    { label: 'Goleador', value: top ? top.player.name.split(' ').at(-1) : '—', sub: top ? `${top.goals} goles` : '', color: 'text-ochre' },
    { label: 'Partidos', value: fin.length, sub: `de ${m.allMatches.length}`, color: 'text-text' },
    { label: 'Goles', value: goals, sub: fin.length ? `prom ${(goals/fin.length).toFixed(1)}` : '', color: 'text-text' },
    { label: 'En vivo', value: m.liveMatches.length || '—', sub: 'ahora', color: 'text-red-light' },
  ]
})
</script>
