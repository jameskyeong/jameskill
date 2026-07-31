# Single-word domain names for all skills

ADR 0011 split the set into a branded flagship (`powertasking`) plus descriptive two-word supplementary names, and ADR 0014 unified the supplementary word order under family markers (`tracker-` prefix, `-check` suffix). A full-roster review immediately after 0014 re-ranked the naming criteria: **descriptive power, typing brevity, and whole-set uniformity**, with brand personality explicitly deprioritized. Under those criteria the flagship's branded name lost its justification — the `jsk:` namespace already carries the brand — and the two-word supplementary names paid a length cost for family markers the namespace and docs can carry instead.

## Decision

Every skill name is the single domain word for its job:

| domain | previous (alpha.16) | final |
|---|---|---|
| orchestrator | `powertasking` | `develop` |
| security inspection | `security-check` | `security` |
| deploy verdict | `ship-check` | `ship` |
| tracker config | `tracker-setup` | `tracker` |
| issue report | `tracker-report` | `report` |
| issue resolve | `tracker-resolve` | `resolve` |

`workflow-external` (legacy record) and `issue-references` (shared reference directory, not a skill) keep their names.

Retired names stay as natural-language triggers in each SKILL.md description (`'powertasking' (legacy name)` etc.) so existing muscle memory keeps working; only the slash-command names change.

## Considered Options

1. **Keep alpha.16 names** — already satisfied descriptive power and family consistency, but failed brevity (flagship 12 chars, `tracker-resolve` 15).

2. **Replace the flagship only** — one rename, minimal churn, but leaves the set split between a one-word flagship and two-word supplementaries, so form stays non-uniform.

3. **Single domain word everywhere** (chosen) — shortest (average 6.5 chars), perfectly uniform form, and each name reads as a command (`/jsk:ship` = "can I ship?"). Accepted trade-offs: `tracker` does not say "setup"; `report` / `resolve` drop the word "issue"; the SKILL.md descriptions disambiguate.

## Consequences

- This reverses ADR 0011's premise that the flagship earns a branded name, and retires ADR 0014's `tracker-` family prefix one release after it landed. Both reversals are criteria-driven (brand deprioritized), not quality judgments on the earlier decisions.
- Family grouping is no longer visible in the names. The signal moves entirely to the `jsk:` namespace and the docs' section structure — the position ADR 0011 already took for the whole set.
- The new names are common English words, so prose that mentions a skill mid-sentence can read as a verb ("control returns to resolve"). House style after this ADR: capitalized proper noun at sentence start (`Develop instruments its pipeline…`), backticked lowercase elsewhere (`` control returns to `resolve` ``).
- The rename direction (distinctive tokens → common words) kept the find-replace safe, per ADR 0011's note. The reverse direction would not be — a future rename away from these common words cannot use blind find-replace.
- The eval hardcode sites (`SUPPLEMENTARY`, `ALLOWLIST`) moved with the rename, as ADR 0011 requires.
- All six retired names enter the CONTEXT.md `_Avoid_` lists.
- Executed in alpha (`2.0.0-alpha.16` → `2.0.0-alpha.17`), commit prefix `feat!:`.
