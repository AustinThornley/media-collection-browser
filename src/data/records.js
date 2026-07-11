import rawRecords from '../../records.json'

/**
 * Deduplicates raw records by artist+album key, keeping the highest-confidence
 * entry for each unique pair. Assigns a stable _key for Vue :key bindings.
 */
export function deduplicateRecords(data) {
  const map = new Map()

  for (const r of data) {
    const key = `${r.artist.toLowerCase().trim()}|||${r.album.toLowerCase().trim()}`
    const existing = map.get(key)
    if (!existing || r.confidence > existing.confidence) {
      map.set(key, { ...r, _key: key })
    }
  }

  return [...map.values()].sort((a, b) => a.artist.localeCompare(b.artist))
}

export const records = deduplicateRecords(rawRecords)
