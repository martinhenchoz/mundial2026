<template>
  <section>
    <h2 class="text-text font-semibold text-base mb-1">Valla Menos Vencida</h2>
    <p class="text-text-disabled text-xs mb-3">Por equipos · mínimo 1 partido jugado · ordenado por goles en contra</p>
    <div class="bg-surface border border-border rounded-lg overflow-hidden">
      <div v-for="(row, i) in bestDefenses" :key="row.team.id"
        class="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
        <span :class="['text-xs font-bold w-5 text-center flex-shrink-0', i === 0 ? 'text-red-light' : 'text-text-disabled']">
          {{ i + 1 }}
        </span>
        <img v-if="row.team?.crest" :src="row.team.crest" class="w-5 h-5 object-contain flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-text text-sm font-medium">{{ row.team.shortName ?? row.team.tla }}</p>
          <p class="text-text-muted text-xs">{{ row.playedGames }} partidos</p>
        </div>
        <span class="text-red-light font-bold text-sm flex-shrink-0">{{ row.goalsAgainst }} GC</span>
      </div>
      <p v-if="!bestDefenses.length" class="px-4 py-3 text-text-disabled text-sm">Sin datos de posiciones aún.</p>
    </div>
  </section>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ standings: { type: Array, required: true } })
const bestDefenses = computed(() =>
  props.standings.flatMap(g => g.table).filter(r => r.playedGames > 0)
    .sort((a, b) => a.goalsAgainst - b.goalsAgainst || b.playedGames - a.playedGames).slice(0, 12)
)
</script>
