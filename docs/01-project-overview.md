# 1. Project Overview

## Purpose

Support Engineering Blog is a static technical publication for practical, research-backed guidance around Microsoft 365 administration, support engineering, project management, architecture, and related technologies.

## Intended audience

The project is designed for:

- Microsoft 365 Administrators
- Support Engineers
- Project Managers
- PMO teams
- Solution Architects
- IT Decision Makers

## Editorial principles

The editorial workflow established for the project follows these principles:

1. Explain **why something matters** before explaining how it works.
2. Keep the tone professional, approachable, and authoritative.
3. Prefer neutral, evidence-driven explanations.
4. Distinguish sourced information from editorial recommendations or practical analysis.
5. Explain Microsoft terminology in context rather than assuming the reader already knows it.
6. Include limitations, trade-offs, governance considerations, and implementation mistakes where relevant.
7. Avoid filler and generic AI-style language.
8. Prefer practical examples when they improve understanding.

## Current production identity

| Property | Value |
|---|---|
| Site | `https://blog.sadhan.ch/` |
| Site title | Support Engineering Blog |
| Short title | SEB |
| Author | Sadhan Chandra |
| Language | English |
| Production hosting | Cloudflare Pages |
| Source control | GitHub |
| DNS | Cloudflare |
| Registrar | GoDaddy |

## Current content

The repository currently contains **27 article source files** in `src/content/articles/`, using Markdown and MDX. The production build also generates the site's discovery, API, legal, learning-path, search, taxonomy, and offline routes.

The content system is designed to scale beyond the current article set without requiring changes to the article page architecture.

## Progressive Web App

The blog also provides a lightweight Progressive Web App layer. The PWA is intentionally an extension of the existing static site rather than a separate application.

Current PWA capabilities include:

- Web App Manifest
- installable application identity
- 192px and 512px application icons
- standalone display mode
- service-worker caching
- network-first navigation for fresh content
- cached previously visited pages for offline reading
- branded `/offline/` fallback
- app-icon shortcuts for common destinations

The PWA deliberately does **not** add push notifications, background sync, native sharing, or a separate mobile reader UI. Those features are outside the current web/PWA scope and may be considered for the dedicated Android application.

## Scope

This repository contains the Astro publication itself. External platform configuration such as Cloudflare Pages project settings, DNS records, Google Search Console properties, Bing Webmaster Tools, and GA4 property settings is not stored in the repository and is documented separately in the relevant operational documents.
