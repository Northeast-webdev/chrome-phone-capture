# ⚡ Quick Start Guide

Get the Phone Dialer Extension running in 5 minutes!

---

## 🚀 3-Step Setup

### Step 1: Start WebSocket Server (2 min)

```bash
cd websocket-server
npm install
npm start
```

You should see:
```
📞 Phone Dialer WebSocket Server
🌐 Server running on: ws://0.0.0.0:3000
✅ Ready to accept connections
```

✅ **Keep this terminal open!**

---

### Step 2: Install Chrome Extension (2 min)

1. Open Chrome: `chrome://extensions/`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select the `chrome-extension` folder
5. Done! Extension installed ✅

---

### Step 3: Test It (1 min)

1. Open `test/test-page.html` in Chrome
2. Click any phone number
3. See notification: **"Numero Inviato"** ✅
4. Check server console - you'll see the phone number logged!

---

## ✅ Verification

### Extension Popup
Click extension icon - you should see:
- Status: **🟢 Connected**
- Server: `ws://localhost:3000`

### Server Console
Should show:
```
[Server] 📞 PHONE NUMBER: +390445123456
[Server] Source: file:///test-page.html
```

---

## 📖 What's Next?

### Use on Real Websites
Visit any website with phone numbers:
- Company websites
- Contact pages  
- Business directories
- LinkedIn profiles

Click on any `tel:` link to capture the number!

### Read Full Documentation
- **[README.md](README.md)** - Complete overview
- **[INSTALLATION.md](docs/INSTALLATION.md)** - Detailed setup
- **[WEBSOCKET_PROTOCOL.md](docs/WEBSOCKET_PROTOCOL.md)** - Protocol spec

---

## 🐛 Troubleshooting

### Server won't start?
```bash
# Port 3000 already in use? Try different port:
PORT=3001 npm start
```

### Extension not working?
1. Check server is running
2. Reload extension: `chrome://extensions/` → Click ↻
3. Check extension popup shows 🟢 Connected

### No notification shown?
1. Allow Chrome notifications in system settings
2. Check `chrome://settings/content/notifications`

---

## 🎯 MVP Features

✅ Click tel: links to capture phone numbers  
✅ WebSocket relay to connected devices  
✅ Chrome notifications for feedback  
✅ Status dashboard in popup  
✅ Auto-reconnect if server restarts  
✅ Works on ANY website  

---

## 📁 Project Structure

```
contact-management-extension/
├── chrome-extension/         ← Chrome Extension
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   └── popup/
│
├── websocket-server/         ← WebSocket Server
│   ├── server.js
│   └── package.json
│
├── test/                     ← Test Page
│   └── test-page.html
│
├── docs/                     ← Documentation
│   ├── INSTALLATION.md
│   └── WEBSOCKET_PROTOCOL.md
│
└── memory-bank/              ← Project Context
```

---

## 🔮 Future (Phase 2)

- 🔐 User authentication
- 📱 Android app integration
- 💾 Save to contact database
- 📊 Statistics dashboard
- ⚙️ Settings page

---

## ✨ You're Ready!

Start clicking phone numbers and watch them get captured instantly! 

The WebSocket server logs every phone number for debugging.

---

**Questions?** Check the full [README.md](README.md) or [INSTALLATION.md](docs/INSTALLATION.md)

**Happy calling! 📞**

