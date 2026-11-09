import fs from 'node:fs/promises';
import path from 'node:path';

export const id = 'skills-dir-clean';

// Everything under skills/ ships to every user and can be found by an agent
// mid-task. Test scenarios, fixtures and logs belong in eval/, not next to a
// SKILL.md, where an agent may read a staged scenario as a real instruction.
export const description =
  'skills/ holds only <skill>/SKILL.md and <skill>/references/*.md; anything else belongs in eval/.';

function allowed(rel) {
  const parts = rel.split(path.sep);
  if (parts.length === 2 && parts[1] === 'SKILL.md') return true;
  if (parts.length === 3 && parts[1] === 'references' && parts[2].endsWith('.md')) return true;
  return false;
}

export async function checkRepo(rootDir) {
  const findings = [];
  const skillsDir = path.join(rootDir, 'skills');
  async function walk(dir) {
    for (const e of await fs.readdir(dir, { withFileTypes: true })) {
      if (e.name.startsWith('.')) continue; // OS litter such as .DS_Store never ships (gitignored)
      const full = path.join(dir, e.name);
      if (e.isDirectory()) {
        await walk(full);
      } else {
        const rel = path.relative(skillsDir, full);
        if (!allowed(rel)) {
          findings.push({ severity: 'fail', message: `skills/${rel} is not a SKILL.md or a references/*.md; move it to eval/` });
        }
      }
    }
  }
  await walk(skillsDir);
  return { ok: findings.length === 0, findings };
}
