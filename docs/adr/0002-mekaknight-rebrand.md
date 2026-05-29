# Rebrand to mekaknight and adopt meka-callsign command naming

The v1.x brand `jameskill` carries no semantic signal — the name does not convey what the package does, and "kill" reads ambiguously. v2 is also the right moment to consolidate the two naming patterns (`temper/harden/ship-ready` from metallurgy + `setup-issue/report-issue/resolve-issue` verb-issue) under one cohesive theme. We decided to rebrand the package to `mekaknight` (mecha + knight, in homage to Korean mecha tradition) and rename all six skills to a meka-callsign tone: `forge / lock / launch` (workflow + ship gate) and `link / tag / strike` (issue tracker). The previous metallurgy theme is retired. SKILL descriptions are neutralized from "vibe-coded" framing while marketing content retains the keyword to keep both discovery channels.

## Considered Options

1. **Keep `jameskill` brand, rename skills only** — Rejected because: the brand still carries no signal in marketplace listings, and partial change creates a two-half-themed namespace (meka-tone commands living under a jameskill plugin name).

2. **Namespace split — `/meka:*` workflow + `/jameskill:*` tracker** — Rejected because: forces users to remember two namespaces, and the brand identity remains split across two surfaces. Cleanest model is one brand, one namespace.

3. **Full rebrand — package + namespace + commands** (chosen) — `mekaknight` package, `/mekaknight:*` namespace, six skills renamed under the meka-callsign tone. Executed in alpha (`2.0.0-alpha.3`) so user disruption is bounded.

## Command mapping

| v1 | v2 | meaning |
|---|---|---|
| `temper` | `forge` | build with discipline |
| `harden` | `lock` | pre-launch security lockdown |
| `ship-ready` | `launch` | GO/NO-GO verdict |
| `setup-issue` | `link` | connect tracker (HQ uplink) |
| `report-issue` | `tag` | flag a target |
| `resolve-issue` | `strike` | engage and resolve |

`workflow-external` is preserved unchanged as the v1.x legacy entry point.

## Consequences

- All six SKILL.md files, cross-references, `package.json`, `marketplace.json`, README, and strategy docs require updates.
- v1.x npm package `jameskill` remains published but receives no further updates after this point.
- History documents (handoff, old plans, ADR 0001) get a top-of-file note "[written under v1 names]" rather than body rewrites — preserves authentic timeline.
- CONTEXT.md is rewritten so domain language reflects the meka-callsign terms; the metallurgy vocabulary (temper, harden as nouns) is retired.
- vibe-coded language is removed from SKILL descriptions to widen the audience (engineers + non-engineers), but retained in marketing/README hero to keep keyword discovery on Twitter/HN.
- GitHub repo rename is deferred to a final user-driven step; `marketplace.json` url update follows.
