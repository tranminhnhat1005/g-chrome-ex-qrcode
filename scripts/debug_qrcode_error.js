// Test to identify the QRCode library error
console.log('🔍 Debugging QRCode library error...\n');

// Test hexToRgb function with various inputs
function testHexToRgb() {
  const hexToRgb = function(hex) {
    console.log(`Testing hex value: "${hex}"`);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    console.log('Regex result:', result);
    
    if (result) {
      console.log('Result array length:', result.length);
      console.log('Result[0]:', result[0]);
      console.log('Result[1]:', result[1]);
      console.log('Result[2]:', result[2]);
      console.log('Result[3]:', result[3]);
      
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    } else {
      console.log('❌ No match found for hex:', hex);
      return null;
    }
  };

  console.log('📋 Testing hexToRgb function:');
  
  // Test valid hex colors
  console.log('\n✅ Valid hex colors:');
  testHexToRgb('#000000');
  testHexToRgb('#ffffff');
  testHexToRgb('#ff0000');
  testHexToRgb('000000');
  
  // Test invalid or problematic inputs
  console.log('\n❌ Invalid/problematic inputs:');
  testHexToRgb('');
  testHexToRgb(null);
  testHexToRgb(undefined);
  testHexToRgb('#');
  testHexToRgb('#gg0000');
  testHexToRgb('invalid');
}

// Test QRCode library initialization
function testQRCodeInit() {
  console.log('\n📋 Testing QRCode library compatibility:');
  
  // Check if QRCode is available
  if (typeof QRCode === 'undefined') {
    console.log('❌ QRCode library not loaded');
    return;
  }
  
  console.log('✅ QRCode library is available');
  console.log('QRCode.CorrectLevel:', typeof QRCode.CorrectLevel);
  
  if (QRCode.CorrectLevel) {
    console.log('Available error correction levels:', Object.keys(QRCode.CorrectLevel));
  }
}

// Test color settings
function testColorSettings() {
  console.log('\n📋 Testing color settings:');
  
  const defaultSettings = {
    size: 256,
    padding: 4,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff'
  };
  
  console.log('Default settings:', defaultSettings);
  
  // Test if the colors are valid
  console.log('\nTesting foreground color:');
  testHexToRgb(defaultSettings.foregroundColor);
  
  console.log('\nTesting background color:');
  testHexToRgb(defaultSettings.backgroundColor);
}

// Run all tests
console.log('Starting diagnostic tests...\n');
testHexToRgb();
testColorSettings();

console.log('\n🔧 Potential fixes to try:');
console.log('1. Add null checks in hexToRgb function');
console.log('2. Validate color values before passing to QRCode library');
console.log('3. Add fallback colors for invalid inputs');
console.log('4. Check QRCode library version compatibility');