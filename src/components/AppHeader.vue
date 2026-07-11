<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  totalCount: { type: Number, required: true },
  filteredCount: { type: Number, required: true },
  showConfidence: { type: Boolean, default: true },
})

defineEmits(['update:modelValue', 'update:showConfidence'])
</script>

<template>
  <header class="header">
    <div class="inner">
      <div class="brand">
        <svg class="brand-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="3" />
          <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </svg>
        <span>Vinyl Collection</span>
      </div>

      <div class="search-wrap">
        <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" stroke-linecap="round" />
        </svg>
        <input
          :value="modelValue"
          type="search"
          placeholder="Search artist or album…"
          autocomplete="off"
          spellcheck="false"
          aria-label="Search records"
          @input="$emit('update:modelValue', $event.target.value)"
        />
      </div>

      <div class="header-actions">
        <label class="toggle" for="show-confidence">
          <input
            id="show-confidence"
            type="checkbox"
            :checked="showConfidence"
            @change="$emit('update:showConfidence', $event.target.checked)"
          />
          <span>Show confidence</span>
        </label>

        <p class="count" aria-live="polite" aria-atomic="true">
          {{ filteredCount }}<span class="count-of"> of {{ totalCount }}</span> records
        </p>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 20;
  background: rgba(15, 15, 15, 0.9);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
  padding: 14px 24px;
}

.inner {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.brand {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  color: var(--gold);
  white-space: nowrap;
  letter-spacing: -0.3px;
}

.brand-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.search-wrap {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 11px;
  top: 50%;
  transform: translateY(-50%);
  width: 15px;
  height: 15px;
  color: var(--text-3);
  pointer-events: none;
}

input {
  width: 100%;
  padding: 8px 14px 8px 36px;
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--text);
  font-size: 13.5px;
  outline: none;
  transition: border-color 0.15s;
}

input:focus {
  border-color: var(--accent);
}

input::placeholder {
  color: var(--text-3);
}

/* Hide native search clear button */
input[type='search']::-webkit-search-cancel-button {
  -webkit-appearance: none;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
  flex-wrap: wrap;
}

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 12.5px;
  color: var(--text-2);
  cursor: pointer;
  user-select: none;
}

.toggle input {
  width: auto;
  padding: 0;
  accent-color: var(--accent);
}

.count {
  font-size: 12.5px;
  color: var(--text-3);
  white-space: nowrap;
}

.count-of {
  color: var(--text-3);
}
</style>
