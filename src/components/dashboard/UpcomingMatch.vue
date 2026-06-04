<template>
  <div class="bg-surface-2 border border-border rounded-lg px-4 py-3 flex items-center gap-3">
    <span class="text-text-muted text-[10px] w-28 flex-shrink-0">{{ timeLabel }}</span>
    <div class="flex-1"><MatchScore :match="match" /></div>
    <span class="text-text-disabled text-[10px] w-14 text-right flex-shrink-0">
      {{ match.group?.replace(/^(GROUP_|Group )/i, 'Grupo ') ?? match.stage }}
    </span>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useArgTime } from '../../composables/useArgTime'
import MatchScore from '../shared/MatchScore.vue'
const props = defineProps({ match: { type: Object, required: true } })
const { formatMatchTime } = useArgTime()
const timeLabel = computed(() => formatMatchTime(props.match.utcDate))
</script>
