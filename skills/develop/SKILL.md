---
name: develop
description: >-
  Self-contained development orchestrator for feature work, bug fixes, and throwaway exploration.
  Use when: 'develop', 'powertasking' (legacy name), 'start working on', 'implement this', 'build this' (feature),
  'fix this', 'debug this', 'diagnose this' (bug),
  'prototype this', 'try a design', 'explore options' (exploration),
  or when resuming a plan file from docs/plans/.
---

# Develop: Development Orchestrator

Self-contained orchestrator that takes raw requirements through a disciplined pipeline to production-grade code. No external skill dependencies.

**Pipeline**: Preflight → Clarify → Route (DIRECT / PLAN for features, DIAGNOSE for bugs, PROTOTYPE for throwaway exploration) → Build (strict TDD) → Peer-review → Verify → Retrospective (compound-engineering deposits) → Finish. No phase boundary is crossed on soft language. (The pipeline lives here, not in the description: a workflow summary in the description makes agents follow it and skip the gates.)

This file holds every gate, loop count and stop rule, and stays under 20,000 bytes so it survives compaction whole. Procedures, templates, anti-patterns and edge cases live in [`references/`](references/README.md).

---

## Cross-cutting gate: mandatory reference loading

**When a phase begins, Read its reference module before the phase's first action.** The references hold the tripwires this file omits, and a tripwire not in context cannot interrupt you. A reference already read this session need not be re-read, **unless the context was compacted since:** after any compaction, re-read this file's gate tables and the current phase's reference before the next action.

| Phase | Read at phase entry |
|---|---|
| Clarify | [`references/grilling.md`](references/grilling.md) |
| Route → PLAN | [`references/planning.md`](references/planning.md) |
| Route → DIAGNOSE | [`references/diagnosis.md`](references/diagnosis.md) |
| Route → PROTOTYPE | [`references/prototyping.md`](references/prototyping.md) |
| Build | [`references/tdd-discipline.md`](references/tdd-discipline.md) |
| Peer-review | [`references/peer-review.md`](references/peer-review.md) + [`references/subagent-patterns.md`](references/subagent-patterns.md) |
| Verify | [`references/verification.md`](references/verification.md) |
| Retrospective | [`references/retrospective.md`](references/retrospective.md) |
| Finish | [`references/finishing.md`](references/finishing.md) |

Running a phase from memory instead of the module on disk is a gate violation.

---

## Cross-cutting rule: phase tracking

Track the pipeline with the task tracker (TodoWrite or equivalent); an untracked phase is silently skippable. Start with `Preflight`, `Clarify`, `Route`. When Route selects, append the route's steps (PLAN: one per task; DIAGNOSE: its five steps; PROTOTYPE: question, branch, shape, time-box, build, present, decide) plus `Peer-review` (not for PROTOTYPE), `Verify`, `Retrospective`, `Finish`. A phase todo is completed only when its exit gate is stated with evidence.

---

## Cross-cutting gate: verification before completion

Every phase that ends with a "done", "passing", or "fixed" claim **MUST** pass its exit gate first. Depth: [`references/verification.md`](references/verification.md).

### Forbidden language

Banned in any completion claim; writing one means you have not verified: "should work", "seems to pass", "probably fixed", "I think it passes", "looks correct", "this should be fine", "likely works".

**The rule:** run the verification command, read the output directly (not a summary or a memory), and only then state "verified: [what passed] — [observed output]".

### Per-phase exit gates

| Phase | Exit gate |
|---|---|
| Preflight | All environment checks pass — output observed |
| Clarify | Ambiguity checklist = 0 items AND user chose an approach AND user explicitly confirms |
| Route (PLAN only) | User confirms plan file |
| Build (per task) | Test runs observed to pass with exact output |
| Peer-review | Every Critical/Important finding addressed or explicitly user-deferred |
| Verify | lint + typecheck + test + architecture review all green — output observed — AND the UI surface driven, or its absence stated |
| Retrospective | Each qualifying channel (ADR / references / CONTEXT.md / .out-of-scope/) reached an explicit user decision |
| Finish | git status clean after commit AND recorded rulings presented (or "none" stated) |

