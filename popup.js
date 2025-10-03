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
      return;
    }

    try {
      // Clear previous QR code
      const qrContainer = document.getElementById('qr-code');
      qrContainer.innerHTML = '';

      // Create new QR code with current settings
      this.currentQR = new QRCode(qrContainer, {
        text: text,
        width: this.settings.size,
        height: this.settings.size,
        colorDark: this.settings.foregroundColor,
        colorLight: this.settings.backgroundColor,
        correctLevel: QRCode.CorrectLevel.M,
        quietZone: this.settings.padding,
        quietZoneColor: this.settings.backgroundColor,
        logoBackgroundTransparent: false
      });

      // Add success animation
      qrContainer.style.transform = 'scale(0.8)';
      qrContainer.style.opacity = '0.5';
      
      setTimeout(() => {
        qrContainer.style.transform = 'scale(1)';
        qrContainer.style.opacity = '1';
        qrContainer.style.transition = 'all 0.3s ease';
      }, 100);

    } catch (error) {
      console.error('QR generation failed:', error);
      this.showPlaceholder('Failed to generate QR code. Please try again.');
    }
  }

  // Show placeholder message
  showPlaceholder(message) {
    const qrContainer = document.getElementById('qr-code');
    qrContainer.innerHTML = `<div class="placeholder">${message}</div>`;
  }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new QRCodeGeneratorPro();
});

// Add some utility functions for future features
const QRUtils = {
  // Download QR code as image (for future enhancement)
  downloadQR: function(filename = 'qrcode.png') {
    const canvas = document.querySelector('#qr-code canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL();
      link.click();
    }
  },

  // Copy QR code to clipboard (for future enhancement)
  copyQR: function() {
    const canvas = document.querySelector('#qr-code canvas');
    if (canvas) {
      canvas.toBlob(blob => {
        navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob })
        ]);
      });
    }
  },

  // Validate URL format
  isValidURL: function(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  }
};
