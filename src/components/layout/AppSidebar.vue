<template>
  <aside class="w-48 bg-surface border-r border-border flex flex-col flex-shrink-0 min-h-screen sticky top-0">
    <div class="px-3 py-4 border-b border-border">
      <p class="text-text font-bold text-sm tracking-tight">⚽ Mundial 2026</p>
      <p class="text-text-muted text-[10px] mt-0.5 tracking-widest uppercase">USA · MEX · CAN</p>
    </div>
    <nav class="flex-1 py-2">
      <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
        class="flex items-center gap-2.5 px-3 py-2.5 text-text-muted text-xs border-l-2 border-transparent hover:text-text transition-colors"
        :class="{ 'text-red-light !border-red bg-red/10': isActive(item.to) }">
        <component :is="item.icon" :size="15" :stroke-width="1.5" />
        {{ item.label }}
      </RouterLink>
    </nav>
    <div class="px-3 py-2.5 border-t border-border text-text-disabled text-[10px]">{{ lastUpdated }}</div>
  </aside>
</template>
<script setup>
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { LayoutDashboard, Trophy, GitMerge, BarChart2, Calendar } from 'lucide-vue-next'
import { useMatchesStore } from '../../stores/matches'
const route = useRoute()
const store = useMatchesStore()
const isActive = (to) => to === '/' ? route.path === '/' : route.path.startsWith(to)
const lastUpdated = computed(() => {
  if (!store.lastFetched) return 'Sin datos aún'
  const s = Math.floor((Date.now() - store.lastFetched) / 1000)
  return s < 60 ? `Act. hace ${s}s` : `Act. hace ${Math.floor(s / 60)}min`
})
const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/grupos', label: 'Grupos', icon: Trophy },
  { to: '/cruces', label: 'Cruces', icon: GitMerge },
  { to: '/estadisticas', label: 'Estadísticas', icon: BarChart2 },
  { to: '/agenda', label: 'Agenda', icon: Calendar },
]
</script>
