// QR Code Generator Pro - Enhanced with customization
class QRCodeGeneratorPro {
  constructor() {
    this.currentQR = null;
    this.settings = this.loadSettings();
    this.initializeEventListeners();
    this.initializeSettings();
  }

  // Load settings from localStorage
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
      console.warn('Failed to load settings:', error);
      return defaultSettings;
    }
  }

  // Save settings to localStorage
  saveSettings() {
    try {
      localStorage.setItem('qr-generator-settings', JSON.stringify(this.settings));
    } catch (error) {
      console.warn('Failed to save settings:', error);
    }
  }

  // Initialize event listeners
  initializeEventListeners() {
    // Generate button
    document.getElementById('generate-btn').addEventListener('click', () => {
      this.generateQRCode();
    });

    // Enter key in text input
    document.getElementById('text-input').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.generateQRCode();
      }
    });

    // Size select dropdown
    document.getElementById('size-select').addEventListener('change', (e) => {
      this.setSize(parseInt(e.target.value));
    });

    // Padding slider
    document.getElementById('padding-control').addEventListener('input', (e) => {
      this.setPadding(parseInt(e.target.value));
    });

    // Color pickers
    document.getElementById('fg-color').addEventListener('change', (e) => {
      this.setForegroundColor(e.target.value);
    });

    document.getElementById('bg-color').addEventListener('change', (e) => {
      this.setBackgroundColor(e.target.value);
    });

    // Download and copy buttons
    document.getElementById('download-btn').addEventListener('click', () => {
      this.downloadQR('png');
    });

    document.getElementById('download-svg-btn').addEventListener('click', () => {
      this.downloadQR('svg');
    });

    document.getElementById('copy-btn').addEventListener('click', () => {
      this.copyQR();
    });

    // Auto-generate on settings change
    ['padding-control', 'fg-color', 'bg-color', 'size-select'].forEach(id => {
      const element = document.getElementById(id);
      if (element) {
        element.addEventListener('change', () => {
          this.autoRegenerate();
        });
      }
    });
  }

  // Initialize UI with saved settings
  initializeSettings() {
    // Set size select
    document.getElementById('size-select').value = this.settings.size;

    // Set sliders and displays
    document.getElementById('padding-control').value = this.settings.padding;
    document.getElementById('padding-display').textContent = `${this.settings.padding}px`;

    // Set color pickers
    document.getElementById('fg-color').value = this.settings.foregroundColor;
    document.getElementById('bg-color').value = this.settings.backgroundColor;
    
    // Update size info
    this.updateSizeInfo();
  }

  // Set QR code size
  setSize(size) {
    this.settings.size = size;
    this.saveSettings();

    // Update UI
    document.getElementById('size-select').value = size;
    
    // Update size info display
    this.updateSizeInfo();

    this.autoRegenerate();
  }

  // Update size information display
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

  // Set padding
  setPadding(padding) {
    this.settings.padding = padding;
    this.saveSettings();
    
    // Update display
    document.getElementById('padding-display').textContent = `${padding}px`;
    
    this.autoRegenerate();
  }

  // Set foreground color
  setForegroundColor(color) {
    this.settings.foregroundColor = color;
    this.saveSettings();
    this.autoRegenerate();
  }

  // Set background color
  setBackgroundColor(color) {
    this.settings.backgroundColor = color;
    this.saveSettings();
    this.autoRegenerate();
  }

  // Auto-regenerate if text exists
  autoRegenerate() {
    const text = document.getElementById('text-input').value.trim();
    if (text) {
      this.generateQRCode();
    }
  }

  // Generate QR code with current settings
  // Generate QR code with fixed 200px preview size
  generateQRCode() {
    const text = document.getElementById('text-input').value.trim();
    
    if (!text) {
      this.showPlaceholder('Please enter some text to generate QR code');
      this.hideDownloadSection();
      this.hideSizeInfo();
      return;
    }

    try {
      // Show loading state
      this.showPlaceholder('Generating QR code...');
      this.hideDownloadSection();
      this.hideSizeInfo();

      // Clear previous QR code
      const qrContainer = document.getElementById('qr-code');
      
      setTimeout(() => {
        qrContainer.innerHTML = '';

        // Always create preview at 200px for consistent UI
        const previewSize = 200;
        this.currentQR = new QRCode(qrContainer, {
          text: text,
          width: previewSize,
          height: previewSize,
          colorDark: this.settings.foregroundColor,
          colorLight: this.settings.backgroundColor,
          correctLevel: QRCode.CorrectLevel.M,
          quietZone: Math.floor(this.settings.padding * (previewSize / this.settings.size)), // Scale padding for preview
          quietZoneColor: this.settings.backgroundColor
        });

        // Add success animation and show download section
        setTimeout(() => {
          qrContainer.style.transform = 'scale(0.9)';
          qrContainer.style.opacity = '0.7';
          
          setTimeout(() => {
            qrContainer.style.transform = 'scale(1)';
            qrContainer.style.opacity = '1';
            qrContainer.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            
            // Show download section and size info after animation
            this.showDownloadSection();
            this.showSizeInfo();
          }, 150);
        }, 200);
      }, 100);

    } catch (error) {
      console.error('QR generation failed:', error);
      this.showPlaceholder('Failed to generate QR code. Please try again.');
      this.hideDownloadSection();
      this.hideSizeInfo();
    }
  }

  // Show placeholder message
  showPlaceholder(message) {
    const qrContainer = document.getElementById('qr-code');
    qrContainer.innerHTML = `<div class="placeholder">${message}</div>`;
  }

  // Show download section
  showDownloadSection() {
    const downloadSection = document.getElementById('download-section');
    downloadSection.classList.add('show');
  }

  // Hide download section
  hideDownloadSection() {
    const downloadSection = document.getElementById('download-section');
    downloadSection.classList.remove('show');
  }

  // Show size info
  showSizeInfo() {
    const sizeInfo = document.getElementById('size-info');
    const actualSizeSpan = document.getElementById('actual-size');
    actualSizeSpan.textContent = `${this.settings.size}px`;
    sizeInfo.classList.add('show');
  }

  // Hide size info
  hideSizeInfo() {
    const sizeInfo = document.getElementById('size-info');
    sizeInfo.classList.remove('show');
  }

  // Update size info display
  updateSizeInfo() {
    if (document.getElementById('qr-code').querySelector('canvas')) {
      this.showSizeInfo();
    }
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
      console.error(`${format.toUpperCase()} download failed:`, error);
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
      // Generate QR at actual size
      const tempQR = new QRCode(tempContainer, {
        text: text,
        width: this.settings.size,
        height: this.settings.size,
        colorDark: this.settings.foregroundColor,
        colorLight: this.settings.backgroundColor,
        correctLevel: QRCode.CorrectLevel.M,
        quietZone: this.settings.padding,
        quietZoneColor: this.settings.backgroundColor
      });

      // Wait a moment for generation to complete
      setTimeout(() => {
        const canvas = tempContainer.querySelector('canvas');
        if (canvas) {
          return canvas;
        }
      }, 100);

      const canvas = tempContainer.querySelector('canvas');
      return canvas;
    } finally {
      // Clean up
      setTimeout(() => {
        if (tempContainer.parentNode) {
          document.body.removeChild(tempContainer);
        }
      }, 200);
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

  // Create SVG QR Code
  createSVGQRCode(text) {
    // Simple QR code matrix generation (basic implementation)
    // For production, you might want to use a proper QR library that supports SVG
    const size = this.settings.size;
    const padding = this.settings.padding;
    const totalSize = size + (padding * 2);
    
    // This is a simplified SVG generation - in real implementation,
    // you'd need a proper QR code algorithm or library that outputs SVG
    const svgHeader = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">`;
    
    const svgBackground = `
  <rect width="${totalSize}" height="${totalSize}" fill="${this.settings.backgroundColor}"/>`;
    
    // Get QR matrix from canvas (this is a workaround - ideally use a QR library with SVG output)
    const canvas = document.querySelector('#qr-code canvas');
    const ctx = canvas.getContext('2d');
    const imageData = ctx.getImageData(0, 0, size, size);
    
    let svgRects = '';
    const moduleSize = size / Math.sqrt(imageData.data.length / 4);
    
    // Convert canvas pixels to SVG rectangles
    for (let y = 0; y < size; y += moduleSize) {
      for (let x = 0; x < size; x += moduleSize) {
        const pixelIndex = (Math.floor(y) * size + Math.floor(x)) * 4;
        const r = imageData.data[pixelIndex];
        const g = imageData.data[pixelIndex + 1];
        const b = imageData.data[pixelIndex + 2];
        
        // If pixel is dark (close to foreground color)
        if (r < 128 && g < 128 && b < 128) {
          svgRects += `
  <rect x="${x + padding}" y="${y + padding}" width="${moduleSize}" height="${moduleSize}" fill="${this.settings.foregroundColor}"/>`;
        }
      }
    }
    
    const svgFooter = `
</svg>`;
    
    return svgHeader + svgBackground + svgRects + svgFooter;
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
      console.error('Copy failed:', error);
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
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QRCodeGeneratorPro();
});

