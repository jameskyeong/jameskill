# jameskill

Claude Code plugin that provides production-readiness skills for AI-built apps. Skills are invoked as `/jameskill:<skill-name>` in Claude Code sessions.

## Language

### Orchestration

**Temper**:
The development orchestrator skill (`/jameskill:temper`). Takes raw requirements through a disciplined pipeline — clarify → build → review → verify → finish — to produce hardened, production-grade code. Named after the metallurgical process of repeatedly heating and cooling metal to maximize strength.
_Avoid_: workflow (ambiguous — see Flagged Ambiguities)

**Production-readiness gate**:
The architectural concept spanning the entire jameskill v2.0 pipeline: **temper** builds the code, **ship-check** inspects it across dimensions, **ship-ready** issues the final verdict. Not a single skill — the emergent property of all three working in sequence.
_Avoid_: workflow, pipeline (too generic)

**Cross-cutting verify gate**:
A discipline enforced at every phase boundary within **temper**: no phase may declare completion without running verification commands and directly observing the output. "Should work" and "seems to pass" are treated as "not verified."
_Avoid_: check, validation (too vague)

### Routing

**DIRECT**:
A **temper** routing decision for small, contained changes (1-4 commits, tightly-grouped files). Skips plan file creation and proceeds straight to build.
_Avoid_: simple, small (subjective)

**PLAN**:
A **temper** routing decision for medium-scope features (5-15 commits, 2-4 files with shared state). Produces a plan file in `docs/plans/` before sequential task execution.
_Avoid_: roadmap, spec (different things)

### Inspection

**Harden**:
Inspection engine (`/jameskill:harden`) that checks a target project for vibe-stack service-configuration security holes — Supabase RLS gaps, secret-key client exposure, missing webhook signature verification. Catches what code scanners (semgrep) miss: configuration mistakes, not code patterns. Named for metallurgical hardening, continuing the temper theme.
_Avoid_: auth-check (too narrow — most checks are not auth), secure (implies it covers all security; it covers ~1/3, the rest is semgrep + secret scanning)

### Ship ecosystem

**Ship-check**:
Umbrella inspection skill that runs security + design + quality checks and produces a 1-minute summary. Invoked automatically by **temper** before the finish phase. Does not exist yet — planned for M4 once design and quality skills land.
_Avoid_: audit, review (ship-check is automated and multi-dimensional)

**Ship-ready**:
The GO / NO-GO verdict skill (`/jameskill:ship-ready`). Aggregates inspection findings (currently **harden**; later **ship-check**) into a single binary answer to "can I deploy this?". The `?` is dropped from the skill name to stay filesystem-safe; the output still reads "SHIP READY?".
_Avoid_: deploy check, release gate, ship-ready? (the literal question mark)

### Legacy

**workflow-external**:
The preserved v1.x orchestrator (`skills/workflow-external/SKILL.md`) that depended on superpowers and Matt Pocock skills. Kept as reference; not actively maintained.
_Avoid_: old workflow, legacy workflow

## Flagged ambiguities

**"workflow"**: Previously used for both the orchestrator skill name AND the general concept of jameskill's pipeline. Resolved: the skill is now **temper**; the concept is **production-readiness gate**. The word "workflow" should only appear when referring to the preserved **workflow-external**.

## Example dialogue

> **Dev**: "I want to add harden to the temper pipeline."
> **Domain expert**: "You mean adding it to the ship-check slot inside temper? Ship-check is where all inspection skills plug in. Temper itself just orchestrates the build flow — it doesn't inspect."
> **Dev**: "Right. So when temper reaches the ship-check phase, it invokes ship-check, which then calls harden?"
> **Domain expert**: "Eventually, yes — but ship-check doesn't exist yet. For now harden runs standalone, and ship-ready reads harden's output directly to issue GO or NO-GO."
