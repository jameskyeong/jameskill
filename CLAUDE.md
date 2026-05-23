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
