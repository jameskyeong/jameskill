# Tracker family prefix: report-issue / resolve-issue → tracker-report / tracker-resolve

ADR 0011 settled on descriptive verb-object names for the supplementary skills (`report-issue`, `resolve-issue`) alongside noun-first names (`tracker-setup`, `security-check`, `ship-check`). That left the set with two word orders: the Notion trio read `tracker-setup` / `report-issue` / `resolve-issue`, so the family's own members disagreed on form, and the two issue skills were the only names in the whole set with verb-first order.

## Decision

Rename the two issue skills to join the `tracker-` prefix of their family:

| domain | previous (alpha.13–15) | final |
|---|---|---|
| tracker config | `tracker-setup` | `tracker-setup` (unchanged) |
| issue report | `report-issue` | `tracker-report` |
| issue resolve | `resolve-issue` | `tracker-resolve` |

All other names unchanged: `powertasking` (branded flagship), `security-check` / `ship-check` (inspection duo, shared `-check` suffix), `workflow-external` (legacy). Every supplementary name now reads noun-first (target-action), and each family carries a morphological marker: `tracker-` prefix for the Notion trio, `-check` suffix for the inspection duo.

Natural-language triggers ("report issues", "resolve issues", "log issues", "engage") are preserved in the SKILL.md descriptions — only the slash-command names change.

## Considered Options

1. **Target-action order only** (`issue-report`, `issue-resolve`, keep `tracker-setup`) — the minimal fix (2 renames, consistent word order), but the Notion family would still split across two prefixes (`issue-`, `tracker-`), so autocomplete would not group the trio.

2. **Verb-object command style on everything** (`setup-tracker`, `check-security`, `check-ship`, keep `report-issue` / `resolve-issue`) — reads like natural commands, but costs 3 renames and loses prefix grouping entirely.

3. **Family prefix** (chosen) — 2 renames; typing `/jsk:tracker-` completes to the entire Notion trio, and family membership is visible in the name itself, not just the docs. Accepted trade-off: `tracker-report` could be misread as "a report about the tracker"; the SKILL.md description disambiguates.

## Consequences

- The blind find-replace was safe (per ADR 0011's note: distinctive source tokens), covering skill directories, SKILL.md `name:` fields and cross-references, `issue-references/grouping.md`, powertasking's SKILL.md + references, README, CLAUDE.md, CONTEXT.md.
- The two eval hardcode sites moved with the rename, as ADR 0011 requires: `eval/checks/cross-cutting-gates-present.mjs` (`SUPPLEMENTARY`) and `eval/checks/inline-gloss-discipline.mjs` (`ALLOWLIST`).
- `report-issue` / `resolve-issue` re-enter the CONTEXT.md `_Avoid_` lists (they had been revived from v1 by ADR 0011).
- Historical documents (prior ADRs, `docs/plans/`, `docs/strategy/`) keep the old names — they are records, not living references.
- Executed in alpha (`2.0.0-alpha.15` → `2.0.0-alpha.16`), commit prefix `feat!:` per the versioning policy for skill renames.
