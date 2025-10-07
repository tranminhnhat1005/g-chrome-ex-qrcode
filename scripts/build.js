#!/usr/bin/env node

/**
 * Build script for QR Code Generator Pro Chrome Extension
 * Copies source files to dist/ folder for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔨 Building QR Code Generator Pro Extension...');

// Clean dist directory
const distDir = path.join(__dirname, '..', 'dist');
if (fs.existsSync(distDir)) {
  fs.rmSync(distDir, { recursive: true, force: true });
}
fs.mkdirSync(distDir, { recursive: true });

// Copy files function
function copyFile(src, dest) {
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`✅ Copied: ${path.relative(process.cwd(), src)} → ${path.relative(process.cwd(), dest)}`);
}

// Copy directory recursively
function copyDir(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.lstatSync(srcPath).isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

try {
  // Copy manifest.json
  copyFile(
    path.join(__dirname, '..', 'manifest.json'),
    path.join(distDir, 'manifest.json')
  );

  // Copy src directory
  copyDir(
    path.join(__dirname, '..', 'src'),
    path.join(distDir, 'src')
  );

  console.log('🎉 Build completed successfully!');
  console.log(`📦 Extension ready for deployment in: ${path.relative(process.cwd(), distDir)}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Load unpacked extension from dist/ folder in Chrome');
  console.log('2. Test all functionality');
  console.log('3. Run "npm run zip" to create distribution package');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}