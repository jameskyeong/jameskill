import fs from 'node:fs/promises';
import path from 'node:path';

export const id = 'cross-cutting-gates-present';

export const description =
  'develop must declare its cross-cutting gates: the Forbidden language section and the user-facing communication style gate.';

const FORGE_REQUIRED = [
  { needle: 'Forbidden language', name: '"Forbidden language" section' },
  { needle: 'user-facing communication style', name: '"user-facing communication style" gate' },
];

export async function checkRepo(rootDir) {
  const findings = [];

  // develop
  const forgePath = path.join(rootDir, 'skills', 'develop', 'SKILL.md');
  const forgeContent = await fs.readFile(forgePath, 'utf8');
  for (const req of FORGE_REQUIRED) {
    if (!forgeContent.includes(req.needle)) {
      findings.push({
        severity: 'fail',
        message: `skills/develop/SKILL.md missing ${req.name} (needle: "${req.needle}")`,
      });
    }
  }

  return { ok: findings.length === 0, findings };
}