---

## Cross-cutting rule: loop counts are stated, not remembered

Two loops have hard caps: **DIAGNOSE fix attempts (3)** and **Peer-review fix → re-review rounds (3)**. Before each attempt or round, re-read that loop's circuit breaker below and state the count (`fix attempt 2/3`, `review round 2/3`). A count kept only in memory resets silently after compaction.

---

## Cross-cutting rule: rulings, not stalls (Build & Verify only)

After the user confirms the plan or approach, execution does not park on questions the orchestrator can safely decide. During **Build and Verify** (including DIAGNOSE's Fix and PROTOTYPE's build), when a non-catastrophic decision blocks progress, make the call, record `Ruling: <what was decided> — <why> — <cost if wrong>`, and keep going. Finish lists every ruling: a ruling that dies with the session was a decision made in secret.

**Still stop and ask**, always, for these four classes:

1. Irreversible or destructive actions (data deletion, force-push, dropping schema).
2. Security-sensitive choices (auth, secrets, permissions).
3. Side effects outside the working tree (external services, published artifacts).
4. A plan or spec so broken that every path forward is a guess: re-Clarify, not a ruling.

Clarify, Route and plan confirmation belong to the user and stay blocking.

---

## Cross-cutting gate: user-facing communication style

Every user-facing summary (phase reports, change explanations, diff walkthroughs) **MUST** gloss non-obvious identifiers on first mention: internal names, abbreviations and symbols, and project terms not yet established. 5–15 characters in the user's language, e.g. `combineQuality(품질 등급 결합 함수)`. Skip standard terms (`test`, `null`), terms the user already used, code-block content, and public APIs the user knows. Never send identifier soup (three or more un-glossed identifiers in one bullet), jargon cascades, or a name glossed with itself. Depth: [`references/communication-style.md`](references/communication-style.md).

---

## Preflight: Environment check

1. **Git repository** (`git rev-parse --git-dir`). Not a repo → **HALT**.
2. **Test runner** (`package.json`, `Makefile`, `pyproject.toml`, …). None → **HALT**: strict TDD needs one; set it up, then re-run `/develop`. Report the command.
3. **Type checker** (`tsconfig.json`, `mypy.ini`, `pyrightconfig.json`) and 4. **linter** (`.eslintrc*`, `biome.json`, `ruff.toml`, `.flake8`), both optional. None → NOTE: Verify skips it.
5. **UI surface and driver** (optional): Web (`next`, `vite`, `react-dom`, `astro`, `svelte`) → `agent-browser`; Flutter (`pubspec.yaml`) → `flutter drive` or `patrol`; React Native (`expo`, `react-native`) → `maestro`; else the runnable artifact. Report surface and driver; a surface without a driver is a NOTE: Verify uses substitute evidence.

**Exit gate:** all checks ran, output observed, no HALT.

---

## Clarify: Relentless questioning

**Goal:** shared understanding with zero ambiguity. Invoked with a plan file path (`docs/plans/<github-id>/*.md`) → skip Clarify and Route; Build resumes it.

- Ask in **rounds** over a decision tree: each round presents every **frontier question** (prerequisites settled), numbered, each with a **recommended answer** and reasoning (`❓ **Q1 — <title>**: … / ➡️ Recommended: … — <why>`).
- **Facts are the agent's job; decisions are the user's.** Read the codebase instead of asking.
- Scan `.out-of-scope/` first, if present. Read `CONTEXT.md`, if present, and challenge language that conflicts with it; propose a glossary entry **inline** the moment a term resolves.
- **Checklist**, all five: scope boundaries, edge cases, term definitions, conflicts with existing code, success criteria (which test proves it, at **which seam**; Build tests only at agreed seams).
- **Approaches:** at checklist zero, 2-3 structurally different approaches with trade-offs, recommendation first (one viable → say why the others are not). No plan, routing or code before the user chooses.

**Exit gate:** zero remaining ambiguities, approach chosen, and the user explicitly confirms **"All ambiguities resolved, approach chosen. Proceed?"** Skip only when the user says "skip clarify", "requirements are clear", or "skip brainstorming"; never on the agent's own judgment.

