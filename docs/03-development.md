# 3. Development

## Requirements

The repository declares:

```text
Node.js >= 22.12.0
```

Git and npm are required.

## Install dependencies

From the project root:

```bash
npm install
```

## Development server

```bash
npm run dev
```

Astro serves the development site locally.

## Production build

Always run:

```bash
npm run build
```

before production deployment.

The build validates content, generates routes, creates optimized assets, builds Pagefind, generates the sitemap, emits the PWA manifest/service worker, and includes the offline route.

## Preview the production build

```bash
npm run preview
```

## PWA development testing

The PWA can be tested locally on the Astro development server because localhost is treated as a secure development context for service workers.

After starting `npm run dev`:

1. Open `http://localhost:4321/`.
2. Open browser DevTools.
3. Use **Application → Manifest** to verify the manifest identity, icons, and shortcuts.
4. Use **Application → Service Workers** to verify `/sw.js` is active.
5. Visit an article while online.
6. Enable the browser's Offline mode.
7. Reload the visited article to confirm cached-page behavior.
8. Navigate to an unvisited/unavailable route to confirm the custom `/offline/` fallback.

When testing a changed service worker, unregistering the previous local service worker can help ensure the new cache generation is installed.

## Git workflow

The production workflow is intentionally simple:

```text
Edit
  ↓
Run locally
  ↓
QA
  ↓
npm run build
  ↓
git status
  ↓
git add
  ↓
git commit
  ↓
git push
  ↓
Cloudflare Pages deployment
```

Before committing:

```bash
git status
```

The preferred final state is:

```text
nothing to commit, working tree clean
```

## Recommended pre-push checks

```bash
npm run content:check
npm run content:health
npm run build
git diff --check
git status
```

For normal article/content changes, run `content:check` before the build. Run `content:health` when reviewing publication state, taxonomy, metadata coverage, or technical review status.

For content changes, also inspect the rendered article locally.

When changing PWA code, additionally verify the manifest, service worker, and offline fallback as described above.

## Important environment variable

Production Analytics uses:

```text
PUBLIC_GA_MEASUREMENT_ID
```

This is a public build variable. It is intentionally available to the client-side application and should not be treated as a secret credential.

## Build warning: large JavaScript chunk

The current build can emit a Vite warning when a minified JavaScript chunk exceeds the default 500 kB warning threshold.

The largest current generated chunk is associated with the Mermaid runtime. The repository already lazy-loads Mermaid with a dynamic `import("mermaid")` only when an article actually contains Mermaid diagrams.

Do not silence this warning by increasing `build.chunkSizeWarningLimit` without first measuring the actual pages that request the chunk. The warning is not, by itself, evidence that all readers download the large Mermaid chunk.

Useful inspection command:

```bash
find dist/_astro -type f -name "*.js" -printf '%s %p
' | sort -nr | head -15
```

If the warning becomes a real reader-facing performance issue, investigate feature-level lazy loading or narrower Mermaid loading before changing global bundle thresholds.

## Files that should not be committed

Generated or local-only directories such as:

```text
node_modules/
dist/
```

should remain excluded according to the repository's `.gitignore`.
