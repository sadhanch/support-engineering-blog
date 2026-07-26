# Blogger Component Mapping

> Mapping SEDS components to Blogger's native architecture.

---

# Overview

This document defines how the Support Engineering Design System (SEDS) integrates with the Blogger platform.

Rather than replacing Blogger's core functionality, SEDS enhances its presentation while preserving native widgets and dynamic content.

---

# Component Mapping

| SEDS Component | Blogger Feature | Status | Notes |
|----------------|-----------------|--------|-------|
| Header            | `Header1`                  | ✅ Identified     | Native Blogger Header widget   |
| Search            | `BlogSearch1`              | ✅ Identified     | Native search widget           |
| Article Rendering | `Blog1`                    | ✅ Identified     | Primary content renderer       |
| Dynamic Posts     | `data:posts` loop          | ✅ Identified     | Used for homepage and articles |
| Article Title     | `data:post.title`          | ✅ Identified     | Dynamic content                |
| Article Body      | `data:post.body`           | ✅ Identified     | Dynamic content                |
| Sidebar           | Profile / Archive / Labels | ✅ Identified     | Optional widgets               |
| Blog Content         | `Blog1` (`type='Blog'`) | ✅ Identified     | Primary widget responsible for rendering posts and listings       |
| Blog Rendering       | `main` includable       | ✅ Identified     | Entry point for Blog widget rendering                             |
| Widget Configuration | `widget-settings`       | ✅ Identified     | Controls Blogger features such as labels, timestamps, and sharing |
| Main Navigation   | `Page List (Top)`          | ✅ Identified     | Navigation section             |
| Footer            | Footer section             | ✅ Identified     | Attribution + Report Abuse     |

---

## Header Integration Strategy

### Blogger Responsibilities

- Stores blog title
- Stores blog description
- Stores favicon
- Provides Header widget configuration

### SEDS Responsibilities

- Custom logo presentation
- Navigation styling
- Responsive layout
- Branding
- Visual hierarchy

### Integration Principle

Keep Blogger as the source of data.
Use SEDS as the source of presentation.

---

# Key Decisions

(To be completed during implementation.)
