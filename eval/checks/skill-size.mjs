import fs from 'node:fs/promises';
import path from 'node:path';

export const id = 'skill-size';

// After a compaction, Claude Code re-attaches each invoked skill keeping only
// its first 5,000 tokens (Claude Code docs, skills page). Anything past that
// point is gone for the rest of the session, so a SKILL.md must fit.
// 20,000 bytes stays under 5,000 tokens for English prose; bytes rather than
// characters because the skills contain non-ASCII text.
const LIMIT_BYTES = 20_000;

export const description = `Every skills/*/SKILL.md must stay under ${LIMIT_BYTES} bytes so it survives compaction whole.`;

export async function checkRepo(rootDir) {
  const findings = [];
  const skillsDir = path.join(rootDir, 'skills');
  const entries = await fs.readdir(skillsDir, { withFileTypes: true });
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const file = path.join(skillsDir, e.name, 'SKILL.md');
    let stat;
    try {
      stat = await fs.stat(file);
    } catch {
      continue;
    }
    if (stat.size >= LIMIT_BYTES) {
      findings.push({
        severity: 'fail',
        message: `skills/${e.name}/SKILL.md is ${stat.size} bytes (limit ${LIMIT_BYTES}); move phase detail into references/`,
      });
    }
  }
  return { ok: findings.length === 0, findings };
}
