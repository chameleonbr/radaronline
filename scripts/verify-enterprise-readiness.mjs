import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const requiredFiles = [
  'README.md',
  'docs/README.md',
  'docs/architecture-overview.md',
  'docs/security-model.md',
  'docs/operations-runbook.md',
  'docs/observability.md',
  'docs/portability-and-provider-seams.md',
  'docs/azure-readiness.md',
  'docs/database-governance.md',
  'docs/database-legacy-inventory.md',
  'database/migration-authority.json',
  'docs/compliance-and-audit-checklist.md',
  'docs/handover-checklist.md',
  'docs/enterprise-readiness-final.md',
  'docs/adr/0001-platform-client-seam.md',
  '.github/workflows/ci.yml',
  '.github/workflows/deploy-infra.yml',
  '.github/workflows/deploy-api.yml',
  '.github/workflows/deploy-web.yml',
  'src/services/platformClient.ts',
  'src/lib/observability.ts',
];

const missing = requiredFiles.filter((file) => !existsSync(path.join(root, file)));

if (missing.length > 0) {
  console.error('Missing enterprise readiness artifacts:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}

const workflow = readFileSync(path.join(root, '.github/workflows/ci.yml'), 'utf8');
const packageJson = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const migrationAuthority = JSON.parse(
  readFileSync(path.join(root, 'database/migration-authority.json'), 'utf8')
);

const workflowChecks = ['npm run lint', 'npm run test:run', 'npm run build'];
const missingWorkflowChecks = workflowChecks.filter((check) => !workflow.includes(check));

if (missingWorkflowChecks.length > 0) {
  console.error('CI workflow is missing required steps:');
  missingWorkflowChecks.forEach((step) => console.error(`- ${step}`));
  process.exit(1);
}

const requiredScripts = ['lint', 'test:run', 'build'];
const missingScripts = requiredScripts.filter((scriptName) => !packageJson.scripts?.[scriptName]);

if (missingScripts.length > 0) {
  console.error('package.json is missing required scripts:');
  missingScripts.forEach((scriptName) => console.error(`- ${scriptName}`));
  process.exit(1);
}

if (!migrationAuthority.authoritativePath) {
  console.error('database/migration-authority.json is missing authoritativePath.');
  process.exit(1);
}

if (!existsSync(path.join(root, migrationAuthority.authoritativePath))) {
  console.error(
    `database/migration-authority.json points to a missing path: ${migrationAuthority.authoritativePath}`
  );
  process.exit(1);
}

console.log('Enterprise readiness artifacts verified.');
