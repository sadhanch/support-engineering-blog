# SEDS Design Tokens

> Design tokens are the single source of truth for the visual language of SEDS.

---

# Overview

The Support Engineering Design System (SEDS) uses CSS Custom Properties (Design Tokens) to ensure visual consistency across the entire project.

Instead of hardcoding colors, spacing, typography, or shadows directly into components, reusable design tokens are defined once and referenced throughout the codebase.

This approach improves:

- Consistency
- Maintainability
- Scalability
- Theme customization

Design tokens should always be preferred over literal values.

---

# Token Philosophy

Every visual decision should originate from a design token.

Instead of writing:

```css
padding: 32px;
```

Use:

```css
padding: var(--space-8);
```

Instead of:

```css
color: #2563EB;
```

Use:

```css
color: var(--primary);
```

This creates a single source of truth for the entire design system.

---

# Token Categories

SEDS organizes design tokens into six categories.

1. Colors
2. Typography
3. Spacing
4. Border Radius
5. Shadows
6. Layout

---

# Colors

Color communicates meaning.

It should never be used purely for decoration.

## Primary

Used for:

- Buttons
- Links
- Active navigation
- Interactive elements

Example:

```css
--primary
```

---

## Surface

Used for:

- Cards
- Toolkits
- Containers
- Tables

Example:

```css
--surface-primary
--surface-secondary
```

---

## Text

Defines typography hierarchy.

Examples:

```css
--text-primary
--text-secondary
--text-muted
```

---

## Borders

Used to create separation without visual noise.

Example:

```css
--border-default
```

---

## Semantic Colors

These colors communicate status.

Examples:

```css
--success
--warning
--danger
--info
```

Use semantic colors only when they reinforce meaning.

---

# Typography

Typography is the foundation of SEDS.

The interface is intentionally typography-first.

## Font Family

Primary font:

System UI Stack

Reasons:

- Excellent readability
- Fast loading
- Native platform appearance

---

## Font Scale

Heading hierarchy should remain consistent.

Example:

```
H1

Largest heading

H2

Section heading

H3

Subsection

Body

Default reading text

Caption

Supporting information
```

Avoid skipping heading levels.

---

## Font Weight

Use weight to create hierarchy rather than visual decoration.

Typical usage:

- Bold for headings
- Medium for emphasis
- Regular for body text

---

## Line Height

Reading comfort is prioritized over content density.

Paragraph spacing should encourage uninterrupted reading.

---

# Spacing

Spacing creates rhythm.

It is one of the defining characteristics of SEDS.

Spacing tokens should always be used.

Example:

```css
--space-2
--space-4
--space-6
--space-8
--space-10
```

Spacing should remain consistent between:

- Sections
- Cards
- Tables
- Callouts
- Images

Avoid arbitrary spacing values.

---

# Border Radius

Rounded corners provide subtle visual softness.

Examples:

```css
--radius-sm
--radius-md
--radius-lg
```

Border radius should remain consistent across components.

Avoid creating custom radius values inside components.

---

# Shadows

Shadows establish visual depth.

SEDS intentionally uses subtle shadows.

Purpose:

- Separate surfaces
- Improve visual hierarchy

Avoid decorative shadows.

---

# Layout

Layout tokens define page structure.

Examples include:

- Content width
- Grid spacing
- Responsive breakpoints

Layout decisions should remain centralized whenever possible.

---

# Best Practices

✓ Always use design tokens.

✓ Avoid hardcoded values.

✓ Reuse existing tokens before introducing new ones.

✓ Document new tokens.

✓ Remove unused tokens during major releases.

---

# Anti-Patterns

Avoid:

```css
margin-top: 37px;
```

Instead:

```css
margin-top: var(--space-8);
```

---

Avoid:

```css
color: #444444;
```

Instead:

```css
color: var(--text-secondary);
```

---

Avoid:

Creating duplicate tokens with similar purposes.

Every token should have a clearly defined responsibility.

---

# Future Enhancements

Potential additions include:

- Dark Mode tokens
- Print theme tokens
- High contrast accessibility theme
- Motion tokens
- Elevation levels

The existing token system is designed to accommodate future themes without changing component code.

---

# Key Decisions

- CSS Custom Properties serve as the single source of truth.
- Components consume tokens rather than defining visual values.
- Typography and spacing are treated as first-class design elements.
- Semantic colors communicate meaning instead of decoration.
- Token names describe purpose rather than appearance.
