// More detailed error checker for popup.js
const fs = require('fs');

console.log('🔧 Detailed syntax analysis of popup.js...\n');

try {
  const content = fs.readFileSync('./popup.js', 'utf8');
  const lines = content.split('\n');
  
  console.log('🔍 Checking for quote mismatches...\n');
  
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inTemplateQuote = false;
  let inComment = false;
  let inMultiComment = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const lineNum = i + 1;
    
    // Check for unescaped quotes at specific problematic lines
    if ([447, 451, 464, 466, 470].includes(lineNum)) {
      console.log(`Line ${lineNum}: ${line.trim()}`);
      
      // Count quotes in this line
      const singleQuotes = (line.match(/'/g) || []).length;
      const doubleQuotes = (line.match(/"/g) || []).length;
      const templateQuotes = (line.match(/`/g) || []).length;
      
      if (singleQuotes % 2 !== 0) {
        console.log(`   ❌ Unmatched single quotes (${singleQuotes})`);
      }
      if (doubleQuotes % 2 !== 0) {
        console.log(`   ❌ Unmatched double quotes (${doubleQuotes})`);
      }
      if (templateQuotes % 2 !== 0) {
        console.log(`   ❌ Unmatched template quotes (${templateQuotes})`);
      }
      
      console.log('');
    }
  }
  
  // Check for specific error patterns
  console.log('🔍 Checking for specific error patterns...\n');
  
  // Look for misplaced quotes in template literals
  const templateLiteralPattern = /`[^`]*'/g;
  const matches = content.match(templateLiteralPattern);
  if (matches) {
    console.log('⚠️ Found single quotes inside template literals:');
    matches.forEach(match => {
      console.log(`   ${match}`);
    });
    console.log('');
  }
  
  // Check for specific known issues
  if (content.includes("'Failed to generate high-resolution QR code for download.'")) {
    console.log('✅ Error message quotes look correct');
  }
  
  if (content.includes("don't")) {
    console.log("❌ Found unescaped apostrophe in text");
  }
  
} catch (error) {
  console.error('❌ Error reading file:', error.message);
}