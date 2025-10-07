#!/usr/bin/env node

/**
 * Lint script for QR Code Generator Pro Chrome Extension
 * Basic code quality checks and best practices validation
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Linting QR Code Generator Pro Extension...');

let issues = 0;
let warnings = 0;

function error(file, message) {
  console.log(`❌ ERROR in ${file}: ${message}`);
  issues++;
}

function warn(file, message) {
  console.log(`⚠️  WARNING in ${file}: ${message}`);
  warnings++;
}

function info(message) {
  console.log(`ℹ️  ${message}`);
}

// Lint manifest.json
console.log('\n📋 Linting manifest.json...');

try {
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  
  if (manifest.manifest_version !== 3) {
    error('manifest.json', 'Should use Manifest V3');
  }
  
  if (!manifest.name || manifest.name.length < 3) {
    error('manifest.json', 'Extension name too short');
  }
  
  if (!manifest.description || manifest.description.length < 10) {
    error('manifest.json', 'Description too short');
  }
  
  if (!manifest.version || !/^\d+\.\d+\.\d+$/.test(manifest.version)) {
    error('manifest.json', 'Invalid version format (should be x.y.z)');
  }
  
  if (!manifest.icons || !manifest.icons['128']) {
    error('manifest.json', 'Missing 128px icon');
  }
  
} catch (err) {
  error('manifest.json', 'Invalid JSON or file not found');
}

// Lint popup.js
console.log('\n⚙️  Linting popup.js...');

try {
  const jsPath = path.join(__dirname, '..', 'src', 'popup', 'popup.js');
  const jsContent = fs.readFileSync(jsPath, 'utf8');
  const lines = jsContent.split('\n');
  
  // Check for common issues
  if (jsContent.includes('console.log')) {
    warn('popup.js', 'Contains console.log statements (should be removed for production)');
  }
  
  if (jsContent.includes('alert(')) {
    warn('popup.js', 'Uses alert() - consider using better UX patterns');
  }
  
  if (!jsContent.includes('try') || !jsContent.includes('catch')) {
    warn('popup.js', 'Missing error handling with try/catch');
  }
  
  if (!jsContent.includes('addEventListener')) {
    error('popup.js', 'No event listeners found');
  }
  
  // Check line length
  lines.forEach((line, index) => {
    if (line.length > 120) {
      warn('popup.js', `Line ${index + 1} too long (${line.length} chars)`);
    }
  });
  
  // Check for proper class structure
  if (!jsContent.includes('class ')) {
    warn('popup.js', 'Consider using ES6 classes for better organization');
  }
  
} catch (err) {
  error('popup.js', 'File not found or not readable');
}

// Lint popup.html
console.log('\n🖥️  Linting popup.html...');

try {
  const htmlPath = path.join(__dirname, '..', 'src', 'popup', 'popup.html');
  const htmlContent = fs.readFileSync(htmlPath, 'utf8');
  
  if (!htmlContent.includes('<!DOCTYPE html>') && !htmlContent.includes('<html')) {
    error('popup.html', 'Missing proper HTML structure');
  }
  
  if (!htmlContent.includes('meta charset')) {
    warn('popup.html', 'Missing charset declaration');
  }
  
  if (!htmlContent.includes('meta name="viewport"')) {
    warn('popup.html', 'Missing viewport meta tag');
  }
  
  if (htmlContent.includes('style=')) {
    warn('popup.html', 'Inline styles found - consider moving to CSS');
  }
  
  if (!htmlContent.includes('<title>')) {
    warn('popup.html', 'Missing page title');
  }
  
} catch (err) {
  error('popup.html', 'File not found or not readable');
}

// Check file sizes
console.log('\n📏 Checking file sizes...');

const filesToCheck = [
  'src/popup/popup.js',
  'src/popup/popup.html',
  'src/lib/qrcode.min.js'
];

for (const file of filesToCheck) {
  try {
    const filePath = path.join(__dirname, '..', file);
    const stats = fs.statSync(filePath);
    const sizeKB = Math.round(stats.size / 1024 * 100) / 100;
    
    if (file.includes('popup.js') && sizeKB > 50) {
      warn(file, `Large file size: ${sizeKB}KB (consider optimization)`);
    } else if (file.includes('popup.html') && sizeKB > 20) {
      warn(file, `Large file size: ${sizeKB}KB (consider optimization)`);
    } else {
      info(`${file}: ${sizeKB}KB ✓`);
    }
  } catch (err) {
    error(file, 'Could not check file size');
  }
}

// Summary
console.log('\n📊 Lint Summary:');
console.log(`❌ Errors: ${issues}`);
console.log(`⚠️  Warnings: ${warnings}`);

if (issues === 0 && warnings === 0) {
  console.log('\n🎉 No issues found! Code quality looks good.');
} else if (issues === 0) {
  console.log('\n✅ No errors found, but consider addressing warnings.');
} else {
  console.log('\n❌ Please fix the errors before deployment.');
  process.exit(1);
}