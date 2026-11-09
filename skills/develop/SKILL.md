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

**Pipeline**: Preflight → Clarify → Route (DIRECT / PLAN for features, DIAGNOSE for bugs, PROTOTYPE for throwaway exploration) → Build (strict TDD) → Peer-review → Verify → Retrospective (compound-engineering deposits) → Finish.

This file holds every gate, loop count and stop rule, small enough to survive compaction; detail lives in [`references/`](references/README.md).

---

## Cross-cutting gate: mandatory reference loading

**When a phase begins, Read its reference module before the phase's first action.** A reference already read this session need not be re-read, **unless the context was compacted since:** after any compaction, re-read this file's gate tables and the current phase's reference before the next action.

| Phase | Read at phase entry |
|---|---|
| Preflight | [`references/verification.md`](references/verification.md) |
| Clarify | [`references/grilling.md`](references/grilling.md) |
| Route → PLAN | [`references/planning.md`](references/planning.md) |
| Route → DIAGNOSE | [`references/diagnosis.md`](references/diagnosis.md) |
| Route → PROTOTYPE | [`references/prototyping.md`](references/prototyping.md) |
| Build | [`references/tdd-discipline.md`](references/tdd-discipline.md) + The run log in [`references/planning.md`](references/planning.md) |
| Peer-review | [`references/peer-review.md`](references/peer-review.md) + [`references/subagent-patterns.md`](references/subagent-patterns.md) |
| Verify | [`references/verification.md`](references/verification.md) |
| Retrospective | [`references/retrospective.md`](references/retrospective.md) |
| Finish | [`references/finishing.md`](references/finishing.md) |

Running a phase from memory is a gate violation.

---

## Cross-cutting rule: phase tracking

Track the pipeline with the task tracker; an untracked phase is silently skippable. Start with `Preflight`, `Clarify`, `Route`. When Route selects, append the route's steps (PLAN: one per task; DIAGNOSE: its five steps; PROTOTYPE: its steps) plus `Peer-review` (not for PROTOTYPE), `Verify`, `Retrospective`, `Finish`. A phase todo is completed only when its exit gate is stated with evidence.

---

## Cross-cutting gate: verification before completion

Every phase that ends with a "done", "passing", or "fixed" claim **MUST** pass its exit gate first. Depth: [`references/verification.md`](references/verification.md).

### Forbidden language

Banned in any completion claim; writing one means you have not verified: "should work", "seems to pass", "probably fixed", "I think it passes", "looks correct", "this should be fine", "likely works".

**The rule:** run the verification command, read the output directly (not a summary or a memory), and only then state "verified: [what passed] (observed: [output])".

### Per-phase exit gates

| Phase | Exit gate |
|---|---|
| Preflight | All environment checks pass (output observed) |
| Clarify | Ambiguity checklist = 0 items AND user chose an approach AND playback shown AND user explicitly confirms |
| Route (PLAN only) | User confirms plan file |
| Build (per task) | The project's test command shows no failure beyond the Preflight baseline; every failure named |
| Peer-review | Every Critical/Important finding addressed or explicitly user-deferred |
| Verify | lint + typecheck + test + architecture review all green (output observed) AND the UI surface driven, or its absence stated |
| Retrospective | Each qualifying channel (ADR / rules / glossary / .out-of-scope/ / checks) reached an explicit user decision |
| Finish | git status clean after commit AND recorded rulings presented (or "none" stated) |

---

## Cross-cutting rule: loop counts are stated, not remembered

Two loops have hard caps: **DIAGNOSE fix attempts (3)** and **Peer-review fix → re-review rounds (3)**. Before each attempt or round, re-read that loop's circuit breaker below and state the count (`fix attempt 2/3`, `review round 2/3`). A count kept only in memory resets silently after compaction.

---

## Cross-cutting rule: rulings, not stalls (Build through Verify)

