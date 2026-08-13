# Retrospective Discipline — Compounding Deposit

Reference for develop's **Retrospective** phase. The Retrospective section of `SKILL.md` enforces the surface mechanics (run between Verify and Finish, three channel checks, propose-not-impose). This document is the deeper discipline — why the phase exists, per-channel thresholds, anti-patterns, and edge cases.

The non-negotiable: **the deposit decision is the user's, not the agent's.** Develop proposes; the user accepts, edits, or skips. Performative deposits — ADRs for one-line CSS fixes, glossary entries for terms that already exist, references appended with paraphrased SKILL.md content — are worse than no deposit at all.

---

## Why Retrospective is an explicit phase

Develop's compound engineering pillar rests on six channels: plan files, DIAGNOSE regression tests, ADRs, discipline references, CONTEXT.md domain glossary, and the `.out-of-scope/` rejection knowledge base. Two of them — plan files (PLAN route) and regression tests (DIAGNOSE route) — deposit automatically as a side effect of running the route. Glossary entries deposit inline the moment a term resolves (see `references/grilling.md`). The rest do not deposit themselves.

Without an explicit prompt, ADRs / references / rejection records only grow when the user remembers to update them. In practice that means they don't grow. The compounding promise becomes infrastructure-only — the channels exist, but the deposits don't happen.

Retrospective makes the deposit decision visible at the moment when the session's learnings are still fresh — between Verify (success confirmed) and Finish (branch decision). The friction is a few short prompts; the value is that the non-automatic channels actually accumulate.

---

## The four channels

Each channel has a specific threshold. The discipline is not "ask three questions every session" — it is "ask each question only when the threshold is met, propose concrete content when it is."

### Channel 1 — ADR

**Threshold — the triple gate. All three must hold; any one missing → skip the ADR:**

1. **Hard to reverse** — undoing the decision later costs real migration work, not a rename.
2. **Surprising without context** — a future reader would ask "why on earth is it done this way?"
3. **The result of a real trade-off** — viable alternatives existed and were actually weighed.

Trigger signals that usually accompany a gate-passing decision:
- A decision constrained by something not visible in the code (regulatory requirement, partner contract, prior incident).
- A decision that retires or supersedes a prior pattern.
- A decision that explicitly *rejects* an alternative the next person is likely to reconsider.

Not an ADR:
- A decision that passes only one or two of the three gates — easily reversed, unsurprising once read, or made with no real alternative on the table.
- A small implementation detail with one obvious answer.
- A bug fix (the commit message carries the why).
- A refactor that follows existing patterns.
- A decision already documented in another ADR.

**Proposal format** (if threshold met):

```
ADR proposal: <short title>

Context: <1-2 sentences on the constraint or trigger>
Decision: <what was chosen>
Considered options: <brief list of alternatives evaluated>
Consequences: <follow-on implications, including what becomes harder>

Save to docs/adr/NNNN-<slug>.md? [y/edit/n]
```

The agent proposes the next ADR number based on `ls docs/adr/`. Filename is kebab-case.

**An ADR can be a single paragraph.** Context, decision, and why in 1-3 sentences is a complete ADR; Considered-options and Consequences appear only when they earn their lines. The gate is strict precisely so the format can stay light — fewer, smaller, denser ADRs beat ceremonial ones.

### Channel 2 — Discipline references

**Threshold**: A phase revealed a new failure mode, anti-pattern, edge case, or recurring issue *that the existing reference does not already cover*.

Trigger signals (any of):
- A Verify check caught an issue that should have been blocked earlier.
- A Peer-review found a pattern that recurs in this codebase.
- A Clarify ambiguity surfaced that the 5-category checklist almost missed.
- A new edge case appeared in DIAGNOSE/PROTOTYPE that wasn't anticipated.
- A subagent dispatch revealed a coordination pattern worth recording.

Not a reference update:
- A one-off mistake that's unlikely to recur.
- A finding already documented in the relevant reference.
- A paraphrase of existing SKILL.md content.

**Proposal format** (if threshold met):

