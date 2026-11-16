# jameskill

Claude Code plugin that provides **develop**, a self-contained development orchestrator, invoked as `/jsk:develop` in Claude Code sessions.

## Language

### Orchestration

**Develop**:
The development orchestrator skill (`/jsk:develop`). Takes raw requirements through a disciplined pipeline — clarify → route → build → review → verify → finish — to produce production-grade code. The router branches 4-way: **DIRECT** / **PLAN** for feature work, **DIAGNOSE** for bugs, **PROTOTYPE** for throwaway exploration. Each phase hardens the work one pass at a time — no phase boundary is crossed on soft language.
_Avoid_: workflow (ambiguous — see Flagged Ambiguities), temper (v1 name, retired), forge (v2.0 name, retired), powertasking (alpha.11–16 name, retired — ADR 0015)

**Cross-cutting verify gate**:
A discipline enforced at every phase boundary within **develop**: no phase may declare completion without running verification commands and directly observing the output. "Should work" and "seems to pass" are treated as "not verified."
_Avoid_: check, validation (too vague)

**Discipline references**:
The modular library at `skills/develop/references/`. Each module deepens one develop phase (or one cross-cutting concern) — principles, anti-patterns, edge cases — so develop's depth does not depend on external skills. `SKILL.md` is the orchestrator; each phase carries a pointer to its reference. See [ADR 0005](docs/adr/0005-forge-depth-references.md) for the rationale.
_Avoid_: helpers, support files (too vague — these are load-bearing discipline)

