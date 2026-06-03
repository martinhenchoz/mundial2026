<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex z-50">
    <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
      class="flex-1 flex flex-col items-center gap-1 py-2 text-text-disabled text-[9px] transition-colors"
      :class="{ '!text-red-light': isActive(item.to) }">
      <component :is="item.icon" :size="20" :stroke-width="1.5" />
      {{ item.label }}
    </RouterLink>
  </nav>
</template>
<script setup>
import { RouterLink, useRoute } from 'vue-router'
import { LayoutDashboard, Trophy, GitMerge, BarChart2, Calendar } from 'lucide-vue-next'
const route = useRoute()
const isActive = (to) => to === '/' ? route.path === '/' : route.path.startsWith(to)
const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/grupos', label: 'Grupos', icon: Trophy },
  { to: '/cruces', label: 'Cruces', icon: GitMerge },
  { to: '/estadisticas', label: 'Stats', icon: BarChart2 },
  { to: '/agenda', label: 'Agenda', icon: Calendar },
]
</script>
