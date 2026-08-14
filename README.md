<p align="center">
  <img src="docs/banner.jpg" alt="jameskill" />
</p>

<p align="center">
  <em>Developer productivity skills for <a href="https://claude.ai/claude-code">Claude Code</a></em>
</p>

<p align="center">
  <a href="#installation"><img src="https://img.shields.io/badge/install-claude%20plugin-1a1a1a?style=flat-square" alt="install" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-1a1a1a?style=flat-square" alt="MIT" /></a>
  <img src="https://img.shields.io/badge/skills-6-1a1a1a?style=flat-square" alt="6 skills" />
</p>

<p align="center">
  <b>English</b> | <a href="README.ko.md">한국어</a>
</p>

---

<img align="right" src="docs/jameskill-hero.jpg" width="220" alt="jameskill character" />

Built on two pillars: **`/develop`** — a self-contained development orchestrator that drives the full flow from one command — and **compound engineering** baked into the structure, so every session deposits artifacts that lift the next one.

The rest (issue tracking, inspection) are opt-in utilities — supplementary, not required.

<br clear="right" />

## Why `/develop` is one skill, not a toolbox

The common shape for agent skills is a toolbox: one skill per discipline — brainstorm, plan, test, review — and it's on you (or the model) to invoke the right one at the right moment. Each invocation starts fresh, and a discipline that never gets called never protects you. `/develop` inverts both halves:

### Pillar 1 — One command, smart pipeline

1. **One command, full pipeline.** You type `/develop` (or `/develop fix the login bug`). Develop runs the whole flow — you never pick which sub-skill to call next.
2. **Auto-routing by intent.** After Clarify, `/develop` *infers* what kind of work this is and picks one of 4 routes. You don't choose; it decides.
3. **Different phase shapes per route.** DIAGNOSE writes the reproduction test before the fix. PROTOTYPE relaxes TDD on purpose. These aren't relabeled flows — they're different phase orders.
4. **No-soft-language verification.** Every phase boundary rejects "should work", "seems fine", "looks good". Verification means running the command and observing the output.
5. **Tracker-free core.** Develop itself never reads or writes Notion. Issue tracking is a separate, opt-in surface.
6. **Self-contained.** Zero external skill dependencies — every discipline lives inside `skills/develop/references/`, versioned with the plugin and editable per project. See [ADR 0001](docs/adr/0001-self-contained-orchestrator.md).

### Pillar 2 — Compound engineering, in one skill

Each `/develop` session deposits durable artifacts in your repo so future sessions start ahead. **Six channels, all automated — bundled into one orchestrator**, no skill composition required. Discipline runs as part of the same flow that builds the code:

| Channel | How `/develop` deposits | What compounds |
|---|---|---|
| **Plan files** | Auto — PLAN route writes `docs/plans/<github-id>/<feature>.md` | Resumable contracts. `/develop docs/plans/<github-id>/<feature>.md` re-enters from the first incomplete task across sessions. |
| **Regression tests** | Auto — DIAGNOSE route adds the *minimized* reproduction test to the suite permanently | Bugs compound into protection. The net grows with every fix. |
| **Domain glossary** | Inline — a CONTEXT.md entry is proposed the moment a term resolves, in any phase; Retrospective sweeps for stragglers | Language stays consistent across sessions and contributors. |
| **ADRs** | Auto-prompted — **Retrospective phase** proposes an ADR when a decision passes the triple gate (hard to reverse · surprising without context · real trade-off) | Decision history accumulates in `docs/adr/`. Future sessions know *why*. |
| **Discipline references** | Auto-prompted — Retrospective proposes a `references/<phase>.md` append when a new failure mode surfaces | In-repo, editable discipline that grows with the project. Not vendor-locked. |
| **Rejection records** | Auto-prompted — Retrospective proposes a `.out-of-scope/<concept>.md` when the user rejects a proposal with a load-bearing reason | Clarify reads them at session start — rejected ideas stop getting re-proposed. |

The Retrospective phase runs between Verify and Finish, checks each channel against a threshold, and proposes deposits one at a time. Silent exit when no channel qualifies — performative deposits are explicitly rejected. See [ADR 0007](docs/adr/0007-retrospective-phase.md).

> Your repo gets *easier to work in* over time. That's the compound part.

## `/develop` — Development Orchestrator

### The 4-way router

After Clarify, `/develop` picks **one** route based on the kind of work. Each route is a meaningfully different phase shape — not the same flow renamed.

