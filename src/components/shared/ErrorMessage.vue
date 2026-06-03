<template>
  <div class="bg-red/10 border border-red/30 rounded-lg p-4">
    <p class="text-red-light font-semibold text-sm mb-1">Error al cargar datos</p>
    <p class="text-text-muted text-xs">{{ message }}</p>
    <button @click="$emit('retry')" class="mt-3 text-xs text-red-light underline">Reintentar</button>
  </div>
</template>
<script setup>
defineProps({ message: String })
defineEmits(['retry'])
</script>
