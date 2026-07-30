import fs from 'node:fs/promises';
import path from 'node:path';

export const id = 'version-sync';

export const description =
  'package.json version must match .claude-plugin/marketplace.json metadata.version and every plugin entry.';

export async function checkRepo(rootDir) {
  const findings = [];

  const pkgPath = path.join(rootDir, 'package.json');
  const manifestPath = path.join(rootDir, '.claude-plugin', 'marketplace.json');

  const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));

  if (manifest.metadata?.version !== pkg.version) {
    findings.push({
      severity: 'fail',
      message: `marketplace.json metadata.version (${manifest.metadata?.version}) != package.json version (${pkg.version})`,
    });
  }

  if (!manifest.plugins?.length) {
    findings.push({
      severity: 'fail',
      message: 'marketplace.json has no plugin entries',
    });
  }
  for (const pluginEntry of manifest.plugins ?? []) {
    if (pluginEntry.version !== pkg.version) {
      findings.push({
        severity: 'fail',
        message: `marketplace.json plugins[${pluginEntry.name}].version (${pluginEntry.version}) != package.json version (${pkg.version})`,
      });
    }
  }

  return { ok: findings.length === 0, findings };
}
