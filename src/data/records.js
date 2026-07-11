import rawRecords from '../../records.json'
import { getRecordKey } from '../utils/records.js'

/**
 * Deduplicates raw records by artist+album key, keeping the highest-confidence
 * entry for each unique pair. Assigns a stable _key for Vue :key bindings.
 */
export function deduplicateRecords(data) {
  const map = new Map()

  for (const r of data) {
    const key = getRecordKey(r)
    const existing = map.get(key)
    if (!existing || Number(r.confidence) > Number(existing.confidence)) {
      map.set(key, { ...r, _key: key })
    }
  }

  return [...map.values()].sort(
    (a, b) =>
      a.artist.localeCompare(b.artist) ||
      a.album.localeCompare(b.album)
  )
}

export const records = deduplicateRecords(rawRecords)
