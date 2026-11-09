# Plan: Upstream adoption 2026-11: survey results and upgrade candidates

## Goal

Decide which methodology changes to take into `/develop`, `/security` and `/ship`, and fix the defects the survey exposed in our own skills.

- Survey date: 2026-11-09.
- Sources: the two public agent-skill methodology projects surveyed on 2026-08-13 (see [upstream-adoption-2026-08.md](upstream-adoption-2026-08.md)), read from their changes since that date. One project shipped five releases; the other landed 99 non-merge commits.
- Status: **Groups A, B and C implemented (2026-11-09)** (C5 rejected). Non-PLAN routes keep their BASE, approved playback and log in a run file, `$(git rev-parse --git-dir)/develop/<slug>.md` (added while implementing B3 and B10).

## Decision record (Group B)

Decided one item at a time with the author; implemented together once every B item is decided.

| ID | Decision |
|---|---|
| B1 | Adopt |
| B2 | Adopt |
| B3 | Adopt |
| B4 | Adopt |
| B5 | Adopt |
| B6 | Adopt |
| B7 | Adopt (DIRECT: review focus as 1-3 lines in the B3 playback) |
| B8 | Adopt, including the Preflight baseline run; a slow suite may run a disclosed subset per task, full suite at Verify |
| B9 | Adopt |
| B10 | Adopt (non-PLAN ledger lives in the scratch spec file that holds BASE) |
| B11 | Adopt (standards files passed by path; resolves the paste-vs-path wording conflict) |
| B12 | Adopt (mechanical-cause deposits go to Channel 2 unless C1 is adopted later) |
| B13 | Adopt |
| B14 | Adopt (new-file default stays CONTEXT.md; changing it is C17) |
| B15 | Adopt |

Separate request during the session: every icon the skills print is a boxed emoji. PASS ✅, WARN 🟨, BLOCK and bad examples 🟥 (❎ was rejected because it is green like ✅), SKIP ⏭️, recommendation ➡️, question numbers 1️⃣ 2️⃣ …, security title ☑️, ship title ▶️. Quoted tool output and the quoted forbidden attribution line keep their original characters.

## Decision record (Group C)

Decided one item at a time with the author; implemented together once every C item is decided.

