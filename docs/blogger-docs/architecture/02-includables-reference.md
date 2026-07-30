---
title: Blog Widget Includables Reference
version: 1.0
status: Draft
author: SEDS
source: Essential Light Blogger Theme
last_updated: 2026-07-30
---

# Blog Widget Includables Reference

## Purpose

This document is the canonical reference for every `<b:includable>` belonging to the Blog widget.

Each includable is documented individually with its responsibilities, dependencies, and relationships to other includables.

---

## Legend

| Status | Meaning |
|---------|---------|
| ✅ | Fully understood |
| 🔍 | Partially understood |
| ⏳ | Not yet analyzed |

---

# Entry Points

---

## `main`

**Category**

Entry Point

**Status**

✅ Understood

### Purpose

Initializes the Blog widget rendering process.

### Responsibilities

- Displays the no-content placeholder.
- Configures advertisement limits.
- Counts desktop advertisements.
- Counts mobile advertisements.
- Filters Featured Posts from the homepage.
- Creates the final `posts` collection.
- Delegates rendering using `super.main`.

### Inputs

| Variable | Purpose |
|----------|---------|
| `data:view` | Current page context |
| `data:posts` | Available posts |
| `data:widgets` | Widget collection |

### Calls

- `noContentPlaceholder`
- `super.main`

### Called By

Blogger runtime.

### Outputs

Prepared rendering context.

### Dependencies

- Blogger runtime
- `super.main`

### Notes

This includable performs orchestration rather than rendering.

---

# Author

---

## `aboutPostAuthor`

**Category**

Author

**Status**

✅ Analyzed

### Purpose

Renders the author's profile information displayed for a blog post.

### Responsibilities

- Display the author's name.
- Link the author's name to their Blogger profile.
- Display the author's "About Me" description.

### Source

The includable renders:

- A container for the author's name.
- A profile hyperlink using `data:post.author.profileUrl`.
- The author's display name using `data:post.author.name`.
- The author's biography using `data:post.author.aboutMe`.

### Inputs

| Variable | Description |
|----------|-------------|
| `data:post.author.profileUrl` | URL of the author's Blogger profile |
| `data:post.author.name` | Display name of the author |
| `data:post.author.aboutMe` | Author biography |

### Calls

None.

### Called By

Not yet determined.

This includable is expected to be invoked by another Blog rendering includable during post rendering, but the exact caller has not yet been traced.

### Output

Generates HTML similar to:

```html
<div class="author-name">
    <a class="g-profile">
        <span>Author Name</span>
    </a>
</div>

<div>
    <span class="author-desc">
        Author biography
    </span>
</div>
```

### Dependencies

- `data:post`
- Author metadata supplied by the Blogger runtime.

### Side Effects

None.

The includable only renders HTML.

### Refactoring Assessment

**Risk:** ⭐ Low

Reasons:

- No conditional logic.
- No loops.
- No nested includables.
- No JavaScript.
- No Blogger control structures.

This makes it an excellent candidate for one of the first renderer extractions during the SEDS migration.

### Facts

- The includable outputs two HTML `<div>` elements.
- The author's name is wrapped in a hyperlink.
- The hyperlink target is `data:post.author.profileUrl`.
- The biography is rendered using `data:post.author.aboutMe`.

### Inferences

- The includable is intended to be reused wherever author information is displayed.
- It acts as a leaf renderer rather than an orchestration component.

### Open Questions

- Which includable invokes `aboutPostAuthor`?
- Under what conditions is it displayed?
- Is it used on both homepage listings and individual post pages?

These questions will be answered when the post rendering pipeline is analyzed.

# Comments

---

## `addComments`

**Category**

Comments

**Role**

Leaf Renderer

**Status**

✅ Analyzed

### Purpose

Renders the "Post a Comment" link for a blog post.

### Responsibilities

- Display a hyperlink that allows users to add a new comment.
- Connect the hyperlink to Blogger's comment system.
- Use Blogger's localized message for the link text.

### Source

The includable renders a single anchor (`<a>`) element.

The destination URL is obtained from:

- `data:post.commentsUrl`

The click behavior is delegated to:

- `data:post.commentsUrlOnclick`

The link text is rendered using:

- `messages.postAComment`

### Inputs

| Variable | Description |
|----------|-------------|
| `data:post.commentsUrl` | URL of the comment page or comment form |
| `data:post.commentsUrlOnclick` | Optional JavaScript handler supplied by Blogger |
| `messages.postAComment` | Localized "Post a Comment" message |

### Calls

None.

### Called By

Not yet determined.

This includable is expected to be used by a higher-level comment or post renderer.

### Output

Generates HTML equivalent to:

```html
<a href="...">
    Post a Comment
</a>
```

The actual text is localized by Blogger and should not be hard-coded.

### Dependencies

- `data:post`
- Blogger localization messages

### Side Effects

None.

The includable renders a single hyperlink and performs no data manipulation.

### Refactoring Assessment

**Risk:** ⭐ Low

Reasons:

- No conditional logic.
- No loops.
- No nested includables.
- No JavaScript authored by the theme.
- Uses Blogger-provided URLs and localized messages.

This includable can be safely extracted into its own renderer without affecting other components, provided the Blogger data bindings are preserved.

### Facts

- The includable renders exactly one anchor element.
- The anchor destination is `data:post.commentsUrl`.
- The optional click handler is `data:post.commentsUrlOnclick`.
- The visible text comes from Blogger's localized message bundle (`messages.postAComment`).

### Inferences

