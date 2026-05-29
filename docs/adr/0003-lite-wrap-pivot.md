# Pivot mekaknight v2.0 to a lite, wrap-based architecture

The original v2 roadmap targeted 16 weeks across 5 milestones, building deep custom inspection logic (Supabase RLS, secret-key exposure, Stripe webhooks, polish AI Score, dedupe semantic clustering) under the mekaknight umbrella. Dogfooding lock v0.1 against three live company codebases (norito, supergrim, grim-2025-frontend — all 100% vibe-coded) returned **zero BLOCK findings**: each project hit only 1-2 of 3 applicable checks because v0.1 scope is narrow to Supabase + Stripe stacks. The conclusion: lock's value is **not in inspection depth** (which existing tools — semgrep, gitleaks, supabase CLI — already cover), but in **launch's one-line GO/NO-GO verdict** that bundles them. We decided to pivot mekaknight v2.0 to a **lite, wrap-based architecture**: lock v0.2+ wraps existing inspectors rather than growing its own pattern library. Launch remains the differentiated surface. polish and dedupe are deferred to v2.1+. Target release shifts from 16 weeks to **6-8 weeks**.

## Considered Options

1. **Stay the course — 16-week deep build** — Rejected because: dogfooding revealed zero blockers across three production codebases, leaving no field-validated content for marketing; Anthropic risks shipping a competing production-readiness plugin within that window; deep custom patterns duplicate work that semgrep/gitleaks already do better.

2. **Lite wrap pivot** (chosen) — lock becomes a thin orchestrator over existing inspectors; launch as the deciding surface; ship in 6-8 weeks. The differentiated value is the **aggregator + verdict**, not the detection logic.

3. **Drop lock entirely, keep launch + jameskill assets only** — Rejected because: launch needs *something* to aggregate, and the wrap layer is the cheapest way to provide that without rebuilding inspection from scratch.

## Consequences

- **lock v0.2 scope** changes from "custom Clerk/NextAuth env strength + frontend-only auth detection" to "semgrep wrap + gitleaks wrap + (optional) supabase CLI wrap". The Clerk/NextAuth focus is dropped because no dogfooding target used either stack.
- **polish (AI Score)** and **dedupe + cohesion-check** are postponed to v2.1.
- **launch** remains the v2.0 differentiated surface and the lead marketing message: "one command, one decision".
- **Forge** (orchestrator) and **link/tag/strike** (issue tracker) ship unchanged.
- The roadmap shrinks from **M1-M6 (16 weeks)** to a **3-milestone, 6-8 week** shape; v2.0 launch is brought forward.
- Marketing angle shifts from "deep inspection for vibe-coded apps" to **"one-command production-readiness gate that bundles the tools you already trust"**.
- v2-roadmap.md / v2-skill-catalog.md / v2-vision.md / v2-marketing.md require coordinated rewrites to reflect the new shape.
