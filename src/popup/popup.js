class QRCodeGeneratorPro {
  constructor() {
    this.currentQR = null;
    this.settings = this.loadSettings();
    this.initializeEventListeners();
    this.initializeSettings();
  }

  loadSettings() {
    const defaultSettings = {
      size: 256,
      padding: 4,
      foregroundColor: '#000000',
      backgroundColor: '#ffffff'
    };

    try {
      const saved = localStorage.getItem('qr-generator-settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch (error) {
      return defaultSettings;
    }
  }

  saveSettings() {
    try {
      localStorage.setItem('qr-generator-settings', JSON.stringify(this.settings));
    } catch (error) {
      // Silent fail for localStorage
    }
  }

  initializeEventListeners() {
    document.getElementById('generate-btn').addEventListener('click', () => {
      this.generateQRCode();
    });

    document.getElementById('text-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.generateQRCode();
      }
    });

    document.getElementById('text-input').addEventListener('input', (e) => {
      this.validateInputRealTime(e.target.value);
    });

    document.getElementById('size-select').addEventListener('change', (e) => {
      this.setSize(parseInt(e.target.value));
    });

    document.getElementById('padding-control').addEventListener('input', (e) => {
      this.setPadding(parseInt(e.target.value));
    });

    document.getElementById('fg-color').addEventListener('change', (e) => {
      this.setForegroundColor(e.target.value);
    });

    document.getElementById('bg-color').addEventListener('change', (e) => {
      this.setBackgroundColor(e.target.value);
    });

    document.getElementById('download-btn').addEventListener('click', () => {
      this.downloadQR('png');
    });

    document.getElementById('download-svg-btn').addEventListener('click', () => {
      this.downloadQR('svg');
    });

    document.getElementById('copy-btn').addEventListener('click', () => {
      this.copyQR();
    });

    ['padding-control', 'fg-color', 'bg-color', 'size-select'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => {
          this.autoRegenerate();
        });
      }
    });
  }

  initializeSettings() {
    document.getElementById('size-select').value = this.settings.size;

    document.getElementById('padding-control').value = this.settings.padding;
    document.getElementById('padding-display').textContent = `${this.settings.padding}px`;

    document.getElementById('fg-color').value = this.settings.foregroundColor;
    document.getElementById('bg-color').value = this.settings.backgroundColor;
    
    this.updateSizeInfo();
  }

  setSize(size) {
    this.settings.size = size;
    this.saveSettings();

    document.getElementById('size-select').value = size;
    
    this.updateSizeInfo();

    this.autoRegenerate();
  }

  updateSizeInfo(size) {
    const sizeInfo = document.getElementById('size-info');
    
    if (size >= 1024) {
      sizeInfo.textContent = 'Preview scaled to fit popup. Download for full 1024px quality.';
      sizeInfo.className = 'size-info large-size show';
    } else if (size >= 512) {
      sizeInfo.textContent = 'High resolution QR code';
      sizeInfo.className = 'size-info show';
    } else {
      sizeInfo.className = 'size-info';
    }
  }

  setPadding(padding) {
    this.settings.padding = padding;
    this.saveSettings();
    
    document.getElementById('padding-display').textContent = `${padding}px`;
    
    this.autoRegenerate();
  }

  setForegroundColor(color) {
    this.settings.foregroundColor = color;
    this.saveSettings();
    this.autoRegenerate();
  }

  setBackgroundColor(color) {
    this.settings.backgroundColor = color;
    this.saveSettings();
    this.autoRegenerate();
  }

  autoRegenerate() {
    const text = document.getElementById('text-input').value.trim();
    if (text) {
      this.generateQRCode();
    }
  }

  generateQRCode() {
    const text = document.getElementById('text-input').value.trim();
    
    if (!text) {
      this.showPlaceholder('Please enter some text to generate QR code');
      this.toggleUI(false);
      return;
    }

    const validation = this.validateInput(text);
    if (!validation.valid) {
      this.showPlaceholder(validation.message);
      this.toggleUI(false);
      return;
    }

    try {
      this.showPlaceholder('Generating QR code...');
      this.toggleUI(false);

      const qrContainer = document.getElementById('qr-code');
      
      setTimeout(() => {
        qrContainer.innerHTML = '';

        try {
          // Validate colors before QRCode generation
          const validatedColors = this.validateColors();
          
          // Try progressive QR generation with fallbacks
          this.currentQR = this.generateQRWithFallbacks(qrContainer, text, validatedColors);

          // Add success animation and show download section
          setTimeout(() => {
            qrContainer.style.transform = 'scale(0.9)';
            qrContainer.style.opacity = '0.7';
            
            setTimeout(() => {
              qrContainer.style.transform = 'scale(1)';
              qrContainer.style.opacity = '1';
              qrContainer.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
              
              this.toggleUI(true);
            }, 150);
          }, 200);

        } catch (libraryError) {
          
          // Handle specific library errors with user-friendly messages
          let errorMessage = 'Failed to generate QR code. ';
          
          if (libraryError.message && libraryError.message.includes('Too long data')) {
            errorMessage += 'Text is too long for current settings. Try reducing text length or using smaller QR size.';
          } else if (libraryError.message && libraryError.message.includes('code length overflow')) {
            errorMessage += 'Content too complex for QR code. Please shorten your text.';
          } else {
            errorMessage += 'Please try with shorter text or different settings.';
          }
          
          this.showPlaceholder(errorMessage);
          this.toggleUI(false);
        }
      }, 100);

    } catch (error) {
      this.showPlaceholder('Failed to generate QR code. Please try again.');
      this.toggleUI(false);
    }
  }

  // Show placeholder message
  showPlaceholder(message) {
    const qrContainer = document.getElementById('qr-code');
    qrContainer.innerHTML = `<div class="placeholder">${message}</div>`;
  }

  toggleUI(show) {
    const downloadSection = document.getElementById('download-section');
    const sizeInfo = document.getElementById('size-info');
    
    if (show) {
      downloadSection.classList.add('show');
      const actualSizeSpan = document.getElementById('actual-size');
      actualSizeSpan.textContent = `${this.settings.size}px`;
      sizeInfo.classList.add('show');
    } else {
      downloadSection.classList.remove('show');
      sizeInfo.classList.remove('show');
    }
  }

  updateSizeInfo() {
    if (document.getElementById('qr-code').querySelector('canvas')) {
      this.toggleUI(true);
    }
  }

  // Validate and ensure colors are always valid
  validateColors() {
    const defaultForeground = '#000000';
    const defaultBackground = '#ffffff';
    
    let foreground = this.settings.foregroundColor;
    let background = this.settings.backgroundColor;
    
    // Validate foreground color
    if (!this.isValidHexColor(foreground)) {
      foreground = defaultForeground;
      this.settings.foregroundColor = defaultForeground;
    }
    
    // Validate background color
    if (!this.isValidHexColor(background)) {
      background = defaultBackground;
      this.settings.backgroundColor = defaultBackground;
    }
    
    return {
      foreground: foreground,
      background: background
    };
  }
  
  // Progressive QR generation with multiple fallback attempts
  generateQRWithFallbacks(container, text, validatedColors, customSize = null) {
    const qrSize = customSize || 200;
    const padding = customSize ? this.settings.padding : Math.floor(this.settings.padding * (200 / this.settings.size));
    
    const baseOptions = {
      text: text,
      width: qrSize,
      height: qrSize,
      colorDark: validatedColors.foreground,
      colorLight: validatedColors.background,
      quietZone: padding,
      quietZoneColor: validatedColors.background
    };
    
    // Try different error correction levels in order of preference
    const errorLevels = [
      { level: QRCode.CorrectLevel.M, name: 'Medium' },
      { level: QRCode.CorrectLevel.L, name: 'Low' },
      { level: QRCode.CorrectLevel.Q, name: 'Quartile' },
      { level: QRCode.CorrectLevel.H, name: 'High' }
    ];
    
    for (const errorLevel of errorLevels) {
      try {
        const options = { ...baseOptions, correctLevel: errorLevel.level };
        return new QRCode(container, options);
      } catch (error) {
        container.innerHTML = '';
        
        if (errorLevel === errorLevels[errorLevels.length - 1]) {
          throw error;
        }
      }
    }
  }

  // Check if a color is a valid hex color
  isValidHexColor(color) {
    if (!color || typeof color !== 'string') {
      return false;
    }
    
    const hexPattern = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
    return hexPattern.test(color.trim());
  }

  // Download QR code as PNG or SVG
  downloadQR(format = 'png') {
    const text = document.getElementById('text-input').value.trim();
    if (!text) {
      alert('No text entered. Please generate a QR code first.');
      return;
    }

    try {
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
      
      if (format === 'svg') {
        this.downloadSVG(timestamp);
      } else {
        this.downloadPNG(null, timestamp); // Pass null since we'll generate fresh canvas
      }
    } catch (error) {
      alert(`Failed to download QR code as ${format.toUpperCase()}. Please try again.`);
    }
  }

  // Download as PNG
  downloadPNG(canvas, timestamp) {
    // Generate QR at actual size for download
    const actualCanvas = this.generateActualSizeCanvas();
    if (!actualCanvas) {
      alert('Failed to generate high-resolution QR code for download.');
      return;
    }

    // Create enhanced canvas with proper padding
    const enhancedCanvas = this.createEnhancedCanvas(actualCanvas);
    
    const filename = `qrcode_${timestamp}.png`;
    
    // Create download link
    const link = document.createElement('a');
    link.download = filename;
    link.href = enhancedCanvas.toDataURL('image/png');
    
    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Visual feedback
    this.showFeedback('download-btn', 'Downloaded! 📥');
  }

  // Generate canvas at actual size for download
  generateActualSizeCanvas() {
    const text = document.getElementById('text-input').value.trim();
    if (!text) return null;

    // Create temporary container off-screen
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '-9999px';
    document.body.appendChild(tempContainer);

    try {
      // Validate colors before generation
      const validatedColors = this.validateColors();
      
      // Use progressive generation for actual size too
      const tempQR = this.generateQRWithFallbacks(tempContainer, text, validatedColors, this.settings.size);

      // QRCode library creates canvas synchronously, get it immediately
      const canvas = tempContainer.querySelector('canvas');
      
      // Clean up container after getting canvas
      if (tempContainer.parentNode) {
        document.body.removeChild(tempContainer);
      }
      
      return canvas;
    } catch (error) {
      if (tempContainer.parentNode) {
        document.body.removeChild(tempContainer);
      }
      return null;
    }
  }

  // Download as SVG
  downloadSVG(timestamp) {
    const text = document.getElementById('text-input').value.trim();
    if (!text) return;

    // Create SVG QR code
    const svgString = this.createSVGQRCode(text);
    const filename = `qrcode_${timestamp}.svg`;
    
    // Create blob and download
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    
    // Visual feedback
    this.showFeedback('download-svg-btn', 'Downloaded! 📄');
  }

  // Create SVG QR Code (Highly Optimized)
  createSVGQRCode(text) {
    // Generate QR at actual size for better precision
    const actualCanvas = this.generateActualSizeCanvas();
    if (!actualCanvas) {
      throw new Error('Failed to generate QR canvas for SVG conversion');
    }

    const actualSize = this.settings.size;
    const padding = this.settings.padding;
    const totalSize = actualSize + (padding * 2);
    
    // Get image data from actual size canvas
    const ctx = actualCanvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, actualSize, actualSize);
    
    // Create SVG header with proper dimensions
    const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">`;
    
    // Background rectangle
    const svgBackground = `
  <rect width="${totalSize}" height="${totalSize}" fill="${this.settings.backgroundColor}"/>`;
    
    // Choose optimization method based on complexity
    const foregroundPixels = this.getForegroundPixels(imageData, actualSize, padding);
    
    let svgContent = '';
    if (foregroundPixels.length > 1000) {
      // For complex QR codes, use path optimization
      svgContent = this.createOptimizedPath(foregroundPixels);
    } else {
      // For simpler QR codes, use rectangle optimization
      const optimizedRects = this.groupPixelsIntoRectangles(foregroundPixels);
      svgContent = optimizedRects.map(rect => 
        `
  <rect x="${rect.x}" y="${rect.y}" width="${rect.width}" height="${rect.height}" fill="${this.settings.foregroundColor}"/>`
      ).join('');
    }
    
    const svgFooter = `
</svg>`;
    
    return svgHeader + svgBackground + svgContent + svgFooter;
  }

  // Extract foreground pixels from image data
  getForegroundPixels(imageData, actualSize, padding) {
    const pixels = [];
    
    for (let y = 0; y < actualSize; y++) {
      for (let x = 0; x < actualSize; x++) {
        const pixelIndex = (y * actualSize + x) * 4;
        const r = imageData.data[pixelIndex];
        const g = imageData.data[pixelIndex + 1];
        const b = imageData.data[pixelIndex + 2];
        const a = imageData.data[pixelIndex + 3];
        
        if (this.isPixelForeground(r, g, b, a)) {
          pixels.push({ x: x + padding, y: y + padding });
        }
      }
    }
    
    return pixels;
  }

  // Create optimized SVG path for complex patterns (ultra-compact)
  createOptimizedPath(pixels) {
    if (pixels.length === 0) return '';
    
    // Group pixels by rows for horizontal line optimization
    const rowGroups = {};
    pixels.forEach(pixel => {
      if (!rowGroups[pixel.y]) {
        rowGroups[pixel.y] = [];
      }
      rowGroups[pixel.y].push(pixel.x);
    });
    
    // Create path commands for horizontal lines
    let pathData = '';
    
    Object.keys(rowGroups).forEach(y => {
      const xValues = rowGroups[y].sort((a, b) => a - b);
      
      // Group consecutive x values into horizontal lines
      let currentStart = xValues[0];
      let currentEnd = xValues[0];
      
      for (let i = 1; i < xValues.length; i++) {
        if (xValues[i] === currentEnd + 1) {
          // Extend current line
          currentEnd = xValues[i];
        } else {
          // Add current line to path and start new line
          pathData += `M${currentStart},${y}h${currentEnd - currentStart + 1}v1h-${currentEnd - currentStart + 1}z`;
          currentStart = xValues[i];
          currentEnd = xValues[i];
        }
      }
      
      // Add the last line
      pathData += `M${currentStart},${y}h${currentEnd - currentStart + 1}v1h-${currentEnd - currentStart + 1}z`;
    });
    
    return `
  <path d="${pathData}" fill="${this.settings.foregroundColor}"/>`;
  }

  // Group adjacent pixels into rectangles to minimize SVG elements
  groupPixelsIntoRectangles(pixels) {
    if (pixels.length === 0) return [];
    
    // Sort pixels by y, then by x for easier processing
    pixels.sort((a, b) => a.y - b.y || a.x - b.x);
    
    const rectangles = [];
    const used = new Set();
    
    for (const pixel of pixels) {
      const key = `${pixel.x},${pixel.y}`;
      if (used.has(key)) continue;
      
      // Try to create the largest possible rectangle starting from this pixel
      const rect = this.findLargestRectangle(pixel, pixels, used);
      rectangles.push(rect);
      
      // Mark all pixels in this rectangle as used
      for (let y = rect.y; y < rect.y + rect.height; y++) {
        for (let x = rect.x; x < rect.x + rect.width; x++) {
          used.add(`${x},${y}`);
        }
      }
    }
    
    return rectangles;
  }

  // Find the largest rectangle starting from a given pixel
  findLargestRectangle(startPixel, allPixels, used) {
    const pixelSet = new Set(allPixels.map(p => `${p.x},${p.y}`));
    
    let maxWidth = 0;
    let maxHeight = 0;
    let bestRect = { x: startPixel.x, y: startPixel.y, width: 1, height: 1 };
    
    // Try different rectangle sizes starting from this pixel
    for (let height = 1; height <= 50; height++) { // Limit search for performance
      let width = 0;
      
      // Find maximum width for this height
      for (let w = 1; w <= 50; w++) { // Limit search for performance
        let canExtend = true;
        
        // Check if we can create a rectangle of width w and height h
        for (let y = 0; y < height && canExtend; y++) {
          for (let x = 0; x < w && canExtend; x++) {
            const checkX = startPixel.x + x;
            const checkY = startPixel.y + y;
            const checkKey = `${checkX},${checkY}`;
            
            if (!pixelSet.has(checkKey) || used.has(checkKey)) {
              canExtend = false;
            }
          }
        }
        
        if (canExtend) {
          width = w;
        } else {
          break;
        }
      }
      
      if (width === 0) break;
      
      // Check if this rectangle is better than our current best
      const area = width * height;
      const bestArea = bestRect.width * bestRect.height;
      
      if (area > bestArea) {
        bestRect = {
          x: startPixel.x,
          y: startPixel.y,
          width: width,
          height: height
        };
      }
    }
    
    return bestRect;
  }

  // Helper function to determine if a pixel is foreground
  isPixelForeground(r, g, b, a) {
    // If pixel is transparent, it's background
    if (a < 128) return false;
    
    // Validate and get colors
    const validatedColors = this.validateColors();
    const fgColor = this.hexToRgb(validatedColors.foreground);
    const bgColor = this.hexToRgb(validatedColors.background);
    
    if (!fgColor || !bgColor) {
      // Fallback to simple brightness check
      return (r + g + b) / 3 < 128;
    }
    
    // Calculate distance to foreground and background colors
    const fgDistance = Math.sqrt(
      Math.pow(r - fgColor.r, 2) + 
      Math.pow(g - fgColor.g, 2) + 
      Math.pow(b - fgColor.b, 2)
    );
    
    const bgDistance = Math.sqrt(
      Math.pow(r - bgColor.r, 2) + 
      Math.pow(g - bgColor.g, 2) + 
      Math.pow(b - bgColor.b, 2)
    );
    
    // Pixel is foreground if it's closer to foreground color
    return fgDistance < bgDistance;
  }

  // Helper function to convert hex to RGB with robust error handling
  hexToRgb(hex) {
    // Validate input
    if (!hex || typeof hex !== 'string') {
      return null;
    }
    
    // Clean and validate hex string
    const cleanHex = hex.trim();
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
    
    if (!result || result.length < 4) {
      return null;
    }
    
    try {
      return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      };
    } catch (error) {
      return null;
    }
  }

  // Validate input text for QR code generation
  validateInput(text) {
    // Very conservative QR Code capacity limits for QRCode.js library reliability
    // These are practical limits that work consistently with the QRCode.js library
    const limits = {
      numeric: 4000,      // Conservative limit for numeric data
      alphanumeric: 2400, // Conservative limit for alphanumeric
      byte: 1600,         // Very conservative limit for UTF-8 (reduced from 2500)
      kanji: 1000         // Conservative limit for Japanese
    };

    // Check basic length
    if (!text || text.trim().length === 0) {
      return { valid: false, message: 'Please enter some text' };
    }

    // Detect content type and apply appropriate limit
    const contentType = this.detectContentType(text);
    const maxLength = limits[contentType.type];
    
    if (text.length > maxLength) {
      return { 
        valid: false, 
        message: `Text too long! Max ${maxLength} characters for reliable QR generation. Current: ${text.length}` 
      };
    }

    // Check for problematic characters that might cause QRCode.js errors
    if (text.includes('\0')) {
      return { valid: false, message: 'Null characters not supported' };
    }
    
    // Check for control characters that might cause issues
    if (/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/.test(text)) {
      return { valid: false, message: 'Control characters not supported' };
    }

    // Warning for long text (but still valid)
    if (text.length > maxLength * 0.8) {
      return { 
        valid: true, 
        warning: `Long text (${text.length}/${maxLength}). Consider smaller size for better scanning.` 
      };
    }

    return { valid: true, message: 'Valid input', type: contentType };
  }

  // Detect content type for optimal QR encoding
  detectContentType(text) {
    // Numeric: only digits
    if (/^\d+$/.test(text)) {
      return { type: 'numeric', description: 'Numeric data - most efficient' };
    }

    // Alphanumeric: numbers, uppercase letters, space, and symbols $ % * + - . / :
    if (/^[0-9A-Z $%*+\-./:]+$/.test(text)) {
      return { type: 'alphanumeric', description: 'Alphanumeric data - efficient' };
    }

    // Kanji: contains Japanese characters
    if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(text)) {
      return { type: 'kanji', description: 'Contains Japanese characters' };
    }

    // Byte: everything else
    return { type: 'byte', description: 'Mixed content - standard encoding' };
  }

  // Real-time input validation with visual feedback
  validateInputRealTime(text) {
    const validation = this.validateInput(text);
    const inputElement = document.getElementById('text-input');
    const charCountElement = document.getElementById('char-count');
    
    // Update character count display
    if (charCountElement) {
      const contentType = this.detectContentType(text);
      // Updated very conservative limits that match validateInput()
      const limits = { numeric: 4000, alphanumeric: 2400, byte: 1600, kanji: 1000 };
      const maxLength = limits[contentType.type];
      
      charCountElement.textContent = `${text.length}/${maxLength} (${contentType.type})`;
      
      // Fixed color coding logic for better UX
      if (text.length > maxLength) {
        // RED: Over the actual limit (invalid)
        charCountElement.style.color = '#ff4444';
        inputElement.style.borderColor = '#ff4444';
        charCountElement.textContent += ' - TOO LONG!';
      } else if (text.length > maxLength * 0.9) {
        // ORANGE: Warning zone (90%+ of limit)
        charCountElement.style.color = '#ff8800';
        inputElement.style.borderColor = '#ff8800';
        charCountElement.textContent += ' - Warning';
      } else if (text.length > maxLength * 0.7) {
        // YELLOW: Caution zone (70%+ of limit)
        charCountElement.style.color = '#ffaa00';
        inputElement.style.borderColor = '#ffaa00';
      } else {
        // GREEN/GRAY: Normal range
        charCountElement.style.color = text.length > 0 ? '#22aa22' : '#666666';
        inputElement.style.borderColor = text.length > 0 ? '#22aa22' : '#ddd';
      }
    }

    return validation;
  }

  // Copy QR code to clipboard
  async copyQR() {
    const canvas = document.querySelector('#qr-code canvas');
    if (!canvas) {
      alert('No QR code to copy. Please generate a QR code first.');
      return;
    }

    try {
      // Create enhanced canvas with proper padding
      const enhancedCanvas = this.createEnhancedCanvas(canvas);
      
      // Convert to blob and copy to clipboard
      enhancedCanvas.toBlob(async (blob) => {
        if (navigator.clipboard && window.ClipboardItem) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          this.showFeedback('copy-btn', 'Copied! 📋');
        } else {
          // Fallback for older browsers
          const url = URL.createObjectURL(blob);
          const img = new Image();
          img.src = url;
          document.body.appendChild(img);
          
          // Select and copy (fallback method)
          const range = document.createRange();
          range.selectNode(img);
          window.getSelection().removeAllRanges();
          window.getSelection().addRange(range);
          document.execCommand('copy');
          window.getSelection().removeAllRanges();
          document.body.removeChild(img);
          URL.revokeObjectURL(url);
          
          this.showFeedback('copy-btn', 'Copied! 📋');
        }
      }, 'image/png');
    } catch (error) {
      alert('Failed to copy QR code. Please try again.');
    }
  }

  // Create enhanced canvas with proper padding
  createEnhancedCanvas(originalCanvas) {
    if (!originalCanvas) return null;
    
    const padding = this.settings.padding;
    const canvasSize = originalCanvas.width; // Use actual canvas size
    const newSize = canvasSize + (padding * 2);
    
    const enhancedCanvas = document.createElement('canvas');
    enhancedCanvas.width = newSize;
    enhancedCanvas.height = newSize;
    
    const ctx = enhancedCanvas.getContext('2d');
    
    // Fill background with background color
    ctx.fillStyle = this.settings.backgroundColor;
    ctx.fillRect(0, 0, newSize, newSize);
    
    // Draw original QR code in center
    ctx.drawImage(originalCanvas, padding, padding);
    
    return enhancedCanvas;
  }

  // Show temporary feedback on buttons
  showFeedback(buttonId, message) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    
    const originalText = button.innerHTML;
    
    button.innerHTML = message;
    button.style.transform = 'scale(0.95)';
    
    setTimeout(() => {
      button.innerHTML = originalText;
      button.style.transform = 'scale(1)';
    }, 1500);
  }

  cleanup() {
    if (this.currentQR) {
      this.currentQR = null;
    }
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const qrGenerator = new QRCodeGeneratorPro();
  
  window.addEventListener('beforeunload', () => {
    qrGenerator.cleanup();
  });
});

