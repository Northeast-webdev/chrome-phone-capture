# ✅ Setup Checklist

Use this checklist to ensure everything is properly installed and working.

---

## 📋 Pre-Installation Checklist

### System Requirements
- [ ] Chrome 88+ installed
- [ ] Node.js 18+ installed (check: `node --version`)
- [ ] npm installed (check: `npm --version`)
- [ ] Port 3000 available (or choose another port)

---

## 🚀 Installation Checklist

### WebSocket Server
- [ ] Navigate to `websocket-server` folder
- [ ] Run `npm install` (no errors)
- [ ] Run `npm start`
- [ ] Server shows: "✅ Ready to accept connections"
- [ ] Server running on ws://localhost:3000

### Chrome Extension
- [ ] Open `chrome://extensions/`
- [ ] Developer mode enabled (toggle top-right)
- [ ] Click "Load unpacked"
- [ ] Select `chrome-extension` folder
- [ ] Extension appears in list
- [ ] Extension icon in toolbar (optional: pin it)
- [ ] No errors shown

### Icons (Optional but Recommended)
- [ ] Create or download 3 PNG icons (16px, 48px, 128px)
- [ ] Place in `chrome-extension/icons/` folder
- [ ] Reload extension
- [ ] Icons appear correctly

---

## ✅ Verification Checklist

### Extension Popup
- [ ] Click extension icon
- [ ] Popup opens without errors
- [ ] Status shows: 🟢 Connected
- [ ] Server URL shows: ws://localhost:3000
- [ ] Last number: "-" (none yet)
- [ ] Today count: 0

### Test Page
- [ ] Open `test/test-page.html` in Chrome
- [ ] Page loads correctly
- [ ] Phone numbers are blue and clickable
- [ ] Click on "+39 0444 784500"
- [ ] Chrome notification appears: "Numero Inviato: +390444784500"
- [ ] Extension popup updates (shows last number)
- [ ] Server console logs the phone number

### Server Console
When phone number is clicked, server should show:
```
[Server] ✅ Client 1 connected
[Server] Client 1 identified as: chrome-extension
[Server] 📞 PHONE NUMBER: +390444784500
[Server] Source: file:///.../test-page.html
[Server] Broadcasting to 0 other clients...
```

### Extension Console (Advanced)
- [ ] Open `chrome://extensions/`
- [ ] Click "Inspect views: service worker"
- [ ] Console opens
- [ ] Look for: `[PhoneDialer Background] WebSocket connected!`
- [ ] No red errors

---

## 🧪 Functionality Testing

### Basic Features
- [ ] Click tel: link → Notification appears
- [ ] Multiple clicks work
- [ ] Different phone formats captured correctly
- [ ] Extension popup shows statistics
- [ ] Server logs all phone numbers

### Connection Management
- [ ] Extension connects automatically on load
- [ ] Stop server → Extension shows 🔴 Disconnected
- [ ] Start server → Extension auto-reconnects
- [ ] Manual reconnect button works

### Popup UI
- [ ] Connection status indicator works
- [ ] Last number updates after capture
- [ ] Today count increments
- [ ] Test button shows "Ping sent"
- [ ] Reconnect button triggers reconnection

---

## 🌐 Real Website Testing

### Test on Popular Sites
Try clicking phone numbers on:
- [ ] Company websites (example.com/contact)
- [ ] Google search results (business listings)
- [ ] LinkedIn profiles
- [ ] Yelp business pages
- [ ] Yellow pages directories

### Verify Behavior
- [ ] Tel links work on all sites
- [ ] Various phone formats captured
- [ ] International numbers work
- [ ] No interference with normal browsing

---

## 🔧 Advanced Configuration (Optional)

### Change WebSocket Port
If port 3000 is busy:
- [ ] Stop server
- [ ] Run: `PORT=3001 npm start`
- [ ] Update extension: Edit `background.js` line 18
- [ ] Change to: `wsUrl: 'ws://localhost:3001'`
- [ ] Reload extension in chrome://extensions

### Enable Debug Mode
For detailed logs:
- [ ] Stop server
- [ ] Run: `SHOW_STATS=true npm start`
- [ ] Server shows statistics every minute

---

## 🐛 Troubleshooting Verification

### If Extension Won't Load
- [ ] Check manifest.json is valid JSON
- [ ] Verify all files exist in chrome-extension folder
- [ ] Check browser console for errors
- [ ] Try reloading Chrome completely

### If WebSocket Won't Connect
- [ ] Server is actually running (check terminal)
- [ ] Port 3000 is not blocked by firewall
- [ ] Extension has correct server URL
- [ ] Try manual reconnect from popup
- [ ] Check browser console for WebSocket errors

### If No Notifications Show
- [ ] Chrome notifications enabled in system settings
- [ ] Extension has notification permission
- [ ] Check chrome://settings/content/notifications
- [ ] Try clicking test page phone numbers again

---

## 📊 Success Criteria

### Minimum Viable Product (MVP)
All these must work:
- ✅ Extension loads without errors
- ✅ WebSocket server runs without errors
- ✅ Extension connects to server (🟢 Connected)
- ✅ Clicking tel: links shows notifications
- ✅ Phone numbers appear in server logs
- ✅ Extension popup shows correct status
- ✅ Statistics update correctly

### Ready for Production
Additional requirements:
- ✅ Professional icons installed
- ✅ Tested on 5+ different websites
- ✅ Server runs stably for 24+ hours
- ✅ No console errors or warnings
- ✅ Connection survives server restarts
- ✅ All documentation reviewed

---

## 🎉 Final Verification

When all above items are checked:

**✅ Extension is fully operational!**

You can now:
- Use it daily for phone number capture
- Test with real websites
- Plan Android app integration
- Prepare for Phase 2 (authentication, database)

---

## 📝 Notes

### Development Mode
- Extension runs in development mode
- Console logs are verbose
- Easy to reload after changes

### Production Considerations (Future)
- Package extension for Chrome Web Store
- Deploy WebSocket server to cloud
- Add user authentication
- Enable WSS (secure WebSocket)
- Rate limiting and monitoring

---

## 🔄 Daily Usage Checklist

Before starting work:
- [ ] Start WebSocket server: `cd websocket-server && npm start`
- [ ] Verify extension is enabled
- [ ] Check connection status (popup)

After work:
- [ ] Stop server (Ctrl+C)
- [ ] Review captured numbers in logs (optional)

---

## 📞 Need Help?

If something doesn't work:
1. Check this checklist again
2. Read QUICKSTART.md
3. Review INSTALLATION.md for detailed steps
4. Check server and extension console logs
5. Verify all files are present

---

**Last Updated**: November 8, 2025  
**Version**: 1.0.0 (MVP)

**Status**: Ready for Testing! 🚀

