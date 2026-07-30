# SEDS Framework Specification
Version: 1.0.0

---

# 1. Introduction

## What is SEDS?

The **Support Engineering Design System (SEDS)** is a modular framework for building Blogger themes.

Instead of maintaining a single monolithic Blogger XML template, SEDS separates the theme into independent architectural layers that are assembled into a valid Blogger theme during the build process.

The framework promotes modularity, maintainability, reusability, and engineering best practices while remaining fully compatible with the Blogger platform.

---

# 2. Design Goals

SEDS is built around the following principles:

- Modularity
- Separation of Concerns
- Maintainability
- Reusability
- Accessibility
- Semantic HTML
- Predictable Architecture
- Standards-Compliant Blogger XML

---

# 3. Core Architecture

```
               SEDS Framework

                    │
                    ▼

              Theme Layer
          (Document Shell)

                    │
                    ▼

            Metadata Layer

                    │
                    ▼

            Variables Layer

                    │
                    ▼

             Layout Layer

                    │
                    ▼

          Widget Library Layer

                    │
                    ▼

          Individual Widgets

                    │
                    ▼

          Generated Blogger Theme
```

Each layer owns one responsibility.

---

# 4. Folder Structure

```
src/

├── assets/

└── templates/

    ├── theme/
    │      theme.xml

    ├── metadata/
    │      metadata.xml

    ├── variables/
    │      variables.xml

    ├── layout/
    │      layout.xml

    └── widgets/

           widgets.xml

           header.xml
           blog.xml
           pagelist.xml
```

This is the canonical folder structure for SEDS v1.0.

---

# 5. Layer Responsibilities

## Theme Layer

### Responsibilities

- XML declaration
- DOCTYPE
- XHTML document
- `<html>`
- `<head>`
- `<body>`
- Build placeholders

### Does Not Own

- Widgets
- Layout
- Blogger sections
- Page rendering

---

## Metadata Layer

Responsible for reusable metadata inside the `<head>` element.

Examples include:

- Character encoding
- Viewport
- SEO metadata
- Open Graph
- Twitter Cards

---

## Variables Layer

Responsible only for Blogger Theme Variables.

It must not contain:

- HTML
- CSS
- Layout
- Widget logic

---

## Layout Layer

Responsible for page structure.

It answers the question:

> Where should widgets appear?

Responsibilities include:

- Semantic HTML
- Blogger Sections
- Widget Placement

---

## Widget Library

Responsible for collecting widget definitions.

It does not determine widget placement.

---

## Widgets

Widgets are responsible for rendering content.

Examples include:

- Header
- Blog
- PageList
- Labels
- Profile
- Search

---

# 6. Widget Contract

Every widget must implement the following contract.

## Public Entry Point

Every widget exposes exactly one public includable.

```
main
```

---

## Internal Pipeline

Widgets may contain additional internal includables.

Example:

```
main

↓

content

↓

items

↓

item
```

Internal includables are considered implementation details and may evolve independently.

---

## Widget Independence

Widgets must never directly depend on another widget.

Widgets communicate only through:

- Blogger Data
- Blogger Sections
- Layout

---

# 7. Layout Contract

The layout defines the page structure.

```
Header

↓

Main

├── Content

└── Sidebar

↓

Footer
```

Each region contains Blogger Sections.

Widgets occupy those sections.

---

# 8. Build Pipeline

```
Validate

↓

Build CSS

↓

Assemble Theme

    Theme

        ↓

    Metadata

        ↓

    Variables

        ↓

    Widget Library

        ↓

    Layout

        ↓

    CSS

↓

Verify

↓

build/theme.xml
```

---

# 9. Engineering Principles

## Single Responsibility

Every file owns exactly one responsibility.

---

## Explicit Ownership

Every feature belongs to exactly one architectural layer.

---

## Semantic HTML

Use semantic HTML wherever possible.

Preferred elements include:

- `<header>`
- `<main>`
- `<aside>`
- `<footer>`

---

## Modular Widgets

Widgets should be independently maintainable.

---

## Build-Time Composition

All template assembly occurs during the build process.

No SEDS placeholders exist in the generated Blogger theme.

---

## Blogger Compatibility

Generated output must always produce valid Blogger XML.

---

# 10. Extension Points

Future versions of SEDS may introduce:

- Multiple Layout Profiles
- Widget Extensions
- Framework Modules
- XML Optimization
- Theme Linting
- Design Token Generation
- Multi-Theme Builds

These features should extend the framework without breaking existing architecture.

---

# 11. Versioning

SEDS follows Semantic Versioning.

## Major Version

Breaking architectural changes.

Examples:

- New framework contracts
- Folder restructuring
- Build pipeline redesign

Example:

```
2.0.0
```

---

## Minor Version

Backward-compatible enhancements.

Examples:

- New widgets
- New build features
- Additional layouts

Example:

```
1.2.0
```

---

## Patch Version

Bug fixes and documentation updates.

Examples:

- XML validation fixes
- Documentation improvements
- Build fixes

Example:

```
1.0.3
```

---

# 12. Architectural Principles

The SEDS framework is governed by the following principles.

1. One file, one responsibility.

2. One layer, one purpose.

3. Layout defines structure.

4. Widgets define presentation.

5. Theme defines the document shell.

6. The build system assembles the final Blogger theme.

7. The generated output must always be standards-compliant Blogger XML.

---

# 13. Roadmap

## Phase 1

Core Framework

- Theme
- Layout
- Widget Library

---

## Phase 2

Core Widgets

- Header
- Blog
- PageList

---

## Phase 3

Platform Widgets

- Labels
- Profile
- Search
- Archive
- Popular Posts

---

## Phase 4

Framework Enhancements

- Theme Profiles
- Extensions
- XML Optimizer
- Theme Linter
- Multi-Theme Support

---

# Conclusion

SEDS is designed as a modular engineering framework for Blogger theme development.

By separating responsibilities into independent architectural layers, SEDS enables maintainable, extensible, and standards-compliant Blogger themes while providing a consistent development experience for framework users and contributors.