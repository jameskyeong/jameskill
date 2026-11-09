# PLAN Routing Discipline: Plan Files as Contracts

Reference for develop's **Route → PLAN** sub-step. The Route section of `SKILL.md` defines the surface mechanics (write a plan file, user confirms, docs checkpoint, sequential execution). This document is the deeper discipline: what makes a plan file actually executable, how to size tasks so each one is one TDD cycle, and what to do when the plan must change mid-flight.

The non-negotiable: **a plan file is a contract, not a wish list.** It is the artifact the user confirmed and the artifact Build executes against. Vague tasks in the plan produce vague tests in Build; missing exit criteria produce "done" claims that nobody can verify.

---

## Why PLAN exists

DIRECT route handles small contained changes in one Build pass. PLAN exists for the next size up: work that touches multiple files, has internal task dependencies, or spans more time than can fit in a single uninterrupted session. The plan file is what makes that size of work survivable:

- **It captures the agreed scope** in a form that does not depend on shared memory. The user confirmed this file; the Build phase executes this file; the Peer-review phase reads this file as the spec axis.
- **It gives cross-session pickup a home.** When the session ends mid-execution, re-running `/develop <plan-file>` resumes from the first incomplete task. No "where were we" reconstruction.
- **It makes scope creep visible.** A plan file with an explicit "Out of scope" section converts scope creep from "the model just added this" to "the model added this contrary to the plan", surfaceable and reviewable.
- **It separates Decide from Do.** PLAN's first move is "write the plan and confirm." Build is downstream. The decision and the execution are different phases with different costs of error, and PLAN keeps them separated.

The cost of not writing a plan when one is warranted: mid-flight redirections that revert hours of work, scope creep that ships without anyone noticing, and re-Clarify rounds because the agent's mental model of the change drifted from the user's.

---

## The plan file template

Plans are filed per author: `docs/plans/<github-id>/<slug>.md`. Resolve `<github-id>` before writing:

1. Run `gh api user --jq .login`, which returns the author's GitHub login.
2. If `gh` is missing or unauthenticated (the command fails or returns empty), ask the user once: *"What's your GitHub id? Your plan files are filed under `docs/plans/<id>/`."*

Create `docs/plans/<github-id>/` if it does not exist yet, then write the plan with this structure:

```markdown
# Plan: <feature name>

## Goal
One sentence.

## Approach
The approach the user chose and why; one line per rejected approach and why it lost;
the approved Clarify playback's `You decided:` and `My call:` lines.

## Global constraints
Project-wide rules every task must respect: exact values, verbatim, not paraphrased
(naming scheme, error format, size limits). This block is how project-wide rules
actually reach per-task execution.

## Tasks

### Task N: <title>
- **What**: description of the change
- **Interfaces**: what this task consumes from / produces for other tasks (exact signatures)
- **Test**: test name + the assertions it makes, with the spec's exact values (RED step)
- **Implement**: signature + file + the spec's values; a body only for an algorithm the signature and tests do not determine (GREEN step)
- **Verify**: the command and its passing output
- **Commit**: commit message

## Dependencies
Which tasks depend on which.

## Review focus
Up to five inputs or failure modes the spec implies but no task's test exercises yet,
each pinned by a test in the task that owns the code. Handed verbatim to the reviewer.

## Out of scope
What this plan deliberately does NOT cover.

## Progress
BASE: <docs-checkpoint sha>
(Appended during Build, never edited before it. One line per event.)
```

**A step records decisions, not code.** A plan fails in two directions:

- **Lines that decide nothing:** "TBD", "add appropriate error handling", "write tests for the above" (without naming them), references to types no task defines. Resolve the gap or return to Clarify before presenting.
- **Bodies the signature already determines:** writing out code a capable implementer would produce from the signature and the test. That turns the plan into a transcript of the implementation, takes several times as long to write, and invites building the project while planning it.

A reference to another task goes through that task's **Interfaces** block ("uses `validateToken` from Task 2's Interfaces"), not a copy of its code.

**Docs checkpoint.** After the user confirms the plan, commit uncommitted documentation before building:

```bash
git add <doc paths> && git commit -m "docs: capture context for <feature>" -- <doc paths>
```

`<doc paths>` are the files this run wrote (the glossary, the ADR, the plan). The path-scoped commit keeps another session's staged files out (see `references/finishing.md`, Committing in a shared working tree).

Record this commit's SHA in the plan file (`BASE: <sha>`): it is the run's review baseline, and a resumed session reads it from there. A run the ratchet upgraded from DIRECT keeps the BASE it recorded first, not this commit.