**Retrospective**:
The develop phase that runs between **Verify** and **Finish** to deposit this session's learnings into the repo's compound-engineering channels. Checks five channels in order — ADR (`docs/adr/`), discipline rules (the repo's own rule files; `skills/develop/references/` only in this repo), the domain glossary (final sweep — terms deposit inline when they resolve), `.out-of-scope/` rejection records, automated checks (logged as follow-ups for the next run) — and proposes a deposit only when the channel's threshold is met. Silent exit is the expected outcome for routine small changes; the phase is successful when it correctly identifies that no deposit is needed. See [ADR 0007](docs/adr/0007-retrospective-phase.md) and [`references/retrospective.md`](skills/develop/references/retrospective.md).
_Avoid_: documentation phase (Retrospective is for compounding artifacts, not user-facing docs), post-mortem (post-mortems are for failures; Retrospective runs on green Verify), wrap-up (too vague — Retrospective has explicit per-channel thresholds).

**Eval discipline**:
The automated regression net at `eval/` that catches drift between skill *declarations* (cross-cutting gates, inline-gloss rule, banned-language list) and skill *content*. v1 is static — check modules in `eval/checks/` apply to fixture files in `eval/fixtures/` plus the repo's skill markdown. Wired as `prepublishOnly`, so `npm publish` refuses on a failing build. v2 will add headless `claude -p` session evals against the same check library; deferred per [ADR 0009](docs/adr/0009-eval-discipline-v1.md). The fixtures are split into **positive** (ideal develop output, must pass declared checks) and **negative** (intentionally-bad samples that *must* trigger a named check) — the latter are unit tests for the checks themselves.
_Avoid_: tests (overlaps with code tests; eval discipline is for skill prose), linting (lint suggests style; eval enforces declared rules), QA (too vague), CI (an enforcement mechanism, not the discipline itself).

### Positioning

**Compound engineering**:
The architectural principle — the second of jameskill's two pillars alongside the **develop** orchestrator — that each session must deposit durable artifacts in the repo so future sessions start ahead. The seven compounding channels and how they fill: **plan files** in `docs/plans/<github-id>/` (auto, PLAN route), **DIAGNOSE regression tests** in the test suite (auto, DIAGNOSE route), **ADRs** in `docs/adr/` (auto-prompted by Retrospective, Channel 1), **discipline rules** in the repo's own rule files (auto-prompted by Retrospective, Channel 2), the **domain glossary** (`GLOSSARY.md` or `CONTEXT.md`; inline the moment a term resolves; Retrospective Channel 3 sweeps stragglers), **`.out-of-scope/` rejection records** (auto-prompted by Retrospective, Channel 4), **automated checks** (proposed by Retrospective, Channel 5, and built as the next run's first task).

The term is **not jameskill's coinage** — EveryInc's [compound-engineering-plugin](https://github.com/EveryInc/compound-engineering-plugin) is the dominant claim-holder in the Claude Code ecosystem (37 skills, "Official Compound Engineering plugin"). jameskill ships an architectural variant: same principle (cross-session artifact deposit so the codebase gets easier to work in), bundled into a single self-contained orchestrator rather than a multi-skill suite the user composes. EveryInc's channels (STRATEGY.md, brainstorms, pulse-reports, code-review patterns, implementation plans) overlap in spirit with ours but are organized differently. See [ADR 0008](docs/adr/0008-compound-engineering-positioning.md) for the positioning decision.

Deeper process-learning compounding (DIRECT-route Clarify-answer reuse, Peer-review meta-pattern extraction, cross-session retrospective accumulation) is **open work** — out of scope for v2.0 per ADR 0007's status note.
_Avoid_: continuous integration (overloaded term), AI feedback loop (too vague — compound engineering specifically means artifact deposit into the repo), context engineering (different — that's about runtime prompt assembly, not durable repo artifacts), claiming the term as jameskill's coinage (it isn't — attribute EveryInc as the wider home).

### Routing

**DIRECT**:
A **develop** routing decision for small, contained changes (1-4 commits, tightly-grouped files). Skips plan file creation and proceeds straight to build.
_Avoid_: simple, small (subjective)

**PLAN**:
A **develop** routing decision for medium-scope features (5-15 commits, 2-4 files with shared state). Produces a plan file in `docs/plans/<github-id>/` before sequential task execution.
_Avoid_: roadmap, spec (different things)

**DIAGNOSE**:
A **develop** routing decision for bug-first work. Five steps: Reproduce (write a test that fails because of the bug) → Minimize (trim until the test exercises only the bug-causing surface) → Investigate (hypothesis-driven code reading) → Fix (standard GREEN discipline) → Regression-prevent (the minimized test stays in the suite permanently). The minimized reproduction test is the regression net. See [ADR 0006](docs/adr/0006-forge-route-expansion.md).
_Avoid_: debug, troubleshoot (too vague — DIAGNOSE is the route name with a specific phase order)

**PROTOTYPE**:
A **develop** routing decision for throwaway exploration ("which design fits", "try a few approaches"). TDD is intentionally relaxed; two or three meaningfully different variations are built within a time-box; the user reviews and chooses Discard (default), Promote-to-Plan (kicks off a fresh PLAN run on the chosen variation), or Re-Clarify (the question was wrong). Prototype code does not graduate to production — Promote means restart with full discipline. See [ADR 0006](docs/adr/0006-forge-route-expansion.md).
_Avoid_: spike (too informal — PROTOTYPE has explicit phase order and exit gate), POC (overloaded term)

## Flagged ambiguities

**"workflow"**: Previously used for both the orchestrator skill name AND the general concept of jameskill's pipeline. Resolved: the skill is now **develop**, and the flow it runs is described under **Develop**. The v1.x orchestrator once named "workflow" (later `workflow-external`) was retired entirely in 2.0.0-alpha.19 — avoid the bare word "workflow" as a skill name.

## Example dialogue

> **Dev**: "The export button throws on an empty report. Should I prototype a fix?"
> **Domain expert**: "No. A broken behavior is a DIAGNOSE run: reproduce it, minimize it, fix it, and keep the regression test. PROTOTYPE is for an open design question, and its code never ships."
> **Dev**: "And if the fix shows the export design itself is wrong?"
> **Domain expert**: "Finish the fix first. Retrospective then proposes an ADR, and the redesign starts as its own PLAN run."
