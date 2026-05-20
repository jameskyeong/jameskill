---
name: jameskill:workflow
description: >-
  Matt Pocock skill orchestrator — from problem understanding to verified implementation.
  Chains grill-with-docs, tdd, diagnose, prototype, to-prd, to-issues, improve-codebase-architecture,
  and review based on context. Use when: 'workflow', 'start working on', 'implement this',
  'fix this', 'build this'. Also invoked by tracking-issue-resolve after issue selection.
---

# Workflow — Matt Pocock Skill Orchestrator

Orchestrates Matt Pocock skills into a complete development flow: understand the problem, build it right, and leave the codebase better than you found it.

**Compound engineering guarantee:** Every workflow run improves domain docs, test coverage, and codebase structure — not just the immediate deliverable.

---

## Phase 0: Clarify — `mattpocock-skills:grill-me`

**Goal:** Reach shared understanding of what the user actually wants.

Invoke `mattpocock-skills:grill-me` with the problem/feature description.

- Interview the user until every branch of the decision tree is resolved
- If invoked from `jameskill:tracking-issue-resolve`, use the issue title + body as the starting context
- If invoked standalone, use whatever the user provided

**Skip conditions:**
- The user explicitly says "skip clarify" or "requirements are clear"
- The input is already a detailed spec with no ambiguity

**Output:** A clear, agreed-upon problem statement.

---

## Phase 1: Grill — `mattpocock-skills:grill-with-docs`

**Goal:** Validate the clarified requirements against the project's domain model and documented decisions.

Invoke `mattpocock-skills:grill-with-docs` with the output from Phase 0.

- Challenge the plan against CONTEXT.md and existing ADRs
- Sharpen terminology to match the project's ubiquitous language
- Update CONTEXT.md / ADRs inline as decisions crystallize

**Compound effect:** Domain documentation gets refined every run.

**Output:** A validated implementation direction with updated docs.

---

## Phase 2: Route

Based on Phase 1 output, determine the nature of the work and route accordingly. **Only one route is taken per run.**

### Route A: Bug → `mattpocock-skills:diagnose`

**Signal:** Error reports, stack traces, "it used to work", reproducible broken behavior.

Invoke `mattpocock-skills:diagnose`. Follow its discipline:
1. Reproduce the bug
2. Minimize the reproduction
3. Form a hypothesis
4. Instrument to verify
5. Fix
6. Regression test

After diagnose completes, proceed to **Phase 3.5** (skip Phase 3 — diagnose already includes the fix + test).

### Route B: Exploration → `mattpocock-skills:prototype`

**Signal:** UI shape is uncertain, data model needs experimentation, "I'm not sure how this should work".

Invoke `mattpocock-skills:prototype`. It will either:
- Build a runnable terminal app (for state/logic questions)
- Generate multiple UI variations (for design questions)

After the user picks a direction from the prototype, proceed to **Phase 3**.

### Route C: Large feature → `mattpocock-skills:to-prd` → `mattpocock-skills:to-issues`

**Signal:** Phase 1 output contains 3+ distinct tasks, spans multiple modules, or would take multiple sessions.

1. Invoke `mattpocock-skills:to-prd` to formalize the requirements into a PRD
2. Invoke `mattpocock-skills:to-issues` to break the PRD into vertical-slice issues
3. Present the issue list to the user
4. Inform the user they can register issues via `/jameskill:tracking-issue-report` and work each one via `/jameskill:workflow` individually
5. **Stop here** — do not attempt to implement all issues in one run

### Route D: Clear feature → Phase 3 directly

**Signal:** None of the above. Requirements are clear, scope is contained, ready to build.

Proceed directly to **Phase 3**.

---

## Phase 3: Build — `mattpocock-skills:tdd`

**Goal:** Implement the solution with test-driven development.

Invoke `mattpocock-skills:tdd`. Follow the red-green-refactor loop strictly:
1. **RED** — Write a failing test first
2. **GREEN** — Write minimal code to make it pass
3. **REFACTOR** — Clean up while keeping tests green
4. Repeat until the feature is complete

**Skip conditions:**
- UI-only work with no testable logic (per project CLAUDE.md: "No tests for UI-only components")
- Route A already completed fix + test via diagnose

**Output:** Working implementation with tests.

---

## Phase 3.5: Architecture — `mattpocock-skills:improve-codebase-architecture`

**Goal:** Check whether the new code fits well structurally, and fix what can be fixed now.

Invoke `mattpocock-skills:improve-codebase-architecture` scoped to the files changed in Phase 3 (or Route A).

Review results and act:

