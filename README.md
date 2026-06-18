# AIS FLOWS Home V0 Static Prototype

Date: 2026-06-09
Status: local-only static prototype; no public launch approved

## Purpose

Compact owned public base prototype for AIS FLOWS Home V0.

It follows:

- Framer / Dashfolio as compact control-panel lens;
- Lucas as secondary visual confidence lens;
- Top Tech as restrained dark technical accent lens.

It does not copy a template and does not use account, deploy, runtime, or package actions.

## Open Locally

Open directly in a browser:

```text
index.html
ru/index.html
```

No dev server is required.

## Files

- `index.html` - EN-first prototype.
- `ru/index.html` - RU route/copy prototype.
- `styles.css` - shared compact dark visual system.
- `content-model.json` - static content/status model.
- `links-manifest.json` - external/local route manifest.
- `assets/cards/skill-cleaner-github-preview.jpg` - confirmed Skill Cleaner card visual copied from release/GitHub asset.
- `assets/cards/ready-gate-release-cover-16x9.jpeg` - Ready Gate release-ready cover.
- `QA_ACCEPTANCE_2026-06-09.md` - static validation evidence.

## Visible V0 Decisions

- Skill Cleaner is the only visible product/artifact card.
- Skill Cleaner is image-backed, using the confirmed `primary_visual` from `04-products/skills/skill-cleaner/github-worktree/site-ready/SITE_DATA.json`.
- Ready Gate is visible as a public release candidate with a GitHub release route.
- Regular social posts, carousels, and quick subscriber info cards are not Home content.
- Routes are proof/media/follow paths only.
- No service, order, checkout, form, or email funnel.
- No coming soon cards.
- No external fonts, analytics, scripts, providers, or embeds.

## Card Image Rule

- Public product/media/proof cards must have an approved or published image asset.
- If a future skill, app, video, generation, or post has no approved image, it stays hidden or internal-only.
- Prefer reusing the same asset family used in public posts and release packages.
- Product/card images must not be cropped in a way that cuts labels, titles, UI text, faces, or proof details.
- Skill Cleaner uses its native `2:1` image ratio with `object-fit: contain`; do not force it into `16:9 cover`.

## Known Blockers Before Public Use

- Final human/media hero asset is not selected.
- Future cards need approved/published image assets before they become visible.
- Ready Gate social publication remains outside Home scope; Home links only to the public GitHub release/artifact.
- Canonical public naming remains AIS FLOWS.
- Facebook Page route is visible because fresh S-Post reports verify posts under `https://www.facebook.com/AISFLOWS/...`.
- TikTok and LinkedIn public route targets need confirmation before adding to the visible page.
- Final browser visual QA and owner acceptance are required before any launch decision.