| ID | Decision |
|---|---|
| C1 | Adopt, deferred build: Retrospective proposes the check (what it catches, where it hooks); on accept it is logged as `Follow-up:` and becomes the first task of the next `/develop` run, never built after Verify in the same run |
| C2 | Adopt: re-review gets the full diff as context and the fix diff (changes since the last reviewed snapshot, taken without commit or stash) as its scope; per-finding addressed / not addressed; new findings outside the fix diff become `Minor (deferred)` |
| C3 | Adopt |
| C4 | Adopt, limited: offered only when the open question is visual (screens, layouts, flows, options that look different), at most once per Clarify |
| C5 | Reject: our spec on PLAN is the ≤250-word playback, so every multi-task plan would read as "several times longer"; B6's two-direction step scan already catches transcribed bodies directly |
| C6 | Adopt, extended: `## Approach` holds the chosen approach with why, one line per rejected approach, and the approved playback's `You decided:` / `My call:` lines, so PLAN keeps the record other routes keep in the run file |
| C7 | Adopt: on resume, re-check the remaining tasks' Interfaces against current code; a mismatch is a recorded plan update (ruling if decidable, else a question); the check itself gets one `## Progress` line |
| C8 | Adopt: long output goes to a file; reading it means the summary line, a search of the whole file for fail / error / skip, and the exit code; reading only the head and tail stays forbidden |
| C9 | Adopt: inline review only when no fresh reviewer can be dispatched, labeled as not independent, logged as a `Ruling:`, and disclosed at Finish with a recommendation to get an independent review before merge |
| C10 | Adopt: every dispatch prompt (reviewer template, subagent prompt construction) says do not invoke skills or dispatch further agents; do the task and report |
| C11 | Adopt: wait for a report the next step consumes (review, a fact a decision waits on); never fill in a pending result; background only for work nothing waits on |
| C12 | Adopt: checked first that no Channel 2 deposit ever landed outside this repo (only jameskill has `skills/develop/references/`; the installed plugin copy matches its tag). Channel 2 now writes to the consuming repo's own rule files (path-scoped rule dirs first, then CONTRIBUTING-style docs, CLAUDE.md only for pointers within the repo's line limit); `skills/develop/references/` only when developing this plugin; never the installed plugin copy |
| C13 | Adopt as the default, not an edge case: path-scoped `git commit -m … -- <paths>`, no `--amend` inside develop (a new commit instead), confirm with `git show --name-only HEAD`; grouped with A3's no-stash rule |
| C14 | Adopt: ship calls the Skill tool with `jsk:security`, waits for its full output, and never re-creates the checks itself (which would skip security's value masking) |
| C15 | Adopt: Channel 2 trigger list gains process-failure moments (user corrections, redone or reverted work, re-reads after compaction, plan steps changed without a record, claims without evidence in the same turn, review points acknowledged but not acted on); thresholds unchanged |
| C16 | Adopt: eval fails on any file under `skills/` other than `SKILL.md` and `references/*.md`, and on `$<digit>` or `$ARGUMENTS` in a SKILL.md body |
| C17 | Adopt: a glossary created from scratch is `GLOSSARY.md`; skill text says "the glossary (new: GLOSSARY.md; existing: whichever file is there)"; this repo keeps its own `CONTEXT.md` |
| C18 | Adopt, scoped: every em-dash under `skills/` (475 at decision time) and in `README.ko.md` is rewritten by hand, sentence by sentence (no blind substitution); an eval check keeps both free of em-dashes. English README, CLAUDE.md, CONTEXT.md and historical docs stay as they are |

## How to read this

- **Group A** are defects in our skills. They are confirmed by reading our own text, independent of any upstream claim.
- **Group B** are upgrades recommended for adoption. Each cites the upstream evidence (a measurement where one exists).
- **Group C** are worth considering. They have weaker evidence or need a design decision.
- **Group D** are rejected or stay deferred.
- "Upstream measured" numbers come from the sources' own eval runs. We have no behavioral eval of our own (ADR 0009 deferred it), so after adoption only static checks guard these rules.

## Group A: defects in our skills (implemented)

| ID | Defect | Where | Size |
|---|---|---|---|
| A1 | Most of develop's late-phase rules are lost after compaction | `skills/develop/SKILL.md` | L |
| A2 | Peer-review diff misses uncommitted work on DIRECT | SKILL.md Peer-review, `peer-review.md:135` | S |
| A3 | The revert ritual uses `git stash` | `diagnosis.md:94`, `tdd-discipline.md` mutation check | S |
| A4 | Secret values are printed into the session transcript | `security/SKILL.md:97-107`, `diagnosis.md:159` | S |
| A5 | No rule against forked subagents | `subagent-patterns.md`, SKILL.md Peer-review | S |
| A6 | Two internal contradictions | SKILL.md:335 and :436, `subagent-patterns.md:113` | S |
| A7 | Stale text | SKILL.md Ship slot, `ship/SKILL.md:33`, `references/README.md:51-53`, SKILL.md:355 | S |

### A1. Compaction cuts develop in half
- **Fact (Claude Code docs, skills page):** after auto-compaction, Claude Code re-attaches the most recent invocation of each skill, keeping only its first 5,000 tokens, within a combined 25,000-token budget. The same page recommends keeping `SKILL.md` under 500 lines.
- **Ours:** `skills/develop/SKILL.md` is 42,134 bytes and 694 lines. The 20,000-character point falls at line 316, in the middle of the PLAN route.
- **Lost after compaction:** the DIAGNOSE three-fix breaker, the TDD iron law, the reviewer prompt and the three-round review breaker, Verify, Retrospective, and Finish with the Discard gate.
- **Aggravating rule:** SKILL.md:29 says a reference already read in the session need not be re-read. A reference read before compaction is summarized away, and the gate forbids reading it again.
- **Upstream incident:** a session lost its fix-round cap after compaction and ran 18 fix rounds on one task. In response, upstream moved the per-round material into `references/`, added "read it again before every round", and added a test that fails at 20,000 bytes.
- **Change:**
  1. Slim SKILL.md under 18,000 bytes. Front-load what must survive: the pipeline line, the reference-loading table, the exit-gate table, forbidden language, the four stop classes, both breaker counts, the iron law, and a one-line Discard gate.
  2. Cut each phase body to a few lines plus its reference pointer. Move out the PLAN template (to `planning.md`), the reviewer prompt (to `peer-review.md`), the Retrospective proposal formats (already in `retrospective.md`), the gloss examples (already in `communication-style.md`), and the Preflight UI table.
  3. Amend SKILL.md:29: after any compaction, re-read the gate tables and the current phase's reference before the next action.
  4. Before each DIAGNOSE fix attempt and each review round, re-read the breaker paragraph and state the count ("fix attempt 2/3").
  5. Add `eval/checks/skill-size.mjs`: fail when any `skills/*/SKILL.md` reaches 20,000 bytes. Measure bytes, not characters, because our text contains non-ASCII.
- **Constraint:** keep the "Forbidden language" and "user-facing communication style" headings. `eval/checks/cross-cutting-gates-present.mjs` looks for them.

### A2. Peer-review reviews an empty or partial diff on DIRECT
- **Ours:** the reviewer gets `git diff <baseline>..HEAD`. DIRECT makes no commit before Finish (SKILL.md:634-643), so the range holds none of the Build work. New untracked files are excluded on every route. "The branch root" (`peer-review.md:135`) is undefined when work happens directly on a long-lived branch.
- **Upstream:** users reported a reviewer that "cannot see my changes" when review ran before commit. Upstream also added range checks: reject an empty or non-descendant range, and use a merge base rather than a bare branch name.
- **Change:**
  1. Record BASE where it survives the session: on PLAN, the docs-checkpoint SHA in the plan file; elsewhere, `git rev-parse HEAD` at Build start, stated and written atop the scratch spec file. A resumed run reuses it.
  2. Before dispatch, register new files with `git add -N <paths>`, then write `git diff BASE` (working tree included) to the scratch file.
  3. Refuse to dispatch on an empty diff, or when `git merge-base --is-ancestor BASE HEAD` fails.
- **Verify first:** reproduce with one tiny DIRECT run before changing the text.

### A3. The revert ritual can restore another session's stash
- **Ours:** `diagnosis.md:94`: "temporarily revert the fix (stash the fix hunks)". Nothing proves the revert actually took effect.
- **Observed in a consuming repo:** several sessions shared one working tree. A `git stash push -- <path>` failed on an untracked file, and the next `git stash pop` restored another session's stash, leaving conflict markers in 11 files. `refs/stash` is shared across sessions and worktrees.
- **Upstream:** "If you forced the red by mutating code or a fixture, diff against a pristine copy to prove the mutation landed before you trust it."
- **Change:**
  1. Copy the fix files aside. Restore tracked files with `git checkout HEAD -- <paths>` and move untracked files out of the way.
  2. Prove the revert with `git diff --stat` output. Observe red. Restore from the copies and observe green.
  3. Chain the steps with `&&` so one failure stops the rest, and state "never `git stash`".
  4. Require the same proof wherever `tdd-discipline.md`'s mutation check mutates real code.
  5. Add "revert proven by `<diff output>`" to the exit sentences at SKILL.md:351 and `diagnosis.md:217`.

### A4. Secret values enter the transcript
- **Ours:** in `security/SKILL.md:97-107`, the secret-key greps print whole matching lines. A hard-coded live key (the BLOCK case) therefore lands in the transcript. The `PUBLIC_*SECRET` grep has no `--include`, so it also scans `.env*` files and prints `NAME=value`. `diagnosis.md:159` tells the agent to diff env vars between environments, which prints values too.
- **Upstream:** fixed the same class of bug. A diagnostic example echoed a signing identity into logs, and it now reports only SET or UNSET.
- **Change:** report `file:line` and the variable name only, with values masked. Compare environments by name and presence (or a hash), never by value. Add a redact note to the security report section.

### A5. Forked subagents break independence and tier rules
- **Fact:** this harness's Agent tool offers a fork type that inherits the full conversation and ignores any model override.
- **Ours:** reviewer independence (`peer-review.md:9-15`) and the explicit-tier rule (`subagent-patterns.md:107-113`) both assume a fresh agent. No rule forbids a fork.
- **Upstream:** "Every skill that dispatches a subagent says to start it with a fresh context window." Their reason: a fork inherits the context the subagent was meant to escape.
- **Change:** one section in `subagent-patterns.md`, "start every subagent with a fresh context: a named agent type, never a fork", plus one clause at the Peer-review dispatch line.

### A6. Two internal contradictions
- **Reviewer tier:** SKILL.md:436 says "mid tier is the reviewer floor". `subagent-patterns.md:113` assigns the most capable tier to "final whole-branch review". Our Peer-review is the whole-branch review. Upstream also runs its end-of-run review on the most capable model. **Change:** the first whole-diff review uses the most capable tier; re-review rounds use the mid tier. Every round regenerates the diff from BASE.
- **Build blockers:** SKILL.md:335 says "surface it to the user, do NOT improvise", and `planning.md:197-224` says stop Build. Both contradict "rulings, not stalls" (SKILL.md:97-112). **Change:** use a three-outcome triage, as upstream's rebuilt plan executor does:
  - output matches the plan: continue to the next step;
  - the code is wrong: debug it;
  - the plan is wrong but the fix is decidable: record a ruling and continue.
  Stop only for the four stop classes. A user-requested scope addition stays a question.

### A7. Stale text
- SKILL.md:485-498: the Ship slot names skills that do not exist (`/auth-check`, `/ship-ready-security`, `/polish`), and the real `security` and `ship` are not wired in. **Done: slot deleted** (pipeline line, gate table, READMEs, CONTEXT.md). Wiring `security` into develop would be a new feature, decided separately.
- `ship/SKILL.md:33`: "`lock` rates as BLOCK" uses a retired name. It should say `security`.
- `references/README.md:51-53`: still cites the removed tracker skills and an author-specific plan path.
- SKILL.md:355 and `diagnosis.md:223-229`: the DIAGNOSE hand-off arrow skips Retrospective.

## Group B: upgrades recommended for adoption

| ID | Upgrade | Upstream evidence | Size |
|---|---|---|---|
| B1 | Ask why first | reason drawn out before any approach: 33/33 conversations (19/33 in an earlier version) | S |
| B2 | Ask only what changes the build | filler questions 41 → 23 (34 in an earlier version) | S |
| B3 | Playback with provenance at Clarify exit | skipped design doc: 24/24 → 3/24 runs; built before approval: 4 → 0 | S |
| B4 | Question wording | user reports | S |
| B5 | Honor a one-question-at-a-time preference | upstream documents it as a supported opt-out | S |
| B6 | Plan steps record decisions, not code | ¼ the time, ⅓ the tokens, same 9/9 planted-defect catch rate | S |
| B7 | Review by reasonable expectation | every implementer shipped the same crash on an implied input | M |
| B8 | The project's suite defines green | 11 of 12 probe runs ran only the named test file | S |
| B9 | Seam notes: what each catches and misses | the most-reported friction with the TDD flow | S |
| B10 | A durable progress ledger | a stub executor measured the same as no plugin | M |
| B11 | Reviewer looks for standards files | user reports | S |
| B12 | Retrospective proposals cite the session moment | user reports of invented generic advice | S |
| B13 | PR body format | user reports | S |
| B14 | Read GLOSSARY.md as well as CONTEXT.md | upstream renamed its glossary file | S |
| B15 | No em-dashes in output templates | upstream style rule; the author's own preference | S |

### B1. Ask why first
- **Ours:** absent. The ambiguity checklist (SKILL.md:214-220) covers scope, edges, terms, conflicts and success, but not intent. `grilling.md:46-55` attaches a recommended answer to every question. For an intent question that steers the user.
- **Change:**
  - New "Intent before shape" rule in `grilling.md`: when the request does not state why, round 1 opens with one open question about why or what for, with no recommendation attached. This is the one exception to the recommended-answer rule.
  - Add "anti-goals" (what would make this a failure even if it technically works) under success criteria.
  - State that this differs from the "philosophical questions" anti-pattern: it asks about the intent of this change.

### B2. Ask only what changes the build
- **Ours:** `grilling.md:29` puts "the whole frontier" in each round. SKILL.md:214 says "Do not skip any".
- **Change:**
  - A frontier node becomes a numbered question only if a different answer would change what gets built. Otherwise it goes into the B3 playback as "My call: X, because Y".
  - Process choices (file locations, write-ups, how to show something) are the agent's own calls.
  - State that a stated call is not the "answering your own question" anti-pattern, because the user sees every call before the exit gate.

### B3. Playback with provenance
- **Ours:** the Clarify exit gate (SKILL.md:232-236) asks "Proceed?" without showing the combined design. The DIRECT scratch spec is written only for the reviewer.
- **Change:** the exit gate shows a playback of about 250 words or fewer, with "You decided:" lines and "My call:" lines, and then asks to proceed. The same text becomes the DIRECT scratch spec file. Update `grilling.md:252-260`.

### B4. Question wording
- Word each question so "yes" accepts the recommended answer. Otherwise a user who agrees has to answer "no".
- Separate the questions in a round with `---`.
- Ask in plain chat text that the user answers in their own words, not in a picker widget. Pickers push toward pre-baked multiple-choice answers.

### B5. One question at a time, when the user asks for it
- **Ours:** `grilling.md:38`: "One-at-a-time survives only as the degenerate case." This conflicts with users who set a one-question preference.
- **Change:** when user instructions (CLAUDE.md, memory, or the conversation) ask for one question at a time, still compute the full frontier, but send only the most-blocking question per message.

### B6. Plan steps record decisions (reverses one August rule)
- **Ours:** SKILL.md:312 bans `"similar to Task N" (repeat the content instead)`. `planning.md:135` and `:165-167` say the same. The template's Test and Implement fields (SKILL.md:300-301) are vague.
- **Upstream:** replaced its "No Placeholders" section. A reference to another task goes through that task's Interfaces block, and the plan does not repeat its code.
- **Change:**
  - A cross-task reference points at that task's Interfaces block.
  - Test field: the test name plus its assertions, with the spec's exact values.
  - Implement field: the signature, the file and the spec's values. A body only for an algorithm the signature and tests do not determine.
  - Self-review checks both failures: lines that decide nothing, and bodies the signature already determines.

### B7. Review by reasonable expectation (one bundle)
- **Ours:** the spec axis judges only stated requirements (`peer-review.md:52-58`). `peer-review.md:180` says "when in doubt, default down a level".
- **Change:**
  - Add a `## Review focus` section to the PLAN template: up to five inputs or failure modes the spec implies but no test covers, each pinned by a test in the task that owns the code. Pass the section verbatim to the reviewer.
  - Axis 2: a reasonable user's expectation is a requirement; the spec's silence is not permission. Grade by effect on that user. Narrow line 180 to style and structure findings.
  - The reviewer output gains a "Declined to judge" list. Each line becomes a ruling (see B10).

### B8. The project's suite defines green
- **Ours:** the Build gate at SKILL.md:423 says "All tests for this unit of work pass", which is the narrow form. Verify at SKILL.md:510 allows "relevant subset" without disclosure.
- **Change:**
  - The Build gate runs the project's test command with output observed, and names every failure, including ones this change did not cause.
  - A subset run must be disclosed, per the long-suite rule in `verification.md`.
  - Optional (our own idea, no upstream evidence): run the suite once at Preflight to baseline pre-existing failures.

### B9. Seam notes
- **Where:** SKILL.md:220, `grilling.md:139`, `tdd-discipline.md:34-38`.
- **Change:** each proposed seam carries a one-line note: what it catches, what it misses, and how fast it runs.

### B10. Durable progress ledger
- **Ours:** rulings and deferred minors live only in conversation memory (SKILL.md:102, :645-647), so a compaction drops them. That breaks our own rule that "a ruling that dies with the session was a decision made in secret". Resume guesses progress from the working tree (`planning.md:226-236`).
- **Change:**
  - PLAN route: a `## Progress` section appended to the plan file and committed with each task. Lines take the form `Task N: complete (commits a..b, tests: <cmd> → <summary line>)`, `Ruling: ...`, and `Minor (deferred): ...`.
  - Other routes: the same lines go in a scratch ledger.
  - Write a completion line only after the passing run is observed.
  - Re-read the task's plan section at task start.
  - Finish reads the ledger, not memory.

### B11. Reviewer looks for standards files
- **Ours:** Axis 1 lists only CLAUDE.md, CONTEXT.md and nearby conventions (SKILL.md:444-447). Rules in consuming repos never reach the reviewer: path-scoped rule directories such as `.claude/rules/`, nested CLAUDE.md files, AGENTS.md, CONTRIBUTING.md, CODING_STANDARDS.md.
- **Change:** search for these files and pass them to the reviewer by path, consistent with the file-based handoff rule.

### B12. Retrospective proposals cite the session moment
- **Change:**
  - Every proposal format gets a "Trigger: <phase>: <what happened>" line. With no traceable moment, there is no proposal.
  - Add a DIAGNOSE trigger: "what would have prevented this bug". A mechanical cause goes to C1, a missing seam to an ADR, and term confusion to the glossary.

### B13. PR body format
- **Ours:** `finishing.md:53`: "what the change does, why, how to test."
- **Change:** use three sections:
  - Summary.
  - Evidence: before and after, reusing the RED and GREEN output already observed in Build or DIAGNOSE.
  - Merge danger: whether the change is a one-way or two-way door, and its blast radius.
  If the repo has `.github/pull_request_template.md`, fill that template and place these sections inside it. Pass the body with `--body-file`. The branch decision stays the user's.

### B14. Glossary file name
- **Change:** Clarify, Peer-review and Retrospective look for `GLOSSARY.md` first, then `CONTEXT.md`, and write only to the file that exists. This prevents a second glossary in repos that already use the other name. Changing our default for new files is a separate decision; see C-list.

### B15. No em-dashes in output templates
- **Where:** the `verified:` line (SKILL.md:79), the `Ruling:` line (SKILL.md:101), and the question title (SKILL.md:206, `grilling.md:31`).
- **Change:** rewrite these templates without dashes, for example `Ruling: <what> | why: <why> | cost if wrong: <cost>`. A full prose sweep (615 dashes under `skills/`) is a C-list item.

## Group C: consider

| ID | Item | Why it is not in B |
|---|---|---|
| C1 | Fifth Retrospective channel: a mechanical mistake becomes a deterministic check (lint, hook, test), and an existing but unwired check is itself a finding | Makes Retrospective produce code after Verify; needs a handling rule (defer to the next DIRECT run, or loop back through Build and Verify) |
| C2 | Fix rounds verified by a failing test; re-review scoped to the fix diff (addressed or not per finding); unrelated findings become deferred minors | M size; changes the review loop we adopted in August |
| C3 | Greenfield stack line: state platform, language and library calls, even when Clarify is skipped | One incident only |
| C4 | Clarify offers PROTOTYPE when seeing would help more than reading | No evidence |
| C5 | Plan proportion sweep: a plan several times longer than its spec is a transcript | Our template already has no code blocks |
| C6 | `## Approach` section in the plan: the chosen approach plus one line per rejected one | No evidence; overlaps with `.out-of-scope/` |
| C7 | Interface-conflict scan when resuming a plan | Matters only for cross-session pickup |
| C8 | Long test output goes to a file; read its tail and grep for fail, error and skip | Must be reconciled with "read the output" in `verification.md` |
| C9 | Fallback when no subagent tool exists: self-review, recorded and disclosed as weaker | Rare in practice |
| C10 | Dispatched subagents must not invoke skills or dispatch further subagents | No incident in our runs yet |
| C11 | Wait for a subagent report that the next step consumes; background only for work nothing waits on | The Peer-review exit gate already covers most of this |
| C12 | Channel 2 target in consuming repos: write to the repo's own standards file, not `skills/develop/references/` | First check where Channel 2 deposits actually landed |
| C13 | Shared-working-tree commit rules: no amend, path-scoped `git commit -- <paths>`, confirm with `git show --name-only` | Belongs in `finishing.md` edge cases; overlaps A3 |
| C14 | `ship` invokes `security` with explicit "call the Skill tool" wording | Both are model-invocable already |
| C15 | Process-failure trigger signals for Retrospective: user corrections, backtracking, re-reads after compaction, plan steps silently changed | Overlaps B12 |
| C16 | Eval checks: no dev or test files inside `skills/`; no `$N` argument placeholders in a SKILL.md body | Both pass today; insurance only |
| C17 | Default name for new glossary files: GLOSSARY.md instead of CONTEXT.md (about 41 references) | Author decision; B14 removes the conflict without it |
| C18 | Full em-dash prose sweep, with an eval check on templates | Large manual rewrite |

## Group D: rejected or still deferred

- **Builder check by subagent** (a fresh agent reads the design as its builder): rejected, same family as the August negative result on subagent review of plan documents. An inline variant already exists: `planning.md:167`'s "executable by someone with no access to the planning conversation".
- **Session-forensics tooling** (transcript analysis, parallel analysts, scrubbed bundles): rejected. It is separate-skill scale and tied to harness transcript formats.
- **Extra Retrospective categories** (navigation pointers, no-op detection, tool economy, information access): rejected. Outside session-scoped deposits.
- **Full subagent-execution mode for PLAN:** stays deferred. New upstream evidence: a nested mid-tier controller measured about half the cost and wall clock. B10 delivers most of the cheap gains.
- **Multi-session decision map, worktree discipline:** stay deferred. No new evidence. Upstream's worktree failure reports are kept here as a draft rule list for later:
  - base-branch drift;
  - merge the integration branch before reporting;
  - gitignored fixtures silently skipped inside a worktree;
  - parallel implementers naming one concept two ways.
- **Per-axis parallel reviewers:** stays deferred, leaning toward reject. Upstream still uses one reviewer and now forbids reviewers from spawning reviewers.
- **Dropping REFACTOR from the TDD loop:** still rejected. No new measurement upstream.
- **Loosening the route ratchet:** rejected. One upstream source dropped its "take the heavier path when in doubt" rule without measurement. We keep ours (strict-clarify identity).

## Reversals of August adoptions

| August item | Upstream now | Our copy |
|---|---|---|
| A3 plan "No Placeholders" + "repeat the content" | Replaced by "what a step contains"; cross-task references go through Interfaces | **Stale** → B6 |
| A3 inline self-review | Still inline; proportion and review-focus sweeps added | Partly stale → B7, C5 |
| A1 frontier rounds | Kept and refined (dividers, "yes" accepts); one-at-a-time documented as an opt-out | Not stale → B4, B5 |
| A2 review-loop breaker | Round counts unchanged; per-round re-read added | Not stale; placement past the compaction cut → A1 |
| A4 pre-agreed seams | Kept; catches/misses note added | → B9 |
| A5 revert ritual | Mutation proof added in the same direction | Our stash wording is unsafe → A3 |
| A6 discard menu + typed confirmation | Unchanged | Not stale |
| A7 ADR triple gate | Unchanged | Not stale |
| B2 rulings, not stalls | Kept; rulings now stored in a ledger file | Storage weaker → B10 |
| B3 inline glossary deposits | Kept; file renamed to GLOSSARY.md | → B14 |
| B4 `.out-of-scope/` | Strengthened with an index file; same record format | Not stale |
| B7 session-boundary hygiene | Compaction is not always a choice | Partly stale → A1 |
| Negative result: subagent review of plan documents | Consistent (both reviewer prompts removed) | Not stale |

## Tasks (after decisions)

Only accepted items are implemented. The grouping below avoids two tasks editing the same section.

### Task 1: Restructure develop SKILL.md for compaction (A1)
- **What:** slim SKILL.md under 18,000 bytes, move bodies into references, amend the re-read rule, add per-round re-reads, delete or rewire the Ship slot (A7).
- **Verify:** `wc -c skills/develop/SKILL.md` < 18,000; `npm run eval` green, including the new size check.

### Task 2: Git and safety fixes (A2, A3, A4, A5, C13)
- **What:** BASE recording and the working-tree diff, the stash-free revert ritual with proof, masked secret output, the fresh-context subagent rule.
- **Verify:** a tiny DIRECT run shows a non-empty reviewer diff that includes a new file; the security greps print no values on a fixture holding a fake key.

### Task 3: Clarify (B1-B5)
- **What:** `grilling.md` and the Clarify section of SKILL.md.
- **Verify:** the SKILL.md and `grilling.md` rules agree; the question template has no dash and puts the recommendation where "yes" accepts it.

### Task 4: Plan and Build (A6 triage, B6, B8, B9, B10)
- **What:** `planning.md`, `tdd-discipline.md`, the PLAN template, the Build gate, and the progress ledger.
- **Verify:** no "repeat the content" text remains; the Build gate names the project test command.

### Task 5: Review (A6 tier, B7, B11)
- **What:** `peer-review.md`, `subagent-patterns.md`, and the reviewer prompt.
- **Verify:** the tier rule appears once, consistently; "Declined to judge" flows into the ledger format from Task 4.

### Task 6: Retrospective and Finish (B12, B13, B14, B15, A7 remainder)
- **What:** `retrospective.md`, `finishing.md`, `references/README.md`, `ship/SKILL.md`, and the glossary lookup.
- **Verify:** channel counts are consistent across SKILL.md, `retrospective.md`, CLAUDE.md, CONTEXT.md and both READMEs.

### Task 7: Invariant sweep and eval
- **What:** grep sweep for stale invariants; `npm run eval`.
- **Verify:** `npm run eval` exits 0.

## Dependencies

- Task 1 goes first, because it moves the sections that Tasks 3 to 6 edit.
- Tasks 3 to 6 touch disjoint files after Task 1, except that Tasks 4 and 5 share the ledger format; Task 4 defines it.
- Task 7 depends on all others.

## Out of scope

- Group D items.
- Behavioral evals (ADR 0009).
- Version bump and publish: decided at Finish.
