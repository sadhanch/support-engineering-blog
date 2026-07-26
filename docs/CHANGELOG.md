# Changelog

All notable changes to this project will be documented in this file.

The format is inspired by Keep a Changelog and follows Semantic Versioning where applicable.

---

## [0.3.0] - 2026-07-27

### Added
- Introduced a Node.js-based development environment for the project.
- Initialized npm and added `package.json` for project automation.
- Created dedicated `build/` directory for generated assets.
- Created `scripts/` directory for custom build automation.
- Added the first custom build script (`build-css.js`) to compile Blogger CSS.
- Added Blogger CSS entry point (`blogger.css`) to serve as the single source for Blogger-specific styles.

### Changed
- Established a source-to-build workflow:
  - `src/` → source files
  - `scripts/` → automation
  - `build/` → generated output
- Updated project architecture to support automated CSS compilation instead of manual stylesheet management.
- Standardized the project around a single working directory after consolidating duplicate local repositories.

### Fixed
- Resolved development environment inconsistency caused by maintaining duplicate project folders.
- Verified Git, GitHub, VS Code, Node.js, and npm are all operating from the same repository.

### Developer Experience
- Added the first `npm run build` workflow.
- Successfully automated generation of a Blogger-ready stylesheet from modular CSS files.

---

## [0.2.0] - 2026-07-26

### Added
- Introduced Blogger-specific CSS architecture.
- Created dedicated `blogger/` stylesheet layer to isolate Blogger customizations from the core design system.
- Added modular Blogger stylesheets:
  - `blogger-base.css`
  - `blogger-layout.css`
  - `blogger-header.css`
  - `blogger-navigation.css`
  - `blogger-article.css`

### Changed
- Refined the project architecture by separating platform-independent SEDS components from Blogger integration.
- Adopted an adapter-layer approach where Essential Light provides functionality and SEDS provides presentation.

### Improved
- Preserved native Blogger functionality including:
  - Sticky header
  - Search behavior
  - Responsive navigation
  - Overflow menu
  - Widget architecture

---

## [0.1.0] - 2026-07-25

### Added
- Established the Support Engineering Design System (SEDS) project structure.
- Created a modular CSS architecture with dedicated folders for:
  - Base
  - Layout
  - Components
  - Pages
  - Utilities
- Designed the initial branding and visual identity for the Support Engineering Blog.
- Completed homepage structure and major page layouts.
- Implemented article layout, Reader Toolkit, search page, and footer.
- Added reusable UI components for cards, categories, navigation, and content presentation.

### Changed
- Reorganized the project into a scalable, documentation-first architecture.
- Standardized spacing, typography, and reusable design tokens across the project.

### Documentation
- Established the project as a documentation-focused platform for Microsoft 365 administrators, support engineers, and IT professionals.
