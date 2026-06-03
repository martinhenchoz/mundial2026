<template>
  <div class="p-4 md:p-6">
    <div class="flex items-center justify-between mb-6 gap-4 flex-wrap">
      <h1 class="text-text font-bold text-xl">Eliminatorias</h1>
      <BracketToggle v-model="viewMode" />
    </div>
    <LoadingSpinner v-if="store.isLoading && !store.allMatches.length" />
    <ErrorMessage v-else-if="store.error" :message="store.error" @retry="() => store.fetchMatches()" />
    <template v-else>
      <BracketView v-if="viewMode === 'bracket'" :matchesByRound="store.matchesByRound" />
      <RoundsList v-else :matchesByRound="store.matchesByRound" />
    </template>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { useMatchesStore } from '../stores/matches'
import BracketToggle from '../components/knockout/BracketToggle.vue'
import BracketView from '../components/knockout/BracketView.vue'
import RoundsList from '../components/knockout/RoundsList.vue'
import LoadingSpinner from '../components/shared/LoadingSpinner.vue'
import ErrorMessage from '../components/shared/ErrorMessage.vue'
const store = useMatchesStore()
const viewMode = ref('bracket')
onMounted(() => { if (!store.allMatches.length) store.fetchMatches() })
</script>
