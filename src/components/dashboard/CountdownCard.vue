<template>
  <div class="bg-surface border border-border rounded-xl p-6 text-center">
    <p class="text-text-muted text-[9px] font-semibold tracking-widest uppercase mb-5">
      ⚽ El torneo empieza en
    </p>
    <div class="flex items-start justify-center gap-2 mb-5">

      <div class="flex flex-col items-center">
        <div class="bg-surface-2 border border-border rounded-lg px-4 py-3 min-w-[56px]">
          <span :key="days" class="digit block text-3xl font-bold leading-none text-text">
            {{ String(days).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-text-disabled text-[8px] tracking-widest uppercase mt-1.5">días</span>
      </div>

      <span class="sep text-red text-2xl font-light pt-2.5 select-none">:</span>

      <div class="flex flex-col items-center">
        <div class="bg-surface-2 border border-border rounded-lg px-4 py-3 min-w-[56px]">
          <span :key="hours" class="digit block text-3xl font-bold leading-none text-text">
            {{ String(hours).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-text-disabled text-[8px] tracking-widest uppercase mt-1.5">hs</span>
      </div>

      <span class="sep text-red text-2xl font-light pt-2.5 select-none">:</span>

      <div class="flex flex-col items-center">
        <div class="bg-surface-2 border border-border rounded-lg px-4 py-3 min-w-[56px]">
          <span :key="minutes" class="digit block text-3xl font-bold leading-none text-text">
            {{ String(minutes).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-text-disabled text-[8px] tracking-widest uppercase mt-1.5">min</span>
      </div>

      <span class="sep text-red text-2xl font-light pt-2.5 select-none">:</span>

      <div class="flex flex-col items-center">
        <div class="bg-red/5 border border-red/30 rounded-lg px-4 py-3 min-w-[56px]">
          <span :key="seconds" class="digit block text-3xl font-bold leading-none text-red-light">
            {{ String(seconds).padStart(2, '0') }}
          </span>
        </div>
        <span class="text-text-disabled text-[8px] tracking-widest uppercase mt-1.5">seg</span>
      </div>

    </div>
    <p class="text-text-disabled text-xs">
      {{ match.homeTeam?.shortName || match.homeTeam?.tla }}
      vs.
      {{ match.awayTeam?.shortName || match.awayTeam?.tla }}
      · {{ formatTime(match.utcDate) }} ARG
    </p>
  </div>
</template>

<script setup>
import { useCountdown } from '../../composables/useCountdown'
import { useArgTime } from '../../composables/useArgTime'

const props = defineProps({ match: { type: Object, required: true } })
const { days, hours, minutes, seconds } = useCountdown(props.match.utcDate)
const { formatTime } = useArgTime()
</script>

<style scoped>
@keyframes slideIn {
  from {
    transform: translateY(-60%);
    opacity: 0;
    filter: blur(4px);
  }
  to {
    transform: translateY(0);
    opacity: 1;
    filter: blur(0);
  }
}
.digit {
  animation: slideIn 0.25s ease-out;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}
.sep {
  animation: blink 1s ease-in-out infinite;
}
</style>
