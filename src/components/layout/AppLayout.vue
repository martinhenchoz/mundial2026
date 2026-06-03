<template>
  <div class="flex min-h-screen bg-bg text-text">
    <AppSidebar v-if="isDesktop" />
    <main class="flex-1 overflow-auto" :class="isDesktop ? '' : 'pb-16'">
      <RouterView />
    </main>
    <AppBottomNav v-if="!isDesktop" />
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'
import AppSidebar from './AppSidebar.vue'
import AppBottomNav from './AppBottomNav.vue'
const mq = window.matchMedia('(min-width: 768px)')
const isDesktop = ref(mq.matches)
const onResize = (e) => { isDesktop.value = e.matches }
onMounted(() => mq.addEventListener('change', onResize))
onUnmounted(() => mq.removeEventListener('change', onResize))
</script>
