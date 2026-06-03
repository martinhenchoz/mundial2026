<template>
  <div class="space-y-8">
    <section v-for="(matches, stage) in orderedRounds" :key="stage">
      <h2 class="text-text-muted text-[10px] font-semibold tracking-widest uppercase mb-3">
        {{ LABELS[stage] ?? stage.replace(/_/g, ' ') }}
      </h2>
      <div class="grid md:grid-cols-2 gap-3">
        <div v-for="match in matches" :key="match.id"
          class="bg-surface border border-border rounded-lg px-4 py-3"
          :class="{ 'border-red/40': match.status === 'IN_PLAY' }">
          <div class="text-text-muted text-[10px] mb-2">{{ formatMatchTime(match.utcDate) }}</div>
          <MatchScore :match="match" />
        </div>
      </div>
    </section>
    <p v-if="!Object.keys(orderedRounds).length" class="text-text-disabled text-sm">
      Los cruces se publicarán al avanzar la fase de grupos.
    </p>
  </div>
</template>
<script setup>
import { computed } from 'vue'
import { useArgTime } from '../../composables/useArgTime'
import MatchScore from '../shared/MatchScore.vue'
const props = defineProps({ matchesByRound: { type: Object, required: true } })
const { formatMatchTime } = useArgTime()
const ORDER = ['ROUND_OF_32','ROUND_OF_16','QUARTER_FINALS','SEMI_FINALS','THIRD_PLACE','FINAL']
const LABELS = { ROUND_OF_32:'16avos de Final', ROUND_OF_16:'Octavos de Final',
  QUARTER_FINALS:'Cuartos de Final', SEMI_FINALS:'Semifinales', THIRD_PLACE:'Tercer Puesto', FINAL:'Final' }
const orderedRounds = computed(() =>
  Object.fromEntries(ORDER.filter(s => props.matchesByRound[s]?.length).map(s => [s, props.matchesByRound[s]]))
)
</script>
