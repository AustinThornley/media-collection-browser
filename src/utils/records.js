export function normalizeRecordText(value = '') {
  return value
    .toString()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function getRecordKey(record) {
  return `${normalizeRecordText(record.artist)}|||${normalizeRecordText(record.album)}`
}

export function isUnknownValue(value = '') {
  return normalizeRecordText(value) === 'unknown'
}

export function getConfidenceLevel(confidence = 0) {
  const value = Number(confidence) || 0
  if (value >= 0.8) return 'high'
  if (value >= 0.5) return 'mid'
  return 'low'
}

export function getConfidencePercent(confidence = 0) {
  return `${Math.round((Number(confidence) || 0) * 100)}%`
}

export function getConfidenceLabel(confidence = 0) {
  const value = Number(confidence) || 0
  if (value >= 0.8) return 'High confidence'
  if (value >= 0.5) return 'Medium confidence'
  return 'Low confidence'
}