- This includable is intended to provide a reusable "Add Comment" action.
- Localization is fully delegated to the Blogger runtime.

### Open Questions

- Which higher-level includable invokes `addComments`?
- Under what conditions is this link displayed?
- Is it used only when comments are enabled?

These questions will be answered during analysis of the post and comment rendering pipeline.

## `commentAuthorAvatar`

**Category**

Comments

**Role**

Leaf Renderer

**Status**

✅ Analyzed

### Purpose

Renders the avatar image associated with a comment author.

### Responsibilities

- Display the comment author's avatar.
- Wrap the avatar in a dedicated container for styling.
- Preserve Blogger-provided avatar dimensions.

### Source

The includable renders a single image inside a container element.

The image source is obtained from:

- `data:comment.authorAvatarSrc`

The image dimensions are fixed by the theme:

- Width: `35`
- Height: `35`

### Inputs

| Variable | Description |
|----------|-------------|
| `data:comment.authorAvatarSrc` | URL of the comment author's avatar image |

### Calls

None.

### Called By

Not yet determined.

Expected to be invoked by a higher-level comment renderer.

### Output

Generates HTML equivalent to:

```html
<div class="avatar-image-container">
    <img
        class="author-avatar"
        src="..."
        width="35"
        height="35">
</div>
```

### Dependencies

- `data:comment`

### Side Effects

None.

This includable only renders markup.

### Refactoring Assessment

**Risk:** ⭐ Very Low

Reasons:

- No Blogger control structures.
- No conditional logic.
- No loops.
- No nested includables.
- Pure presentation component.

This is an ideal candidate for extraction during the early stages of the SEDS migration.

### Facts

- The avatar is rendered using an `<img>` element.
- The image source is `data:comment.authorAvatarSrc`.
- The image is wrapped in a `<div class="avatar-image-container">`.
- The image dimensions are hard-coded to `35 × 35` pixels.

### Inferences

- The fixed dimensions indicate that avatar sizing is controlled by the theme rather than Blogger.
- This includable is intended to be reused wherever a comment author's avatar is displayed.

### Open Questions

- Which includable is responsible for assembling the complete comment layout?
- Are avatars rendered for all comment types or only standard comments?
- Does Blogger omit this includable when avatars are unavailable?

These questions will be answered during analysis of the `comment` and `comments` includables.

# Posts

---

## `post`

**Category**

Posts

**Role**

Composite Renderer

**Status**

🔍 Partially Analyzed

### Purpose

Coordinates the rendering of an individual blog post.

Unlike leaf renderers, this includable is responsible for assembling multiple post-related components into a complete post presentation.

At this stage of the investigation, the exact implementation details are still being reverse engineered.

---

## Responsibilities

Based on the Blog widget architecture, the `post` includable is expected to coordinate the rendering of a complete post by composing smaller rendering components.

Typical responsibilities include:

- Rendering the post container.
- Rendering post metadata.
- Rendering post content.
- Rendering post footer information.
- Rendering optional UI elements such as labels, sharing controls, jump links, and comments.

> **Inference**
>
> The exact composition will be confirmed when the complete call hierarchy has been mapped.

---

## Inputs

| Variable | Description |
|----------|-------------|
| `data:post` | Current post being rendered |
| `data:view` | Current Blogger view context |
| `data:messages` | Localized Blogger messages |

Additional inputs will be documented as they are confirmed.

---

## Calls

**Confirmed**

None documented yet.

**Expected**

The following includables are likely to participate in post rendering:

- `postHeader`
- `postBody`
- `postFooter`
- `postLabels`
- `postShareButtons`
- `postJumpLink`
- `postFooterJumpLink`

These relationships require verification before being promoted to facts.

---

## Called By

Not yet confirmed.

Expected to be invoked by Blogger's inherited rendering pipeline after execution reaches `super.main`.

---

## Output

Produces the HTML representation of a single blog post.

This includable represents one of the primary rendering components within the Blog widget.

---

## Dependencies

Confirmed:

- Blogger runtime
- `data:post`

Additional dependencies will be recorded as they are discovered.

---

## Side Effects

None identified.

The includable appears to be responsible for rendering rather than modifying application state.

---

## Refactoring Assessment

**Risk:** ⭐⭐⭐⭐ High

Reasons:

- Coordinates multiple rendering components.
- Likely contains conditional rendering logic.
- May vary its behavior depending on the current page type.
- Serves as an integration point between numerous leaf renderers.

This includable should **not** be one of the first components extracted during the SEDS migration.

Instead, supporting renderers should be understood first.

---

## Facts

- The Blog widget contains a dedicated `post` includable.
- The `post` includable is part of the Blog rendering pipeline.

---

## Inferences

- `post` acts as a composite renderer rather than a simple HTML fragment.
- It is likely responsible for coordinating many of the post-related includables documented elsewhere.

These inferences remain subject to verification.

---

## Open Questions

- Which includable invokes `post`?
- Does it render both homepage summaries and full post pages?
- Which child includables are invoked directly?
- Which rendering decisions depend on `data:view`?
- How does it interact with comments, labels, sharing controls, and pagination?

These questions will be answered during the rendering flow analysis.

---

## Refactoring Notes

The `post` includable is considered a **structural component**.

Before modifying it, the following should already be documented:

- `postHeader`
- `postBody`
- `postFooter`
- `postLabels`
- `postShareButtons`
- `postJumpLink`
- Related helper includables

Only after these dependencies are understood should the `post` includable itself be refactored.

