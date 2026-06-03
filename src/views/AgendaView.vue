<template>
  <div class="p-4 md:p-6">
    <h1 class="text-text font-bold text-xl mb-6">Agenda</h1>
    <LoadingSpinner v-if="store.isLoading && !store.allMatches.length" />
    <ErrorMessage v-else-if="store.error" :message="store.error" @retry="() => store.fetchMatches()" />
    <AgendaList v-else :matchesByDate="store.matchesByDate" />
  </div>
</template>
<script setup>
import { onMounted } from 'vue'
import { useMatchesStore } from '../stores/matches'
import AgendaList from '../components/agenda/AgendaList.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import ErrorMessage from '../components/shared/ErrorMessage.vue'
const store = useMatchesStore()
onMounted(() => { if (!store.allMatches.length) store.fetchMatches() })
</script>
