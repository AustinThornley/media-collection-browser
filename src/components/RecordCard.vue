<script setup>
import { computed } from 'vue'
import { useArtwork } from '../composables/useArtwork.js'

const props = defineProps({
  record: { type: Object, required: true },
  showConfidence: { type: Boolean, default: true },
})

const emit = defineEmits(['click'])

const artwork = useArtwork(props.record._key, props.record.artist, props.record.album)

const confidenceClass = computed(() => {
  const c = props.record.confidence
  if (c >= 0.8) return 'high'
  if (c >= 0.5) return 'mid'
  return 'low'
})

const confidencePct = computed(() => `${Math.round(props.record.confidence * 100)}%`)
</script>

<template>
  <article
    class="card"
    role="button"
    tabindex="0"
    :aria-label="`${record.album} by ${record.artist}`"
    @click="emit('click', record)"
    @keydown.enter="emit('click', record)"
    @keydown.space.prevent="emit('click', record)"
  >
    <!-- Artwork -->
    <div class="art">
      <Transition name="fade">
        <img
          v-if="artwork.url"
          :src="artwork.url"
          :alt="`${record.album} album cover`"
          loading="lazy"
        />
        <div v-else-if="artwork.loading" class="art-placeholder" key="loading">
          <span class="spinner" aria-hidden="true"></span>
        </div>
        <div v-else class="art-placeholder" key="empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="3" />
            <circle cx="12" cy="12" r="0.8" fill="currentColor" stroke="none" />
          </svg>
        </div>
      </Transition>

      <!-- Confidence badge -->
      <span
        v-if="showConfidence"
        class="badge"
        :class="confidenceClass"
        aria-label="Confidence: {{ confidencePct }}"
      >
        {{ confidencePct }}
      </span>
    </div>

    <!-- Info -->
    <div class="info">
      <p class="album">{{ record.album }}</p>
      <p class="artist">{{ record.artist }}</p>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease;
  outline: none;
}

.card:hover,
.card:focus-visible {
  transform: translateY(-5px);
  border-color: var(--accent);
  box-shadow: 0 10px 32px rgba(0, 0, 0, 0.5);
}

.card:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}

/* Artwork */
.art {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--surface-2);
  overflow: hidden;
}

.art img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.art-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface-2);
}

.art-placeholder svg {
  width: 40px;
  height: 40px;
  color: var(--text-3);
}

/* Loading spinner */
.spinner {
  display: block;
  width: 24px;
  height: 24px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Confidence badge */
.badge {
  position: absolute;
  top: 7px;
  right: 7px;
  min-width: 44px;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.2px;
  text-align: center;
  background: rgba(12, 12, 12, 0.86);
  border: 1px solid rgba(255, 255, 255, 0.24);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(8px);
}

.badge.high { color: #7df29d; border-color: rgba(125, 242, 157, 0.7); }
.badge.mid  { color: #ffe066; border-color: rgba(255, 224, 102, 0.7); }
.badge.low  { color: #ff9a9a; border-color: rgba(255, 154, 154, 0.7); }

/* Info */
.info {
  padding: 10px 12px 13px;
}

.album {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--text);
  margin-bottom: 3px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.artist {
  font-size: 11.5px;
  color: var(--text-2);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Artwork fade transition */
.fade-enter-active { transition: opacity 0.25s ease; }
.fade-enter-from   { opacity: 0; }
</style>
