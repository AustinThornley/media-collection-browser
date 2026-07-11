# Media Collection Browser

A Vue 3 + Vite app for browsing your scanned vinyl record collection.

## Features

- **Card grid** with album artwork pulled live from the iTunes Search API
- **Real-time search** by artist or album title
- **Click-through modal** showing confidence score, scan reasoning, catalog number, and edition
- **Confidence badges** color-coded green / yellow / red (high / medium / low)
- Fully keyboard-accessible (Tab, Enter, Escape)
- Dark theme

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173 (or whatever your terminal says)

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start the dev server         |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build |

## Project structure

```
media-collection-browser/
├── index.html
├── vite.config.js
├── package.json
├── records.json                  # Editable collection data used by the app
├── sample.records.json           # Example records with placeholder data
└── src/
    ├── main.js                     # App entry point
    ├── App.vue                     # Root component — layout, search, grid
    ├── style.css                   # Global CSS variables & resets
    ├── data/
    │   └── records.js              # Imports JSON + deduplicates records
    ├── composables/
    │   ├── useArtwork.js           # iTunes artwork lookup with cache & stagger
    │   └── useSearch.js            # Reactive search/filter logic
    └── components/
        ├── AppHeader.vue           # Sticky header with search input
        ├── RecordCard.vue          # Individual album card
        └── RecordModal.vue         # Detail overlay with confidence info
```

## Artwork

Album artwork is fetched from the **iTunes Search API** with no API key required.
The app searches album results, prefers exact artist/album matches, and scales
the returned artwork URL up for sharper cards. Requests are staggered at 130 ms
intervals to stay within Apple's published guidance, and results are cached in
module-level reactive state so re-renders never cause duplicate network calls.

Artwork results are also persisted in `localStorage` under
`media-collection-browser:artwork:v1`, so reloads avoid repeating the same API
calls. Found artwork is cached for 90 days. Confirmed misses and unknown records
are cached for 7 days so placeholder-only records do not get re-requested on
every visit.

Cover Art Archive/MusicBrainz is another strong option for cover provenance, but
it needs MusicBrainz release or release-group IDs before artwork can be fetched.
For a browser-only app using artist/album strings, iTunes remains the simplest
default source.

## Adding more records

Edit `records.json` at the repo root. Add objects using this shape:

```json
{
  "artist": "Artist Name",
  "album": "Album Title",
  "catalog_number": "ABC-123",
  "edition": "Limited edition",
  "position": 1,
  "confidence": 0.95,
  "reason": "Why this scan result was chosen.",
  "crop": 1
}
```

Use `sample.records.json` as a safe reference when changing the data format. The
`deduplicateRecords` function in `src/data/records.js` automatically merges
duplicates from multiple scan crops, keeping whichever entry has the highest
confidence.

## Ignored files

Generated files such as `dist/`, `node_modules/`, `package-lock.json`, logs,
coverage output, local `.env` files, and editor/OS noise are ignored via
`.gitignore`.
