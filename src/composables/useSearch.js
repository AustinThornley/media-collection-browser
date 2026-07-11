import { ref, computed } from 'vue'
import { normalizeRecordText } from '../utils/records.js'

/**
 * Provides reactive search filtering over a list of records.
 *
 * @param {Array} records - The full deduplicated record list
 */
export function useSearch(records) {
  const query = ref('')

  const filtered = computed(() => {
    const q = normalizeRecordText(query.value)
    if (!q) return records
    return records.filter(
      (r) =>
        normalizeRecordText(r.artist).includes(q) ||
        normalizeRecordText(r.album).includes(q)
    )
  })

  return { query, filtered }
}
