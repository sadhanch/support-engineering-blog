# SEDS Documentation

## Purpose

This directory contains the engineering documentation for the **SEDS Blogger Theme** project.

The goal of this documentation is to describe the Blogger theme as a software system rather than a collection of XML files. Every architectural decision, reverse engineering discovery, and implementation change should be documented alongside the source code.

---

# Documentation Principles

## 1. Evidence First

Documentation must always distinguish between:

| Type | Description |
|------|-------------|
| **Fact** | Directly observable from the Blogger theme. |
| **Inference** | A conclusion derived from one or more facts. |
| **Decision** | A design choice made by the SEDS project. |
| **Assumption** | A hypothesis that requires further validation. |

Facts should always be preferred over inference.

---

## 2. Documentation Before Refactoring

Before modifying an existing Blogger component:

1. Understand it.
2. Document it.
3. Review it.
4. Refactor it.
5. Validate it.

No architectural change should occur without corresponding documentation.

---

## 3. Preserve Blogger's Public Contract

The project intentionally preserves Blogger's widget contracts wherever possible.

This includes:

- Widget declarations
- Required widget attributes
- Public includable entry points
- Blogger runtime expectations

Internal implementation may be reorganized, but public behavior should remain compatible.

---

## 4. Small, Reversible Changes

Refactoring should be incremental.

Each change should:

- Have a single responsibility.
- Be independently testable.
- Be uploadable to Blogger.
- Be reversible.

---

## 5. Living Documentation

Documentation evolves alongside the project.

Changes to architecture should be reflected in the relevant documentation as part of the same work.

---

# Repository Structure

```text
docs/
├── README.md
├── architecture/
├── decisions/
├── development/
├── notes/
└── widgets/
```

Each directory has a distinct purpose.

## architecture/

Describes the structure and behavior of the Blogger theme.

## decisions/

Contains Architecture Decision Records (ADRs).

## development/

Contains contributor guides, testing procedures, and coding standards.

## notes/

Chronological investigation notes and reverse engineering discoveries.

## widgets/

Widget-specific documentation.

---

# Documentation Workflow

Every significant feature should follow this lifecycle:

```text
Study
    ↓
Document
    ↓
Design
    ↓
Review
    ↓
Implement
    ↓
Validate
    ↓
Commit
```

---

# Goals

The long-term objective of this documentation is to ensure that the SEDS Blogger Theme can be understood, maintained, and extended without requiring future contributors to reverse engineer Blogger's internal widget implementation from scratch.