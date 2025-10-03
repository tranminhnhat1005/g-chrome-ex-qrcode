# QR Code Generator Chrome Extension - Roadmap Development

## Tổng quan nâng cấp
Nâng cấp QR Code Generator Extension theo 3 giai đoạn với các tính năng từ cơ bản đến nâng cao, mở rộng khả năng tùy chỉnh và hỗ trợ nhiều chuẩn QR code khác nhau.

---

## 🎯 GIAI ĐOẠN 1: QR Code Customization
**Mục tiêu**: Thêm khả năng tùy chỉnh QR code cơ bản

### Tính năng cần triển khai:
- ✅ Tùy chỉnh padding (margin) cho QR code
- ✅ Thay đổi kích thước QR code (128px, 256px, 512px)
- ✅ Tùy chỉnh màu sắc foreground (màu đen) và background (màu trắng)
- ✅ Tùy chỉnh kiểu hiển thị module (vuông, tròn, diamond)
- ✅ Lưu settings trong localStorage

### Công nghệ sử dụng:
- **QR Code Library**: Upgrade từ qrcode.min.js sang QRCode.js với customization API
- **HTML5 Color Picker**: `<input type="color">` cho color selection
- **HTML5 Range Slider**: `<input type="range">` cho padding/size
- **CSS Flexbox**: Layout responsive cho controls
- **JavaScript LocalStorage**: Lưu user preferences

### File cần thay đổi:
1. **popup.html**: Thêm controls panel
2. **popup.js**: Logic xử lý customization
3. **manifest.json**: Cập nhật permissions nếu cần
4. **CSS**: Styling cho controls mới

