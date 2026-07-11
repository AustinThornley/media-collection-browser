import { reactive } from 'vue'

// Module-level cache so artwork persists across component unmounts
const cache = reactive({})
const STORAGE_KEY = 'media-collection-browser:artwork:v1'
const HIT_TTL_MS = 1000 * 60 * 60 * 24 * 90
const MISS_TTL_MS = 1000 * 60 * 60 * 24 * 7

/**
 * Fetches album artwork from the iTunes Search API.
 * Results are cached by record key to avoid duplicate requests.
 *
 * @param {string} key    - Unique record key used as cache key
 * @param {string} artist - Artist name
 * @param {string} album  - Album title
 * @returns {{ url: string | null, loading: boolean }}
 */
export function useArtwork(key, artist, album) {
  if (!cache[key]) {
    const stored = readStoredArtwork(key)
    cache[key] = { url: stored?.url ?? null, loading: !stored }
    if (stored) return cache[key]

    fetchArtwork(key, artist, album)
  }
  return cache[key]
}

async function fetchArtwork(key, artist, album) {
  if (isUnknown(artist) || isUnknown(album)) {
    cache[key].loading = false
    writeStoredArtwork(key, null)
    return
  }

  let shouldStore = false

  try {
    const params = new URLSearchParams({
      term: `${artist} ${album}`,
      entity: 'album',
      limit: '5',
      media: 'music',
      country: 'US',
    })
    const resp = await fetch(`https://itunes.apple.com/search?${params}`)
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
    const data = await resp.json()
    const result = findBestResult(data.results, artist, album)
    if (result?.artworkUrl100) cache[key].url = scaleArtworkUrl(result.artworkUrl100)
    shouldStore = true
  } catch {
    // Silently fail; placeholder artwork will remain visible.
  } finally {
    if (shouldStore) writeStoredArtwork(key, cache[key].url)
    cache[key].loading = false
  }
}

function readStoredArtwork(key) {
  const stored = getStoredArtwork()[key]
  if (!stored) return null

  const ttl = stored.url ? HIT_TTL_MS : MISS_TTL_MS
  if (Date.now() - stored.savedAt > ttl) {
    removeStoredArtwork(key)
    return null
  }

  return stored
}

function writeStoredArtwork(key, url) {
  const stored = getStoredArtwork()
  stored[key] = { url, savedAt: Date.now() }
  setStoredArtwork(stored)
}

function removeStoredArtwork(key) {
  const stored = getStoredArtwork()
  delete stored[key]
  setStoredArtwork(stored)
}

function getStoredArtwork() {
  if (!canUseLocalStorage()) return {}

  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return {}
  }
}

function setStoredArtwork(stored) {
  if (!canUseLocalStorage()) return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored))
  } catch {
    // Storage can be full or disabled; the in-memory cache still works.
  }
}

function canUseLocalStorage() {
  return typeof localStorage !== 'undefined'
}

function findBestResult(results = [], artist, album) {
  const normalizedArtist = normalize(artist)
  const normalizedAlbum = normalize(album)

  return (
    results.find(
      (result) =>
        normalize(result.artistName) === normalizedArtist &&
        normalize(result.collectionName) === normalizedAlbum
    ) ||
    results.find((result) => normalize(result.collectionName) === normalizedAlbum) ||
    results[0]
  )
}

function scaleArtworkUrl(url) {
  return url.replace(/100x100[^.]*\.(jpg|png)$/i, '600x600bb.$1')
}

function normalize(value = '') {
  return value
    .toString()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

function isUnknown(value = '') {
  return normalize(value) === 'unknown'
}

/**
 * Kicks off staggered artwork fetches for an array of records.
 * Staggering avoids hitting iTunes rate limits.
 *
 * @param {Array} records - Array of record objects with _key, artist, album
 * @param {number} delayMs - Milliseconds between each request (default 130)
 */
export function prefetchArtwork(records, delayMs = 130) {
  records.forEach((record, i) => {
    setTimeout(() => {
      useArtwork(record._key, record.artist, record.album)
    }, i * delayMs)
  })
}
