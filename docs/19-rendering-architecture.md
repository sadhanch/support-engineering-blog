# SEDS Rendering Architecture

**Document Version:** 1.0.0  
**Status:** Draft  
**Applies To:** SEDS Framework

---

# 1. Purpose

The Rendering Architecture defines how the Support Engineering Design
System (SEDS) transforms Blogger's data model into semantic HTML using
a layered rendering pipeline.

Unlike traditional Blogger themes where rendering logic, page routing,
and HTML generation are tightly coupled, SEDS separates these concerns
into independent architectural layers.

This separation provides:

- Better maintainability
- Improved readability
- Component reusability
- Predictable rendering behavior
- Easier long-term evolution

---

# 2. Core Philosophy

SEDS follows one fundamental principle:

> Blogger provides the data.
> SEDS defines the presentation.
> CSS defines the appearance.

Each layer has exactly one responsibility.

Blogger is responsible for exposing the data model.

SEDS is responsible for deciding how that data should be rendered.

The CSS design system is responsible for how the rendered HTML looks.

No layer should perform the responsibilities of another.

---

# 3. Rendering Pipeline

Every request follows the same rendering pipeline.

```
Blogger Request
        │
        ▼
     Router
        │
        ▼
     Layout
        │
        ▼
     Sections
        │
        ▼
     Renderers
        │
        ▼
      HTML
        │
        ▼
       CSS
```

Each stage transforms the request before passing it to the next stage.

---

# 4. Architectural Layers

## 4.1 Router

### Responsibility

Determine which page Blogger is requesting.

The router performs no rendering.

It only selects the appropriate layout.

### Inputs

- Blogger page context
- Blogger view type

### Outputs

A layout renderer.

Examples:

- Homepage
- Article
- Archive
- Search
- Static Page
- Error Page
- Preview

---

## 4.2 Layout

### Responsibility

Define the overall structure of the page.

A layout determines how major page regions are arranged.

A layout never renders individual UI elements.

### Examples

Homepage Layout

```
Header

Post List

Pagination

Footer
```

Article Layout

```
Header

Article

Sidebar

Footer
```

Archive Layout

```
Header

Archive Listing

Pagination

Footer
```

---

## 4.3 Sections

Sections divide a layout into logical regions.

Each section owns one area of the page.

Example

```
Article Layout

├── Article Header
├── Article Body
└── Article Footer
```

Sections coordinate renderers but contain very little rendering logic.

---

## 4.4 Renderers

Renderers generate semantic HTML.

Each renderer has one responsibility.

Examples

- metadataRenderer
- authorRenderer
- labelsRenderer
- commentsRenderer
- newsletterRenderer
- referencesRenderer

Renderers never determine page routing.

Renderers never control page layout.

---

## 4.5 HTML

Renderers generate semantic HTML.

Example

```html
<article class="article">

    <header class="article-header">

    </header>

    <section class="article-content">

    </section>

    <footer class="article-footer">

    </footer>

</article>
```

The HTML structure is defined by SEDS.

Not by Blogger.

---

## 4.6 CSS

The CSS Design System controls presentation.

The rendering architecture never concerns itself with:

- colors
- spacing
- typography
- animation

Those belong exclusively to CSS.

---

# 5. Composition Model

Pages are composed from layouts.

Layouts are composed from sections.

Sections are composed from renderers.

Renderers generate HTML.

```
Layout

│

├── Section

│       ├── Renderer

│       ├── Renderer

│       └── Renderer

│

├── Section

│       ├── Renderer

│       ├── Renderer

│       └── Renderer

│

└── Section

        ├── Renderer

        └── Renderer
```

This composition model is used throughout SEDS.

---

# 6. Example Composition

Article Page

```
Article Layout

│

├── Article Header

│       ├── Title Renderer

│       ├── Metadata Renderer

│       ├── Featured Image Renderer

│       └── Badge Renderer

│

├── Article Body

│       ├── Content Renderer

│       ├── Callout Renderer

│       ├── Code Block Renderer

│       ├── Table Renderer

│       └── References Renderer

│

└── Article Footer

        ├── Labels Renderer

        ├── Share Renderer

        ├── Author Renderer

        ├── Related Articles Renderer

        ├── Newsletter Renderer

        └── Comments Renderer
```

Each renderer has a single responsibility.

---

# 7. Design Rules

## Rule 1

Every renderer has one responsibility.

---

## Rule 2

Routing contains no HTML.

---

## Rule 3

Layouts define structure only.

---

## Rule 4

Sections compose renderers.

---

## Rule 5

Renderers generate semantic HTML.

---

## Rule 6

CSS controls presentation.

XML never controls appearance.

---

## Rule 7

Blogger data is never modified.

Only rendered.

---

## Rule 8

Widgets never render other widgets.

Communication happens only through Blogger's rendering pipeline.

---

## Rule 9

Every includable must have a descriptive name.

Good

- articleHeader
- metadataRenderer
- authorRenderer

Avoid

- helper1
- renderStuff
- content2

---

# 8. Naming Standards

## Layouts

```
homepageLayout

articleLayout

archiveLayout

searchLayout

pageLayout

errorLayout
```

---

## Sections

```
articleHeader

articleBody

articleFooter
```

---

## Renderers

```
titleRenderer

metadataRenderer

featuredImageRenderer

contentRenderer

referencesRenderer

labelsRenderer

authorRenderer

shareRenderer

commentsRenderer

newsletterRenderer
```

---

# 9. Extension Points

The rendering pipeline reserves extension points for future features.

```
Before Header

After Header

Before Content

After Content

Before Footer

After Footer
```

Future capabilities may include:

- AI summaries
- Reading progress
- Related articles
- Advertisements
- Newsletter prompts
- Custom widgets

These features should integrate through extension points instead of
modifying the rendering pipeline.

---

# 10. Benefits

The SEDS Rendering Architecture provides:

- Clear separation of responsibilities
- Predictable rendering flow
- Modular implementation
- Easier maintenance
- Improved readability
- Reusable rendering units
- Extensible architecture
- Consistent HTML generation
- Better documentation
- Long-term scalability

---

# 11. Relationship to Other Documents

This document complements:

- Design Manifesto
- Widget Contracts
- SEDS Architecture
- Engineering Principles
- Blogger Component Mapping

Together these documents define the engineering foundation of SEDS.

---

# 12. Summary

SEDS treats Blogger as a rendering platform rather than a template
engine.

Blogger supplies the data.

The rendering architecture transforms that data into semantic HTML.

The CSS Design System transforms the HTML into a consistent visual
experience.

Each layer has a single responsibility.

Each responsibility is independently maintainable.

This architecture forms the foundation for every widget implemented
within SEDS.