# Retire security and ship; jameskill is develop alone

ADR 0004 kept `security` and `ship` in the plugin as alpha utilities off the marketing surface, and deferred their future (wrap, deep, or sunset) to post-launch feedback. An audit on 2026-11-16 settled it:

- **No use.** Across 77 of the author's Claude Code sessions (2026-10-15 to 2026-11-16), `develop` was invoked 13 times; `security` and `ship` were invoked zero times.
- **No findings.** The v0.1 dogfooding on three live codebases returned zero BLOCK findings (ADR 0004).
- **Covered elsewhere.** Supabase's own Security Advisor reads the live database and flags a public table with RLS off, in Studio, through the CLI (`supabase db advisors`) and through its MCP server. `security` usually reads migration files instead, where it cannot tell "off" from "enabled in the dashboard" and can only WARN. Code-level review of a diff is Claude Code's built-in `/security-review`.
- **Thin.** Three checks on one stack (Next.js, Supabase, Stripe), and no fixture that proves any of them fires. `ship` adds one rule on top of `security`'s report: any BLOCK means NO-GO.
- **Unkept promises.** `security` still announced five more checks for v0.2 and an auto-fix "in a later version"; neither is planned.

Keeping them meant README copy that either oversold them or apologized for them. Both cost the reader's trust in the skill that does carry the plugin.

## Decision

Remove `skills/security/` and `skills/ship/`. jameskill ships one skill, `develop`. README, CLAUDE.md, CONTEXT.md, the plugin descriptions and the eval gate check drop them. The skills badge goes too, since a count of one says nothing.

## Considered options

1. **Rework `security`**: fold `ship` into it, read Supabase's advisors, add fixture evals. Real work for a skill nobody has asked for yet.
2. **Fold the checks into `develop`**: run them in Verify when a diff touches migrations, env files or webhook handlers. Ties a stack-neutral orchestrator to one stack.
3. **Remove both** (chosen): matches actual use, and leaves the plugin telling the story its README already tells, one skill rather than a toolbox.

## Consequences

- `/jsk:security` and `/jsk:ship` disappear on update. Removing a command is breaking under the versioning policy: commit prefix `feat!:`, still within the alpha line (`2.0.0-alpha.26` to `2.0.0-alpha.27`).
- The code stays in git history (last present at `v2.0.0-alpha.26`) and can return as a fresh decision if users ask for configuration checks.
- ADRs 0004 and 0010, and the plans that discuss these skills, stay as records of their time.