// Add some utility functions for enhanced features
const QRUtils = {
  // Enhanced download with custom filename
  downloadQRWithName: function(canvas, customName = 'qrcode') {
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
    const filename = `${customName}_${timestamp}.png`;
    
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0); // Max quality
    link.click();
  },

  // Validate text input for QR limitations
  validateQRInput: function(text) {
    if (!text || text.trim().length === 0) {
      return { valid: false, message: 'Text cannot be empty' };
    }
    if (text.length > 2953) { // QR Code limit for alphanumeric
      return { valid: false, message: 'Text is too long for QR code' };
    }
    return { valid: true, message: 'Valid input' };
  },

  // Detect input type and suggest optimal settings
  detectInputType: function(text) {
    if (this.isValidURL(text)) {
      return { type: 'url', suggestion: 'URL detected - consider using smaller size for quick scanning' };
    }
    if (/^\d+$/.test(text)) {
      return { type: 'number', suggestion: 'Numeric data - good for inventory or ID codes' };
    }
    if (text.includes('\n') || text.length > 100) {
      return { type: 'text', suggestion: 'Long text - consider larger size for better readability' };
    }
    return { type: 'text', suggestion: 'Regular text input' };
  },

  // Validate URL format (enhanced)
  isValidURL: function(string) {
    try {
      const url = new URL(string);
      return ['http:', 'https:', 'ftp:', 'mailto:'].includes(url.protocol);
    } catch (_) {
      // Check for common URL patterns without protocol
      return /^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/.test(string);
    }
  },

  // Color contrast checker for better readability
  checkColorContrast: function(fg, bg) {
    const getRelativeLuminance = (hex) => {
      const rgb = parseInt(hex.slice(1), 16);
      const r = (rgb >> 16) & 0xff;
      const g = (rgb >> 8) & 0xff;
      const b = (rgb >> 0) & 0xff;
      
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    };
    
    const l1 = getRelativeLuminance(fg);
    const l2 = getRelativeLuminance(bg);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    
    return {
      ratio: ratio,
      rating: ratio >= 7 ? 'excellent' : ratio >= 4.5 ? 'good' : ratio >= 3 ? 'acceptable' : 'poor'
    };
  }
};