---

## The run log

**Two parts, kept apart.** Everything above `## Progress` is the contract and changes only through a recorded plan update. `## Progress` is the log, appended from Build on and committed with each task.

Routes without a plan file keep the same log in the **run file**, `$(git rev-parse --git-dir)/develop/<slug>.md`: untracked, so it never lands in a commit, yet on disk, so it survives compaction and a new session. Its first lines are `BASE: <sha>` and the approved Clarify playback (the spec the reviewer reads).

Log lines:

- `Task N: complete, commit "<message>" (red: <the failure line RED showed> → green: <the test command's summary line>)`, written only after the passing run was observed. The red line is what the PR's before-and-after evidence quotes later.
- `Ruling: <what> | why: <why> | cost if wrong: <cost>` for every ruling made from Build through Verify.
- `Ruling (declined to judge): <behavior>: <decision> | why: <why> | cost if wrong: <cost>` for each behavior the reviewer set aside.
- `Minor (deferred): <finding>` for each Minor review finding left for later.
- `Follow-up: <check> (<hook point>)` for each automated check accepted in Retrospective (Channel 5), also written to `$(git rev-parse --git-dir)/develop/follow-ups.md` so the next run's Preflight finds it.
- `Review snapshot (round N): <tree sha>` before each review round (see `references/peer-review.md`).
- `Resume check: <n> interfaces confirmed, <m> mismatches` when a plan is resumed.

Conversation memory does not survive compaction; the log does. Finish builds its report from it, and a resumed session starts from it. When the ratchet upgrades a DIRECT run to PLAN, copy the run file's lines into the new plan's `## Progress` first, so the report keeps the rulings made before the upgrade.

---

## Anatomy of a good plan file

The template above names the sections: Goal, Approach, Global constraints, Tasks, Dependencies, Review focus, Out of scope, and the Progress log. **Approach** is how a plan keeps what other routes keep in the run file: the choice the user made in Clarify and the calls the agent made for them, so the reviewer and a resumed session both see why the plan looks the way it does. A rejected approach with a load-bearing reason may also become an `.out-of-scope/` record at Retrospective; the plan line records this run, the record warns future ones. Plus per-task structure (What / Interfaces / Test / Implement / Verify / Commit). Here is what makes each section actually load-bearing.

### Goal: one sentence

Not a paragraph. Not a list. One sentence that names the outcome of the change. If the goal needs more than one sentence, the work is either too large for a single PLAN (split into two plans) or too vague (re-Clarify).

Good: "Add password reset via email link with 1-hour expiry."
Bad: "Improve the auth system to be more user-friendly and add some new flows."

### Global constraints: exact values, verbatim

Project-wide rules the whole plan must respect: naming schemes, error-response formats, size limits, forbidden dependencies. Two rules make this section load-bearing:

- **Verbatim, not paraphrased.** "Errors follow the standard format" transmits nothing; `errors are {code: string, message: string}, HTTP 4xx, no stack traces` transmits the actual constraint. Paraphrase is where project-wide rules silently die between Clarify and Build.
- **This is the delivery mechanism.** When a task is executed (by the orchestrator focused on one task, or by a dispatched subagent that sees only its task), the Global constraints block is how the rule reaches the execution point. A rule that lives only in the Clarify transcript reaches nothing.

### Tasks: each task is one TDD cycle on a contained surface

Each task should produce one passing test (or a small cluster of related passing tests for the same behavior). If a task description sounds like multiple cycles, split. If two adjacent tasks sound like the same cycle, merge.

Each task carries six fields:

- **What**: one sentence describing the change.
- **Interfaces**: what this task consumes from other tasks and produces for them, as exact signatures (`consumes: createToken(userId: string): Token from Task 2; produces: validateToken(raw: string): Claims`). A task is executed with attention on that task alone; this block is how it learns its neighbors' names and types. Vague interfaces ("uses the token helper") are how two tasks each invent half of a mismatched contract.
- **Test**: the failing test's name and the assertions it makes, with the spec's exact values (`rejects_expired_token: validateToken(expiredRaw) throws TokenExpired`).
- **Implement**: the exact signature, the file, and the spec's values. Include a body only for an algorithm the signature and tests do not determine; the reader is a capable engineer who writes idiomatic code once the interface and the test are fixed.
- **Verify**: the specific command and the observed output that proves the task is done.
- **Commit**: the commit message for this task (per `references/finishing.md` conventions).