| Route | When | Phase shape | Why it's different |
|---|---|---|---|
| **DIRECT** | Small contained change. 1-4 commits, tightly-grouped files. | Build → Peer-review → Verify → Finish | Skips plan file. No ceremony for a one-shot change. |
| **PLAN** | Medium feature. 5-15 commits, 2-4 files with shared state. | Plan file → user confirms → sequential Build | Plan file becomes the contract; cross-session pickup runs off it. |
| **DIAGNOSE** | Bug-first work. Reproduction steps, error messages, "it's broken". | Reproduce → Minimize → Investigate → Fix → Regression-prevent | The reproduction test is written *first* and stays in the suite as the regression net. |
| **PROTOTYPE** | Throwaway exploration. "How should this look", "try a few approaches". | Time-boxed variations (relaxed TDD) → user reviews → Discard or Promote | TDD is intentionally relaxed. Prototype code parks under `prototype/<name>` as a primary source — never merged. Promote = restart as a fresh PLAN run, not a graduation. |

### Flexible entry & resume

- **Resume mid-flow** — `/develop docs/plans/<github-id>/<feature>.md` re-enters the plan, skips Clarify+Route, picks up from the first incomplete task.
- **Skip Clarify** — say "skip clarify" or "requirements are clear" when you've already specced the work.
- **Called from `/resolve`** — the Notion issue title + body seeds Clarify automatically.

### Phases at a glance

```
preflight → clarify → route → build (strict TDD) → peer-review → ship (slot) → verify → retrospective → finish
```

- **Relentless clarification, without the ping-pong** — questions arrive in frontier rounds (every currently-answerable question at once, numbered, each with a recommended answer); the 5-category ambiguity checklist must reach 0 items before Route.
- **Strict TDD** — RED → GREEN → REFACTOR for every unit. No skipped tests, no commented-out tests, no "TODO: add test later". Tests must be falsifiable: name the production change that would break each one.
- **Independent peer-review subagent** — fresh perspective on the diff, free from author recency bias, with a built-in 12-smell baseline and a 3-round fix-loop circuit breaker.
- **Autonomous where it's safe** — during Build/Verify, non-catastrophic calls are decided and logged as rulings instead of stalling the session; irreversible or security-sensitive decisions still stop and ask.
- **Retrospective** — proposes ADR / references / CONTEXT.md / `.out-of-scope/` deposits when the session produced learnings worth keeping. Silent exit otherwise.
- **Branch finish is explicit** — local merge / open PR / keep branch. Discard never appears on the menu: it runs only on explicit request, gated on typing the word `discard`.

> Decision history: [ADR 0001](docs/adr/0001-self-contained-orchestrator.md) (self-contained), [ADR 0005](docs/adr/0005-forge-depth-references.md) (depth via references), [ADR 0006](docs/adr/0006-forge-route-expansion.md) (DIAGNOSE + PROTOTYPE), [ADR 0007](docs/adr/0007-retrospective-phase.md) (Retrospective).

---

## Supplementary skills

### 🔬 Inspection (alpha)

Ships in v2.0 but not the v2.0 headline — the author doesn't use them daily and dogfooding didn't surface real findings. Available if you want them; future direction tied to post-launch feedback. See [ADR 0004](docs/adr/0004-narrow-v2-to-forge-and-tracker.md).

| Command | What it does |
|---|---|
| `/security` | v0.1 inspection for Supabase RLS gaps, secret-key client exposure (Next.js `"use client"` paradigm), missing Stripe webhook signatures |
| `/ship` | v0.1 security GO / NO-GO deploy verdict from `/security`'s findings (security-only by design — multi-axis aggregation is not promised, see [ADR 0010](docs/adr/0010-launch-v0.1-security-only.md)) |

> **Framework note**: `/security`'s secret-key check assumes a Next.js-style client/server boundary. SvelteKit / Nuxt / Remix may receive false PASSes on that specific check — manual review recommended for those stacks until framework-specific detection lands.

### 🗂 Notion issue tracking (optional integration)

Notion-backed issue lifecycle. From a Slack-pasted blob of bug reports to grouped, codebase-verified tickets — and back out into shippable fixes.

| Command | What it does |
|---|---|
| `/tracker` | One-time Notion connection — API key, database, property mapping, defaults |
| `/report` | Parse a prompt into issues, auto-group related items, verify against the codebase, create pages |
| `/resolve` | Pick a pending issue, call `/develop` to implement, update status with a human-readable outcome note |

**Why it's different** — issue titles are written as user-visible problems, not git commit messages. Cross-functional readers (PMs, support, customers) can scan the tracker without engineering context.

## Installation

```bash
claude plugins marketplace add https://github.com/jameskyeong/jameskill.git
claude plugins install jsk
```

## Quick start

```bash
/develop add a password-reset flow           # feature → DIRECT or PLAN route
/develop fix: login 500s on empty email      # bug → DIAGNOSE route
/develop prototype the onboarding layout     # exploration → PROTOTYPE route
/develop docs/plans/<github-id>/<feature>.md # resume a plan mid-flight
```

## Requirements

- [Claude Code](https://claude.ai/claude-code) — required for all skills.
- **`/develop`, `/security`, `/ship`** — no external dependencies.
- **`/tracker`, `/report`, `/resolve`** — `curl`, `jq`, and a [Notion Internal Integration](https://www.notion.so/my-integrations) token.

## License

[MIT](LICENSE)
