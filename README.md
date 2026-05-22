# jameskill

Developer productivity skills for [Claude Code](https://claude.ai/claude-code) — issue tracking, structured workflows, and more.

## Skills

### Issue Tracking

Notion-based issue tracker integration. Report, resolve, and manage issues directly from your terminal.

| Skill | Command | Description |
|---|---|---|
| Setup | `/tracking-issue-setup` | Configure Notion connection |
| Report | `/tracking-issue-report` | Create issues from a prompt — auto-groups related items into single tickets |
| Resolve | `/tracking-issue-resolve` | Work on pending issues, with non-developer-friendly outcome notes |

Designed for cross-functional teams: titles and notes follow a non-developer-friendly tone (PMs, support, customers can read them as-is — no engineering context required).

### Workflow

Structured development workflow that orchestrates [Matt Pocock skills](https://github.com/mattpocock/skills) into a complete flow: clarify requirements, validate against the domain model, implement with TDD, review, and verify.

| Skill | Command | Description |
|---|---|---|
| Workflow | `/workflow` | Full development flow from problem to verified implementation |

**Requires Matt Pocock skills installed** (user-level `~/.claude/skills/` or project-level `.claude/skills/`). The workflow halts at Phase -1 (Preflight) if any required skill is missing.

**Phases:**

1. **Clarify** — Interview to resolve ambiguity
2. **Grill** — Validate against domain model and documented decisions
3. **Route** — Bug (diagnose) / Exploration (prototype) / Large feature (PRD + issue decomposition) / Clear feature (straight to build)
4. **Build** — Test-driven development (red-green-refactor)
5. **Architecture** — Structural review with compound improvement
6. **Review** — Two-axis code review (Standards + Spec)
7. **Verify** — Type checking, tests, lint

## Installation

```bash
claude plugins marketplace add https://github.com/jameskyeong/jameskill.git
claude plugins install jameskill
```

## Requirements

- [Claude Code](https://claude.ai/claude-code)
- `curl` + `jq` (for issue tracking skills)
- A [Notion Internal Integration](https://www.notion.so/my-integrations) token (for issue tracking skills)

## License

[MIT](LICENSE)
