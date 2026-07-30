# Retire the mekaknight brand — consolidate on jameskill

ADR 0012 shortened the plugin namespace to `jsk` and kept the mekaknight brand on everything else. The consolidation continued the same day: the GitHub repo was renamed to `jameskill`, and the README banner was replaced with Jameskill artwork. That left the product split across two names, so this ADR retires mekaknight from every live surface.

## Decision

One brand: **jameskill** (namespace `jsk`). Renamed on live surfaces:

- Marketplace name: `mekaknight-marketplace` → `jameskill-marketplace` (install id becomes `jsk@jameskill-marketplace`)
- npm package name: `mekaknight` → `jameskill`
- Docs product references: CLAUDE.md, CONTEXT.md, README, eval titles/comments, one security-check line
- Artwork filenames: `docs/mekaknight-hero.jpg` → `jameskill-hero.jpg`, `docs/mekaknight-face.jpg` → `jameskill-face.jpg` — the robot character itself is retained as the jameskill mascot

Untouched: historical docs (ADRs 0001–0012, plans, strategy) keep mekaknight references as records of their time, and the local working-directory name is left to the author (renaming it mid-session breaks the running Claude Code session).

## Consequences

- The mekaknight name survives only in history (git log, tags up to v2.0.0-alpha.14, historical docs) — by design, not as residue.
- The marketplace rename changes the plugin install identity; the author (sole user) re-registered and reinstalled. Anyone else would need to re-add the marketplace and reinstall.
- Executed in alpha (`2.0.0-alpha.14` → `2.0.0-alpha.15`), commit prefix `feat!:` per the versioning policy on renames.