---

## Route

| Route | When | Next |
|---|---|---|
| **DIRECT** | Small, contained: 1-4 commits, grouped files, no task dependencies | Build |
| **PLAN** | Medium: 5-15 commits, 2-4 files with shared state, dependent tasks | Plan file → confirm → docs checkpoint → Build |
| **DIAGNOSE** | Bug-first: reproduction steps, errors, "something is broken" | Reproduce → Minimize → Investigate → Fix → Regression-prevent |
| **PROTOTYPE** | Throwaway exploration: "how should this look", "which design fits" | Prototype branch → user review → Discard or Promote |

**Ratchet, upgrades only.** One route at a time. When in doubt, take the heavier route; reaching for the lighter one to skip its ceremony is itself the doubt. "Small" measures the change and the repo, not your familiarity: an unfamiliar codebase or a new project is heavier by definition. A DIRECT run that uncovers hidden dependencies, shared state, or a growing task list stops at a clean point, keeps the work, writes the plan file for the rest, and gets confirmation. State every route change out loud. PRD-scale multi-session work is unsupported: suggest a PRD in `docs/prd/` split into several `/develop` sessions.

**DIRECT:** proceed to Build.

**PLAN:**
1. Write `docs/plans/<github-id>/<slug>.md` from the template in `references/planning.md`. No placeholders; self-review inline, never by subagent. Exit gate: the user confirms **"This is the execution plan. Proceed, or adjust?"**
2. Docs checkpoint: commit uncommitted docs (CONTEXT.md, ADRs, plan) as `docs: capture context for <feature>`.
3. Execute tasks in dependency order, each a full Build cycle. When a task goes off plan: the code is wrong → debug it; the plan is wrong and the smallest fix that satisfies the spec is clear → `Ruling:`, update the plan file, continue; every path a guess, or a stop class → stop and ask. A scope addition is always a question.

**DIAGNOSE:**
1. **Reproduce:** a fast, deterministic pass/fail signal (failing test preferred; loop menu in `references/diagnosis.md`). The observed failure points at the bug, not at setup.
2. **Minimize** to the bug-causing surface.
3. **Investigate:** 3-5 ranked, falsifiable hypotheses before testing any. Read code; do not change it. Instrumentation is tagged `[DEBUG-xxxx]` and removed before the fix commits.
4. **Fix:** the minimum change that passes the minimized test without breaking others.
5. **Regression-prevent:** the test is committed with the fix after the **revert ritual**: revert the fix without `git stash`, prove the revert landed with `git diff --stat`, observe red, restore, observe green.

**Circuit breaker: three failed fixes means the architecture is the problem.** A failed fix returns to Investigate; after the **third**, STOP. No fix #4: bring the three attempts to the user and discuss restructuring. Then Peer-review → Verify → Retrospective → Finish, as on other routes.

**PROTOTYPE:** TDD is relaxed for this route only. State the question in one sentence; `git checkout -b prototype/<name>` from a clean main; pick the shape (LOGIC: one interactive harness; UI: two or three variations) and an explicit time-box; build without RED, REFACTOR or Peer-review while existing tests still pass; present what it revealed without declaring done. The user decides Discard (default), Promote, or Re-Clarify. **Promote is a restart:** a fresh PLAN run, no code graduates. The branch stays under `prototype/<name>`, never merged, never deleted.

---

## Build: Strict TDD

**First record the review baseline, BASE,** where it survives the session: on PLAN, the docs-checkpoint SHA in the plan file (a resumed run reuses it, never its own starting HEAD); on other routes, `git rev-parse HEAD` at Build start, stated as `BASE: <sha>` and written atop the scratch spec file. A ratchet-upgraded run keeps its first BASE.

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Implementation written before its test is **deleted**: not kept as reference, not adapted, not commented out. A test written around existing code never failed, so it proves nothing.

Per unit of work (one PLAN task, or the whole DIRECT change):
1. **RED:** write the test, run it, **observe it fail** with the expected message. Unexpected pass → STOP and investigate. Unexpected error → fix the test.
2. **GREEN:** the minimum code to pass; run it; **observe it pass**.
3. **REFACTOR:** with tests green, clean up; run after each change; revert a refactor that breaks a test.
4. **Repeat** for the next behavior.

