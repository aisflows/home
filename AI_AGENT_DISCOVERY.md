# AIS FLOWS Agent Discovery

Start with [agent-manifest.json](./agent-manifest.json), then read [content-model.json](./content-model.json). A null route is unavailable and its reason is stored in `route_unavailable_reasons`. Canonical public deployment status: public.

## Objects

| id | type | title | lifecycle | route | access | machine index | content | download | version |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| course-writer | skill | AIS FLOWS Course Writer / AIS FLOWS Course Writer | released | verified | public_free | null | null | https://github.com/aisflows/course-writer/releases/download/v1.0/ais-flows-course-writer-1.0.zip | 1.0 |
| proofline | skill | Proofline / Proofline | released | verified | public_free | null | null | https://github.com/aisflows/proofline/releases/download/v0.2.0-rc5/ais-flows-proofline-0.2.0-rc5.zip | v0.2.0-rc5 |
| ready-gate | skill | Ready Gate / Ready Gate | released | verified | public_free | null | null | https://github.com/aisflows/ready-gate/releases/download/v0.1.0-ready-gate-rc1/ais-flows-ready-gate-0.1.0-ready-gate-rc1.zip | v0.1.0-ready-gate-rc1 |
| skill-cleaner | skill | Skill Cleaner / Skill Cleaner | released | verified | public_free | null | null | https://github.com/aisflows/skill-cleaner/releases/download/v0.1.0-release-001/ais-flows-skill-library-cleaner-0.1.0-release-001-final-candidate.zip | v0.1.0-release-001 |
| skill-operations-pack | skill | Skill Operations Pack / Skill Operations Pack | released | verified | public_free | null | null | https://github.com/aisflows/skill-operations-pack/releases/download/v0.1.0-rc6/ais-flows-skill-operations-pack-0.1.0-rc6.zip | 0.1.0-rc6 |
| video-builder-pack | system | Video Builder Pack / Набор для AI-видео | draft | unavailable | unavailable | null | null | null | null |
| local-ai-gateway | app | Local AI Gateway / Local AI Gateway | in_development | unavailable | unavailable | null | null | null | null |
| featured-youtube-trailer | media | AIS FLOWS trailer / Трейлер AIS FLOWS | published | verified | public_free | ./media/media-index.json | ./media/media-index.json | null | null |
| request | contact | Personal Contact / Личный контакт | published | verified | public_free | null | null | null | null |
| ais-flows-ai-video-course | course | AI tools course / Курс по AI-инструментам | draft | verified | public_preview | ./course/releases/fead99dcc1f7192632f4945dc201b3edae1cf02944ebe57c7c95771175efae2b/course-agent-manifest.json | ./course/releases/fead99dcc1f7192632f4945dc201b3edae1cf02944ebe57c7c95771175efae2b/course-content.json | null | 0.2.0-local-rc |

## Skills

Machine index: [skills/skills-index.json](./skills/skills-index.json)

| id | version | status | action | release |
| --- | --- | --- | --- | --- |
| course-writer | 1.0 | released | open_release | https://github.com/aisflows/course-writer/releases/tag/v1.0 |
| skill-operations-pack | 0.1.0-rc6 | released | open_release | https://github.com/aisflows/skill-operations-pack/releases/tag/v0.1.0-rc6 |
| skill-cleaner | v0.1.0-release-001 | released | open_release | https://github.com/aisflows/skill-cleaner/releases/tag/v0.1.0-release-001 |
| ready-gate | v0.1.0-ready-gate-rc1 | released | open_release | https://github.com/aisflows/ready-gate/releases/tag/v0.1.0-ready-gate-rc1 |
| proofline | v0.2.0-rc5 | released | open_release | https://github.com/aisflows/proofline/releases/tag/v0.2.0-rc5 |

## Media works

Machine index: [media/media-index.json](./media/media-index.json)

