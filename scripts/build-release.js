#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Markdown Editor Pro Release...\n');

// Clean previous artifacts
console.log('🧹 Cleaning previous artifacts...');
if (fs.existsSync('release/artifacts')) {
  fs.rmSync('release/artifacts', { recursive: true, force: true });
}
fs.mkdirSync('release/artifacts', { recursive: true });

// Build the application
console.log('📦 Building application...');
execSync('npm run build', { stdio: 'inherit' });

// Build for all platforms
console.log('\n🔨 Building platform packages...');

const platforms = [
  { name: 'macOS', command: 'npm run electron:pack -- --mac', emoji: '🍎' },
  { name: 'Windows', command: 'npm run electron:pack -- --win', emoji: '🪟' },
  { name: 'Linux', command: 'npm run electron:pack -- --linux --config.linux.target=AppImage --config.linux.target=deb', emoji: '🐧' }
];

platforms.forEach(platform => {
  try {
    console.log(`${platform.emoji} Building ${platform.name}...`);
    execSync(platform.command, { stdio: 'inherit' });
    console.log(`✅ ${platform.name} build completed`);
  } catch (error) {
    console.log(`⚠️  ${platform.name} build failed (some dependencies may be missing on this platform)`);
  }
});

// Clean up build files (keep only main artifacts)
console.log('\n🧹 Cleaning up build files...');
const artifactsDir = 'release/artifacts';
const filesToKeep = ['.dmg', '.zip', '.exe', '.AppImage', '.deb', '.rpm'];

if (fs.existsSync(artifactsDir)) {
  const files = fs.readdirSync(artifactsDir);
  files.forEach(file => {
    const filePath = path.join(artifactsDir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Remove unpacked directories
      fs.rmSync(filePath, { recursive: true, force: true });
      console.log(`🗑️  Removed unpacked directory: ${file}`);
    } else if (!filesToKeep.some(ext => file.endsWith(ext))) {
      // Remove non-essential files
      fs.unlinkSync(filePath);
      console.log(`🗑️  Removed build file: ${file}`);
    }
  });
}

// Display final artifacts
console.log('\n📦 Final Release Artifacts:');
if (fs.existsSync(artifactsDir)) {
  const files = fs.readdirSync(artifactsDir);
  const sortedFiles = files.sort((a, b) => {
    // Sort by platform order: Windows, macOS, Linux
    const order = { exe: 1, dmg: 2, zip: 3, AppImage: 4, deb: 5, rpm: 6 };
    const extA = a.split('.').pop();
    const extB = b.split('.').pop();
    return (order[extA] || 999) - (order[extB] || 999);
  });

  let totalSize = 0;
  sortedFiles.forEach(file => {
    const filePath = path.join(artifactsDir, file);
    const stat = fs.statSync(filePath);
    const sizeInMB = (stat.size / (1024 * 1024)).toFixed(1);
    totalSize += stat.size;
    
    let emoji = '📄';
    if (file.includes('.exe')) emoji = '🪟';
    else if (file.includes('.dmg') || file.includes('.zip')) emoji = '🍎';
    else if (file.includes('.AppImage') || file.includes('.deb') || file.includes('.rpm')) emoji = '🐧';
    
    console.log(`${emoji} ${file} (${sizeInMB}MB)`);
  });
  
  const totalSizeInMB = (totalSize / (1024 * 1024)).toFixed(1);
  console.log(`\n📊 Total size: ${totalSizeInMB}MB`);
  console.log(`📁 Location: ${path.resolve(artifactsDir)}`);
}

console.log('\n✅ Release build completed!');
console.log('🎯 Ready to upload to GitHub Releases'); 