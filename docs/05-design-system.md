# 5. Design System

## Design system name

The project refers to its UI system as:

**SEDS — Support Engineering Design System**

The system is implemented primarily through CSS custom properties and reusable Astro components.

## CSS architecture

The global entry point is:

```text
src/assets/css/style.css
```

It imports CSS in these broad layers:

```text
Foundation
    ↓
Layout
    ↓
UI
    ↓
Homepage
    ↓
Components
    ↓
Pages
```

## Design tokens

Global tokens are defined in:

```text
src/assets/css/base/variables.css
```

The system includes tokens for:

- brand colors
- neutral colors
- surfaces
- text
- borders
- typography
- spacing
- radius
- shadows
- layout widths
- breakpoints
- motion
- z-index
- content measures
- opacity

The spacing scale follows an 8px rhythm.

## Typography

The design system uses Inter as the base and heading font family and JetBrains Mono for code.

Typography is expressed through semantic role tokens such as:

```text
--font-h1
--font-h2
--font-h3
--font-body
--font-body-lg
--font-caption
```

## Theme

Light and dark semantic tokens are defined in:

```text
src/assets/css/base/variables.css
```

Dark mode is activated with:

```text
[data-theme="dark"]
```

## Components

Reusable components include:

- buttons
- cards
- badges
- technology chips
- article cards
- callouts
- panels
- category cards
- learning path cards
- Quick Summary
- Reading Progress
- Table of Contents
- References
- Related Articles
- Technology Stack
- Comparison Table
- Planner Fit Check
- Work Management Journey
- consent banner

## Article-specific presentation

The article experience includes:

- Reader's Toolkit
- Table of Contents
- reading progress
- Quick Summary
- technology metadata
- references
- related articles
- code blocks
- callouts
- reusable comparison tables

## Tables

The reusable comparison table component is:

```text
src/components/content/ComparisonTable.astro
```

Its styles are:

```text
src/assets/css/components/comparison-table.css
```

The component is designed for future articles rather than being tied to one table.

On desktop it is designed to fit the article presentation without forcing horizontal scrolling; smaller screens can use horizontal overflow where necessary.

## Accessibility

Accessibility is a project-level design requirement.

The site includes:

- skip-to-main-content link
- semantic headings
- keyboard-operable navigation
- keyboard search shortcuts
- focus-visible states
- accessible labels
- reduced reliance on pointer-only interactions
- theme control with accessible labels

Accessibility testing is part of normal QA.

## Favicon and brand assets

Brand assets are stored in:

```text
public/favicon/
public/logo/
```

The current favicon URL is:

```text
/favicon/favicon.ico
```

The favicon path is intentionally root-relative so nested article routes use the same asset.
