#!/usr/bin/env node

/**
 * Zip script for QR Code Generator Pro Chrome Extension
 * Creates a distributable ZIP file from the dist/ folder
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

console.log('📦 Creating distribution package...');

const distDir = path.join(__dirname, '..', 'dist');
const packageInfo = require('../package.json');
const zipName = `qr-code-generator-pro-v${packageInfo.version}.zip`;
const zipPath = path.join(__dirname, '..', zipName);

// Check if dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory not found. Run "npm run build" first.');
  process.exit(1);
}

// Remove existing zip file
if (fs.existsSync(zipPath)) {
  fs.unlinkSync(zipPath);
  console.log(`🗑️  Removed existing: ${zipName}`);
}

// Create zip file
const command = process.platform === 'win32' 
  ? `powershell Compress-Archive -Path "${distDir}\\*" -DestinationPath "${zipPath}"`
  : `cd "${distDir}" && zip -r "../${zipName}" .`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Failed to create zip file:', error.message);
    process.exit(1);
  }

  if (stderr && !stderr.includes('warning')) {
    console.error('❌ Zip creation error:', stderr);
    process.exit(1);
  }

  // Verify zip file was created
  if (fs.existsSync(zipPath)) {
    const stats = fs.statSync(zipPath);
    const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
    
    console.log('✅ Distribution package created successfully!');
    console.log(`📦 File: ${zipName}`);
    console.log(`📏 Size: ${sizeKB} KB`);
    console.log('');
    console.log('🚀 Ready for Chrome Web Store upload!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Go to Chrome Web Store Developer Dashboard');
    console.log('2. Upload the ZIP file');
    console.log('3. Fill in store listing details');
    console.log('4. Submit for review');
  } else {
    console.error('❌ Zip file was not created successfully');
    process.exit(1);
  }
});