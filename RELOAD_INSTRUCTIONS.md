# 🔧 Extension Reload Instructions

## 🚨 **BROWSER CACHE ISSUE - RELOAD EXTENSION**

### 📋 **Steps to Force Reload Extension:**

#### 1️⃣ **Clear Extension Cache:**
1. Open Chrome
2. Go to `chrome://extensions/`
3. Find "QR Code Generator Pro"
4. Click **"🔄 Reload"** button (or toggle off/on)

#### 2️⃣ **Alternative Method:**
1. Go to `chrome://extensions/`
2. **Turn OFF** the extension
3. **Turn ON** the extension again

#### 3️⃣ **Complete Reload (If Still Not Working):**
1. Go to `chrome://extensions/`
2. Click **"Remove"** to uninstall extension
3. Click **"Load unpacked"**
4. Select the `dist/` folder again

#### 4️⃣ **Clear Browser Cache (Last Resort):**
1. Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac)
2. Or go to Chrome settings → Privacy → Clear browsing data

### 🎯 **Expected New Layout:**
```
┌─────────────────────────────────────────────────────┐
│              QR Code Generator Pro                  │
├──────────────────────┬──────────────────────────────┤
│ LEFT PANEL           │ RIGHT PANEL                  │
│ ┌──────────────────┐ │ ┌──────────────────────────┐ │
│ │ Text Input       │ │ │                          │ │
│ │ Size Selection   │ │ │    QR Code Preview       │ │
│ │ Padding Control  │ │ │                          │ │
│ │ Color Pickers    │ │ │                          │ │
│ │ Generate Button  │ │ └──────────────────────────┘ │
│ └──────────────────┘ │ [PNG] [SVG] [Copy] buttons   │
└──────────────────────┴──────────────────────────────┘
```

### ⚠️ **If Still Not Working:**
The extension files are correctly updated in `dist/` folder. The issue is browser cache/extension cache.

**TRY THIS ORDER:**
1. Extension Reload first ⬆️
2. If not working → Remove & Re-add extension
3. If still not working → Clear browser cache

### ✅ **Verification:**
- Extension should be **wider** (520px-620px vs old 350px-420px)
- **2 columns** visible side by side
- **No vertical scrolling** needed
- Left: Controls, Right: Preview