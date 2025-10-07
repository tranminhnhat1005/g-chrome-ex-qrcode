#!/usr/bin/env node

/**
 * Clean script for QR Code Generator Pro Chrome Extension
 * Removes build artifacts and temporary files
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Cleaning build artifacts...');

const itemsToClean = [
  path.join(__dirname, '..', 'dist'),
  path.join(__dirname, '..', '*.zip'),
  path.join(__dirname, '..', 'node_modules'),
  path.join(__dirname, '..', '.DS_Store'),
];

let cleaned = 0;

for (const item of itemsToClean) {
  try {
    if (item.includes('*')) {
      // Handle glob patterns
      const dir = path.dirname(item);
      const pattern = path.basename(item);
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
          if (file.match(pattern.replace('*', '.*'))) {
            const filePath = path.join(dir, file);
            fs.rmSync(filePath, { recursive: true, force: true });
            console.log(`🗑️  Removed: ${path.relative(process.cwd(), filePath)}`);
            cleaned++;
          }
        }
      }
    } else if (fs.existsSync(item)) {
      fs.rmSync(item, { recursive: true, force: true });
      console.log(`🗑️  Removed: ${path.relative(process.cwd(), item)}`);
      cleaned++;
    }
  } catch (error) {
    console.warn(`⚠️  Could not remove ${item}:`, error.message);
  }
}

if (cleaned === 0) {
  console.log('✅ Nothing to clean - workspace is already clean!');
} else {
  console.log(`✅ Cleaned ${cleaned} item(s)`);
}

console.log('🎉 Cleanup completed!');