```
Reference update proposal: <references/<phase>.md>

Section to append: <existing section name, or "new section: <name>">

Content:
<draft paragraph or bullet — concrete, attributable, with enough context to be useful out of session>

Append? [y/edit/n]
```

The agent identifies the right reference file (one of `grilling.md`, `planning.md`, `diagnosis.md`, `prototyping.md`, `tdd-discipline.md`, `peer-review.md`, `verification.md`, `finishing.md`, `subagent-patterns.md`, `retrospective.md`).

### Channel 3 — CONTEXT.md domain glossary (final sweep)

**The primary deposit path is inline**: per `references/grilling.md`, a term that resolves during any phase is proposed for the glossary at that moment — deferred to session end, the nuance of the resolution has already blurred. Retrospective's channel 3 is the **final sweep**: scan the session for terms that were introduced, redefined, or contested but never deposited inline. The threshold below applies to those stragglers.

**Threshold**: A term was introduced, redefined, or contested during this session, was not deposited inline, and future contributors will need to use it consistently.

Trigger signals (any of):
- A new feature name was coined and used across files.
- A term meant something specific in this session that differs from the obvious reading.
- An "Avoid" antonym surfaced — a term users will *almost* reach for that means something else.
- A renaming happened (old term → new term) and the old should be flagged as deprecated.

Not a glossary update:
- A term that already has a glossary entry.
- A throwaway phrase used once.
- A standard programming term with no project-specific meaning.

**Proposal format** (if threshold met):

```
CONTEXT.md glossary proposal:

Term: <name>
Section: <existing section name, or "new section: <name>">

Entry:
**<Term>**:
<definition — one to three sentences, ground in concrete project artifacts>
_Avoid_: <one or two confusable terms with brief reason>

Append? [y/edit/n]
```

### Channel 4 — `.out-of-scope/` rejection knowledge base

**Threshold**: The user rejected a proposal, feature, or approach during this session *with a load-bearing reason*, and a future session (or a future architecture review) is likely to re-propose it.

Trigger signals (any of):
- A Clarify approach or scope item the user explicitly excluded, with reasoning recorded nowhere else.
- A Peer-review or Retrospective proposal the user declined for a reason that will still hold next time.
- A feature request (via `resolve`) closed as wontfix with rationale.

Not an out-of-scope entry:
- Deferrals — "later" is not "rejected"; a deferred item belongs in an issue, not here.
- Rejections whose reason is circumstantial ("no time this sprint").
- Anything an existing concept file already covers — append the new occurrence to that file instead. One file per **concept**, not per occurrence: a "night theme" request lands in the existing `dark-mode.md`.

**Proposal format** (if threshold met):

```
.out-of-scope/ proposal: <concept>.md

Why rejected: <the load-bearing reason, 1-3 sentences>
Prior requests: <this session's occurrence; future ones append here>

Save to .out-of-scope/<concept-slug>.md? [y/edit/n]
```

The consumer that makes this channel compound: Clarify scans `.out-of-scope/` at session start (see `references/grilling.md`) and surfaces overlaps before grilling. That read is what turns these files into institutional memory instead of an archive.

---

## The phase mechanics

1. **Run only after Verify exits green.** If Verify failed, fix Verify first; do not retrospect on broken work.
2. **Check each channel in order.** ADR → references → CONTEXT.md (final sweep) → `.out-of-scope/`. Each check is independent — the agent decides whether the threshold is met for that channel and proposes only when it is.
3. **Threshold check is silent when no.** If no channel threshold is met, the phase exits with a one-line note ("No compounding-worthy artifacts surfaced this session") and proceeds to Finish. Do not invent deposits to make the phase feel productive.
4. **Propose, never impose.** Each proposal asks `[y/edit/n]`. The user owns the final wording. The agent does the drafting work so the user doesn't have to context-switch.
5. **One proposal at a time.** If multiple channels qualify, present them sequentially — not as a batch. Each accept/edit/reject decision is independent.
6. **Write the accepted deposit immediately.** On `y` or `edit-then-y`, the agent writes the file (creates or appends) and `git add`s it. The deposit becomes part of the same commit as the implementation, not a follow-up.
7. **Skipped deposits leave a one-line breadcrumb (optional).** If the user rejects an ADR proposal, the agent may note "user declined ADR for <topic>" in the session output — useful if the same topic surfaces in a future session.

