# 🔲 QR Code Generator Pro

> Advanced Chrome Extension for generating customizable QR codes with modern UI and powerful features

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Chrome](https://img.shields.io/badge/chrome-extension-orange.svg)

## ✨ Features

### 🎨 Advanced Customization
- **Variable Sizes**: Choose from 128px, 256px, or 384px
- **Custom Colors**: Personalize foreground and background colors
- **Adjustable Padding**: Control quiet zone from 0-20px
- **Real-time Preview**: See changes instantly as you adjust settings

### 🚀 Smart Functionality
- **Settings Persistence**: Your preferences are automatically saved
- **Auto-regeneration**: QR codes update automatically when settings change
- **Keyboard Support**: Press Enter to generate quickly
- **Error Handling**: Robust validation and user feedback

### 🎯 Modern UI/UX
- **Beautiful Design**: Gradient backgrounds and card-based layout
- **Smooth Animations**: Professional transitions and hover effects
- **Responsive Layout**: Optimized for the extension popup format
- **Intuitive Controls**: Easy-to-use interface for all skill levels

## 📸 Screenshots

```
┌─────────────────────────┐
│  🔲 QR Code Generator Pro │
├─────────────────────────┤
│ Text: [Enter text...]   │
├─────────────────────────┤
│ Size: [128] [256] [384] │ 
│ Padding: ████████ 4px   │
│ Colors: ⬛ ⬜           │
├─────────────────────────┤
│     🚀 GENERATE         │
├─────────────────────────┤
│   [QR CODE PREVIEW]     │
└─────────────────────────┘
```

## 🛠 Installation

### Method 1: Chrome Web Store (Coming Soon)
1. Visit Chrome Web Store
2. Search for "QR Code Generator Pro"
3. Click "Add to Chrome"

### Method 2: Developer Mode (Current)
1. Download or clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the project folder
5. The extension icon will appear in your toolbar

## 🚀 Usage

### Basic QR Generation
1. Click the extension icon in your Chrome toolbar
2. Enter text, URL, or any content in the input field
3. Click "🚀 GENERATE QR CODE" or press Enter
4. Your QR code appears instantly!

### Customization Options

#### Size Selection
- **128px**: Compact size for simple content
- **256px**: Standard size (default) for most use cases  
- **384px**: Large size for detailed content or better readability

#### Color Customization
- **Foreground Color**: Click the black color picker to change QR module color
- **Background Color**: Click the white color picker to change background
- Popular combinations: Blue/White, Red/Yellow, Green/Transparent

#### Padding Control
- Use the slider to adjust quiet zone (white space around QR code)
- Range: 0px (no padding) to 20px (maximum padding)
- Recommended: 4-8px for optimal scanning

## 🔧 Technical Details

### Architecture
```
QR Code Generator Pro/
├── manifest.json       # Extension configuration
├── popup.html         # Main interface
├── popup.js           # Core logic (ES6 Class-based)
├── qrcode.min.js      # QR generation library
├── icons/             # Extension icons
└── docs/              # Documentation
```

### Key Technologies
- **Manifest V3**: Latest Chrome Extension standard
- **QRCode.js**: Reliable QR code generation
- **ES6 Classes**: Modern JavaScript architecture
- **CSS Grid/Flexbox**: Responsive layout
- **LocalStorage API**: Settings persistence

### Browser Compatibility
- ✅ Chrome 88+
- ✅ Edge 88+
- ✅ Brave Browser
- ✅ Other Chromium-based browsers

## 📋 Roadmap

### 🎯 Phase 1: ✅ Completed (v2.0.0)
- Advanced customization options
- Modern UI design
- Settings persistence

### 🎯 Phase 2: 🚧 In Development (v2.1.0)
- Logo integration in QR center
- Image upload and positioning
- Logo customization tools

### 🎯 Phase 3: 📅 Planned (v2.2.0)
- Data Matrix support
- GS1 QR Code standards
- Micro QR Code generation

*See [ROADMAP.md](ROADMAP.md) for detailed development plans*

## 🐛 Troubleshooting

### Common Issues

**QR Code not generating?**
- Ensure text field is not empty
- Try refreshing the extension (disable/enable in chrome://extensions/)

**Settings not saving?**
- Check if browser has sufficient localStorage space
- Ensure extension has storage permissions

**Colors not changing?**
- Some QR scanners require high contrast (black/white)
- Test with different color combinations

**Extension not loading?**
- Verify all files are in the same directory
- Check browser console for error messages
- Ensure manifest.json is valid JSON

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Setup
```bash
git clone https://github.com/tranminhnhat1005/g-chrome-ex-qrcode.git
cd g-chrome-ex-qrcode
# Load in Chrome as unpacked extension
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **QRCode.js**: For the reliable QR code generation library
- **Chrome Extension Team**: For excellent documentation and APIs
- **Community**: For feedback and suggestions

## 📞 Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/tranminhnhat1005/g-chrome-ex-qrcode/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/tranminhnhat1005/g-chrome-ex-qrcode/discussions)
- 📧 **Contact**: Create an issue for any questions

---

<div align="center">

**Made with ❤️ by [tranminhnhat1005](https://github.com/tranminhnhat1005)**

*Star ⭐ this repository if you find it helpful!*

</div>