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

The build validates content, generates routes, creates optimized assets, builds Pagefind, and generates the sitemap.

## Preview the production build

```bash
npm run preview
```

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
npm run build
git status
```

For content changes, also inspect the rendered article locally.

## Important environment variable

Production Analytics uses:

```text
PUBLIC_GA_MEASUREMENT_ID
```

This is a public build variable. It is intentionally available to the client-side application and should not be treated as a secret credential.

## Files that should not be committed

Generated or local-only directories such as:

```text
node_modules/
dist/
```

should remain excluded according to the repository's `.gitignore`.
