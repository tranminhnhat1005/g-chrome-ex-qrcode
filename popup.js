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

    // Size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setSize(parseInt(e.target.dataset.size));
      });
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
      this.downloadQR();
    });

    document.getElementById('copy-btn').addEventListener('click', () => {
      this.copyQR();
    });

    // Auto-generate on settings change
    ['padding-control', 'fg-color', 'bg-color'].forEach(id => {
      document.getElementById(id).addEventListener('change', () => {
        this.autoRegenerate();
      });
    });
  }

  // Initialize UI with saved settings
  initializeSettings() {
    // Set size buttons
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.size) === this.settings.size);
    });

    // Set container class for responsive layout
    const container = document.querySelector('.container');
    container.className = 'container size-' + this.settings.size;

    // Set sliders and displays
    document.getElementById('padding-control').value = this.settings.padding;
    document.getElementById('padding-display').textContent = `${this.settings.padding}px`;

    // Set color pickers
    document.getElementById('fg-color').value = this.settings.foregroundColor;
    document.getElementById('bg-color').value = this.settings.backgroundColor;
  }

  // Set QR code size
  setSize(size) {
    this.settings.size = size;
    this.saveSettings();

    // Update UI
    document.querySelectorAll('.size-btn').forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.dataset.size) === size);
    });

    // Update container class for responsive layout
    const container = document.querySelector('.container');
    container.className = 'container size-' + size;

    this.autoRegenerate();
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
  generateQRCode() {
    const text = document.getElementById('text-input').value.trim();
    
    if (!text) {
      this.showPlaceholder('Please enter some text to generate QR code');
      this.hideDownloadSection();
      return;
    }

    try {
      // Show loading state
      this.showPlaceholder('Generating QR code...');
      this.hideDownloadSection();

      // Clear previous QR code
      const qrContainer = document.getElementById('qr-code');
      
      setTimeout(() => {
        qrContainer.innerHTML = '';

        // Create new QR code with current settings
        // Note: qrcode.min.js uses different parameter names
        this.currentQR = new QRCode(qrContainer, {
          text: text,
          width: this.settings.size,
          height: this.settings.size,
          colorDark: this.settings.foregroundColor,
          colorLight: this.settings.backgroundColor,
          correctLevel: QRCode.CorrectLevel.M,
          // Apply padding by creating a larger canvas and centering the QR
          quietZone: this.settings.padding,
          quietZoneColor: this.settings.backgroundColor
        });

        // Add success animation and show download section
        setTimeout(() => {
          qrContainer.style.transform = 'scale(0.8)';
          qrContainer.style.opacity = '0.5';
          
          setTimeout(() => {
            qrContainer.style.transform = 'scale(1)';
            qrContainer.style.opacity = '1';
            qrContainer.style.transition = 'all 0.3s ease';
            
            // Show download section after animation
            this.showDownloadSection();
          }, 100);
        }, 200);
      }, 100);

    } catch (error) {
      console.error('QR generation failed:', error);
      this.showPlaceholder('Failed to generate QR code. Please try again.');
      this.hideDownloadSection();
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

  // Download QR code as PNG
  downloadQR() {
    const canvas = document.querySelector('#qr-code canvas');
    if (!canvas) {
      alert('No QR code to download. Please generate a QR code first.');
      return;
    }

    try {
      // Create enhanced canvas with proper padding
      const enhancedCanvas = this.createEnhancedCanvas(canvas);
      
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '');
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
    } catch (error) {
      console.error('Download failed:', error);
      alert('Failed to download QR code. Please try again.');
    }
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
    const padding = this.settings.padding;
    const newSize = this.settings.size + (padding * 2);
    
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
