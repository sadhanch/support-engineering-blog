# SEDS Component Library

> A consistent interface begins with consistent components.

---

# Overview

The Support Engineering Design System (SEDS) is built from reusable, modular components.

Each component has a single responsibility and is designed to work consistently across the entire website.

This document serves as the reference guide for every UI component currently available in SEDS.

---

# Component Design Principles

Every component should follow these principles:

- Single responsibility
- Reusable
- Accessible
- Responsive
- Consistent
- Easy to maintain

Before adding a new component, ask:

> Does this solve a real problem, or does it simply add visual complexity?

---

# Component Categories

## Navigation

### Header

**Purpose**

Provides global branding and navigation.

**CSS**

```text
layout/header.css
```

**Used On**

- Homepage
- Search
- About
- Articles

**Future Improvements**

- Sticky behavior
- Search integration
- Mobile navigation improvements

---

### Navigation Bar

**Purpose**

Allows users to move between major sections.

**CSS**

```text
components/navigation.css
```

---

# Actions

## Buttons

**Purpose**

Primary user interaction.

### Variants

- Primary
- Secondary
- Ghost

### Guidelines

Buttons should represent actions.

Navigation should use links.

---

# Content Components

## Cards

Used to preview articles.

CSS

```text
components/cards.css
```

---

## Category Cards

Used on the homepage to organize content.

CSS

```text
components/categories.css
```

---

## Latest Articles

Displays recently published content.

CSS

```text
components/latest-articles.css
```

---

# Documentation Components

These are the heart of SEDS.

---

## Reader Toolkit

Purpose

Provides quick access to article navigation and supplementary information.

CSS

```text
components/reader-toolkit.css
```

Guidelines

- Keep concise.
- Avoid duplicating article content.
- Remain sticky on desktop.

---

## Quick Summary

Purpose

Provide readers with an overview before reading.

Guidelines

Should answer:

- What happened?
- Why does it matter?
- What should readers do?

---

## Callouts

Purpose

Highlight important information.

Variants

- Information
- Success
- Warning
- Danger

Guidelines

Use sparingly.

Avoid excessive nesting.

---

## Code Blocks

Purpose

Display technical commands and scripts.

Features

- Horizontal scrolling
- Monospace font
- Preserved formatting

---

## Tables

Purpose

Present structured information.

Features

- Responsive
- Horizontal scrolling
- Consistent spacing

Guidelines

Prefer tables only when comparison improves understanding.

---

## Figures

Purpose

Provide supporting visual context.

Guidelines

Always include captions.

Number figures sequentially.

---

## Checklists

Purpose

Summarize actionable steps.

Guidelines

Checklist items should begin with verbs whenever possible.

---

## Badges

Purpose

Communicate metadata and status.

Variants

- Primary
- Success
- Warning
- Danger

Examples

- Updated
- Preview
- Microsoft Learn
- Copilot

---

## References

Purpose

Provide evidence and supporting resources.

Guidelines

- Prefer official documentation.
- Keep links current.
- Organize logically.

---

## Related Articles

Purpose

Encourage continued learning.

Guidelines

Suggest genuinely relevant content.

Avoid unrelated recommendations.

---

## Author Card

Purpose

Introduce the author and establish credibility.

Guidelines

Keep concise.

Focus on expertise.

---

# Page Templates

## Homepage

Purpose

Content discovery.

---

## Search

Purpose

Knowledge retrieval.

---

## About

Purpose

Explain the project's mission.

---

## Article

Purpose

Deliver long-form technical documentation.

---

# Component Checklist

Before introducing a new component:

- Does it solve a real user problem?
- Can it be reused?
- Does it follow SEDS spacing?
- Does it use design tokens?
- Is it responsive?
- Is it accessible?
- Does it improve readability?
- Does it require documentation?

If the answer to any of these is "No," reconsider whether the component belongs in SEDS.

---

# Key Decisions

- Every component has a single responsibility.
- Components are documented before expansion.
- Design tokens are used instead of hard-coded values.
- Components should remain independent of page layouts.
- Documentation components receive the highest design priority because they directly support the reading experience.
