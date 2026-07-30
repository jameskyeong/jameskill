# Plugin namespace: `jsk`, decoupled from the mekaknight brand

After fixing the doubled-prefix bug (SKILL.md `name:` fields carried a redundant `mekaknight:` prefix on top of the automatic plugin namespace), the slash commands still read long: `/mekaknight:powertasking` is 23 characters, of which the 11-character namespace carries no functional information. ADR 0011 settled the *skill* names and noted "the family signal lives entirely in the `mekaknight:` namespace. If the plugin is ever renamed, that signal moves with it." This ADR executes that rename.

## Decision

- **Plugin name (slash namespace)**: `jsk` — short for **jameskill**, the author's personal skill brand (also the name of the author's marketplace repo, `jameskill.git`). Short, unique enough to avoid collision with other plugins, and personal rather than thematic.
- **Everything else keeps the mekaknight brand**: GitHub repo, npm package name, marketplace name (`mekaknight-marketplace`), README banner, docs.

Commands become `/jsk:powertasking`, `/jsk:security-check`, `/jsk:ship-check`, `/jsk:tracker-setup`, `/jsk:report-issue`, `/jsk:resolve-issue`, `/jsk:workflow-external`.

## Considered Options

1. **Keep `mekaknight`** — Zero cost, but the namespace is the longest part of every command and the author (currently the sole user) wanted it shorter.
2. **`meka` / `mekk` / thematic names (`armet`)** — Shorter and brand-adjacent, but the author preferred a personal identifier over a thematic one.
3. **`jsk`** (chosen) — 3 characters, derived from the author's jameskill brand, near-zero collision risk in the plugin ecosystem.

## Consequences

- The family signal ADR 0011 assigned to the namespace now reads as an author signature rather than a product brand. The product brand (mekaknight) lives in the repo/package/marketplace names only.
- The version-sync tooling (`scripts/sync-version.mjs`, `eval/checks/version-sync.mjs`) previously matched the plugin entry by npm package name; it now syncs/checks every plugin entry, since the plugin name (`jsk`) and package name (`mekaknight`) are decoupled.
- Anyone who installed under the old name must reinstall: the plugin identity changes from `mekaknight@<marketplace>` to `jsk@<marketplace>`. Executed while the author is the sole user, so no external migration exists.
- The `jameskill-marketplace` listing (separate repo) still names the plugin `mekaknight`; installs from there would resurrect the old namespace until that repo's marketplace.json is updated or the listing is removed.
- Historical docs (ADRs 0001–0011, plans, strategy) intentionally keep `/mekaknight:` references — they record the commands as they were at the time.
- Executed in alpha (`2.0.0-alpha.13` → `2.0.0-alpha.14`), commit prefix `feat!:` per the versioning policy on renames.

## Addendum (same day)

The brand consolidation went further than this ADR's original decision: the GitHub repo was renamed `mekaknight` → `jameskill` (reclaiming the pre-rebrand name; GitHub redirects the old URL), and the README banner now carries the Jameskill artwork. What still carries the mekaknight name: the npm package name, the marketplace name (`mekaknight-marketplace`), the local working-directory name, and the docs' product references.
