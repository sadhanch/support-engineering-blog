# SEDS Folder Structure

> A well-organized project is easier to understand, maintain, and extend.

---

# Overview

The Support Engineering Blog follows a modular project structure designed around the principles of separation of concerns and maintainability.

Each directory has a clearly defined responsibility.

The goal is to ensure that every file has an obvious home and every future addition fits naturally into the existing structure.

---

# Project Structure

```text
support-engineering-blog/

├── docs/
├── src/
├── dist/
├── .gitignore
├── LICENSE
└── README.md
```

---

# Root Directory

## docs/

Contains all project documentation.

This includes:

- Design Manifesto
- Architecture
- Component Library
- Design Tokens
- Accessibility
- Roadmap
- Changelog

This folder explains the project rather than implementing it.

---

## src/

The source code for the project.

All development happens here.

This directory contains:

- HTML
- CSS
- Images
- JavaScript

Think of this as the working version of SEDS.

---

## dist/

Contains deployment-ready files.

Examples include:

- Blogger Theme XML
- Production CSS
- Optimized assets

This folder is generated from the source and should not be edited directly.

---

# Source Directory

```text
src/

├── assets/
├── index.html
├── article.html
├── about.html
└── search.html
```

---

## assets/

Contains reusable project assets.

```text
assets/

├── css/
├── images/
├── js/
└── fonts/
```

---

# CSS Structure

The CSS architecture follows a layered design.

```text
css/

├── base/
├── layout/
├── components/
├── pages/
└── utilities/
```

---

## base/

Provides global foundations.

Files include:

- variables.css
- reset.css
- typography.css
- base.css

These files should affect the entire project.

---

## layout/

Defines the site's structural layout.

Examples:

- header.css
- footer.css
- grid.css

Layout files position components but do not define component behavior.

---

## components/

Contains reusable UI components.

Examples:

- buttons.css
- cards.css
- tables.css
- callouts.css
- badges.css
- references.css

Each component should have a single responsibility.

Whenever possible, new UI elements should receive their own component file.

---

## pages/

Contains page-specific layout rules.

Examples:

- homepage.css
- article.css
- about.css

These files arrange components rather than redefine them.

---

## utilities/

Contains helper classes.

Examples:

- text alignment
- spacing helpers
- display utilities

Utilities should remain generic and reusable.

---

# Images

Images are organized by purpose rather than file type.

```text
images/

├── articles/
├── logos/
├── icons/
├── ui/
└── backgrounds/
```

This organization makes assets easier to locate as the project grows.

---

# JavaScript

JavaScript should remain modular.

Future structure:

```text
js/

├── navigation.js
├── search.js
├── article.js
└── utilities.js
```

Scripts should focus on behavior rather than presentation.

---

# Development Workflow

The recommended workflow is:

```
Design
        ↓

Develop in src/
        ↓

Review
        ↓

Test
        ↓

Generate dist/
        ↓

Deploy to Blogger
```

The `src` directory is always the source of truth.

---

# Naming Conventions

Use descriptive names.

Good examples:

- article-content.css
- reader-toolkit.css
- related-articles.css

Avoid generic names such as:

- styles.css
- page.css
- box.css
- misc.css

File names should clearly communicate their purpose.

---

# Best Practices

When adding new files:

✓ One responsibility per file

✓ Use existing design tokens

✓ Prefer reusable components

✓ Keep page-specific code inside the `pages` directory

✓ Update the documentation when introducing new components

---

# Key Decisions

- Organized CSS by responsibility instead of page.
- Separated reusable components from page layouts.
- Treated `src` as the development workspace and `dist` as the deployment package.
- Organized images by purpose to support long-term scalability.
- Reserved the `docs` directory for project knowledge rather than implementation.
