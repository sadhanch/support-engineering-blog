---
title: Blog Widget Call Hierarchy
version: 1.0
status: Living Document
author: SEDS
source: Essential Light Blogger Theme
last_updated: 2026-07-30
---

# Blog Widget Call Hierarchy

## Purpose

This document describes the invocation relationships between Blog widget includables.

Unlike the Includables Reference, which documents each includable independently, this document focuses on **how execution flows through the Blog widget**.

The hierarchy will evolve as additional relationships are verified.

---

# Legend

| Symbol | Meaning |
|---------|---------|
| → | Direct include (`<b:include>`) |
| ? | Relationship not yet verified |
| ✓ | Verified from source |
| 🔍 | Under investigation |

---

# Current Hierarchy

```
Blog Widget
│
└── main ✓
    │
    ├── noContentPlaceholder ✓
    │
    └── super.main ✓
        │
        └── 🔍 Inherited Blogger Rendering
```

---

# Verified Relationships

## main

**Calls**

- noContentPlaceholder ✓
- super.main ✓

---

## aboutPostAuthor

No child includables.

Leaf renderer.

---

## addComments

No child includables.

Leaf renderer.

---

## commentAuthorAvatar

No child includables.

Leaf renderer.

---

# Unverified Relationships

The following relationships are expected to exist but have not yet been verified.

```
post
├── postHeader ?
├── postBody ?
├── postFooter ?
├── postLabels ?
├── postShareButtons ?
└── postJumpLink ?

comments
├── comment ?
├── commentForm ?
└── commentAuthorAvatar ?
```

These remain hypotheses until confirmed by source analysis.

---

# Call Graph Depth

Current maximum verified depth:

```
Blog Widget
    ↓
main
    ↓
super.main
```

Further levels are currently under investigation.

---

# Leaf Renderers

Currently identified:

- aboutPostAuthor
- addComments
- commentAuthorAvatar

These includables do not invoke other includables.

---

# Composite Renderers

None verified.

---

# Orchestrators

Verified:

- main

---

# Investigation Queue

The following includables should be analyzed next because they are expected to expand the verified hierarchy.

Priority 1

- post

Priority 2

- postBody

Priority 3

- comments

Priority 4

- comment

Priority 5

- postFooter

Priority 6

- postHeader

The hierarchy will be updated after each investigation.