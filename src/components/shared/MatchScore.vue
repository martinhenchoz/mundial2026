<template>
  <div class="flex items-center justify-between gap-2">
    <span class="font-semibold text-text text-sm flex-1 flex items-center gap-1.5 min-w-0">
      <img v-if="match.homeTeam?.crest" :src="match.homeTeam.crest" class="w-4 h-4 object-contain flex-shrink-0" />
      <span class="truncate">{{ match.homeTeam?.shortName || match.homeTeam?.tla || '?' }}</span>
    </span>
    <div class="min-w-[56px] text-center flex-shrink-0">
      <span v-if="hasScore" :class="['font-bold tabular-nums', size === 'lg' ? 'text-xl text-ochre' : 'text-sm text-ochre']">
        {{ match.score.fullTime.home }} - {{ match.score.fullTime.away }}
      </span>
      <span v-else class="text-text-muted text-xs bg-surface-2 px-2 py-0.5 rounded">vs</span>
    </div>
    <span class="font-semibold text-text text-sm flex-1 flex items-center justify-end gap-1.5 min-w-0">
      <span class="truncate">{{ match.awayTeam?.shortName || match.awayTeam?.tla || '?' }}</span>
      <img v-if="match.awayTeam?.crest" :src="match.awayTeam.crest" class="w-4 h-4 object-contain flex-shrink-0" />
    </span>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ match: { type: Object, required: true }, size: { type: String, default: 'md' } })
const hasScore = computed(() =>
  ['FINISHED','IN_PLAY','PAUSED'].includes(props.match.status) && props.match.score?.fullTime?.home != null)
</script>
