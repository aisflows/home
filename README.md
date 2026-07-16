# AIS FLOWS Home V0 Source / Prototype Bundle

Date: 2026-07-16
Status: public Home V0 source; deployed to GitHub Pages at `https://aisflows.github.io/home/`

## Purpose

Compact owned public base for AIS FLOWS Home V0 and its static source/prototype files.

It follows:

- Framer / Dashfolio as compact control-panel lens;
- Lucas as secondary visual confidence lens;
- Top Tech as restrained dark technical accent lens.

It does not copy a template and does not authorize account, deploy, runtime, or package actions.

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
- `content-model.schema.json` - JSON Schema for the canonical content model.
- `links-manifest.json` - external/local route manifest.
- `AI_AGENT_DISCOVERY.md` - machine-readable object and route index.
- `llms.txt`, `robots.txt`, `sitemap.xml` - local discovery and crawl surfaces.
- `request/index.html`, `ru/request/index.html` - compact request routes.
- `analytics.js`, `request.js` - provider-neutral event and request contracts.
- `assets/cards/skill-cleaner-github-preview.jpg` - confirmed Skill Cleaner card visual copied from release/GitHub asset.
- `assets/cards/ready-gate-release-cover-16x9.jpeg` - Ready Gate release-ready cover.
- `QA_ACCEPTANCE_2026-06-09.md` - static validation evidence.

## Visible V0 Decisions

- Products contains Skills, Systems, and Apps simultaneously.
- Proofline, Ready Gate, and Skill Cleaner are visible with their verified GitHub release routes.
- Video Builder Pack is visible as `preview_pending` with no fake page/download/payment route.
- Local AI Gateway is visible as `in_development` with no fake page/download/release route.
- Regular social posts, carousels, and quick subscriber info cards are not Home content.
- Routes are proof/media/follow paths plus a short request route.
- The request form is a UI contract only: its submit is disabled until an HTTPS receiver is configured and verified; the email fallback is available.
- No checkout, payment, account, password, upload, or fake success state.
- No external fonts, providers, or analytics network calls without explicit configuration.

## Card Image Rule

- Public product/media/proof cards must have an approved or published image asset.
- If a future skill, app, video, generation, or post has no approved image, it stays hidden or internal-only.
- Prefer reusing the same asset family used in public posts and release packages.
- Product/card images must not be cropped in a way that cuts labels, titles, UI text, faces, or proof details.
- Skill Cleaner uses its native `2:1` image ratio with `object-fit: contain`; do not force it into `16:9 cover`.

## Known Limits

- Final human/media hero asset is not selected.
- Future cards need approved/published image assets before they become visible.
- Ready Gate social publication remains outside Home scope; Home links only to the public GitHub release/artifact.
- Canonical public naming remains AIS FLOWS.
- Facebook Page route is visible because fresh S-Post reports verify posts under `https://www.facebook.com/AISFLOWS/...`.
- TikTok and LinkedIn public route targets need confirmation before adding to the visible page.
- Final browser visual QA and owner acceptance are required before any new launch/update decision.
- Request receiver is not selected, configured, or verified.
- The production route is GitHub Pages; no custom domain is configured.
- External analytics provider is not selected or verified.
- Public Systems package and public Apps release routes are not available.
