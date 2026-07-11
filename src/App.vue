<script setup>
import { ref, onMounted } from 'vue'
import { records } from './data/records.js'
import { useSearch } from './composables/useSearch.js'
import { prefetchArtwork } from './composables/useArtwork.js'
import AppHeader from './components/AppHeader.vue'
import RecordCard from './components/RecordCard.vue'
import RecordModal from './components/RecordModal.vue'

const { query, filtered } = useSearch(records)
const selectedRecord = ref(null)
const showConfidence = ref(true)

function openRecord(record) {
  selectedRecord.value = record
}

function closeRecord() {
  selectedRecord.value = null
}

// Kick off staggered artwork fetches after mount
onMounted(() => {
  prefetchArtwork(records)
})
</script>

<template>
  <AppHeader
    v-model="query"
    v-model:show-confidence="showConfidence"
    :total-count="records.length"
    :filtered-count="filtered.length"
  />

  <main class="main">
    <!-- Empty state -->
    <div v-if="filtered.length === 0" class="empty">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.35-4.35" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
      <p class="empty-title">No records found</p>
      <p class="empty-sub">Try a different artist or album name</p>
    </div>

    <!-- Card grid -->
    <TransitionGroup v-else tag="div" name="list" class="grid">
      <RecordCard
        v-for="record in filtered"
        :key="record._key"
        :record="record"
        :show-confidence="showConfidence"
        @click="openRecord(record)"
      />
    </TransitionGroup>
  </main>

  <!-- Detail modal -->
  <RecordModal :record="selectedRecord" @close="closeRecord" />
</template>

<style scoped>
.main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(155px, 1fr));
  gap: 14px;
}

/* Empty state */
.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text-3);
}

.empty svg {
  width: 44px;
  height: 44px;
  margin-bottom: 14px;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-2);
  margin-bottom: 4px;
}

.empty-sub {
  font-size: 13.5px;
  color: var(--text-3);
}

/* Grid card transitions */
.list-enter-active,
.list-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(0.96);
}

.list-leave-active {
  position: absolute;
}
</style>
