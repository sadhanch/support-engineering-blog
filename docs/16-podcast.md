# 16. Podcast

## Purpose

This document describes the Support Engineering Weekly podcast integration in the Support Engineering Blog. It records the public information architecture, content model, audio delivery model, podcast player, external listening destinations, episode content workflow, and maintenance expectations.

The podcast is an extension of the publication rather than a separate web application. RSS.com provides podcast distribution, while the blog provides the editorial home for the show and individual episodes.

## Public destinations

The podcast landing page is:

```text
https://blog.sadhan.ch/podcast/
```

Individual episodes use the episode slug beneath the podcast path, for example:

```text
https://blog.sadhan.ch/podcast/surviving-the-microsoft-project-online-shutdown/
```

The RSS.com show is:

```text
https://rss.com/podcasts/support-engineering-weekly
```

The podcast RSS feed is:

```text
https://media.rss.com/support-engineering-weekly/feed.xml
```

## Site architecture

Podcast episodes are maintained as a separate Astro content collection rather than being stored in the article collection. This preserves a clear distinction between written articles and spoken episodes while allowing an episode to reference one or more related articles.

```text
src/
├── config/
│   ├── podcast.ts
│   └── site.ts
├── content/
│   ├── articles/
│   └── podcast/
│       ├── *.mdx
│       └── transcripts/
├── components/
│   └── podcast/
├── layouts/
│   └── PodcastEpisodeLayout.astro
├── lib/
│   └── podcast.ts
└── pages/
    └── podcast/
        ├── index.astro
        └── [...slug].astro
```

## Show-level configuration

The show-level configuration is centralized in:

```text
src/config/podcast.ts
```

It contains the show title, subtitle, description, RSS feed, RSS.com destination, blog URL, current listening destinations, artwork reference, author, language, copyright, and explicit-content flag.

The RSS feed remains configuration data even though it is not displayed as a listener-facing destination on the landing page.

Current listener-facing destinations are:

- Spotify
- Apple Podcasts

Additional platforms should be added only after their canonical public destinations are confirmed.

## Episode content model

The podcast collection is defined in:

```text
src/content.config.ts
```

The episode schema currently covers:

```text
episodeNumber
season
guid
title
artwork
description
publishDate
audio.url
audio.mimeType
audio.duration
chapters[]
relatedArticles[]
transcript
captions
transcriptFile
```

The episode slug is derived from the content filename. The same slug is used by the episode route.

### Identity and publication data

`episodeNumber` identifies the episode within the show. `season` is supported for future organization. `guid` preserves the published RSS episode identifier. `publishDate` records the published episode timestamp.

### Audio

The `audio` object points to the publicly accessible MP3 distribution asset and records its MIME type and duration in seconds.

The production/archive master is not stored in the blog repository. The public RSS.com distribution asset is used by the web player.

### Chapters

Chapters are stored as structured start times in seconds and titles. They are passed to the podcast player for chapter navigation and active-chapter display.

### Related articles

`relatedArticles` contains article content IDs from the existing article collection. The episode route resolves those IDs through `src/lib/articles.ts` and fails the build when a referenced article cannot be found.

### Transcript

Two transcript concepts are kept separate:

```text
transcript / captions
    -> published VTT resource

transcriptFile
    -> local VTT file stored with the episode source
```

The local VTT is parsed during the static build so the episode page can render synchronized transcript cues.

## Podcast content library

Centralized episode retrieval is provided by:

```text
src/lib/podcast.ts
```

The library provides:

```text
getAllPodcastEpisodes()
getPodcastEpisodeBySlug()
getLatestPodcastEpisode()
```

Episodes are sorted deterministically by episode number, with publication date as the fallback ordering value. Page code should use these helpers rather than querying the Astro content collection directly.

## Landing page

The landing page is:

```text
src/pages/podcast/index.astro
```

Its current structure is:

```text
Introduction
    ↓
Alex & Maya illustration
    ↓
Character profiles
    ↓
Latest episode
    ↓
Listening destinations
    ↓
Episode archive
```

Alex and Maya are recurring editorial characters used by the podcast identity. Their names and descriptions are HTML content and are intentionally not dependent on text embedded in the illustration.

The wide illustration is stored under:

```text
src/assets/images/podcast/
```

The square show artwork is a separate branding asset and is not treated as episode-specific artwork by default.

## Individual episode pages

