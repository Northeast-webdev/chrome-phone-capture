# 📞 Contact Management Phone Dialer Extension

> Chrome Extension to capture phone numbers from web pages and send them to your mobile phone dialer via WebSocket

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-brightgreen)](https://chrome.google.com/webstore)
[![WebSocket](https://img.shields.io/badge/WebSocket-Ready-blue)](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green)](https://nodejs.org/)

---

## 🎯 What is this?

A Chrome Extension that instantly captures phone numbers when you click on `tel:` links on any website and sends them to your mobile phone's dialer automatically (via a future Android app).

**Perfect for**: Sales teams, customer service, anyone making lots of phone calls from web research.

---

## ✨ Features

- ✅ **One-Click Capture**: Click any tel: link to capture the phone number
- ✅ **WebSocket Relay**: Instant transmission to connected devices
- ✅ **Universal**: Works on ANY website
- ✅ **Smart Parser**: Handles all phone number formats
- ✅ **Visual Feedback**: Chrome notifications confirm successful sends
- ✅ **Status Dashboard**: Popup shows connection status and statistics
- ✅ **Auto-Reconnect**: Maintains connection even if server restarts
- ✅ **Zero Config**: Works out of the box (for MVP)

---

## 📦 Project Structure

```
contact-management-extension/
├── chrome-extension/          # Chrome Extension
│   ├── manifest.json         # Extension configuration
│   ├── background.js         # WebSocket handler
│   ├── content.js            # Tel link interceptor
│   ├── popup/                # Popup UI
│   └── icons/                # Extension icons
│
├── websocket-server/         # WebSocket relay server
│   ├── server.js             # Node.js server
│   ├── package.json          # Dependencies
│   └── README.md             # Server documentation
│
├── test/                     # Testing
│   └── test-page.html        # Test page with tel: links
│
├── docs/                     # Documentation
│   ├── INSTALLATION.md       # Installation guide
│   └── WEBSOCKET_PROTOCOL.md # Protocol specification
│
└── memory-bank/              # Project context
    ├── projectbrief.md
    ├── productContext.md
    ├── systemPatterns.md
    ├── techContext.md
    ├── activeContext.md
    └── progress.md
```

---

## 🚀 Quick Start

### 1. Install WebSocket Server

```bash
cd websocket-server
npm install
npm start
```

Server runs on `ws://localhost:3000`

### 2. Install Chrome Extension

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder
5. Extension installed! 📱

### 3. Test It

1. Open `test/test-page.html` in Chrome
2. Click on any phone number
3. See notification: "Numero Inviato"
4. Check server console for the phone number

**Done!** 🎉

---

## 📋 Requirements

### Chrome Extension
- Chrome 88+ (Manifest V3 support)
- No additional dependencies

### WebSocket Server
- Node.js 18+
- npm or yarn

---

## 🔧 How It Works

```
┌─────────────┐
│  Web Page   │  User clicks tel: link
└──────┬──────┘
       ↓
┌─────────────────────┐
│ Chrome Extension    │  Captures phone number
│  - content.js       │
└──────┬──────────────┘
       ↓
┌─────────────────────┐
│ Background Worker   │  Sends via WebSocket
│  - background.js    │
└──────┬──────────────┘
       ↓
┌─────────────────────┐
│ WebSocket Server    │  Broadcasts to devices
│  - server.js        │
└──────┬──────────────┘
       ↓
┌─────────────────────┐
│ Android App         │  Opens phone dialer
│  (Future)           │
└─────────────────────┘
```

---

## 📖 Documentation

- **[INSTALLATION.md](docs/INSTALLATION.md)** - Detailed installation guide
- **[WEBSOCKET_PROTOCOL.md](docs/WEBSOCKET_PROTOCOL.md)** - WebSocket message protocol
- **[websocket-server/README.md](websocket-server/README.md)** - Server documentation

---

## 🎨 Usage

### For Employees

1. **Browse any website** with phone numbers
2. **Click on a phone number** (tel: link)
3. **Phone dialer opens** automatically on your mobile
4. **Make the call** 📞

That's it! No copy-paste, no manual entry.

### For Admins

- Monitor server logs to see usage
- Check extension popup for statistics
- Future: Dashboard with analytics

---

## 🧪 Testing

### Test with Test Page

```bash
# Open test page in browser
open test/test-page.html
```

Click on the phone numbers to test the extension.

### Test with Real Websites

Visit any website with phone numbers:
- Company websites
- Contact pages
- Business directories
- LinkedIn profiles
- Any page with `<a href="tel:+123456">` links

### Verify in Server Console

```bash
cd websocket-server
npm start

# You should see:
[Server] 📞 PHONE NUMBER: +390445123456
[Server] Source: https://example.com
[Server] Broadcasting to 1 other clients...
```

---

## 🔐 Security

### Current (MVP)
- ⚠️ No authentication (localhost only)
- ⚠️ Open WebSocket (testing)
- ⚠️ No encryption

### Production (Phase 2)
- ✅ JWT authentication
- ✅ WSS (encrypted WebSocket)
- ✅ Rate limiting
- ✅ User session tracking

---

## 🛠️ Development

### Extension Development

```bash
# Make changes to chrome-extension files
# Then reload extension in chrome://extensions
```

### Server Development

```bash
cd websocket-server
npm run dev  # Auto-reload on changes
```

### Debug Extension

1. Open `chrome://extensions/`
2. Find "Phone Dialer Extension"
3. Click **"Inspect views: service worker"**
4. See console logs from background.js

---

## 📊 Features Roadmap

### Phase 1: MVP ✅ (Current)
- [x] Tel link interception
- [x] Phone number capture
- [x] WebSocket transmission
- [x] Chrome notifications
- [x] Popup status UI

### Phase 2: Integration (Next)
- [ ] User authentication
- [ ] Laravel API integration
- [ ] Save to contacts database
- [ ] Settings page

### Phase 3: Android App
- [ ] Android app development
- [ ] Dialer auto-open
- [ ] Call history tracking

### Phase 4: Advanced Features
- [ ] Right-click context menu
- [ ] Auto-detect plain text numbers
- [ ] Multiple device support
- [ ] Statistics dashboard

---

## 🐛 Troubleshooting

### Extension not working

**Check:**
1. Extension enabled in `chrome://extensions/`
2. WebSocket server running
3. Server URL correct in extension (ws://localhost:3000)
4. Check console for errors

### WebSocket won't connect

**Solutions:**
1. Start server: `cd websocket-server && npm start`
2. Check port 3000 is free: `lsof -i :3000` (Mac/Linux)
3. Try different port: `PORT=3001 npm start`
4. Check firewall settings

### Phone numbers not captured

**Check:**
1. Are they `tel:` links? (`<a href="tel:+123">`)
2. Check extension console (Inspect views: service worker)
3. Try test page: `test/test-page.html`

### No notification shown

**Check:**
1. Chrome notifications enabled (System Settings)
2. Extension has notification permission
3. Check `chrome://settings/content/notifications`

---

## 💡 Tips

### For Best Results

- Ensure WebSocket server is always running
- Keep extension updated
- Test on the test page first
- Check server console to verify messages

### Keyboard Shortcuts (Future)

- `Ctrl+Shift+D` - Toggle extension on/off
- `Ctrl+Shift+C` - Open extension popup

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 👥 Team

**Developer**: Luca  
**Project**: Contact Management System Extension  
**Date**: November 8, 2025

---

## 📞 Support

- **Issues**: Check documentation first
- **Server Logs**: See what's happening in real-time
- **Test Page**: Use `test/test-page.html` to verify setup

---

## 🎯 Integration with Contact Management System

This extension is designed to work with the existing [Contact Management System](../contact%20management/README.md):

- **Current**: Standalone extension
- **Phase 2**: Will integrate with Laravel API
- **Phase 3**: Android app will complete the flow

---

## ⭐ Acknowledgments

- Chrome Extension API
- WebSocket Protocol (RFC 6455)
- Node.js `ws` library
- Contact Management System team

---

**Built with ❤️ for efficient phone calling**

Last Updated: November 8, 2025  
Version: 1.0.0 (MVP)