**Exit gate:** all tests for this unit of work pass, output directly observed. No skipped or commented-out tests, no "TODO: add test later".

---

## Peer-review: Independent diff review

1. **Diff to a scratch file, working tree included:** `git add -N <new files>`, then `git diff BASE > <scratch>`. `git diff BASE..HEAD` sees only commits, which on DIRECT is none of the change. Do not dispatch on an empty diff, or when `git merge-base --is-ancestor BASE HEAD` fails.
2. **Dispatch a fresh reviewer**, a named agent type, never a fork: a fork inherits this conversation, which defeats independence, and ignores the model override. The first review runs on the most capable tier; re-review rounds on mid tier. Every round regenerates the scratch diff from BASE. Use the prompt template in `references/peer-review.md`; pass the spec and the diff **by path**.
3. **Triage:** **Critical** → fix now through the Build loop, then re-review. **Important** → fix unless the user explicitly defers. **Minor** → note, do not block. Push back on a wrong finding with reasoning; never agree performatively.

**Circuit breaker: count fix → re-review rounds.** After the third round that still leaves Critical/Important findings, STOP: no round four. Hand the user the remaining findings and what was attempted, to rule on each (fix now / defer / reject).

**Exit gate:** every Critical and Important finding resolved or explicitly user-deferred.

---

## Verify: Comprehensive confirmation

Run and read: (1) type checking and (2) lint, if present; (3) the full test suite (or a relevant subset for large projects); (4) architecture review of the changed files: single responsibility, naming conventions, dead code (issues → fix and re-run); (5) the UI surface, driven with Preflight's driver, or its absence stated.

**Exit gate:** every check green with output observed; no warning accepted without justification; "all checks pass" only after listing what ran and what it printed.

---

## Retrospective: Deposit compounding artifacts

After Verify, before Finish. Check each channel silently; propose only when its threshold is met. Formats are in `references/retrospective.md`.

1. **ADR** (`docs/adr/`): triple gate, all required: hard to reverse, surprising without context, a real trade-off. Number = highest `NNNN` + 1. Never for bug fixes.
2. **Discipline references** (`skills/develop/references/`): a new failure mode or edge case the reference does not cover.
3. **CONTEXT.md glossary** (final sweep): a term introduced or contested this session and not deposited inline.
4. **`.out-of-scope/`**: a rejection with a load-bearing reason that a future session will likely re-propose. One file per concept; a deferral is not a rejection.

Propose one at a time, never batched, each `[y/edit/n]`. On accept, write and `git add` the file. If nothing qualifies, say *"Retrospective: no compounding-worthy artifacts this session."*

**Exit gate:** every qualifying channel reached an explicit user decision and accepted deposits are staged, or the one-line note is recorded. No invented deposits.

---

## Finish: Commit and decide

1. **Final commit** of uncommitted implementation changes (`git add <implementation files>`, `git commit -m "<type>: <description>"`); skip if none.
2. **Session report:** what was done, then every recorded `Ruling:` (what, why, cost if wrong), or "No rulings this session."
3. **Branch decision**, three options: **Local merge**, **Open PR**, **Keep branch**.

**Discard is not on the menu.** A branch is deleted only when the user explicitly asks and then types the literal word `discard`; "yeah, get rid of it" does not count. No auto-merge or auto-push without the user's explicit choice.

**Exit gate:** `git status` clean (or intentionally kept changes for Keep branch); rulings presented; the user made an explicit branch decision.

---

## Session boundaries and context hygiene

- Clarify through plan confirmation happens in one unbroken context: decisions live only in the conversation until the plan file captures them.
- After a PLAN task's commit, the session can end and resume with `/develop <plan-file>`.
- When context runs long: continue; else end at a task boundary; else dispatch scoped work to a subagent; compact only as the last resort.
- **Compaction can also happen without being chosen.** After one, apply the re-read rule and restate any loop count before continuing.

**Abort:** completed work stays in the working tree; resume with `/develop` and the same context or plan file. The user decides where to pick up.
