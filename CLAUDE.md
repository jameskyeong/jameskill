# jameskill

Notion issue tracker integration for Claude Code.

## Available Skills

- `/report-issue` — Report issues to a Notion database. Parses prompts, verifies against codebase, creates pages with proper template blocks.
- `/resolve-issue` — Fetch pending issues, brainstorm solutions, implement fixes, update status.
- `/setup-issue` — Configure Notion API key, connect databases, detect templates, set defaults.

## Configuration

Each project stores its config in `.claude/tracking-issue.json` (gitignored). Run `/setup-issue` to create it.

## Requirements

- `curl` (HTTP calls to Notion API)
- `jq` (JSON parsing)
- A Notion Internal Integration token

## Versioning policy

Use strict semver when running `npm version`. **Do not default to minor for every change** — classify by the change's primary intent:

| Change | Bump |
|---|---|
| Bug fix, doc/spec gap fill, shell compat patch, fixing existing inconsistency | **patch** (`x.x.+1`) |
| New skill file, new command, new workflow Phase, genuinely new capability the user can invoke | **minor** (`x.+1.0`) |
| Skill/command rename, breaking signature change | **major** (`+1.0.0`, commit prefix `feat!:`) |

Borderline rule of thumb: if the change *primarily* closes a gap in existing behavior (even if a small new behavior is added as side-effect), use **patch**. If it introduces a meaningfully invocable new capability, use **minor**.
