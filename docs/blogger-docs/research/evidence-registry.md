---
title: Evidence Registry
version: 1.0
status: Living Document
last_updated: 2026-07-30
---

# Evidence Registry

## Purpose

This document records every verified technical fact discovered during the reverse engineering of the Blogger Blog widget.

Each fact:

- has a unique identifier,
- references its investigation,
- can be cited by architecture documents,
- can justify Architecture Decision Records (ADRs).

Facts should only be recorded when directly supported by the Essential Light source.

---

# Fact Format

Every fact follows this structure.

## Fact ID

F-XXX-YYY

Example:

F-005-003

Where:

- 005 = Investigation ID
- 003 = Fact number

---

## Fact Entry Template

### F-XXX-YYY

**Investigation**

INV-XXX

**Statement**

...

**Evidence**

```xml
...
```

**Confidence**

High

**Referenced By**

-

---

# Verified Facts

## F-001-001

**Investigation**

INV-001

**Statement**

The Blog widget entry point is the `main` includable.

**Confidence**

High

---

## F-001-002

**Investigation**

INV-001

**Statement**

The `main` includable delegates rendering using `super.main`.

**Confidence**

High

---

## F-002-001

**Investigation**

INV-002

**Statement**

`aboutPostAuthor` renders the author's profile hyperlink.

**Confidence**

High

---

## F-003-001

**Investigation**

INV-003

**Statement**

`addComments` renders the "Post a Comment" hyperlink.

**Confidence**

High

---

## F-004-001

**Investigation**

INV-004

**Statement**

`commentAuthorAvatar` renders a fixed-size avatar image.

**Confidence**

High