Skipping any of these fields produces a task that cannot be executed without re-Clarify. A task with no "Test" is a wish; a task with no "Verify" cannot have its done-ness audited; a task with no "Interfaces" invents its neighbors' contracts.

### Dependencies: explicit, not implicit

Name which tasks block which. "Task 3 depends on Task 1" is the form. Hidden dependencies (Task 3 silently requires Task 1's API surface that the plan did not describe) produce mid-execution surprises.

If a dependency is conditional ("Task 5 only if Task 4 surfaced an issue"), state that too. The plan is allowed branches; what it does not have is unstated ones.

### Out of scope: the cheapest scope guard

Out of scope is the single most-skipped section in plan files. It costs one minute to write. It saves hours when "while we're here" temptation hits during Build.

The discipline: name the **three closest neighboring features** that this plan is *not* doing. For "Add password reset", out of scope: account deletion, change-email flow, 2FA setup. These are the features that are mechanically nearby and the most likely scope creep candidates.

If a plan has no "Out of scope" section, the scope is wishful: defined only by what the plan does mention, with no fence around what it does not.

### Verification: overall, not just per-task

In addition to per-task Verify, the plan has an overall Verification section: what proves the *whole change* works together. For a multi-task feature, this often includes an integration test or an end-to-end smoke test that no single task produced. Stating it in the plan ensures it is built (or named) rather than assumed.

---

## Task sizing: rules of thumb

A task is right-sized when it can be completed in one RED → GREEN → REFACTOR cycle on a small surface. Signals you are off:

### Too large

- The "Test" field describes multiple test cases.
- The task description contains "and" connecting two distinct behaviors.
- The "Implement" surface spans more than 2-3 files.
- After completing the task, the diff is more than ~100 lines of production code.
- The task would take more than a single uninterrupted Build pass.

Split into: one task per failing test you would have to write.

### Too small

- The "Test" field is "no test needed, just rename."
- The task's commit would be `chore: bump version`.
- The task is one line of code.

Merge with the adjacent task that motivated it.

### Right-sized examples

- "Add `POST /auth/reset/request` endpoint that accepts an email and returns 202 if the email exists."
- "Add token generation and storage with 1-hour expiry."
- "Add `POST /auth/reset/confirm` endpoint that validates the token and updates the password."

Each is one cycle. Each has a clear test. Each commits independently.

---

## Dependencies: recognizing them

The most common dependency pattern: Task N produces an API surface that Task N+1 consumes. The plan should explicitly say "Task N+1 depends on Task N" so Build runs them in order.

Other patterns:

- **Schema before queries.** If Task 1 adds a column and Task 2 queries the column, Task 2 depends on Task 1.
- **Type before usage.** If Task 1 adds an exported type and Task 2 uses it, Task 2 depends on Task 1.
- **Service before consumer.** If Task 1 builds a helper and Task 2 calls the helper, Task 2 depends on Task 1.

Independent tasks (no shared state, no consumed API) can be executed in any order. The plan can note "Tasks 3 and 4 are independent", useful for parallel work or for resuming from either side mid-session.

### Wide refactors: expand–contract sequencing

When the change replaces something with many call sites (a function signature, a module, a data format), the naive plan ("change it and fix all callers in one task") produces one giant red-to-green gap where nothing compiles. The expand–contract pattern keeps every intermediate state green:

1. **Expand**: one task adds the new form *beside* the old one. Nothing breaks; both forms coexist.
2. **Migrate**: call sites move to the new form in batches, each batch one task, sized by blast radius (how much can break in one step; a batch is small enough that its failure is diagnosable in one sitting). Each batch commits green.
3. **Contract**: the final task removes the old form. It depends on *every* migration batch, and the dependency is declared.

The payoff compounds with develop's own machinery: any session boundary between batches lands on a green build, so cross-session pickup resumes cleanly; and a mid-migration discovery ("batch 3 revealed callers that need the old semantics") is a plan update, not a broken tree.

---

## Inline self-review: the last step before presenting

After writing the plan and before presenting it to the user, the orchestrator reviews its own document. Four sweeps:

1. **Step scan, both directions**: search for "TBD", "TODO", "appropriate", "as needed", "etc." (lines that decide nothing), and for code bodies a signature and test already determine (lines that transcribe). Each hit is resolved, cut to a signature, or taken back to Clarify.
2. **Interface consistency**: every signature a task *consumes* is *produced*, with the same name and types, by a task it depends on. Mismatches here are precisely the bugs that surface three tasks later.
3. **Coverage sweep**: every requirement from Clarify's output maps to some task. An uncovered requirement is a plan gap; an unmapped task is scope creep at write-time.
4. **Review focus**: list the inputs and failure modes the spec implies but never names (empty, huge, duplicate, concurrent, unauthorized), keep up to five that no task's test exercises, and pin each with a test in the task that owns the code. The spec's silence on an input is not permission for that input to break the program.

This is done inline, never by a dispatched subagent. The upstream result is worth recording: subagent review of plan *documents* was measured (5×5 regression trials) to double wall-clock time at identical quality; inline self-review catches the same real defects in seconds. (This says nothing about *code* review, where the independence of a fresh reviewer earns its cost; see `references/peer-review.md`.)

---

## Anti-patterns

### Vague task

"Implement auth." This is a feature, not a task. No failing test would drive "implement auth"; it is too large. The plan that contains this has not done the work of sizing.

The fix: every task is named at a level where you could open a code editor and write a single failing test for it right now. If the failing test does not come to mind in 30 seconds, the task is too vague.

### Too-large task

"Add user signup flow with email verification and welcome email and session creation and rate limiting." This is five tasks, not one. Build would either execute it as one giant scope-creeping cycle, or stall trying to figure out which test to write first.

The fix: read the task description out loud. Every "and" is a candidate split point.

### No exit criteria

A task with no "Verify" field. Build's exit gate cannot fire because there is no command to run and no output to observe. The agent ends up declaring done by feel, which violates `references/verification.md`'s discipline.

The fix: every task has a "Verify" line naming the exact command and the expected observation. If the task's verification is hard to name, that is the signal that the task is fuzzy.

### Placeholder tasks

"Task 4: add appropriate error handling." "Task 6: write tests for the above." "Task 7: same as Task 3 but for orders." Each of these defers a decision to Build time, which means Build stalls or improvises, and improvisation at Build is exactly what the plan exists to prevent. "Similar to Task N" is the sneakiest form: it feels like brevity but forces the executor to re-derive the content, and the two derivations drift.

The fix: the plan is finished only when every task could be executed by someone with no access to the planning conversation. Point at the other task's Interfaces block instead of "similar to"; name the tests and their assertions instead of gesturing at them; resolve "appropriate" into the actual behavior.

### Hidden dependencies

The plan lists Task 3 before Task 5, but Task 5 is what actually defines the function Task 3 calls. Build executes Task 3 first, fails, gets confused, possibly stubs out the missing function, and now there is a placeholder in production code that nobody planned.

The fix: trace each task's "Implement" surface to its "What". Does it depend on a surface that does not exist yet? If so, declare the dependency.

### Plan-as-document instead of plan-as-contract

The plan was written, the user confirmed, Build started, and then halfway through, the implementation drifted from the plan because "we figured it out as we went." The plan is now a document of what we *thought* we would do, not what we did. Peer-review against the plan becomes meaningless.

The fix: when execution diverges from the plan, **stop and update the plan**, do not silently drift. The update is short ("Task 4 reworked: the cleaner shape turned out to be X instead of Y. User confirmed at <timestamp>."). The point is the plan stays the contract; the execution stays auditable against it.

### Scope creep allowed at write-time

The plan author thinks "we should also add X while we are in here" and adds X to the plan. The user confirms the plan as written, thinking X is required. Now the scope is bigger and nobody flagged it.

The fix: if X was not in Clarify, X does not go in the plan. If X seems important enough to add, take it back to Clarify ("X seems related; should we include it?") and let the user decide.

### Out of scope omitted

The plan has no scope guard. Mid-Build, the agent adds adjacent functionality "because it's almost free." There is no plan section to compare against; the scope creep is invisible.

The fix: every plan has the Out of scope section, even if it is short. "Out of scope: account deletion, OAuth, password strength rules" is enough: three sentences that block the three nearest temptations.

---

## Edge cases

### Mid-execution discovery requires plan change

Build is on Task 3 and discovers Task 5 depends on a surface that does not exist. Build is under the rulings-not-stalls rule (`SKILL.md`), so the question is whether the fix is decidable:

- Finish the current task first (do not start Task 5 yet).
- **Decidable** (the smallest change that satisfies the spec is clear, e.g. add Task 4.5 to create surface X): make the call, log `Ruling: added Task 4.5 (create surface X) | why: Task 5 needs it | cost if wrong: one extra task to revert` in `## Progress`, update the plan file ("Updated: added Task 4.5. Ruling, <timestamp>."), and continue.
- **Not decidable** (every option changes what the user asked for, or a stop class applies): stop and surface it: "Task 5 needs surface X, which the plan did not include. Options: add Task 4.5, or restructure Task 5 to not need it." Update the plan with the user's choice.

Either way the change is logged in the plan file, not silently absorbed. The plan stays the truth.

### User adds a task mid-flight

The user says "while you are in there, also add Y." The discipline:

- Check whether Y was in Clarify. If yes, it was already in scope; add the task and proceed.
- If Y was not in Clarify, this is a scope addition. Surface it: "Y is new scope. Adding Task N+1: Y. Confirm?"
- After confirmation, update the plan file and resume.

Even small mid-flight additions go through plan-update. The discipline is the audit trail, not the size of the change.

### Task turns out to be wrong

Build executes Task 3 and the test the plan named cannot be written, or fails for reasons that mean the task itself was misconceived. The discipline:

- Do not "force it through" with a different test than the plan named and say nothing.
- If a different test at the same seam clearly proves the same requirement, that is decidable: record a `Ruling:` with the reason ("Task 3 names test X; X cannot be written because Y; wrote X′, which asserts the same behavior"), update the plan file, and continue.
- If the task itself was misconceived (no test can prove the requirement as stated), stop and surface it with the specific reason and the options: rewrite Task 3, or restructure the change so the test becomes writeable.
- Either way the fix is a recorded plan update, not a silent improvisation.

### Cross-session resume

The session ends after Task 4. The user resumes hours or days later with `/develop docs/plans/<github-id>/<feature>.md`. The discipline:

- Re-read the plan file as the source of truth, `## Progress` first: its `BASE:` line and its `Task N: complete` lines say where the run stands.
- **Re-check the remaining tasks' Interfaces against the code as it is now.** Another session or a teammate may have renamed or reshaped a signature since the plan was written. For each signature a remaining task consumes, confirm it exists with the same name and shape. A mismatch is a recorded plan update: a `Ruling:` when the smallest fix is clear, a question to the user when it is not. Log the check itself (`Resume check: 3 interfaces confirmed, 0 mismatches`).
- Check the working tree against it (the listed commits exist, the tests named there pass). The log wins over memory; the working tree breaks a tie only when the log is missing a line.
- Resume from the first task with no completion line; do not re-do completed ones. At each task's start, re-read that task's section of the plan: what you remember of it is a summary.
- If the working tree shows partial progress on an incomplete task, surface it to the user: "Task 5 has partial state in the working tree. Continue from here, or revert and restart Task 5?"

The plan file makes resume mechanical. Without the plan file, resume would require the user to reconstruct mental state.

### Plan file outlives the change

After Finish, the plan file is still on disk in `docs/plans/`. The discipline is not to delete it; it is a record of how this change was decided and executed. Future contributors reading `git blame` on the changed files will follow the commit messages, which can reference the plan file. The plan file is documentation of the decision, not just scaffolding.

---

## The exit gate sentence

The Route → PLAN exit gate per the SKILL.md table:

> **Route (PLAN only): User confirms plan file.**

In evidence form:

> Plan written at `docs/plans/<github-id>/<slug>.md`. User confirmed at `<timestamp>`: "`<exact user quote>`."

If a docs checkpoint commit was made, the gate also records:

> Docs checkpoint at SHA `<sha>` (commit message: `<message>`).

If the sentence cannot be stated with the plan path, the user quote, and the optional checkpoint SHA, the PLAN sub-step has not exited.

---

## Relationship to `develop`'s other phases

- **Clarify** produces the Goal sentence and the constraint context that PLAN turns into tasks. Vague Clarify produces vague Goal, which produces tasks that cannot be sized, so the deepest source of plan-quality is Clarify-quality.
- **Build** executes the plan task by task. The plan's per-task "Test" and "Verify" fields become Build's exit gate inputs. A plan with no Verify cannot have a clean Build exit.
- **Peer-review** reads the plan file as the Spec axis. A plan with Out-of-scope omitted weakens Peer-review's ability to detect scope creep: the reviewer has no fence to compare the diff against.
- **Verify** runs the overall verification section, plus the standard typecheck / lint / test suite. A plan's overall Verification section names the integration check no single task produced.
- **Finish** reads the plan to know whether the work product matches what was agreed. If the executed diff diverges from the plan and the plan was not updated to match, Finish surfaces the divergence as a decision point, typically Keep branch rather than Local merge. Abandoning the work entirely is never offered; it goes through the request-only discard gate in `references/finishing.md`.
