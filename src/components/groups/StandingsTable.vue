<template>
  <table class="w-full text-xs">
    <thead>
      <tr class="text-text-disabled">
        <th class="px-3 py-1.5 text-left w-5">#</th>
        <th class="px-2 py-1.5 text-left">Equipo</th>
        <th class="px-1 py-1.5 text-center" title="Partidos jugados">PJ</th>
        <th class="px-1 py-1.5 text-center">G</th>
        <th class="px-1 py-1.5 text-center">E</th>
        <th class="px-1 py-1.5 text-center">P</th>
        <th class="px-1 py-1.5 text-center">DG</th>
        <th class="px-2 py-1.5 text-center font-semibold">Pts</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, i) in rows" :key="row.team.id"
        :class="['border-t border-border', i < 2 ? 'text-text' : 'text-text-muted']">
        <td class="px-3 py-2">
          <span :class="['inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-bold',
            i < 2 ? 'bg-red text-white' : 'bg-border text-text-disabled']">{{ row.position }}</span>
        </td>
        <td class="px-2 py-2 font-medium">
          <div class="flex items-center gap-1.5">
            <img v-if="row.team.crest" :src="row.team.crest" class="w-3.5 h-3.5 object-contain" />
            {{ row.team.tla }}
          </div>
        </td>
        <td class="px-1 py-2 text-center">{{ row.playedGames }}</td>
        <td class="px-1 py-2 text-center">{{ row.won }}</td>
        <td class="px-1 py-2 text-center">{{ row.draw }}</td>
        <td class="px-1 py-2 text-center">{{ row.lost }}</td>
        <td class="px-1 py-2 text-center">{{ row.goalDifference > 0 ? '+' : '' }}{{ row.goalDifference }}</td>
        <td class="px-2 py-2 text-center font-bold text-ochre">{{ row.points }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
defineProps({ rows: { type: Array, required: true } })
</script>
