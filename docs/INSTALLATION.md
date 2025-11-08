# 📦 Installation Guide - Phone Dialer Extension

Complete step-by-step installation instructions for the Phone Dialer Chrome Extension and WebSocket server.

---

## 📋 Prerequisites

Before you begin, ensure you have:

### For Chrome Extension
- ✅ **Chrome Browser** 88+ (or Edge, Brave - Chromium-based)
- ✅ **Developer Mode** enabled in chrome://extensions

### For WebSocket Server
- ✅ **Node.js** 18+ installed ([Download](https://nodejs.org/))
- ✅ **npm** or **yarn** (comes with Node.js)
- ✅ **Port 3000** available (or any other port)

---

## 🚀 Installation Steps

### Part 1: WebSocket Server Setup

#### 1. Navigate to Server Directory

```bash
cd contact-management-extension/websocket-server
```

#### 2. Install Dependencies

```bash
npm install
```

This installs:
- `ws` (WebSocket library)
- `nodemon` (dev dependency for auto-reload)

#### 3. Start the Server

**Production mode:**
```bash
npm start
```

**Development mode (auto-reload on changes):**
```bash
npm run dev
```

#### 4. Verify Server is Running

You should see:

```
╔════════════════════════════════════════════════════════╗
║   📞 Phone Dialer WebSocket Server                    ║
╠════════════════════════════════════════════════════════╣
║   🌐 Server running on: ws://0.0.0.0:3000             ║
║   🕐 Started at: 11/8/2025, 10:30:00 AM              ║
║   ✅ Ready to accept connections                      ║
╚════════════════════════════════════════════════════════╝

[Server] Waiting for clients...
```

**✅ Server ready!** Keep this terminal window open.

---

### Part 2: Chrome Extension Installation

#### 1. Open Chrome Extensions Page

In Chrome, navigate to:
```
chrome://extensions/
```

Or: **Menu → More Tools → Extensions**

#### 2. Enable Developer Mode

Toggle **Developer mode** ON (top-right corner)

![Developer Mode](https://developer.chrome.com/static/docs/extensions/mv3/getstarted/hello-world/image/extensions-page-e0d64d89a6acf_1920.png)

#### 3. Load Unpacked Extension

1. Click **"Load unpacked"** button
2. Navigate to the project folder
3. Select the `chrome-extension` folder
4. Click **"Select Folder"** (or "Open" on Windows)

#### 4. Verify Extension is Loaded

You should see:

```
📞 Contact Management Phone Dialer
Version 1.0.0
Enabled ✓
```

#### 5. Pin Extension (Optional but Recommended)

1. Click the **puzzle icon** (Extensions) in Chrome toolbar
2. Find **"Contact Management Phone Dialer"**
3. Click the **pin icon** 📌

Now the extension icon is always visible!

---

### Part 3: Add Extension Icons (Optional)

The extension needs icons. You can:

**Option A: Use Placeholder Icons**
Create simple 48x48px PNG files and place them in:
```
chrome-extension/icons/
├── icon16.png
├── icon48.png
└── icon128.png
```

**Option B: Use an Icon Generator**
1. Visit https://www.favicon-generator.org/
2. Upload a phone icon image
3. Generate icons
4. Download and place in `chrome-extension/icons/`

**Option C: Skip for Now**
Extension will work without icons (Chrome shows default icon)

---

## ✅ Verification

### 1. Check Extension Status

Click the extension icon in Chrome toolbar. You should see:

```
Status: 🟢 Connected
Server: ws://localhost:3000
Last Number Sent: -
Today: 0
```

If status is 🔴 Disconnected, check that WebSocket server is running.

### 2. Test with Test Page

1. Open `test/test-page.html` in Chrome:

```bash
# From project root
open test/test-page.html
# Or on Windows
start test/test-page.html
```

2. Click on any phone number
3. You should see:
   - ✅ Chrome notification: "Numero Inviato: +39..."
   - ✅ Extension popup updates (shows last number)
   - ✅ Server console logs the phone number

### 3. Verify in Server Console

In the terminal where server is running, you should see:

```
[Server] ✅ Client 1 connected
[Server] IP: ::1
[Server] Total clients: 1

[Server] 📨 Message from client 1: HANDSHAKE
[Server] Client 1 identified as: chrome-extension

[Server] 📨 Message from client 1: CALL_REQUEST
[Server] 📞 PHONE NUMBER: +390445123456
[Server] Source: file:///path/to/test-page.html
[Server] Broadcasting to 0 other clients...
```

**✅ Everything working!**

---

## 🔧 Configuration

### Change WebSocket Server Port

If port 3000 is already in use:

```bash
PORT=3001 npm start
```

Then update extension to use new port:
1. Open extension popup
2. (Future) Settings → Server URL
3. Change to `ws://localhost:3001`

For now (MVP), you need to edit `background.js`:

```javascript
// Line ~18 in background.js
wsUrl: 'ws://localhost:3001'  // Change port here
```

Then reload extension in `chrome://extensions/`

### Enable Debug Logs

To see more detailed server logs:

```bash
SHOW_STATS=true npm start
```

This displays statistics every minute.

---

## 🐛 Troubleshooting

### Server Won't Start

**Error**: `EADDRINUSE: address already in use :::3000`

**Solution**: Port 3000 is already used. Try:
```bash
# Check what's using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Use different port
PORT=3001 npm start
```

---

### Extension Not Loading

**Error**: "Manifest file is missing or unreadable"

**Solution**: 
1. Make sure you selected the `chrome-extension` folder (not the root)
2. Check that `manifest.json` exists in that folder
3. Verify manifest.json is valid JSON (no syntax errors)

---

### No Notification Shown

**Issue**: Phone number captured but no notification

**Solution**:
1. Check Chrome notification settings:
   - `chrome://settings/content/notifications`
   - Ensure notifications are allowed
2. Check system notification settings (Windows/Mac)
3. Check extension has notification permission:
   - `chrome://extensions/` → Extension details → Permissions

---

### WebSocket Won't Connect

**Symptoms**: Extension popup shows 🔴 Disconnected

**Solutions**:

1. **Check server is running**:
```bash
# Server terminal should show:
[Server] 🌐 Server running on: ws://0.0.0.0:3000
```

2. **Check server URL**:
   - Open background.js console: chrome://extensions → Inspect views
   - Look for: `[PhoneDialer Background] Connecting to ws://localhost:3000`

3. **Check firewall**:
   - Allow incoming connections on port 3000
   - On Mac: System Preferences → Security → Firewall
   - On Windows: Windows Defender Firewall

4. **Try manual reconnect**:
   - Click extension icon
   - Click "Riconnetti" button

---

### Phone Numbers Not Captured

**Issue**: Clicking phone numbers does nothing

**Solutions**:

1. **Verify it's a tel: link**:
   - Right-click → Inspect element
   - Should see: `<a href="tel:+123456789">`
   - If not, it's plain text (not supported in MVP)

2. **Check content script is running**:
   - Open page console (F12)
   - Look for: `[PhoneDialer] Content script loaded`

3. **Reload extension**:
   - `chrome://extensions/`
   - Click reload button ↻

4. **Check extension permissions**:
   - Extension needs `<all_urls>` permission
   - Should be granted automatically

---

## 🖥️ Platform-Specific Notes

### Windows

- Use PowerShell or Command Prompt
- Replace `open` with `start` for opening files
- Use `netstat` instead of `lsof` for port checking

### macOS

- May need to allow Node.js in Security settings
- Port 3000 should work without issues
- Use `lsof` to check ports

### Linux

- May need `sudo` for ports below 1024
- Use `lsof` or `netstat` to check ports
- Ensure Chrome is Chromium-based

---

## 🔄 Update Instructions

### Update Extension

1. Make changes to extension files
2. Go to `chrome://extensions/`
3. Click **reload button** ↻ for the extension
4. Changes applied!

### Update Server

1. Stop server (Ctrl+C)
2. Make changes to `server.js`
3. Restart server: `npm start`

---

## ✅ Installation Checklist

Use this checklist to verify everything is installed correctly:

### WebSocket Server
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Dependencies installed (`npm install` successful)
- [ ] Server starts without errors
- [ ] Server logs show: "✅ Ready to accept connections"
- [ ] Port 3000 is accessible

### Chrome Extension
- [ ] Chrome 88+ installed
- [ ] Developer mode enabled
- [ ] Extension loaded successfully
- [ ] Extension icon appears in toolbar
- [ ] Extension popup opens
- [ ] Connection status shows 🟢 Connected

### Testing
- [ ] Test page opens (test/test-page.html)
- [ ] Clicking phone number shows notification
- [ ] Server console logs phone number
- [ ] Extension popup shows last number sent
- [ ] Statistics update correctly

---

## 🎓 Next Steps

After installation:

1. **Test thoroughly** with test page
2. **Try on real websites** (Google, LinkedIn, company sites)
3. **Check server logs** to see captured numbers
4. **Read usage documentation** for advanced features
5. **Plan Android app** integration (Phase 2)

---

## 📚 Additional Resources

- **Main README**: [../README.md](../README.md)
- **WebSocket Protocol**: [WEBSOCKET_PROTOCOL.md](WEBSOCKET_PROTOCOL.md)
- **Server Documentation**: [../websocket-server/README.md](../websocket-server/README.md)
- **Chrome Extension Docs**: https://developer.chrome.com/docs/extensions/mv3/

---

## 💡 Tips

- Keep server running in a dedicated terminal
- Pin extension to toolbar for easy access
- Check server logs if something doesn't work
- Use test page to verify setup before using on real sites

---

**Installation complete! 🎉**

Now you're ready to start capturing phone numbers with a single click!

---

**Last Updated**: November 8, 2025  
**Version**: 1.0.0 (MVP)

