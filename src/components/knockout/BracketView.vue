<template>
  <div class="overflow-x-auto pb-4">
    <div v-if="rounds.length" class="flex gap-4 min-w-max items-start pt-2">
      <div v-for="round in rounds" :key="round.stage" class="flex flex-col gap-3">
        <h3 class="text-text-muted text-[9px] font-semibold tracking-widest uppercase text-center mb-1">
          {{ LABELS[round.stage] }}
        </h3>
        <div class="flex flex-col gap-3">
          <div v-for="match in round.matches" :key="match.id"
            class="bg-surface border border-border rounded-md p-2.5 w-44"
            :class="{ 'border-red/40': match.status === 'IN_PLAY' }">
            <div v-for="(side, idx) in [match.homeTeam, match.awayTeam]" :key="idx"
              :class="['flex items-center justify-between text-xs px-1 py-1 rounded',
                isWinner(match, idx) ? 'text-text font-semibold bg-red/5' : 'text-text-muted',
                idx === 0 ? 'mb-0.5' : '']">
              <div class="flex items-center gap-1.5 min-w-0">
                <img v-if="side?.crest" :src="side.crest" class="w-3.5 h-3.5 object-contain flex-shrink-0" />
                <span class="truncate">{{ side?.tla ?? side?.name?.split(' ').at(-1) ?? '?' }}</span>
              </div>
              <span v-if="hasScore(match)" :class="{ 'text-ochre font-bold': isWinner(match, idx) }">
                {{ idx === 0 ? match.score.fullTime.home : match.score.fullTime.away }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="text-text-disabled text-sm">Los cruces se publicarán al avanzar la fase de grupos.</p>
  </div>
</template>
<script setup>
import { computed } from 'vue'
const props = defineProps({ matchesByRound: { type: Object, required: true } })
const ORDER = ['ROUND_OF_32','ROUND_OF_16','QUARTER_FINALS','SEMI_FINALS','FINAL']
const LABELS = { ROUND_OF_32:'16avos', ROUND_OF_16:'Octavos', QUARTER_FINALS:'Cuartos', SEMI_FINALS:'Semis', FINAL:'Final' }
const rounds = computed(() => ORDER.filter(s => props.matchesByRound[s]?.length).map(s => ({ stage: s, matches: props.matchesByRound[s] })))
const hasScore = (m) => ['FINISHED','IN_PLAY','PAUSED'].includes(m.status) && m.score?.fullTime?.home != null
const isWinner = (m, idx) => hasScore(m) && m.score.winner === (idx === 0 ? 'HOME_TEAM' : 'AWAY_TEAM')
</script>
