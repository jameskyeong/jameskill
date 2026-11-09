import fs from 'node:fs/promises';
import path from 'node:path';

export const id = 'no-em-dash';

// Agents copy the style of the instructions they read, so em-dashes in skill
// prose leak into user-facing replies, including Korean ones where the author
// does not want them. Keep the shipped skills and the Korean README free of them.
export const description = 'No em-dash (U+2014) under skills/ or in README.ko.md.';

async function mdFiles(dir) {
  const out = [];
  for (const e of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await mdFiles(full)));
    else if (e.name.endsWith('.md')) out.push(full);
  }
  return out;
}

export async function checkRepo(rootDir) {
  const findings = [];
  const files = [...(await mdFiles(path.join(rootDir, 'skills'))), path.join(rootDir, 'README.ko.md')];
  for (const file of files) {
    const lines = (await fs.readFile(file, 'utf8')).split('\n');
    lines.forEach((line, i) => {
      if (line.includes('—')) {
        findings.push({ severity: 'fail', line: i + 1, message: `${path.relative(rootDir, file)} has an em-dash` });
      }
    });
  }
  return { ok: findings.length === 0, findings };
}
