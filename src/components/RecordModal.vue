<script setup>
import { computed, onMounted, onUnmounted, watch } from 'vue'
import { useArtwork } from '../composables/useArtwork.js'

const props = defineProps({
  record: { type: Object, default: null },
})

const emit = defineEmits(['close'])

const artwork = computed(() =>
  props.record ? useArtwork(props.record._key, props.record.artist, props.record.album) : { url: null, loading: false }
)

const confidenceClass = computed(() => {
  if (!props.record) return ''
  const c = props.record.confidence
  if (c >= 0.8) return 'high'
  if (c >= 0.5) return 'mid'
  return 'low'
})

const confidencePct = computed(() =>
  props.record ? `${Math.round(props.record.confidence * 100)}%` : ''
)

const confidenceLabel = computed(() => {
  if (!props.record) return ''
  const c = props.record.confidence
  if (c >= 0.8) return 'High confidence'
  if (c >= 0.5) return 'Medium confidence'
  return 'Low confidence'
})

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})

watch(
  () => props.record,
  (record) => {
    document.body.style.overflow = record ? 'hidden' : ''
  },
  { immediate: true }
)

onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="overlay">
      <div
        v-if="record"
        class="overlay"
        role="dialog"
        aria-modal="true"
        :aria-label="`${record.album} details`"
        @click.self="emit('close')"
      >
        <Transition name="modal">
          <div class="modal" v-if="record">
            <!-- Close button -->
            <button class="close-btn" aria-label="Close" @click="emit('close')">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <!-- Artwork -->
            <div class="modal-art-wrap">
              <img
                v-if="artwork.url"
                :src="artwork.url"
                :alt="`${record.album} album cover`"
                class="modal-art"
              />
              <div v-else class="modal-art-placeholder">
                <span v-if="artwork.loading" class="spinner"></span>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
                </svg>
              </div>
            </div>

            <!-- Body -->
            <div class="modal-body">
              <h2 class="modal-album">{{ record.album }}</h2>
              <p class="modal-artist">{{ record.artist }}</p>

              <!-- Confidence -->
              <section class="section">
                <h3 class="section-label">Scan confidence</h3>
                <div class="conf-track">
                  <div
                    class="conf-fill"
                    :class="confidenceClass"
                    :style="{ width: confidencePct }"
                  ></div>
                </div>
                <span class="conf-text" :class="confidenceClass">
                  {{ confidencePct }} — {{ confidenceLabel }}
                </span>
              </section>

              <!-- Reasoning -->
              <section class="section">
                <h3 class="section-label">Reasoning</h3>
                <p class="reason">{{ record.reason }}</p>
              </section>

              <!-- Metadata chips -->
              <section class="section">
                <h3 class="section-label">Details</h3>
                <dl class="meta-grid">
                  <div v-if="record.catalog_number" class="meta-chip">
                    <dt>Catalog #</dt>
                    <dd>{{ record.catalog_number }}</dd>
                  </div>
                  <div v-if="record.edition" class="meta-chip">
                    <dt>Edition</dt>
                    <dd>{{ record.edition }}</dd>
                  </div>
                  <div class="meta-chip">
                    <dt>Position</dt>
                    <dd>#{{ record.position }}</dd>
                  </div>
                  <div class="meta-chip">
                    <dt>Crop</dt>
                    <dd>{{ record.crop }}</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.modal {
  background: var(--surface-1);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  width: 100%;
  max-width: 520px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.8);
}

/* Scrollbar inside modal */
.modal::-webkit-scrollbar { width: 4px; }
.modal::-webkit-scrollbar-track { background: transparent; }
.modal::-webkit-scrollbar-thumb { background: var(--surface-3); border-radius: 2px; }

/* Close button */
.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.close-btn:hover { background: rgba(0, 0, 0, 0.9); }

.close-btn svg {
  width: 13px;
  height: 13px;
}

/* Artwork */
.modal-art-wrap {
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
  aspect-ratio: 1 / 1;
  background: var(--surface-2);
  max-height: min(52vh, 520px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-art {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: var(--surface-2);
}

.modal-art-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-art-placeholder svg {
  width: 64px;
  height: 64px;
  color: var(--text-3);
}

.spinner {
  display: block;
  width: 28px;
  height: 28px;
  border: 2px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* Body */
.modal-body {
  padding: 20px 22px 26px;
}

.modal-album {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.25;
  color: var(--text);
  margin-bottom: 4px;
  letter-spacing: -0.3px;
}

.modal-artist {
  font-size: 0.9rem;
  color: var(--gold);
  margin-bottom: 20px;
  font-weight: 500;
}

.section {
  margin-bottom: 18px;
}

.section-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-3);
  font-weight: 600;
  margin-bottom: 7px;
}

/* Confidence bar */
.conf-track {
  height: 5px;
  background: var(--surface-3);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 5px;
}

.conf-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.5s ease;
}

.conf-fill.high { background: var(--high); }
.conf-fill.mid  { background: var(--mid);  }
.conf-fill.low  { background: var(--low);  }

.conf-text {
  font-size: 12.5px;
  font-weight: 600;
}

.conf-text.high { color: var(--high); }
.conf-text.mid  { color: var(--mid);  }
.conf-text.low  { color: var(--low);  }

/* Reason */
.reason {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 11px 14px;
  font-size: 13px;
  color: var(--text-2);
  line-height: 1.65;
}

/* Metadata chips */
.meta-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.meta-chip {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 8px 12px;
  min-width: 90px;
}

.meta-chip dt {
  font-size: 9.5px;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-3);
  font-weight: 600;
  margin-bottom: 2px;
}

.meta-chip dd {
  font-size: 12.5px;
  font-weight: 500;
  color: var(--text);
}

/* Transitions */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.modal-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.modal-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  transform: scale(0.97) translateY(8px);
}
</style>
