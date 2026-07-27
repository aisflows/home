# AIS FLOWS Agent Discovery

Start with [agent-manifest.json](./agent-manifest.json), then read [content-model.json](./content-model.json). A null route is unavailable and its reason is stored in `route_unavailable_reasons`. This candidate is local and not deployed.

## Objects

| id | type | title | lifecycle | route | access | machine index | content | download | version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| proofline | skill | Proofline / Proofline | released | verified | public_free | null | null | null | v0.2.0-rc5 |
| ready-gate | skill | Ready Gate / Ready Gate | released | verified | public_free | null | null | https://github.com/aisflows/ready-gate/releases/download/v0.1.0-ready-gate-rc1/ais-flows-ready-gate-0.1.0-ready-gate-rc1.zip | v0.1.0-ready-gate-rc1 |
| skill-cleaner | skill | Skill Cleaner / Skill Cleaner | released | verified | public_free | null | null | null | v0.1.0-release-001 |
| video-builder-pack | system | Video Builder Pack / Набор для AI-видео | draft | unavailable | unavailable | null | null | null | null |
| local-ai-gateway | app | Local AI Gateway / Local AI Gateway | in_development | unavailable | unavailable | null | null | null | null |
| featured-youtube-trailer | media | AIS FLOWS trailer / Трейлер AIS FLOWS | published | verified | public_free | null | null | null | null |
| request | contact | Start a Project / Оставить заявку | published | verified | public_free | null | null | null | null |
| ais-flows-ai-video-course | course | AIS FLOWS AI-video course / Курс AIS FLOWS по AI-видео | draft | verified | public_preview | ./course/course-agent-manifest.json | ./course/course-content.json | null | 0.1.0-local-preview |

## Direct indexes

- Course: [course-agent-manifest.json](./course/course-agent-manifest.json)
- Artifacts: [artifacts.json](./artifacts.json)
- Updates: [updates.json](./updates.json) or [feed.xml](./feed.xml)
- Public changelog: [CHANGELOG_PUBLIC.md](./CHANGELOG_PUBLIC.md)

## Agent rules

- Follow only non-null routes with `route_status: verified`.
- Check artifact SHA256, size, MIME, and version before download.
- Do not infer purchase, private content, or unavailable routes.
- Browser progress is local user state, not server state.
- Request delivery: `formspree_live_delivery_confirmed_local_not_deployed`.
- Browser analytics: `umami_configured_remote_control_event_observed_public_site_not_deployed`.
- No public write/admin API or payment route is active.
