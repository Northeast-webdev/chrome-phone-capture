# Technical Context - Phone Dialer Extension

## 🛠️ Technology Stack

### Chrome Extension
- **Manifest Version**: V3 (latest standard)
- **Language**: JavaScript (ES6+)
- **APIs Used**:
  - Chrome Runtime (messaging)
  - Chrome Notifications (user feedback)
  - Chrome Storage (settings persistence)
  - Chrome Tabs (optional - page info)
  - WebSocket API (browser native)

### WebSocket Server
- **Runtime**: Node.js 18+
- **Framework**: `ws` library (lightweight WebSocket)
- **Port**: 3000 (configurable)
- **Protocol**: WebSocket (ws://)

### Development Tools
- **Editor**: VS Code
- **Testing**: Chrome Developer Tools
- **Debugging**: chrome://extensions with developer mode
- **Version Control**: Git

## 📦 Dependencies

### Extension (No npm needed!)
- **Zero dependencies** - Pure JavaScript
- Uses browser native APIs only
- No build step required

### WebSocket Server
```json
{
  "dependencies": {
    "ws": "^8.14.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.1"
  }
}
```

## 🏗️ Project Structure

```
contact-management-extension/
│
├── chrome-extension/              # Extension source
│   ├── manifest.json             # Extension config (V3)
│   ├── background.js             # Service worker
│   ├── content.js                # Content script
│   │
│   ├── popup/
│   │   ├── popup.html           # Popup UI
│   │   ├── popup.js             # Popup logic
│   │   └── popup.css            # Popup styles
│   │
│   ├── utils/
│   │   └── phone-parser.js      # Phone number utilities
│   │
│   └── icons/
│       ├── icon16.png           # Toolbar icon
│       ├── icon48.png           # Extension manager
│       └── icon128.png          # Chrome Web Store
│
├── websocket-server/              # WebSocket relay
│   ├── server.js                 # Main server file
│   ├── package.json              # Node dependencies
│   └── README.md                 # Server setup guide
│
├── docs/
│   ├── INSTALLATION.md           # How to install extension
│   ├── PROTOCOL.md               # WebSocket message protocol
│   └── DEVELOPMENT.md            # Development guide
│
├── test/
│   └── test-page.html           # Test page with tel: links
│
└── README.md                     # Project overview
```

## 🔧 Chrome Extension Manifest V3

### Key Manifest Fields
```json
{
  "manifest_version": 3,
  "name": "Contact Management Phone Dialer",
  "version": "1.0.0",
  "permissions": [
    "notifications",
    "storage"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [{
    "matches": ["<all_urls>"],
    "js": ["content.js"],
    "run_at": "document_idle"
  }],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": "icons/icon48.png"
  }
}
```

### Important V3 Changes
- **Service Workers** instead of background pages
- **Promises** instead of callbacks (chrome.* APIs)
- **Host permissions** separate from regular permissions
- **No remote code** execution (all scripts must be local)

## 🌐 WebSocket Protocol

### Connection URL
```
ws://localhost:3000
```

### Message Format (JSON)
```typescript
interface CallRequest {
  type: 'CALL_REQUEST';
  number: string;          // "+390445123456"
  source: string;          // "https://example.com"
  timestamp: number;       // Unix timestamp (ms)
}

interface StatusUpdate {
  type: 'STATUS';
  connected: boolean;
  clients: number;
}

interface ErrorMessage {
  type: 'ERROR';
  message: string;
  code: string;
}
```

## 🔐 Security Considerations

### MVP (No Auth)
- WebSocket runs on localhost only
- No external access
- No sensitive data transmitted
- Testing environment only

### Production (Future)
- WSS (WebSocket Secure) with TLS
- JWT token authentication
- CORS policies
- Rate limiting
- Message encryption

## 🚀 Deployment Strategy

### Extension Deployment
**Option 1: Development (Load Unpacked)**
1. Chrome → Extensions → Developer Mode
2. "Load unpacked" → Select chrome-extension folder
3. Extension loads immediately

**Option 2: Production (Chrome Web Store)**
1. Zip extension folder
2. Upload to Chrome Developer Dashboard
3. Fill in store listing
4. Submit for review
5. Published (1-3 days)

### WebSocket Server Deployment
**Local Testing:**
```bash
cd websocket-server
npm install
npm start
# Server running on ws://localhost:3000
```

**Production Deployment:**
- Deploy to Render / Railway / Heroku
- Use WSS with SSL certificate
- Environment variable for port
- Process manager (PM2) for auto-restart

## 📊 Data Storage

### Chrome Storage API
```javascript
// Save settings
chrome.storage.local.set({
  serverUrl: 'ws://localhost:3000',
  numbersSentToday: 12,
  lastNumber: '+390445123456'
});

// Retrieve settings
chrome.storage.local.get(['serverUrl'], (result) => {
  const url = result.serverUrl || 'ws://localhost:3000';
});
```

### Storage Limits
- **local**: 5 MB (more than enough)
- **sync**: 100 KB (unused in MVP)

## 🔍 Testing Strategy

### Manual Testing
1. Load extension in Chrome
2. Open test page with tel: links
3. Click phone number
4. Verify:
   - Notification appears
   - WebSocket server logs message
   - Popup shows updated stats

### Testing Tools
- **Chrome DevTools**: Console, Network, Sources
- **Extension Inspector**: chrome://extensions → Inspect views
- **WebSocket Client**: Use Postman or websocat CLI

### Test Scenarios
```
1. ✅ Click tel: link → Number captured
2. ✅ WebSocket connected → Message sent
3. ✅ WebSocket disconnected → Error shown
4. ✅ Rapid clicks → Debounced correctly
5. ✅ Invalid tel: link → Handled gracefully
6. ✅ Popup shows status → UI updates
7. ✅ Extension icon shows state → Green/Red
```

## 🐛 Debugging

### Extension Debugging
```javascript
// background.js console
console.log('[Background]', 'WebSocket connected');

// content.js console
console.log('[Content]', 'Tel link clicked:', phoneNumber);

// View logs: chrome://extensions → Inspect views: service worker
```

### WebSocket Server Debugging
```javascript
// server.js logs
console.log(`[WS] Client connected. Total: ${clients.size}`);
console.log(`[WS] Message received:`, JSON.parse(message));
```

### Common Issues
| Issue | Cause | Solution |
|-------|-------|----------|
| Content script not running | Permissions missing | Add `<all_urls>` to manifest |
| WebSocket won't connect | Server not running | Start with `npm start` |
| No notification shown | Permission not granted | Add `notifications` to manifest |
| Changes not reflected | Extension not reloaded | Click "Reload" in chrome://extensions |

## 📱 Phone Number Parsing

### Supported Formats
```javascript
// All these should parse correctly:
tel:+390445123456
tel:039-045-123-456
tel:(039) 045 123 456
tel:039.045.123.456
tel:+39 045 123456

// Parser output: "+390445123456" (normalized)
```

### Parsing Logic
```javascript
function parsePhoneNumber(telHref) {
  // Remove "tel:" prefix
  let number = telHref.replace(/^tel:/, '');
  
  // Remove spaces, dashes, dots, parentheses
  number = number.replace(/[\s\-\.\(\)]/g, '');
  
  // Ensure starts with +
  if (!number.startsWith('+')) {
    number = '+' + number;
  }
  
  return number;
}
```

## 🌍 Browser Compatibility

### Supported Browsers
- ✅ Chrome 88+ (Manifest V3 support)
- ✅ Edge 88+ (Chromium-based)
- ✅ Brave 1.20+ (Chromium-based)
- ❌ Firefox (uses different extension API)
- ❌ Safari (uses different extension API)

### Future Cross-Browser Support
- Use WebExtension Polyfill
- Separate manifest versions
- Browser-specific builds

## ⚡ Performance

### Metrics to Monitor
- Time from click to WebSocket send: < 100ms
- Memory usage: < 50 MB
- CPU usage: < 1% idle, < 5% active
- WebSocket latency: < 50ms (localhost)

### Optimization Techniques
- Event delegation (single listener)
- Debounce rapid clicks
- Lazy WebSocket connection
- Minimal DOM queries
- No heavy libraries

## 🔄 Update Strategy

### Extension Updates
1. Bump version in manifest.json
2. Test thoroughly
3. Upload new version to Chrome Web Store
4. Auto-updates to users within 24 hours

### Server Updates
1. Deploy new server version
2. Keep backward compatibility
3. Graceful shutdown (drain connections)
4. Zero-downtime with load balancer (production)

## 📚 Reference Documentation

### Official Docs
- [Chrome Extension Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [WebSocket API](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [Node.js ws Library](https://github.com/websockets/ws)

### Useful Resources
- Chrome Extension Samples: https://github.com/GoogleChrome/chrome-extensions-samples
- WebSocket Protocol: https://datatracker.ietf.org/doc/html/rfc6455
- Manifest V3 Migration: https://developer.chrome.com/docs/extensions/migrating/

