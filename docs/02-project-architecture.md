# SEDS Project Architecture

> A maintainable architecture is one that future you can understand without guessing.

---

# Overview

Support Engineering Blog is built around the **Support Engineering Design System (SEDS)**.

Rather than treating the website as a collection of individual pages, SEDS organizes the project into reusable layers that separate design, layout, components, and content.

This modular architecture improves maintainability, scalability, and consistency while making future enhancements easier to implement.

---

# Architecture Overview

```
                Blogger
        (Content Management)

                │
                ▼

        HTML Page Templates

                │
                ▼

      Support Engineering
        Design System

                │
                ▼

        Modular Components

                │
                ▼

         Design Tokens

                │
                ▼

            CSS Variables
```

Every layer has a single responsibility.

---

# Design Principles

The architecture follows five engineering principles.

## Separation of Concerns

Each file has a single responsibility.

Examples:

- Typography belongs in `typography.css`
- Tables belong in `tables.css`
- Buttons belong in `buttons.css`

This prevents unrelated changes from affecting multiple parts of the system.

---

## Modularity

Every component should be reusable.

Components are designed to work independently of individual pages.

Examples include:

- Reader Toolkit
- Callouts
- Tables
- Badges
- References

The same component should be usable on any page without modification.

---

## Scalability

New components should integrate into the project without requiring architectural changes.

Future additions such as:

- Breadcrumbs
- Timeline Components
- Resource Cards
- FAQ Blocks

should fit naturally into the existing structure.

---

## Consistency

Visual consistency is achieved through shared design tokens.

Instead of hard-coded values, components rely on CSS variables for:

- Colors
- Typography
- Spacing
- Border Radius
- Shadows

This creates a unified visual language throughout the project.

---

## Maintainability

The project favors readable code over clever code.

Future contributors - including the original author - should be able to understand the project structure quickly.

Maintainability is treated as a feature rather than an afterthought.

---

# Project Structure

```
support-engineering-blog/

├── docs/
│
├── src/
│
│   ├── assets/
│   │
│   ├── css/
│   │
│   │   ├── base/
│   │   ├── layout/
│   │   ├── components/
│   │   ├── pages/
│   │   └── utilities/
│   │
│   ├── images/
│   ├── js/
│   │
│   ├── index.html
│   ├── article.html
│   ├── search.html
│   └── about.html
│
├── dist/
│
└── README.md
```

---

# CSS Architecture

The CSS architecture follows a layered approach.

```
Design Tokens
        │
        ▼

Base Styles
        │
        ▼

Layout
        │
        ▼

Components
        │
        ▼

Pages
```

Each layer depends only on the layers below it.

This reduces unnecessary coupling between components.

---

## Base

Provides project-wide foundations.

Includes:

- Variables
- Reset
- Typography
- Base styles

Every page depends on these files.

---

## Layout

Defines the site's structural framework.

Examples:

- Header
- Footer
- Grid

Layout files should never contain component-specific styling.

---

## Components

The largest part of the project.

Each component lives in its own file.

Examples include:

- Buttons
- Cards
- Tables
- Callouts
- Reader Toolkit
- References
- Author Card

Components should remain independent of page layouts whenever possible.

---

## Pages

Page-level files define layout relationships between components.

Examples:

- Homepage
- Article
- About

These files position components but do not redefine them.

---

## Utilities

Utility classes provide small reusable behaviors.

Examples include:

- Spacing helpers
- Text alignment
- Display utilities

Utilities should remain generic and reusable.

---

# HTML Philosophy

HTML should describe content.

It should not describe presentation.

Examples:

Good:

```html
<article class="callout">
```

Poor:

```html
<div class="blue-box">
```

Semantic HTML improves accessibility, maintainability, and readability.

---

# Blogger Integration

SEDS treats Blogger as the content management system rather than the design system.

Responsibilities are clearly separated.

### Blogger manages

- Posts
- Labels
- Search
- Archives
- Publication Dates

### SEDS manages

- Layout
- Components
- Typography
- Responsive behavior
- Design tokens

This separation allows the design system to evolve independently of the publishing platform.

---

# Future Architecture

SEDS is designed to support future growth.

Potential additions include:

- Dark Mode
- Resource Library
- Interactive Components
- Print Styles
- Static Site Generation

The existing architecture is intended to accommodate these enhancements without significant restructuring.

---

## Key Decisions

- Adopted a modular CSS architecture with one responsibility per file.
- Organized styles into Base, Layout, Components, Pages, and Utilities.
- Used CSS custom properties as the single source of truth for design tokens.
- Kept SEDS independent of Blogger to allow future platform migration.

---

# Conclusion

The goal of SEDS is not simply to create a website.

Its purpose is to establish a reusable design system that makes technical documentation easier to build, easier to maintain, and easier to trust.

Good architecture should disappear behind the experience it enables.

SEDS aims to achieve exactly that.
