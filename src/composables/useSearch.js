import { ref, computed } from 'vue'

/**
 * Provides reactive search filtering over a list of records.
 *
 * @param {Array} records - The full deduplicated record list
 */
export function useSearch(records) {
  const query = ref('')

  const filtered = computed(() => {
    const q = query.value.toLowerCase().trim()
    if (!q) return records
    return records.filter(
      (r) =>
        r.artist.toLowerCase().includes(q) ||
        r.album.toLowerCase().includes(q)
    )
  })

  return { query, filtered }
}