The episode route is:

```text
src/pages/podcast/[...slug].astro
```

The shared presentation layout is:

```text
src/layouts/PodcastEpisodeLayout.astro
```

The route generates static paths from the podcast collection, resolves related articles, and prepares previous/next episode navigation.

The episode presentation currently includes:

```text
Episode identity
Audio player
Transcript
Related reading
Episode navigation
```

## Podcast player

The reusable player component is:

```text
src/components/podcast/PodcastPlayer.astro
```

The client-side behavior is:

```text
src/scripts/podcast-player.ts
```

The player uses the direct public MP3 URL from the episode metadata rather than embedding a third-party player. It currently provides:

- play/pause
- current-time display
- seek control
- 10-second backward skip
- 30-second forward skip
- playback speed selection
- chapter navigation
- active chapter indication
- synchronized transcript highlighting

The player stylesheet is:

```text
src/assets/css/components/podcast-player.css
```

Podcast player initialization is part of the global client-side initialization in `BaseLayout.astro`.

## Transcript rendering

The transcript component is:

```text
src/components/podcast/PodcastTranscript.astro
```

VTT parsing is centralized in:

```text
src/lib/vtt.ts
```

Transcript cues expose their start and end times to the client-side player. Selecting a timestamp seeks the episode to the corresponding cue.

## External listening destinations

The landing page currently exposes Spotify and Apple Podcasts as outbound listening destinations. The links are stored in `src/config/podcast.ts` and rendered by:

```text
src/components/podcast/ListeningLinks.astro
```

The website's own player remains the primary on-site listening mechanism. External platform links are alternatives rather than embedded third-party players.

## Styling

Podcast page composition is styled in:

```text
src/assets/css/pages/podcast.css
```

The player is styled separately in:

```text
src/assets/css/components/podcast-player.css
```

Both use the existing SEDS variables and visual language. The pixel-art Alex/Maya illustration is the distinctive podcast identity layer; it does not create a second global design system.

## Publication and RSS relationship

RSS.com remains the podcast distribution platform and source of the public podcast feed. The blog does not replace or regenerate the podcast RSS feed.

```text
Episode source
    ↓
RSS.com
    ↓
podcast RSS feed
    ↓
Spotify / Apple Podcasts / other directories

Episode source
    ↓
Support Engineering Blog
    ↓
/podcast/<episode-slug>/
```

The web page and RSS distribution record should remain consistent for title, episode number, publication state, duration, and audio availability.

## Production archive relationship

The podcast website repository is not the long-term production archive. Production assets are preserved in the separate `support-engineering-weekly-archive` repository and the audio archive is maintained separately.

The website stores only the metadata and content required for public presentation.

This separation keeps the roles clear:

```text
Blog repository
    -> public publication

Podcast RSS.com
    -> distribution

Podcast archive repository / long-term storage
    -> production preservation
```

## Adding a new episode

When a new episode is published:

1. Confirm the public RSS.com episode record.
2. Record the published episode number, season, GUID, title, publication date, duration, and public audio URL.
3. Record the published VTT transcript URL and local transcript file.
4. Add structured chapters in seconds.
5. Add related Support Engineering Blog article IDs when applicable.
6. Add the new MDX file under `src/content/podcast/`.
7. Confirm the audio URL is reachable from the browser.
8. Run content validation and the production build.
9. Review the landing page and episode page locally.
10. Verify the published episode remains consistent with the RSS.com record.

Do not copy production audio into the blog repository merely to make the player work. The player should use the published distribution URL.

## Maintenance checklist

For every episode:

```text
[ ] Episode number is unique
[ ] RSS GUID is correct
[ ] Title matches the published episode
[ ] Description is accurate
[ ] Publish date matches publication
[ ] Audio URL is public and correct
[ ] MIME type is correct
[ ] Duration is correct
[ ] Chapters are accurate
[ ] Related article IDs resolve
[ ] Transcript URL is valid
[ ] Local VTT file is present when transcriptFile is used
[ ] Episode page renders correctly
[ ] Player controls work
[ ] Transcript synchronization works
[ ] Mobile layout is checked
```

## Platform additions

When another major podcast directory becomes available, add its canonical public URL to `src/config/podcast.ts` and confirm its branding/usage requirements before changing the presentation component.

Do not expose internal RSS.com infrastructure URLs as listener-facing platform buttons.
