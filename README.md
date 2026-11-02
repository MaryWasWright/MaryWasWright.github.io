Great Pyrenees and Beyond — Southwest Guardian archive. Static GitHub Pages site.

## Asset dependency

This repo's `assets/` folder is the single asset host for both doors. The named door
(https://marywaswright.github.io/great-pyrenees/, repo MaryWasWright/great-pyrenees)
has no assets of its own and loads `styles.css`, `site.js`, `favicon.svg`,
`age-ladder.svg` (Training only), and the painted JPEG/WebP images from here by absolute URL.

- Do not rename or delete a file in `assets/` without updating the named door's pages.
- Keep every JPEG: each WebP is served via `<picture>` with the JPEG as fallback.
- After a visual change, bump the same `?v=` cache-buster on every page in both repos.
