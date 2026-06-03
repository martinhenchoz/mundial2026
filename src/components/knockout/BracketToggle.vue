<template>
  <div class="flex gap-0.5 bg-surface border border-border rounded-md p-0.5">
    <button v-for="opt in options" :key="opt.value" @click="$emit('update:modelValue', opt.value)"
      :class="['flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors',
        modelValue === opt.value ? 'bg-red text-white' : 'text-text-muted hover:text-text']">
      <component :is="opt.icon" :size="13" :stroke-width="1.5" />
      {{ opt.label }}
    </button>
  </div>
</template>
<script setup>
import { GitBranch, List } from 'lucide-vue-next'
defineProps({ modelValue: String }); defineEmits(['update:modelValue'])
const options = [{ value: 'bracket', label: 'Bracket', icon: GitBranch }, { value: 'list', label: 'Lista', icon: List }]
</script>
