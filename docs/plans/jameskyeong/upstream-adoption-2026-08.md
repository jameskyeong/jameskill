# Plan: Upstream adoption 2026-08 — port superpowers v6.x / mattpocock v1.2.x learnings into `/develop`

## Goal

Adopt 17 upstream methodology improvements (surveyed 2026-08-13 from `obra/superpowers` v6.3.0 and `mattpocock/skills` v1.2.3) into the develop orchestrator, each explicitly accepted by the user in a 19-item decision session.

## Decision record

Adopted (17): A1 frontier-round questioning · A2 review-loop circuit breaker · A3 plan-template hardening (Global Constraints / Interfaces / No Placeholders / inline self-review) · A4 test-quality gates (Name the Break, tautological, change-detector, mutation check, pre-agreed seams) · A5 DIAGNOSE upgrades (ranked hypotheses, DEBUG tags, Redact, revert ritual) · A6 discard menu removal + typed confirmation · A7 ADR triple gate + one-paragraph ADR · B1 route ratchet · B2 rulings-not-stalls (Build/Verify only) · B3 inline glossary deposits (hybrid) · B4 `.out-of-scope/` sixth channel · B5 prototype-branch preservation · B6 expand–contract sequencing · B7 session-boundary hygiene · B8 trigger-only description · C1 file-based handoffs + explicit model tiers (SDD partial) · C3 Fowler-derived smell baseline.

Deferred: C2 wayfinder-equivalent (backlog — separate skill scale) · C4 worktree discipline (revisit when parallel-session demand appears) · B5's LOGIC=HTML harness · C1's full SDD execution mode · C3's per-axis parallel reviewers.

Upstream negative results respected (do NOT adopt): subagent review of spec/plan *documents* (measured: identical quality, 2× time — inline self-review instead); dropping REFACTOR from the TDD loop (mattpocock did; superpowers kept it; conflicts with our strict-TDD identity).

## Tasks

### Task 1: Clarify → frontier rounds
- **What**: Replace one-question-at-a-time with round-based frontier questioning in `references/grilling.md` + SKILL.md Clarify; add facts/decisions split, seam question, `.out-of-scope/` read at Clarify start.
- **Verify**: SKILL.md and grilling.md agree; no stale "one question at a time" text outside historical docs.

### Task 2: SKILL.md cross-cutting — ratchet, rulings, hygiene, description
- **What**: Route one-way ratchet + label-gaming red flags; "Rulings, not stalls" section scoped to Build/Verify; session-boundary hygiene section; frontmatter description rewritten trigger-only (pipeline summary moved into body).
- **Verify**: description contains no workflow arrows; body carries the pipeline line.

### Task 3: PLAN hardening
- **What**: SKILL.md PLAN.1 template gains Global constraints + per-task Interfaces; No-Placeholders rule; inline self-review step. `references/planning.md` gains matching depth + expand–contract section.
- **Verify**: template fields consistent between SKILL.md and planning.md.

### Task 4: TDD test-quality gates
- **What**: `references/tdd-discipline.md` gains Name the Break, tautological test, change-detector, mutation check, pre-agreed seams.
- **Verify**: new anti-patterns referenced from RED section.

### Task 5: DIAGNOSE upgrades
- **What**: `references/diagnosis.md` — Investigate becomes 3–5 ranked falsifiable hypotheses; `[DEBUG-xxxx]` tag convention; Redact rule; Regression-prevent revert ritual. SKILL.md DIAGNOSE step text updated.
- **Verify**: exit-gate sentences updated to match.

### Task 6: Review + dispatch upgrades
- **What**: `references/peer-review.md` — 3-round fix-loop circuit breaker with user adjudication; Fowler-derived smell baseline on Standards axis; diff delivered by file path. `references/subagent-patterns.md` — file-based handoffs + explicit model tier rules. SKILL.md Peer-review section updated.
- **Verify**: SKILL.md prompt template references file-based diff.

### Task 7: Retrospective channels
- **What**: `references/retrospective.md` + SKILL.md — ADR triple gate + one-paragraph form; glossary hybrid (inline deposit at resolution, Retrospective as final sweep); new channel: `.out-of-scope/` rejection KB (concept-level files).
- **Verify**: channel counts consistent across SKILL.md / retrospective.md / CLAUDE.md / CONTEXT.md / references/README.md.

### Task 8: Finish + prototype disposal
- **What**: `references/finishing.md` + SKILL.md Finish — menu becomes 3 options; Discard only on explicit request gated on typing `discard`. `references/prototyping.md` — Discard preserves code on `prototype/<name>` branch as primary source.
- **Verify**: no remaining "four options" text; prototyping and finishing agree on preservation.

### Task 9: Invariant sweep + eval
- **What**: Update CLAUDE.md (five→six channels), CONTEXT.md Retrospective entry, references/README.md; grep sweep for stale invariants; run `npm run eval`.
- **Verify**: `npm run eval` exits 0.

## Dependencies

Tasks 1–8 are independent of each other (disjoint sections; SKILL.md edits touch different sections). Task 9 depends on all of 1–8.

## Out of scope

- C2 wayfinder-equivalent skill (backlog).
- C4 worktree discipline.
- SDD-style subagent execution mode for PLAN.
- Rewriting other jsk skills' descriptions (B8 follow-up, separate session).
- Version bump / publish (decided at Finish).

## Overall verification

`npm run eval` green; grep sweep shows no stale invariant text outside historical docs (`docs/adr/`, `docs/plans/` are records and stay untouched).
