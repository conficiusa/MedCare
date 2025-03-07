// Simple script to execute the make-data-key.ts file with proper ESM settings
const { spawn } = require('child_process');
const path = require('path');

// On Windows, we need to specify the full path to the executable
const isWindows = process.platform === 'win32';
const npxCommand = isWindows ? 'npx.cmd' : 'npx';

const child = spawn(npxCommand, [
  'ts-node',
  '--esm', // Enable ESM support
  '--transpileOnly', // Corrected from transpile-only
  'make-data-key.ts'
], {
  stdio: 'inherit',
  cwd: __dirname,
  shell: isWindows // Use shell on Windows for better compatibility
});

child.on('exit', (code) => {
  process.exit(code || 0);
});

child.on('error', (err) => {
  console.error('Failed to start subprocess:', err);
  process.exit(1);
});