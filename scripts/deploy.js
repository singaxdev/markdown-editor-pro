#!/usr/bin/env node

/**
 * Automated Deployment Script for Markdown Editor Pro
 *
 * This script automates the entire deployment process:
 * - Builds the application
 * - Creates platform-specific installers
 * - Prepares GitHub release
 *
 * Usage: node deploy.js [version] [--platform=all|win|mac|linux]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const APP_NAME = 'Markdown Editor Pro';
const PLATFORMS = {
  win: 'Windows',
  mac: 'macOS',
  linux: 'Linux'
};

// Parse command line arguments
const args = process.argv.slice(2);
const version = args[0] || 'patch';
const platformArg = args.find(arg => arg.startsWith('--platform='));
const targetPlatform = platformArg ? platformArg.split('=')[1] : 'all';

console.log(`🚀 Starting deployment of ${APP_NAME}`);
console.log(`📦 Version: ${version}`);
console.log(`🖥️  Platform: ${targetPlatform}`);

// Helper functions
function exec(command, options = {}) {
  console.log(`\n⚡ Executing: ${command}`);
  try {
    return execSync(command, {
      stdio: 'inherit',
      encoding: 'utf8',
      ...options
    });
  } catch (error) {
    console.error(`❌ Failed to execute: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

function checkPrerequisites() {
  console.log('\n🔍 Checking prerequisites...');

  // Check if package.json exists
  if (!fs.existsSync('package.json')) {
    console.error('❌ package.json not found. Run this script from the project root.');
    process.exit(1);
  }

  // Check if build directory exists
  if (!fs.existsSync('build')) {
    console.log('📁 Creating build directory...');
    fs.mkdirSync('build', { recursive: true });
  }

  // Check for required icons
  const requiredIcons = ['icon.png'];
  const missingIcons = requiredIcons.filter(icon => !fs.existsSync(path.join('build', icon)));

  if (missingIcons.length > 0) {
    console.warn(`⚠️  Missing icons: ${missingIcons.join(', ')}`);
    console.warn('   Creating placeholder icons...');
    createPlaceholderIcons();
  }

  console.log('✅ Prerequisites check complete');
}

function createPlaceholderIcons() {
  // Create a simple SVG placeholder and convert to PNG
  const svgContent = `
    <svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
      <rect width="512" height="512" fill="#007acc"/>
      <text x="256" y="280" font-family="Arial" font-size="48" fill="white" text-anchor="middle">MD</text>
    </svg>
  `;

  fs.writeFileSync('build/icon.svg', svgContent);
  console.log('📄 Created placeholder icon.svg');
  console.log('💡 Replace build/icon.* with your actual app icons before final release');
}

function updateVersion() {
  console.log(`\n📝 Updating version (${version})...`);
  exec(`npm version ${version} --no-git-tag-version`);

  // Read the new version
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const newVersion = packageJson.version;
  console.log(`✅ Version updated to: ${newVersion}`);
  return newVersion;
}

function cleanDist() {
  console.log('\n🧹 Cleaning dist directory...');
  if (fs.existsSync('dist')) {
    exec('rm -rf dist');
  }
  console.log('✅ Dist directory cleaned');
}

function buildReactApp() {
  console.log('\n⚛️  Building React application...');
  exec('npm run build');
  console.log('✅ React build complete');
}

function buildElectronApp(platform) {
  console.log(`\n🔨 Building Electron app for ${PLATFORMS[platform] || 'all platforms'}...`);

  const buildCommands = {
    win: 'npm run dist:win',
    mac: 'npm run dist:mac',
    linux: 'npm run dist:linux',
    all: 'npm run dist:all'
  };

  const command = buildCommands[platform] || buildCommands.all;
  exec(command);
  console.log(`✅ Electron build complete for ${platform}`);
}

function listBuiltFiles() {
  console.log('\n📦 Built files:');
  if (fs.existsSync('dist')) {
    const files = fs.readdirSync('dist');
    files.forEach(file => {
      const filePath = path.join('dist', file);
      const stats = fs.statSync(filePath);
      const size = (stats.size / 1024 / 1024).toFixed(1);
      console.log(`   📄 ${file} (${size} MB)`);
    });
  } else {
    console.log('   ❌ No dist directory found');
  }
}

function createGitTag(version) {
  console.log(`\n🏷️  Creating git tag v${version}...`);
  try {
    exec(`git add .`);
    exec(`git commit -m "Release v${version}"`);
    exec(`git tag v${version}`);
    console.log(`✅ Git tag v${version} created`);
    return true;
  } catch (error) {
    console.warn('⚠️  Failed to create git tag (this is okay if not in a git repository)');
    return false;
  }
}

function showDeploymentSummary(version, platform, hasGitTag) {
  console.log('\n🎉 Deployment Summary');
  console.log('═'.repeat(50));
  console.log(`📱 App: ${APP_NAME}`);
  console.log(`🔢 Version: ${version}`);
  console.log(`🖥️  Platform: ${PLATFORMS[platform] || 'All platforms'}`);
  console.log(`📁 Output: ./dist/`);

  if (hasGitTag) {
    console.log(`🏷️  Git tag: v${version}`);
    console.log('\n📤 Next steps:');
    console.log(`   1. Push to GitHub: git push origin main --tags`);
    console.log(`   2. GitHub Actions will automatically create a release`);
    console.log(`   3. Or manually upload files from ./dist/ to GitHub releases`);
  } else {
    console.log('\n📤 Next steps:');
    console.log(`   1. Upload files from ./dist/ to your distribution platform`);
    console.log(`   2. Create a GitHub release manually`);
  }

  console.log('\n🔗 Useful links:');
  console.log(`   📚 Package.json: Update repository URLs`);
  console.log(`   🎨 Icons: Replace placeholders in ./build/`);
  console.log(`   📄 README: Update download links`);
  console.log('\n✨ Deployment complete!');
}

// Main deployment process
async function deploy() {
  try {
    checkPrerequisites();
    const newVersion = updateVersion();
    cleanDist();
    buildReactApp();
    buildElectronApp(targetPlatform);
    listBuiltFiles();
    const hasGitTag = createGitTag(newVersion);
    showDeploymentSummary(newVersion, targetPlatform, hasGitTag);
  } catch (error) {
    console.error('\n❌ Deployment failed:', error.message);
    process.exit(1);
  }
}

// Run deployment
if (require.main === module) {
  deploy();
}

module.exports = { deploy };