---

## Anti-patterns

### Performative deposit

Writing an ADR / reference update / glossary entry because the phase exists and "we should deposit something." The result is noise that future sessions have to ignore — worse than nothing.

**The cure**: hold the threshold strictly. If no channel qualifies, the phase exits silently. The phase is successful when it correctly identifies *no* deposit is needed.

### Paraphrasing SKILL.md into a reference

Appending content to a reference that just restates what `SKILL.md` already says, with no new principle or pattern. References are for depth that exceeds the orchestrator, not for echoing it.

**The cure**: every reference update must contain at least one piece of information that is not already in `SKILL.md` or in the reference. If not, reject.

### ADR for a bug fix

Bug fixes don't get ADRs; the commit message carries the why. An ADR is for a *decision* — a choice between viable alternatives with reasoning. A bug is a fix for a wrong, not a choice among rights.

**The cure**: if the only thing to record is "we found bug X and fixed it Y way", that's the commit message + the regression test, not an ADR.

### Glossary entry without "Avoid"

A glossary term without an `_Avoid_` line tends to drift — readers don't know what *not* to call it. CONTEXT.md's discipline is that every term carries the confusable alternatives explicitly.

**The cure**: require at least one `_Avoid_` antonym per glossary entry. If you can't think of one, the term is probably too obvious to need an entry.

### Batch-style deposit proposals

Presenting all three channel proposals at once ("Here are the ADR draft, reference update, and glossary entry — accept all?"). This invites blanket acceptance or blanket rejection, defeating the per-channel threshold discipline.

**The cure**: present one at a time. Each gets its own accept/edit/reject decision.

### Treating Retrospective as the "documentation phase"

Retrospective is for *compounding artifacts* — durable deposits that lift future sessions. It is not for tutorial documentation, user-facing READMEs, or marketing copy. Those have their own homes.

**The cure**: every retrospective deposit must answer "what does a *future develop session in this repo* benefit from knowing?" If the answer is "nothing — this is for external readers," reject.

---

## Edge cases

### Multiple sessions of the same plan

If `/develop docs/plans/<github-id>/<feature>.md` resumes a prior session, the Retrospective runs on the *completed-this-session* tasks, not the whole plan. The threshold checks compare against the project state, not the session boundary — if the prior session already deposited an ADR for this feature's architectural choice, this session does not propose a duplicate.

### Resolve-issue-caller integration

When `/develop` is invoked by `/resolve`, the Retrospective still runs. Deposits proposed here are independent of the Notion status update `resolve` performs after Finish. An ADR or reference deposit may happen even if the issue itself is rejected by the user during `resolve`.

### PROTOTYPE Discard

If PROTOTYPE exits with Discard (the prototype is thrown away), Retrospective still runs — *the variations themselves* may have produced learnings worth depositing even though the code is discarded. Specifically: which approaches didn't work and why often belongs in a reference or an ADR-as-negative-decision.

### PROTOTYPE Promote-to-Plan

If PROTOTYPE exits with Promote, Retrospective runs at the *end of the fresh PLAN run*, not at the prototype's exit. The Promote restarts the flow; the deposit decision belongs to the production-grade PLAN session, not the throwaway prototype session.

### User declines all proposals

If the user rejects every channel proposal, the phase exits successfully — declining is a valid outcome. Do not treat rejection as failure.

### No proposals to make

If no channel threshold is met, the phase exits with one line: "Retrospective: no compounding-worthy artifacts this session." This is the most common outcome for DIRECT-route small changes and is correct.

### Retrospective deposit causes Verify to need to re-run?

It should not — Retrospective only writes to `docs/adr/`, `skills/develop/references/`, `CONTEXT.md`, and `.out-of-scope/`. None of these affect lint/typecheck/test outcomes. If for some reason a deposit touches a file that does (e.g., a markdown linter is wired into the build), re-run Verify before Finish.
