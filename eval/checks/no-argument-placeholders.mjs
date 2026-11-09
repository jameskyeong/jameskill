import fs from 'node:fs/promises';
import path from 'node:path';

export const id = 'no-argument-placeholders';

// Claude Code substitutes $ARGUMENTS and positional $0, $1, ... in a skill's
// SKILL.md body with the invocation's arguments, so a shell snippet such as
// awk '{print $1}' breaks the moment the skill is invoked with arguments.
// References are read with the Read tool and are not substituted.
export const description =
  'No $ARGUMENTS or $<digit> in any SKILL.md body (Claude Code substitutes them with invocation arguments).';

const PATTERN = /\$ARGUMENTS|\$[0-9]/g;

export async function checkRepo(rootDir) {
  const findings = [];
  const skillsDir = path.join(rootDir, 'skills');
  for (const e of await fs.readdir(skillsDir, { withFileTypes: true })) {
    if (!e.isDirectory()) continue;
    const file = path.join(skillsDir, e.name, 'SKILL.md');
    let content;
    try {
      content = await fs.readFile(file, 'utf8');
    } catch {
      continue;
    }
    content.split('\n').forEach((line, i) => {
      for (const m of line.matchAll(PATTERN)) {
        findings.push({ severity: 'fail', line: i + 1, message: `skills/${e.name}/SKILL.md uses ${m[0]}, which is replaced by invocation arguments` });
      }
    });
  }
  return { ok: findings.length === 0, findings };
}
