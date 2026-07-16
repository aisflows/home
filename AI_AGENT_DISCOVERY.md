# AIS FLOWS Home Agent Discovery

This file is the machine-readable companion to `content-model.json` for the public Home V0 surface. `null` means that a public route or artifact has not been verified and must not be presented as active.

## Objects

| id | type | name | status | short_description | page_url | release_url | download_url | payment_url | contact_url | language | last_verified |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| proofline | skill | Proofline | released | Five-skill readiness check for agent chats. | null | https://github.com/aisflows/proofline/releases/tag/v0.2.0-rc5 | null | null | ./request/ | en,ru | 2026-07-15 |
| ready-gate | skill | Ready Gate | released | One-skill handoff readiness gate. | null | https://github.com/aisflows/ready-gate/releases/tag/v0.1.0-ready-gate-rc1 | https://github.com/aisflows/ready-gate/releases/download/v0.1.0-ready-gate-rc1/ais-flows-ready-gate-0.1.0-ready-gate-rc1.zip | null | ./request/ | en,ru | 2026-07-15 |
| skill-cleaner | skill | Skill Cleaner | released | Workflow pack for cleaning AI-agent skill folders. | null | https://github.com/aisflows/skill-cleaner/releases/tag/v0.1.0-release-001 | null | null | ./request/ | en,ru | 2026-07-15 |
| video-builder-pack | system | Video Builder Pack / Набор для AI-видео | preview_pending | Working files for creating AI-video with your own AI chat. | null | null | null | null | ./request/ | en,ru | 2026-07-15 |
| local-ai-gateway | app | Local AI Gateway | in_development | Local OpenAI-compatible gateway for AI apps, chats, and agents. | null | null | null | null | ./request/ | en,ru | 2026-07-15 |
| featured-youtube-trailer | media | AIS FLOWS trailer | published_on_provider | Featured YouTube trailer. | ./index.html#media | https://www.youtube.com/watch?v=DDpVQ53pnAI | null | null | null | en,ru | 2026-07-15 |
| request | contact | Start a Project / Оставить заявку | receiver_unavailable | Short request form with an email fallback. | ./request/index.html | null | null | null | mailto:hitmesound@gmail.com | en,ru | 2026-07-15 |

## Request route

- EN: `./request/index.html`
- RU: `./ru/request/index.html`
- Request types: `project_video`, `audio_music`, `app_tool`, `hiring_collaboration`, `product_support`, `other`.
- Fields: request type, optional 1-3 sentence summary, contact method, required contact value, optional HTTP/HTTPS materials URL.
- Delivery: `receiver_unavailable` until an HTTPS receiver is configured and independently verified.
- Submit behavior: disabled in the static build; no success state is emitted without a verified receiver response containing a nonempty `request_id`.
- Fallback: `mailto:hitmesound@gmail.com` with a short prefilled subject/body and no user values in the URL.

## Discovery constraints

- No public price, checkout, payment, account, password, upload, or fake download route is advertised.
- The Systems and Apps objects remain status-only until approved public artifacts and routes exist.
- `content-model.json` is the canonical source; this file is a human-readable mirror and must stay in parity with it.
