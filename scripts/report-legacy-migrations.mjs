import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const authorityPath = path.join(root, 'database/migration-authority.json');

if (!existsSync(authorityPath)) {
  console.error('database/migration-authority.json not found.');
  process.exit(1);
}

const authority = JSON.parse(readFileSync(authorityPath, 'utf8'));
const legacyPaths = authority.legacySupplementalPaths || [];
const markdownOutputPath = path.join(root, 'docs/database-legacy-inventory.md');

function collectFiles(relativeDir) {
  const fullDir = path.join(root, relativeDir);
  if (!existsSync(fullDir)) {
    return [];
  }

  return readdirSync(fullDir)
    .map((entry) => path.join(fullDir, entry))
    .filter((entryPath) => statSync(entryPath).isFile())
    .map((entryPath) => path.relative(root, entryPath).replaceAll('\\', '/'))
    .sort();
}

const sections = legacyPaths.map((relativeDir) => ({
  relativeDir,
  files: collectFiles(relativeDir),
}));

const lines = [
  '# Legacy Migration Inventory',
  '',
  `Authority: \`${authority.authoritativePath}\``,
  '',
];

for (const section of sections) {
  lines.push(`## ${section.relativeDir}`);
  lines.push('');

  if (section.files.length === 0) {
    lines.push('- none');
  } else {
    for (const file of section.files) {
      lines.push(`- \`${file}\``);
    }
  }

  lines.push('');
}

const markdown = lines.join('\n');

if (process.argv.includes('--write')) {
  writeFileSync(markdownOutputPath, markdown);
  console.log(`Legacy migration inventory written to ${path.relative(root, markdownOutputPath)}.`);
} else {
  console.log(markdown);
}