| Finding | Action |
|---|---|
| In scope of current work | Fix immediately (loop back to Phase 3 tdd for the fix) |
| Out of scope, small (1-2 lines) | Fix immediately |
| Out of scope, large | Note for the user — suggest `/jameskill:tracking-issue-report` to track separately |

**Compound effect:** Codebase architecture improves incrementally with every workflow run.

**Output:** Cleaner codebase + list of deferred improvements (if any).

---

## Phase 4: Review — Two-Axis Code Review

**Goal:** Two-axis code review before declaring done. Standards and Spec are reviewed independently so one axis cannot mask the other.

### 4.1: Determine the diff

Capture the diff from the commit/branch where work started:

```bash
git diff <start-point>...HEAD
git log <start-point>..HEAD --oneline
```

The start point is the commit before Phase 3 began (or before Route A's diagnose began).

### 4.2: Collect review sources

**Standards sources** — documents that define how code should be written:
- `CLAUDE.md`, `AGENTS.md`, `CONTRIBUTING.md`
- `CONTEXT.md`, per-module `CONTEXT.md` files
- `docs/adr/` (architectural decisions are standards)
- Linter/formatter configs (`biome.json`, `eslint.config.*`, `tsconfig.json`) — note them but don't re-check what tooling already enforces

**Spec source** — what was agreed to build:
- The problem statement from Phase 0-1 (grill-me + grill-with-docs output)
- If invoked from tracking-issue-resolve: the original issue title + body
- Issue references in commit messages (`#123`, `Closes #45`)
- PRD from Route C if applicable

### 4.3: Run two reviews in parallel sub-agents

Spawn two `general-purpose` sub-agents simultaneously. They must not share context.

**Standards sub-agent prompt:**
> Read the standards docs: [list of files from 4.2]. Then read the diff: `git diff <start-point>...HEAD`. Report — per file/hunk where relevant — every place the diff violates a documented standard. Cite the standard (file + the rule). Distinguish hard violations from judgement calls. Skip anything tooling already enforces. Under 400 words.

**Spec sub-agent prompt:**
> Read the spec: [spec content from 4.2]. Then read the diff: `git diff <start-point>...HEAD`. Report: (a) requirements the spec asked for that are missing or partial; (b) behavior in the diff that wasn't asked for (scope creep); (c) requirements that look implemented but where the implementation looks wrong. Quote the spec line for each finding. Under 400 words.

### 4.4: Aggregate and act

Present the two reports under `## Standards` and `## Spec` headings. Do **not** merge or rerank — keep axes separate.

| Review result | Action |
|---|---|
| Hard violation found | Fix it, loop back to Phase 3 tdd |
| Judgement call flagged | Present to user for decision |
| Both axes pass | Proceed to Phase 5 |

**Output:** Standards + Spec review report, all violations resolved.

---

## Phase 5: Verify

**Goal:** Mechanical verification that nothing is broken.

Run the project's verification commands. Detect from project config which commands are available:

- **Type checking** (e.g. `tsc --noEmit`, `pnpm typecheck`)
- **Tests** (e.g. `vitest`, `jest`, `pnpm test`)
- **Lint/format** (e.g. `biome check`, `eslint`, `pnpm check`)

If the project has a top-level script that runs all checks (e.g. `pnpm check`, `npm run ci`), prefer that.

If any command fails, fix the issue and re-run from Phase 5 (do not re-run earlier phases unless the fix is substantial).

**Output:** All checks green. Work is complete.

---

## Caller integration

### From `jameskill:tracking-issue-resolve`

When invoked from tracking-issue-resolve:
- Phase 0 receives the issue title + body as starting context
- All phases proceed normally
- On completion, control returns to tracking-issue-resolve for status transition + memo

### Standalone usage

When invoked directly via `/jameskill:workflow`:
- User provides the problem/feature description as the argument
- All phases proceed normally
- On completion, summarize what was done

---

## Abort handling

If the user interrupts at any phase:
- Work completed in prior phases (docs updates, tests, code) persists in the working tree
- The user can resume by running `/jameskill:workflow` again with the same context
- No automatic state tracking — the user decides where to pick up

---

## Skill availability

Each phase invokes a Matt Pocock skill (except Phase 4 which is self-contained). If a skill is unavailable:
- **grill-me / grill-with-docs unavailable:** Proceed with standard interactive brainstorming — present context and work through the solution conversationally
- **tdd unavailable:** Implement with manual TDD discipline (write test first, then code)
- **diagnose unavailable:** Debug systematically (reproduce → hypothesize → verify → fix)
- **Any other skill unavailable:** Inform the user and adapt the phase's intent with available tools

Never skip a phase entirely because a skill is unavailable — fulfill the phase's goal by other means.
