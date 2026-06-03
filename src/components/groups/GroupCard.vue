<template>
  <div class="bg-surface border border-border rounded-lg overflow-hidden">
    <div class="px-3 py-2 border-b border-border">
      <h3 class="text-text-muted text-[10px] font-semibold tracking-widest uppercase">{{ groupName }}</h3>
    </div>
    <StandingsTable :rows="group.table" />
    <div v-if="matches.length" class="border-t border-border">
      <div v-for="match in matches" :key="match.id"
        class="px-3 py-2 border-b border-border last:border-0"
        :class="{ 'bg-red/5': match.status === 'IN_PLAY' }">
        <div class="text-text-disabled text-[9px] mb-1">{{ formatMatchTime(match.utcDate) }}</div>
        <MatchScore :match="match" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useArgTime } from '../../composables/useArgTime'
import StandingsTable from './StandingsTable.vue'
import MatchScore from '../shared/MatchScore.vue'
const props = defineProps({ group: { type: Object, required: true }, matches: { type: Array, default: () => [] } })
const { formatMatchTime } = useArgTime()
const groupName = computed(() => `Grupo ${props.group.group.replace('GROUP_', '')}`)
</script>
