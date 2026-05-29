# Self-contained orchestrator (temper) replacing external skill dependencies

The v1.x workflow orchestrator depended on 11 external skills from superpowers (obra) and Matt Pocock to function — if any were missing, it halted entirely. We decided to replace it with a self-contained orchestrator (`temper`) that embeds the core philosophies of those skills directly in its SKILL.md, rather than invoking them at runtime. This trades depth (the external skills had years of accumulated discipline) for independence (temper works without any plugin dependencies).

## Considered Options

1. **Keep external dependencies** — continue requiring superpowers + Matt Pocock skills. Rejected because: users must install 2 additional plugin families before jameskill's core feature works; version drift between the three projects creates fragile coupling; and jameskill's v2.0 identity as a standalone production-readiness layer is undermined by depending on development-phase tools.

2. **Thin wrapper with optional fallback** — call external skills when available, fall back to built-in behavior when not. Rejected because: two code paths means two behaviors to maintain and test; users get inconsistent experiences depending on their plugin setup; and the SKILL.md becomes complex with conditional logic.

3. **Self-contained with philosophy embedding** (chosen) — extract the core principles (relentless clarification, strict TDD, no-soft-language verification, two-axis code review) into temper's own SKILL.md text. The external skills' source code served as design reference, not runtime dependency.

## Consequences

- temper's clarify/build/review/verify phases will initially be shallower than grill-me/tdd/verification-before-completion. This is acknowledged in the README: "temper is for production gating, not for daily TDD workflow."
- The preserved `workflow-external` skill remains available for users who prefer the external-dependency version.
- Future deepening of temper's phases does not require coordinating with upstream skill authors.
