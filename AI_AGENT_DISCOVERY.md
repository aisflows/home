# AIS FLOWS Agent Discovery

Start with [agent-manifest.json](./agent-manifest.json), then read [content-model.json](./content-model.json). A null route is unavailable and its reason is stored in `route_unavailable_reasons`. The canonical public deployment is live and verified.

## Objects

| id | type | title | lifecycle | route | access | machine index | content | download | version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| proofline | skill | Proofline / Proofline | released | verified | public_free | null | null | null | v0.2.0-rc5 |
| ready-gate | skill | Ready Gate / Ready Gate | released | verified | public_free | null | null | https://github.com/aisflows/ready-gate/releases/download/v0.1.0-ready-gate-rc1/ais-flows-ready-gate-0.1.0-ready-gate-rc1.zip | v0.1.0-ready-gate-rc1 |
| skill-cleaner | skill | Skill Cleaner / Skill Cleaner | released | verified | public_free | null | null | null | v0.1.0-release-001 |
| skill-operations-pack | skill | Skill Operations Pack / Skill Operations Pack | released | verified | public_free | null | null | https://github.com/aisflows/skill-operations-pack/releases/download/v0.1.0-rc6/ais-flows-skill-operations-pack-0.1.0-rc6.zip | 0.1.0-rc6 |
| video-builder-pack | system | Video Builder Pack / Набор для AI-видео | draft | unavailable | unavailable | null | null | null | null |
| local-ai-gateway | app | Local AI Gateway / Local AI Gateway | in_development | unavailable | unavailable | null | null | null | null |
| featured-youtube-trailer | media | AIS FLOWS trailer / Трейлер AIS FLOWS | published | verified | public_free | ./media/media-index.json | ./media/media-index.json | null | null |
| request | contact | Start a Project / Оставить заявку | published | verified | public_free | null | null | null | null |
| ais-flows-ai-video-course | course | AIS FLOWS AI-video course / Курс AIS FLOWS по AI-видео | draft | verified | public_preview | ./course/course-agent-manifest.json | ./course/course-content.json | null | 0.1.0-local-preview |

## Skills

Machine index: [skills/skills-index.json](./skills/skills-index.json)

| id | version | status | action | release |
| --- | --- | --- | --- | --- |
| skill-operations-pack | 0.1.0-rc6 | released | open_release | https://github.com/aisflows/skill-operations-pack/releases/tag/v0.1.0-rc6 |
| skill-cleaner | v0.1.0-release-001 | released | open_release | https://github.com/aisflows/skill-cleaner/releases/tag/v0.1.0-release-001 |
| ready-gate | v0.1.0-ready-gate-rc1 | released | open_release | https://github.com/aisflows/ready-gate/releases/tag/v0.1.0-ready-gate-rc1 |
| proofline | v0.2.0-rc5 | released | open_release | https://github.com/aisflows/proofline/releases/tag/v0.2.0-rc5 |

## Media works

Machine index: [media/media-index.json](./media/media-index.json)

| id | kind | dimensions | status | action | EN route | direct media |
| --- | --- | --- | --- | --- | --- | --- |
| jbl-jurassic-park | local_video | 720x1280 | published | playback | https://aisflows.github.io/home/media/jbl-jurassic-park/ | https://aisflows.github.io/home/assets/media/aisflows-media-jbl-jurassic-park-web.mp4 |
| interstellar-millers-planet | local_video | 720x1280 | published | playback | https://aisflows.github.io/home/media/interstellar-millers-planet/ | https://aisflows.github.io/home/assets/media/aisflows-media-interstellar-millers-planet-web.mp4 |
| doom-battlefield-earth | local_video | 720x1280 | published | playback | https://aisflows.github.io/home/media/doom-battlefield-earth/ | https://aisflows.github.io/home/assets/media/aisflows-media-doom-battlefield-earth-web.mp4 |
| witcher-monsters-men | local_video | 720x1280 | published | playback | https://aisflows.github.io/home/media/witcher-monsters-men/ | https://aisflows.github.io/home/assets/media/aisflows-media-witcher-monsters-men-web.mp4 |
| 28-days-later | local_video | 720x1280 | published | playback | https://aisflows.github.io/home/media/28-days-later/ | https://aisflows.github.io/home/assets/media/aisflows-preview-28-days-later-web.mp4 |
| dead-space | local_video | 720x1280 | published | playback | https://aisflows.github.io/home/media/dead-space/ | https://aisflows.github.io/home/assets/media/aisflows-preview-dead-space-web.mp4 |
| godzilla | local_video | 720x1280 | published | playback | https://aisflows.github.io/home/media/godzilla/ | https://aisflows.github.io/home/assets/media/aisflows-preview-godzilla-web.mp4 |
| predator | local_video | 720x1280 | published | playback | https://aisflows.github.io/home/media/predator/ | https://aisflows.github.io/home/assets/media/aisflows-preview-predator-web.mp4 |

## Direct indexes

- Skills: [skills/skills-index.json](./skills/skills-index.json)
- Media: [media/media-index.json](./media/media-index.json)
- Course: [course-agent-manifest.json](./course/course-agent-manifest.json)
- Artifacts: [artifacts.json](./artifacts.json)
- Updates: [updates.json](./updates.json) or [feed.xml](./feed.xml)
- Public changelog: [CHANGELOG_PUBLIC.md](./CHANGELOG_PUBLIC.md)
- Privacy EN: [privacy/index.html](./privacy/index.html)
- Privacy RU: [ru/privacy/index.html](./ru/privacy/index.html)

## Agent rules

- Follow only non-null routes with `route_status: verified`.
- Use the Skills machine index for stable skill order, versions, action states, release routes, images, and unavailable reasons.
- Use the Media machine index for stable work IDs, language routes, dimensions, action state, posters, and direct assets.
- Check artifact SHA256, size, MIME, and version before download.
- Do not infer purchase, private content, or unavailable routes.
- Browser progress is local user state, not server state.
- Request delivery: `formspree_public_home_delivery_verified`.
- Browser analytics: `umami_public_home_collection_verified`.
- No public write/admin API or payment route is active.
