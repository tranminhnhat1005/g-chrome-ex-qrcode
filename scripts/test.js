#!/usr/bin/env node

/**
 * Test script for QR Code Generator Pro Chrome Extension
 * Validates extension structure and functionality
 */

const fs = require('fs');
const path = require('path');

console.log('🧪 Testing QR Code Generator Pro Extension...');

let passed = 0;
let failed = 0;

function test(description, condition) {
  if (condition) {
    console.log(`✅ ${description}`);
    passed++;
  } else {
    console.log(`❌ ${description}`);
    failed++;
  }
}

// Test file structure
console.log('\n📁 Testing file structure...');

const requiredFiles = [
  'manifest.json',
  'src/popup/popup.html',
  'src/popup/popup.js',
  'src/lib/qrcode.min.js',
  'src/assets/icons/icon16.png',
  'src/assets/icons/icon48.png',
  'src/assets/icons/icon128.png'
];

for (const file of requiredFiles) {
  const filePath = path.join(__dirname, '..', file);
  test(`File exists: ${file}`, fs.existsSync(filePath));
}

// Test manifest.json
console.log('\n📋 Testing manifest.json...');

try {
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  test('Manifest version is 3', manifest.manifest_version === 3);
  test('Extension name exists', !!manifest.name);
  test('Extension version exists', !!manifest.version);
  test('Extension description exists', !!manifest.description);
  test('Action popup defined', !!manifest.action?.default_popup);
  test('Icons defined', !!manifest.icons);
  test('Permissions defined', Array.isArray(manifest.permissions));
  
  // Test icon paths
  const iconSizes = ['16', '48', '128'];
  for (const size of iconSizes) {
    const iconPath = manifest.icons[size];
    test(`Icon ${size}px path correct`, iconPath && iconPath.startsWith('src/assets/icons/'));
  }
  
} catch (error) {
  test('Manifest.json is valid JSON', false);
  console.log(`   Error: ${error.message}`);
}

// Test popup.html
console.log('\n🖥️  Testing popup.html...');

try {
  const popupPath = path.join(__dirname, '..', 'src', 'popup', 'popup.html');
  const popupContent = fs.readFileSync(popupPath, 'utf8');
  
  test('HTML includes QR library script', popupContent.includes('qrcode.min.js'));
  test('HTML includes popup script', popupContent.includes('popup.js'));
  test('HTML has required elements', 
    popupContent.includes('text-input') && 
    popupContent.includes('generate-btn') && 
    popupContent.includes('qr-code')
  );
  test('HTML script paths are relative', 
    popupContent.includes('../lib/qrcode.min.js')
  );
  
} catch (error) {
  test('popup.html is readable', false);
  console.log(`   Error: ${error.message}`);
}

// Test popup.js
console.log('\n⚙️  Testing popup.js...');

try {
  const jsPath = path.join(__dirname, '..', 'src', 'popup', 'popup.js');
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  
  test('JS defines QRCodeGeneratorPro class', jsContent.includes('class QRCodeGeneratorPro'));
  test('JS has proper initialization', jsContent.includes('DOMContentLoaded'));
  test('JS is optimized (no console.log)', !jsContent.includes('console.log'));
  test('JS has cleanup method', jsContent.includes('cleanup()'));
  test('JS has error handling', jsContent.includes('try') && jsContent.includes('catch'));
  
} catch (error) {
  test('popup.js is readable', false);
  console.log(`   Error: ${error.message}`);
}

// Test directory structure
console.log('\n📂 Testing directory structure...');

const requiredDirs = [
  'src',
  'src/popup',
  'src/assets',
  'src/assets/icons',
  'src/lib',
  'docs',
  'scripts'
];

for (const dir of requiredDirs) {
  const dirPath = path.join(__dirname, '..', dir);
  test(`Directory exists: ${dir}`, fs.existsSync(dirPath));
}

// Summary
console.log('\n📊 Test Summary:');
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`📈 Success Rate: ${Math.round(passed / (passed + failed) * 100)}%`);

if (failed === 0) {
  console.log('\n🎉 All tests passed! Extension is ready for deployment.');
} else {
  console.log('\n⚠️  Some tests failed. Please fix the issues before deployment.');
  process.exit(1);
}