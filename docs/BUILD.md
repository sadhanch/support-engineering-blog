# Support Engineering Blog Builder

## Overview

The Support Engineering Blog Builder is a modular build pipeline that transforms the Support Engineering Design System (SEDS) into a deployable Blogger theme.

Instead of manually copying CSS into Blogger, the build system compiles source files, injects them into a Blogger template, validates the output, and generates a production-ready `theme.xml`.

The entire build process is executed with a single command:

```bash
npm run build
```

---

# Build Pipeline

The builder executes the following stages:

```
Validation
    │
    ▼
CSS Compilation
    │
    ▼
Theme Generation
    │
    ▼
Output Verification
    │
    ▼
Build Complete
```

Each stage has a single responsibility.

---

# Project Structure

```
scripts/
│
├── build.js
├── validate.js
├── build-css.js
├── build-theme.js
├── verify.js
│
└── lib/
    ├── banner.js
    ├── config.js
    ├── logger.js
    └── utils.js
```

---

# Module Responsibilities

## build.js

Acts as the build orchestrator.

Responsibilities:

- Starts the build
- Executes each stage
- Handles errors
- Displays build information

This file intentionally contains very little implementation logic.

---

## validate.js

Performs pre-build validation.

Checks include:

- CSS entry file exists
- Theme template exists
- Required placeholders exist

If validation fails, the build stops immediately.

---

## build-css.js

Compiles the Design System.

Responsibilities:

- Resolve recursive `@import` statements
- Generate the build banner
- Produce `build/blogger.css`
- Return build metadata

Output:

```javascript
{
    css,
    output,
    files,
    size,
    elapsed
}
```

---

## build-theme.js

Generates the Blogger theme.

Responsibilities:

- Read `theme.xml`
- Replace `{{BLOGGER_CSS}}`
- Generate `build/theme.xml`

---

## verify.js

Performs post-build verification.

Checks include:

- Generated theme exists
- Theme is not empty
- CSS placeholder was replaced
- Opening `<b:skin>` tag exists
- Closing `</b:skin>` tag exists

Verification ensures that the generated theme is structurally correct before deployment.

---

# Shared Library

The `lib` directory contains reusable modules shared across the build pipeline.

## config.js

Centralized project configuration.

Contains:

- project metadata
- version information
- build paths

---

## utils.js

Reusable helper functions.

Examples:

- Read files
- Write files
- Ensure directories exist
- Format file sizes

---

## banner.js

Generates the build banner inserted at the top of every compiled stylesheet.

Example:

```
/*==========================================
 Support Engineering Blog
 Version : 1.0.0
 Build   : 2026-07-27T14:08:46Z
==========================================*/
```

---

## logger.js

Provides consistent console output.

Examples:

```
logger.header()
logger.section()
logger.info()
logger.success()
logger.error()
```

Centralizing logging keeps the build output consistent across every module.

---

# Design Principles

The build system follows several engineering principles.

## Single Responsibility

Each module performs one job.

Examples:

- CSS compilation
- Theme generation
- Validation
- Verification

---

## Separation of Concerns

Implementation details remain inside their own modules.

The build orchestrator only coordinates the build stages.

---

## Fail Fast

The builder validates both inputs and outputs.

The build should never silently generate an invalid Blogger theme.

---

## Trust the Pipeline

The build system verifies its own output.

Manual inspection should be used for development, not as part of the normal build process.

---

# Build Lifecycle

```
Source Files
      │
      ▼
Validation
      │
      ▼
Compile CSS
      │
      ▼
Generate Theme
      │
      ▼
Verify Output
      │
      ▼
Deploy
```

---

# Future Improvements

Planned enhancements include:

- XML validation
- Additional placeholder verification
- Build summaries
- Release packaging
- Minification
- Automatic versioning
- Deployment automation

---

# Engineering Philosophy

The Support Engineering Blog Builder is intentionally designed as a maintainable engineering project rather than a collection of build scripts.

The objective is not simply to generate a Blogger theme, but to provide a reliable, repeatable, and verifiable build process.

Every stage of the pipeline should be:

- Predictable
- Modular
- Testable
- Easy to debug
- Easy to extend

A successful build is not enough.

A successful build must also be trustworthy.