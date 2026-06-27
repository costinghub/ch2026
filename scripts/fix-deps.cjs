#!/usr/bin/env node
const { spawnSync } = require('child_process');
const fs = require('fs');

function run(command, args, extraEnv = {}) {
  const result = spawnSync(command, args, {
    stdio: 'inherit',
    shell: true,
    env: { ...process.env, ...extraEnv },
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

console.log('======================================================');
console.log('⚙️  RUNNING DEPLOYMENT DEPENDENCY RESOLVER');
console.log('======================================================');

console.log('📦 Setting legacy-peer-deps configuration...');
run('npm', ['config', 'set', 'legacy-peer-deps', 'true']);

if (fs.existsSync('package-lock.json')) {
  console.log('🔒 Syncing package-lock.json with package.json...');
  run('npm', ['install', '--package-lock-only', '--legacy-peer-deps']);
} else {
  console.log('⚠️  No package-lock.json found. Creating one...');
  run('npm', ['install', '--package-lock-only', '--legacy-peer-deps']);
}

console.log('✅ Dependency setup complete!');
console.log('======================================================');
