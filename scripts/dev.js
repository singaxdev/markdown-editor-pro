#!/usr/bin/env node

const { spawn } = require('child_process');
const os = require('os');

const platform = os.platform();
let command;

switch (platform) {
  case 'darwin':
    console.log('🍎 Detected macOS - Starting Electron development...');
    command = 'npm run electron-dev-mac';
    break;
  case 'win32':
    console.log('🪟 Detected Windows - Starting Electron development...');
    command = 'npm run electron-dev-win';
    break;
  case 'linux':
    console.log('🐧 Detected Linux - Starting Electron development...');
    command = 'npm run electron-dev-linux';
    break;
  default:
    console.log('🤖 Unknown platform - Using default...');
    command = 'npm run electron-dev';
}

// Execute the appropriate command
const child = spawn(command, { shell: true, stdio: 'inherit' });

child.on('close', (code) => {
  console.log(`\nElectron development server exited with code ${code}`);
  process.exit(code);
});

child.on('error', (error) => {
  console.error(`Error starting development server: ${error.message}`);
  process.exit(1);
});