| id | kind | dimensions | status | action | EN route | direct media |
| --- | --- | --- | --- | --- | --- | --- |
| mortal-kombat-dont-wake-the-champion | local_video | 1080x1920 | published | playback | https://aisflows.com/media/mortal-kombat-dont-wake-the-champion/ | https://aisflows.com/assets/media/aisflows-media-mortal-kombat-dont-wake-the-champion-web.mp4 |
| ghostbusters-first-day-on-the-job | local_video | 1080x1920 | published | playback | https://aisflows.com/media/ghostbusters-first-day-on-the-job/ | https://aisflows.com/assets/media/aisflows-media-ghostbusters-first-day-on-the-job-web.mp4 |
| monster-island-mutants | local_video | 1080x1920 | published | playback | https://aisflows.com/media/monster-island-mutants/ | https://aisflows.com/assets/media/aisflows-media-monster-island-mutants-web.mp4 |
| interstellar-millers-planet | local_video | 720x1280 | published | playback | https://aisflows.com/media/interstellar-millers-planet/ | https://aisflows.com/assets/media/aisflows-media-interstellar-millers-planet-web.mp4 |
| doom-battlefield-earth | local_video | 720x1280 | published | playback | https://aisflows.com/media/doom-battlefield-earth/ | https://aisflows.com/assets/media/aisflows-media-doom-battlefield-earth-web.mp4 |
| witcher-monsters-men | local_video | 720x1280 | published | playback | https://aisflows.com/media/witcher-monsters-men/ | https://aisflows.com/assets/media/aisflows-media-witcher-monsters-men-web.mp4 |
| 28-days-later | local_video | 720x1280 | published | playback | https://aisflows.com/media/28-days-later/ | https://aisflows.com/assets/media/aisflows-preview-28-days-later-web.mp4 |
| dead-space | local_video | 720x1280 | published | playback | https://aisflows.com/media/dead-space/ | https://aisflows.com/assets/media/aisflows-preview-dead-space-web.mp4 |
| godzilla | local_video | 720x1280 | published | playback | https://aisflows.com/media/godzilla/ | https://aisflows.com/assets/media/aisflows-preview-godzilla-web.mp4 |
| predator | local_video | 720x1280 | published | playback | https://aisflows.com/media/predator/ | https://aisflows.com/assets/media/aisflows-preview-predator-web.mp4 |

## Prompt Library

Machine index: [prompts/prompts-index.json](./prompts/prompts-index.json)

- Catalog state: published_owner_records
- Public records: 6
- Test fixtures are excluded from public catalog and agent discovery surfaces.
- Read or copy a prompt only where `prompt_access=public`.

## Direct indexes

- Skills: [skills/skills-index.json](./skills/skills-index.json)
- Media: [media/media-index.json](./media/media-index.json)
- Course RU machine manifest: [current release](./course/releases/fead99dcc1f7192632f4945dc201b3edae1cf02944ebe57c7c95771175efae2b/course-agent-manifest.json)
- Course RU content index: [current release](./course/releases/fead99dcc1f7192632f4945dc201b3edae1cf02944ebe57c7c95771175efae2b/course-content.json)
- Course RU download manifest: [current release](./course/releases/fead99dcc1f7192632f4945dc201b3edae1cf02944ebe57c7c95771175efae2b/course-download-manifest.json)
- Course RU artifact manifest: [current release](./course/releases/fead99dcc1f7192632f4945dc201b3edae1cf02944ebe57c7c95771175efae2b/artifacts.json)
- Course EN: [course/en/course-locale-manifest.json](./course/en/course-locale-manifest.json)
- Artifacts: [artifacts.json](./artifacts.json)
- Updates: [updates.json](./updates.json) or [feed.xml](./feed.xml)
- Public changelog: [CHANGELOG_PUBLIC.md](./CHANGELOG_PUBLIC.md)
- Privacy EN: [privacy/index.html](./privacy/index.html)
- Privacy RU: [ru/privacy/index.html](./ru/privacy/index.html)

## Agent rules

- Follow only non-null routes with `route_status: verified`.
- Use the Skills machine index for stable skill order, versions, action states, release routes, images, and unavailable reasons.
- Use the Media machine index for stable work IDs, language routes, dimensions, action state, posters, and direct assets.
- Use locale-bound Course manifests and downloads; do not mix RU and EN artifacts.
- Check artifact SHA256, size, MIME, and version before download.
- Do not infer purchase, private content, or unavailable routes.
- Browser progress is local user state, not server state.
- Request delivery: `formspree_public_home_delivery_verified`.
- Browser analytics: `umami_public_home_collection_verified`.
- No public write/admin API or payment route is active.
