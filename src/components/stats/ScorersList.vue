<template>
  <section>
    <h2 class="text-text font-semibold text-base mb-3">Goleadores</h2>
    <div class="bg-surface border border-border rounded-lg overflow-hidden">
      <div v-for="(scorer, i) in scorers" :key="scorer.player.id"
        class="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
        <span :class="['text-xs font-bold w-5 text-center flex-shrink-0', i === 0 ? 'text-ochre' : 'text-text-disabled']">
          {{ i + 1 }}
        </span>
        <img v-if="scorer.team?.crest" :src="scorer.team.crest" class="w-5 h-5 object-contain flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <p class="text-text text-sm font-medium truncate">{{ scorer.player.name }}</p>
          <p class="text-text-muted text-xs">{{ scorer.team?.shortName ?? scorer.team?.name }}</p>
        </div>
        <div class="flex items-center gap-3 text-xs flex-shrink-0">
          <span class="text-ochre font-bold">{{ scorer.goals }} ⚽</span>
          <span v-if="scorer.assists" class="text-text-muted">{{ scorer.assists }} asis.</span>
          <span v-if="scorer.penalties" class="text-text-disabled text-[10px]">{{ scorer.penalties }} pen.</span>
        </div>
      </div>
      <p v-if="!scorers.length" class="px-4 py-3 text-text-disabled text-sm">Sin datos de goleadores aún.</p>
    </div>
  </section>
</template>
<script setup>
defineProps({ scorers: { type: Array, required: true } })
</script>
