<template>
  <div class="bg-surface border border-red/40 rounded-lg p-4 space-y-2.5">
    <div class="flex items-center justify-between">
      <span class="bg-red text-white text-[9px] font-bold px-1.5 py-0.5 rounded tracking-wider">
        ● EN VIVO{{ match.minute ? ` ${match.minute}'` : '' }}
      </span>
      <span class="text-text-muted text-[10px]">{{ match.group?.replace('GROUP_','Grupo ') ?? match.stage }}</span>
    </div>
    <MatchScore :match="match" size="lg" />
  </div>
</template>
<script setup>
import MatchScore from '../shared/MatchScore.vue'
defineProps({ match: { type: Object, required: true } })
</script>