### Tài liệu tham khảo:
- [QRCode.js Documentation](https://github.com/davidshimjs/qrcodejs)
- [HTML5 Input Types](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input)
- [Chrome Extension Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

---

## 🎯 GIAI ĐOẠN 2: Logo Integration
**Mục tiêu**: Thêm logo vào giữa QR code

### Tính năng cần triển khai:
- 📋 Upload logo từ máy tính (drag & drop + file picker)
- 📋 Preview logo trước khi apply
- 📋 Resize logo (10% - 30% kích thước QR)
- 📋 Logo positioning (center, custom position)
- 📋 Logo shape (circle, square, rounded square)
- 📋 Logo background (transparent, white, custom)
- 📋 Save/manage multiple logos

### Công nghệ sử dụng:
- **File API**: Upload và xử lý file ảnh
- **Canvas API**: Merge QR code với logo
- **HTML5 Drag & Drop**: UX upload files
- **Image Processing**: Resize, crop, format conversion
- **Base64 Encoding**: Store logo trong localStorage
- **FileReader API**: Đọc file ảnh

### Thư viện cần thêm:
- **Fabric.js** hoặc **Konva.js**: Canvas manipulation
- **Cropper.js**: Crop logo images
- **JSZip**: Export QR + logo packages

### File cần thêm/thay đổi:
1. **logo-manager.js**: Logic xử lý logo
2. **canvas-renderer.js**: Render QR + logo
3. **popup.html**: Logo upload interface
4. **styles.css**: Styling cho logo controls

### Tài liệu tham khảo:
- [File API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/File)
- [Canvas API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Fabric.js Documentation](http://fabricjs.com/docs/)

---

## 🎯 GIAI ĐOẠN 3: Advanced QR Standards
**Mục tiêu**: Hỗ trợ các chuẩn QR code khác

### Chuẩn cần hỗ trợ:

#### 3.1 Data Matrix
- 📋 2D barcode format tương tự QR
- 📋 Tối ưu cho dữ liệu nhỏ, ít lỗi
- 📋 Sử dụng trong y tế, aerospace
- 📋 Kích thước từ 10x10 đến 144x144

#### 3.2 GS1 QR Code
- 📋 Chuẩn công nghiệp cho supply chain
- 📋 GTIN, batch numbers, expiry dates
- 📋 FNC1 character support
- 📋 Validation theo GS1 standards

#### 3.3 Micro QR Code
- 📋 Phiên bản nhỏ gọn của QR code
- 📋 Kích thước 11x11 đến 17x17
- 📋 Ít data capacity hơn
- 📋 Sử dụng cho space-constrained applications

### Công nghệ sử dụng:
- **ZXing Library**: Multi-format barcode generation
- **jsqr Library**: QR code detection and parsing
- **Custom Encoders**: Cho từng format riêng
- **Validation Libraries**: GS1 standards compliance
- **WebAssembly**: Performance optimization

### Thư viện chuyên dụng:
- **@zxing/library**: Multi-format support
- **datamatrix-svg**: Data Matrix generation
- **gs1-barcode**: GS1 compliance
- **microqr-js**: Micro QR implementation

### File architecture mới:
```
src/
├── encoders/
│   ├── qr-encoder.js
│   ├── datamatrix-encoder.js
│   ├── gs1-encoder.js
│   └── microqr-encoder.js
├── validators/
│   ├── gs1-validator.js
│   └── format-validator.js
├── renderers/
│   ├── canvas-renderer.js
│   └── svg-renderer.js
└── utils/
    ├── format-detector.js
    └── error-correction.js
```

### Tài liệu tham khảo:
- [GS1 Standards](https://www.gs1.org/standards/barcodes)
- [Data Matrix Specification](https://www.iso.org/standard/44230.html)
- [ZXing Project](https://github.com/zxing/zxing)
- [Micro QR Code Standard](https://www.qrcode.com/en/codes/microqr.html)

---

## 📋 Kế hoạch thực hiện chi tiết

### Phase 1: Foundation (Tuần 1)
1. **Setup development environment**
   - Code organization
   - Testing framework
   - Build tools (nếu cần)

2. **Upgrade core library**
   - Replace qrcode.min.js với QRCode.js full version
   - Add customization options

3. **Basic UI enhancements**
   - Responsive layout
   - Control panels
   - Color pickers

### Phase 2: Advanced Features (Tuần 2-3)
1. **Logo integration**
   - File upload system
   - Canvas manipulation
   - Logo positioning

2. **Enhanced customization**
   - Advanced styling options
   - Export functionality
   - Settings persistence

### Phase 3: Multi-format Support (Tuần 4-6)
1. **Architecture refactoring**
   - Modular encoder system
   - Plugin architecture
   - Format detection

2. **Standard implementations**
   - Data Matrix encoder
   - GS1 compliance
   - Micro QR support

3. **Testing & optimization**
   - Cross-format testing
   - Performance optimization
   - Error handling

---

## 🚀 Getting Started - Giai đoạn 1

### Bước 1: Chuẩn bị
- [x] Backup code hiện tại
- [x] Tạo development branch
- [ ] Setup testing environment

### Bước 2: UI Enhancement
- [ ] Redesign popup.html với controls
- [ ] Add CSS for new components
- [ ] Implement responsive design

### Bước 3: Core Logic
- [ ] Upgrade QR library
- [ ] Add customization logic
- [ ] Implement settings persistence

### Bước 4: Testing
- [ ] Test all customization options
- [ ] Cross-browser compatibility
- [ ] Performance testing

---

## 📊 Success Metrics

### Giai đoạn 1:
- ✅ QR codes với custom colors
- ✅ Variable sizes (128px - 512px)
- ✅ Configurable padding
- ✅ Settings persistence
- ✅ Responsive UI

### Giai đoạn 2:
- ✅ Logo upload & integration
- ✅ Logo customization
- ✅ High-quality output
- ✅ Multiple logo formats

### Giai đoạn 3:
- ✅ 4 format support (QR, Data Matrix, GS1, Micro QR)
- ✅ Format auto-detection
- ✅ Standards compliance
- ✅ Performance optimization

---

*Roadmap được tạo vào ngày 3/10/2025*
*Dự kiến hoàn thành: 6 tuần*