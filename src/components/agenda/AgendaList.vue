<template>
  <div class="space-y-6">
    <section v-for="(matches, date) in matchesByDate" :key="date">
      <h2 class="text-text text-sm font-semibold capitalize mb-3 sticky top-0 bg-bg py-1 z-10">{{ date }}</h2>
      <div class="space-y-2">
        <div v-for="match in matches" :key="match.id"
          class="bg-surface border border-border rounded-lg px-4 py-3"
          :class="{ 'border-red/40': match.status === 'IN_PLAY' }">
          <div class="flex items-center justify-between mb-2">
            <span class="text-text-muted text-xs">{{ timeOnly(match.utcDate) }} ARG</span>
            <span :class="['text-[10px] font-semibold px-1.5 py-0.5 rounded', badgeClass(match.status)]">
              {{ LABELS[match.status] ?? match.status }}
            </span>
          </div>
          <MatchScore :match="match" />
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import MatchScore from '../shared/MatchScore.vue'
defineProps({ matchesByDate: { type: Object, required: true } })
const ARG = 'America/Argentina/Buenos_Aires'
const timeOnly = (u) => new Intl.DateTimeFormat('es-AR', { timeZone: ARG, hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date(u))
const LABELS = { SCHEDULED:'Programado', IN_PLAY:'En vivo', PAUSED:'Pausado', FINISHED:'Finalizado', POSTPONED:'Postergado', CANCELLED:'Cancelado' }
const badgeClass = (s) => ({ IN_PLAY:'bg-red/10 text-red-light', PAUSED:'bg-red/10 text-red-light', FINISHED:'bg-border text-text-muted', SCHEDULED:'bg-surface-2 text-text-disabled' }[s] ?? 'text-text-disabled')
</script>
