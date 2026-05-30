# Position mekaknight's "compound engineering" claim relative to EveryInc's plugin

ADR 0007 added the Retrospective phase and named "compound engineering" as forge's second pillar across README, CLAUDE.md, CONTEXT.md, and the v2 strategy documents. A follow-up audit of `docs/strategy/competitive-landscape.md` flagged that EveryInc ships an "Official Compound Engineering plugin for Claude Code, Codex, Cursor, and more" — 37 skills + 51 agents, 17,656 stars at the time of audit. The term "compound engineering" is therefore not ours to claim as a coined term; it is a community concept with an established dominant claim-holder in the Claude Code skill ecosystem. This ADR records the decision to **keep the term in our docs, drop any ownership framing, attribute the concept's wider home explicitly, and reposition our Pillar 2 around the architectural variant we actually ship (single-orchestrator bundle) rather than the principle itself**.

## Considered options

### Option A — Keep "compound engineering" as the Pillar 2 name, no acknowledgment of EveryInc (rejected)

**Argument for**: The term is general enough — Kent Beck, Geoffrey Litt, and Dan Shipper all write about it as a principle. We can claim it as common vocabulary.

**Argument against**: EveryInc's plugin (a) calls itself "the Official Compound Engineering plugin", (b) prefixes 37 skill names with `ce-`, (c) sits at 17k stars. In the Claude Code marketplace specifically, they are the dominant claim-holder. Using the term without attribution invites "Show HN: knockoff CE" reactions and burns marketing trust on the cheapest possible angle.

**Decision**: Rejected. The general-vocabulary argument is true conceptually but irrelevant to skill-marketplace perception. The risk of being read as derivative outweighs the cost of attribution.

### Option B — Rename our term entirely (rejected)

**Argument for**: Sidesteps the conflict completely. Coining a fresh term ("repo-resident discipline", "artifact-deposit orchestration", "single-skill compounding") forces our wording to be specific to what forge actually does and avoids any comparison.

**Argument against**: Compound engineering is the *accurate* description of what we do — every session deposits artifacts that lift the next session. A coined replacement would either be jargon that requires explanation or a paraphrase that obscures the connection to a recognized concept readers already understand. Renaming away from accurate vocabulary because someone else uses it first is defensive positioning, not honest positioning.

**Decision**: Rejected. The term fits our mechanism; the conflict is with attribution, not with vocabulary fit.

### Option C — Investigate first, then decide (interim path, completed)

The hybrid options below depend on knowing what EveryInc's plugin actually does. A short investigation (GitHub fetch + WebSearch) was completed before this ADR was written. Findings:

- EveryInc's definition matches ours conceptually: *"each unit of engineering work should make subsequent units easier"*; *"a good compound note means the next agent does not have to learn the same lesson from scratch."*
- Their deposit channels: `STRATEGY.md`, `docs/brainstorms/*-requirements.md`, `docs/pulse-reports/`, code review pattern files via `/ce-compound`, implementation plan files for `/ce-work`.
- Their architecture: 9 user-facing core commands (`/ce-strategy`, `/ce-ideate`, `/ce-brainstorm`, `/ce-plan`, `/ce-work`, `/ce-debug`, `/ce-code-review`, `/ce-compound`, `/ce-product-pulse`) inside a 37-skill suite.

Conclusion of investigation: **same concept, different architecture.** They ship a multi-skill suite the user composes. We ship a single orchestrator that runs the whole flow with five built-in deposit channels.

### Option D — Keep the term, attribute the wider home, reposition Pillar 2 around our architecture (chosen)

**Argument for**: Honest. The concept is real and we do implement it. Attribution removes the knockoff perception. The repositioning ("compound engineering, in one skill") makes our actual differentiator legible — we are not competing with EveryInc on breadth of skills; we are offering a different architectural take on the same principle. Readers who already know the term recognize our usage; readers who don't get a pointer to the fuller treatment. Marketing copy that survives skeptical HN/PH scrutiny.

**Argument against**: Reads as defensive in some framings — *"we acknowledge they got there first"* could be heard as conceding leadership. The mitigation is in the framing: lead with the architecture difference (single skill vs 37-skill suite), use attribution as a neutral pointer, not as a deference.

**Decision**: Promote. The attribution + architectural reframing is the honest position; the defensive-framing risk is mitigable with careful wording.

## Consequences

- **Pillar 2 headline in README** changes from *"Compound engineering, built in"* to *"Compound engineering, in one skill"*. The body adds a one-sentence attribution to EveryInc's plugin as the principle's fullest treatment in the Claude Code ecosystem, then states our architectural contribution (single self-contained orchestrator with five built-in deposit channels) explicitly.
- **CLAUDE.md two-pillars intro** drops "Distinguishes mekaknight from per-invocation discipline libraries like superpowers" as the sole framing of Pillar 2 and instead names both the wider-home plugin (EveryInc) and the architectural difference (single orchestrator vs multi-skill suite). superpowers comparison stays but is no longer the only framing.
- **CONTEXT.md `Compound engineering` glossary entry** gains a paragraph noting EveryInc's plugin as the term's dominant claim-holder in the Claude Code marketplace and mekaknight's flavor as the single-orchestrator variant. The `_Avoid_` line gains an entry: do not frame this term as something mekaknight coined.
- **`docs/strategy/competitive-landscape.md` EveryInc row TODO is resolved**: the resolution note in the third column states the decision (keep term, attribute, differentiate on architecture). The wider TODO flag is removed.
- **`docs/strategy/v2-vision.md` axis 2** ("compound-engineering-first") gains the attribution language so the strategy document reads consistent with the README/CLAUDE.md framing.
- **`docs/strategy/v2-skill-catalog.md` forge differentiation bullets** clarify that the compound-engineering pillar is our *architectural variant* of an established principle, not a coined claim.
- **HN / PH / Reddit launch copy** writes itself: *"compound engineering principles in one self-contained skill — EveryInc's plugin is the larger-suite treatment; forge is the single-orchestrator one."* Survives the obvious "is this a knockoff?" comment in the first hour after launch.
- **No skill code changes.** Retrospective phase mechanics, the five channels, and the per-channel thresholds are all unchanged. This ADR is positioning, not capability.
- **Version bump**: patch (positioning correction inside the 2.0 alpha cycle). `2.0.0-alpha.5` → `2.0.0-alpha.6`.

## Status

Active. v2.0.0-alpha.6 ships the positioning realignment. The decision survives unless EveryInc significantly changes their plugin's positioning (e.g., narrows their claim to a smaller domain that frees the umbrella term) or unless mekaknight pivots away from compound engineering as a Pillar 2 framing entirely. Re-open if either happens.