After the user confirms the approach, from **Build through Verify** (DIAGNOSE's Fix, PROTOTYPE's build and review triage included), when a non-catastrophic decision blocks progress, make the call, log `Ruling: <what> | why: <why> | cost if wrong: <cost>` (the plan's `## Progress`, else the run file), and keep going. Finish lists them from that log; a ruling that dies with the session was made in secret.

**Still stop and ask**, always, for these four classes:

1. Irreversible or destructive actions (data deletion, force-push, dropping schema).
2. Security-sensitive choices (auth, secrets, permissions).
3. Side effects outside the working tree (external services, published artifacts).
4. A plan or spec so broken that every path forward is a guess: re-Clarify, not a ruling.

Clarify, Route and plan confirmation belong to the user and stay blocking.

---

## Cross-cutting gate: user-facing communication style

Every user-facing summary **MUST** gloss non-obvious identifiers on first mention (internal names, abbreviations, project terms): 5–15 characters in the user's language. Skip standard terms, terms the user already used, and code blocks. Never send identifier soup (three or more un-glossed identifiers in one bullet) or a name glossed with itself. Depth: [`references/communication-style.md`](references/communication-style.md).

---

## Preflight: Environment check

1. **Git repository** (`git rev-parse --git-dir`). Not a repo → **HALT**.
2. **Test runner**. None → **HALT**: strict TDD needs one; set it up, then re-run `/develop`. Report the command, run it once, and note the failures already present (the baseline).
3. **Type checker** and 4. **linter**, both optional (detection files in `references/verification.md`). None → NOTE: Verify skips it.
5. **UI surface and driver** (optional; detection table in `references/verification.md`). Report both; a surface without a driver is a NOTE: Verify uses substitute evidence.
6. **Open follow-ups** in `$(git rev-parse --git-dir)/develop/follow-ups.md`: show them before Clarify; they go first.

**Exit gate:** all checks ran, output observed, no HALT.

---

## Clarify: Relentless questioning

Invoked with a plan file path (`docs/plans/<github-id>/*.md`) → skip Clarify and Route; Build resumes it after the resume check in `references/planning.md`.

- Ask in **rounds** over a decision tree: each round presents every **frontier question** that changes the build numbered, each with a **recommended answer** worded so "yes" accepts it (`1️⃣ **<title>**: … / ➡️ Recommended: …, because <why>`), `---` between questions. Everything else is stated as `My call: X, because Y`; process choices are the agent's. If the request omits **why**, open with that one open question, no recommendation. One at a time if the user asked.
- **Facts are the agent's job; decisions are the user's.** Read the codebase instead of asking.
- Scan `.out-of-scope/` first, if present. Read the glossary (`GLOSSARY.md`, else `CONTEXT.md`), if present, and challenge language that conflicts with it; propose a glossary entry **inline** the moment a term resolves.
- **Checklist**, all five: scope boundaries, edge cases, term definitions, conflicts with existing code, success criteria and anti-goals (which test proves it, at **which seam**, each seam noted with what it catches, misses, and its speed; Build tests only at agreed seams).
- **Approaches:** at checklist zero, 2-3 structurally different approaches with trade-offs, recommendation first (one viable → say why the others are not). No plan, routing or code before the user chooses.

**Exit gate:** zero remaining ambiguities, approach chosen, a playback shown (`You decided:` / `My call:` / `Review focus:` lines; off PLAN it is saved in the run file as the spec), and the user explicitly confirms **"All ambiguities resolved, approach chosen. Proceed?"** Skip only when the user says "skip clarify", "requirements are clear", or "skip brainstorming"; never on the agent's own judgment. On a new project, a skip still states the build choices in one line.

---

## Route

| Route | When | Next |
|---|---|---|
| **DIRECT** | Small, contained: 1-4 commits, no task dependencies | Build |
| **PLAN** | Medium: 5-15 commits, 2-4 files with shared state, dependent tasks | Plan file → confirm → docs checkpoint → Build |
| **DIAGNOSE** | Bug-first: errors, "something is broken" | Reproduce → Minimize → Investigate → Fix → Regression-prevent |
| **PROTOTYPE** | Throwaway exploration: "which design fits" | Prototype branch → user review → Discard or Promote |

**Ratchet, upgrades only.** One route at a time. When in doubt, take the heavier route; reaching for the lighter one to skip its ceremony is itself the doubt. "Small" measures the change and the repo, not your familiarity: an unfamiliar codebase or a new project is heavier by definition. A DIRECT run that uncovers hidden dependencies, shared state, or a growing task list stops at a clean point, keeps the work, writes the plan file for the rest (carrying over the run file's log), and gets confirmation. State every route change out loud. PRD-scale work is unsupported: suggest a PRD in `docs/prd/` and several sessions.

**DIRECT:** proceed to Build.

**PLAN:**
1. Write `docs/plans/<github-id>/<slug>.md` from the template in `references/planning.md`. Steps record decisions, not code; `## Review focus` names implied inputs; self-review inline, never by subagent. Exit gate: the user confirms **"This is the execution plan. Proceed, or adjust?"**
2. Docs checkpoint: commit uncommitted docs (glossary, ADRs, plan) as `docs: capture context for <feature>`; its SHA is the plan's `BASE:`.
3. Execute tasks in dependency order, each a full Build cycle; re-read the task's section first and log its completion in `## Progress`. When a task goes off plan: the code is wrong → debug it; the plan is wrong and the smallest fix that satisfies the spec is clear → `Ruling:`, update the plan file, continue; every path a guess, or a stop class → stop and ask. A scope addition is always a question.

**DIAGNOSE:**
1. **Reproduce:** a fast, deterministic pass/fail signal (failing test preferred; loop menu in `references/diagnosis.md`). The observed failure points at the bug, not at setup.
2. **Minimize** to the bug-causing surface.
3. **Investigate:** 3-5 ranked, falsifiable hypotheses before testing any. Read code; do not change it. Instrumentation is tagged `[DEBUG-xxxx]` and removed before the fix commits.
4. **Fix:** the minimum change that passes the minimized test without breaking others.
5. **Regression-prevent:** the test is committed with the fix after the **revert ritual**: revert the fix without `git stash`, prove the revert landed with `git diff --stat`, observe red, restore, observe green.

**Circuit breaker: three failed fixes means the architecture is the problem.** A failed fix returns to Investigate; after the **third**, STOP. No fix #4: bring the three attempts to the user and discuss restructuring. Then Peer-review → Verify → Retrospective → Finish, as on other routes.

**PROTOTYPE:** TDD is relaxed for this route only; follow `references/prototyping.md`. Work on `prototype/<name>` from a clean main, under an explicit time-box; existing tests still pass; present what it revealed without declaring done. The user decides Discard (default), Promote (a fresh PLAN run; no code graduates), or Re-Clarify. The branch is never merged or deleted.

---

## Build: Strict TDD

**First record the review baseline, BASE,** where it survives the session: on PLAN, the docs-checkpoint SHA in the plan file (a resumed run reuses it, never its own starting HEAD); on other routes, `git rev-parse HEAD` at Build start, stated as `BASE: <sha>` atop the run file, `$(git rev-parse --git-dir)/develop/<slug>.md`. A ratchet-upgraded run keeps its first BASE.

```
NO PRODUCTION CODE WITHOUT A FAILING TEST FIRST
```

Implementation written before its test is **deleted**: not kept as reference, not adapted, not commented out.

Per unit of work (one PLAN task, or the whole DIRECT change):
1. **RED:** write the test, run it, **observe it fail** with the expected message. Unexpected pass → STOP and investigate. Unexpected error → fix the test.
2. **GREEN:** the minimum code to pass; run it; **observe it pass**.
3. **REFACTOR:** with tests green, clean up; run after each change; revert a refactor that breaks a test.
4. **Repeat** for the next behavior.

**Exit gate:** the project's test command shows no failure beyond the Preflight baseline, output directly observed; every failure is named (a slow suite may run a disclosed subset). No skipped or commented-out tests, no "TODO: add test later".

---

## Peer-review: Independent diff review

1. **Diff to a scratch file, working tree included:** `git add -N <new files>`, then `git diff BASE > <scratch>`. Do not dispatch on an empty diff, or when `git merge-base --is-ancestor BASE HEAD` fails.
2. **Dispatch a fresh reviewer**, a named agent type, never a fork (it inherits this conversation and ignores the model override). The first review runs on the most capable tier; re-review rounds on mid tier. A re-review judges only the fix diff since the last round's snapshot (`references/peer-review.md`). No reviewer dispatchable at all → a labeled, logged self-review, disclosed at Finish. Use the prompt template in `references/peer-review.md`; pass the spec, the diff and the rule files covering the changed paths **by path**. Log each line it declined to judge as a `Ruling:`.
3. **Triage:** **Critical** → fix now through the Build loop, then re-review. **Important** → fix unless the user explicitly defers. **Minor** → note, do not block. Push back on a wrong finding with reasoning; never agree performatively.

**Circuit breaker: count fix → re-review rounds.** After the third round that still leaves Critical/Important findings, STOP: no round four. Hand the user the remaining findings and what was attempted, to rule on each (fix now / defer / reject).

**Exit gate:** every Critical and Important finding resolved or explicitly user-deferred.

---

## Verify: Comprehensive confirmation

Run and read: (1) type checking and (2) lint, if present; (3) the full test suite (if it cannot run here, say so; it then runs before Finish or in CI); (4) architecture review of the changed files: single responsibility, naming conventions, dead code; (5) the UI surface, driven with Preflight's driver, or its absence stated.

**Exit gate:** every check green (tests: nothing beyond the baseline) with output observed; no warning accepted without justification; "all checks pass" only after listing what ran and what it printed.

---

## Retrospective: Deposit compounding artifacts

After Verify, before Finish. Check each channel silently; propose only when its threshold is met and you can name the session moment that triggered it. Formats are in `references/retrospective.md`.

1. **ADR** (`docs/adr/`): triple gate, all required: hard to reverse, surprising without context, a real trade-off. Never for bug fixes.
2. **Discipline rules** (the repo's own rule files): a new failure mode or edge case they do not cover.
3. **Glossary** (`GLOSSARY.md` or an existing `CONTEXT.md`; new ones are `GLOSSARY.md`; final sweep): a term introduced or contested this session and not deposited inline.
4. **`.out-of-scope/`**: a rejection with a load-bearing reason that a future session will likely re-propose. One file per concept; a deferral is not a rejection.
5. **Check** (lint rule, hook, test): a mechanical mistake this session. On accept, log `Follow-up:`; it is the next run's first task, never built after Verify.

Propose one at a time, never batched, each `[y/edit/n]`. On accept, write and `git add` the file. If nothing qualifies, say *"Retrospective: no compounding-worthy artifacts this session."*

**Exit gate:** every qualifying channel reached an explicit user decision and accepted deposits are staged, or the one-line note is recorded. No invented deposits.

---

## Finish: Commit and decide

1. **Final commit** of every path this run changed, deposits included: `git add <paths> && git commit -m "<type>: <description>" -- <paths>`, never `--amend`, then `git show --name-only HEAD`.
2. **Session report**, built from the log, not memory: what was done, every `Ruling:`, deferred Minor and `Follow-up:`, or "No rulings this session."
3. **Branch decision**, three options: **Local merge**, **Open PR** (body: Summary, Evidence before/after, Merge danger), **Keep branch**.

**Discard is not on the menu.** A branch is deleted only when the user explicitly asks and then types the literal word `discard`; "yeah, get rid of it" does not count. No auto-merge or auto-push without the user's explicit choice.

**Exit gate:** `git status` clean (or intentionally kept changes for Keep branch); rulings presented; the user made an explicit branch decision.

---

## Session boundaries and context hygiene

- Keep Clarify through plan confirmation in one unbroken context: those decisions have no artifact yet.
- When context runs long: end at a task boundary and resume, or dispatch scoped work to a subagent; compact last.
- **Compaction can also happen unchosen.** After one, apply the re-read rule and restate any loop count.

**Abort:** completed work stays in the working tree; the user decides where to resume.
