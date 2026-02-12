# Amber_Home - agents

## Goal
Create a single-page portal website that routes users to other apps via link cards.

### Requirements
- No login
- One page with anchor navigation (Home / Apps / About)
- Apps are defined by `public/apps.json` with `url`
- Favorites (LocalStorage): no reordering; append when added; remove when toggled off
- Recently Used (LocalStorage):
  - display top 5
  - sort by last access time desc
  - move-to-front on click (dedupe by id)
  - expire entries older than 90 days (cleanup on load)
  - keep max 20 entries in storage
- Deploy to GitHub Pages (Vite base configured)
- Include OGP / title / favicon assets and meta tags

## Must-have behaviors
1. Load `public/apps.json` at runtime and render apps sorted by `order` asc.
2. Favorites:
   - toggle per app card (☆/★)
   - persist to localStorage key `amber_home:favorites:v1`
   - store as array of app ids (append-only order)
3. Recently Used:
   - on app link click, write `{id, ts}` to `amber_home:recent:v1`
   - dedupe by id (move to front)
   - keep max 20 entries
   - remove expired entries (>90 days old) on load
   - display top 5 in UI
4. Anchors:
   - header nav links to `#top`, `#apps`, `#about`
5. About section:
   - "Coming soon" text only

## Files to focus
- `public/apps.json`
- `src/lib/storage.js`
- `src/App.jsx`
- `index.html` (meta tags for OGP, icons)
- `vite.config.js` (base path for GitHub Pages)
- `.github/workflows/deploy.yml` (Pages deploy)

## Acceptance checklist
- `npm run dev` works
- `npm run build` works
- favorites and recent persist across reload
- old recent entries (>90d) are removed automatically
- GitHub Pages serves correctly under `/REPO_NAME/`
- OGP meta tags exist and point to `/ogp.png` (optionally updated to absolute URL after deploy)
