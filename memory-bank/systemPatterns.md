# System Patterns - Phone Dialer Extension

## 🏗️ Architecture Overview

### Component Architecture
```
┌─────────────────────────────────────────────────────┐
│                    Web Page                         │
│  ┌─────────────────────────────────────────────┐   │
│  │ <a href="tel:+390445123456">Call Us</a>    │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────┘
                      │ (user clicks)
                      ↓
┌─────────────────────────────────────────────────────┐
│            Chrome Extension                         │
│  ┌──────────────────────────────────────────────┐  │
│  │  content.js (Content Script)                 │  │
│  │  - Intercepts clicks                         │  │
│  │  - Extracts phone number                     │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │ chrome.runtime.sendMessage        │
│                 ↓                                    │
│  ┌──────────────────────────────────────────────┐  │
│  │  background.js (Service Worker)              │  │
│  │  - Maintains WebSocket connection            │  │
│  │  - Sends phone numbers                       │  │
│  │  - Shows notifications                       │  │
│  └──────────────┬───────────────────────────────┘  │
│                 │                                    │
│  ┌──────────────┴───────────────────────────────┐  │
│  │  popup.html/js (Popup UI)                    │  │
│  │  - Shows status                              │  │
│  │  - Displays last number                      │  │
│  └──────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────┘
                      │ WebSocket
                      ↓
┌─────────────────────────────────────────────────────┐
│         WebSocket Server (Node.js)                  │
│  - Receives phone numbers                           │
│  - Broadcasts to connected clients                  │
│  - Maintains client list                            │
└─────────────────────┬───────────────────────────────┘
                      │ WebSocket
                      ↓
┌─────────────────────────────────────────────────────┐
│         Android App (Future)                        │
│  - Receives phone number                            │
│  - Opens phone dialer                               │
└─────────────────────────────────────────────────────┘
```

## 🔌 Communication Patterns

### Pattern 1: Content Script → Background Worker
**Type**: Message Passing (Chrome Runtime API)

```javascript
// content.js sends
chrome.runtime.sendMessage({
  type: 'PHONE_CAPTURED',
  number: '+390445123456',
  url: 'https://example.com'
});

// background.js receives
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'PHONE_CAPTURED') {
    handlePhoneNumber(message.number);
  }
});
```

### Pattern 2: Background Worker → WebSocket Server
**Type**: WebSocket Protocol (ws://)

```javascript
// background.js sends
ws.send(JSON.stringify({
  type: 'CALL_REQUEST',
  number: '+390445123456',
  timestamp: Date.now()
}));

// Server receives and broadcasts
wss.on('message', (data) => {
  const message = JSON.parse(data);
  broadcastToClients(message);
});
```

### Pattern 3: Popup → Background Worker
**Type**: Chrome Extension Messaging

```javascript
// popup.js gets status
chrome.runtime.sendMessage({ type: 'GET_STATUS' }, (response) => {
  updateUI(response);
});
```

## 📦 Data Flow

### Phone Number Capture Flow
```
1. User clicks tel: link
   ↓
2. Content script captures click event
   ↓
3. Extract href attribute: "tel:+390445123456"
   ↓
4. Clean phone number: remove "tel:", normalize format
   ↓
5. Send to background worker via chrome.runtime.sendMessage
   ↓
6. Background worker validates WebSocket connection
   ↓
7. Send JSON message to WebSocket server
   ↓
8. Show Chrome notification to user
   ↓
9. Update popup statistics
```

### Connection Management Flow
```
Extension loads
   ↓
Background worker starts
   ↓
Attempt WebSocket connection
   ↓
┌─ Success ─────────────┐  ┌─ Failure ──────────┐
│ Set status: connected │  │ Set status: error  │
│ Update icon: green    │  │ Update icon: red   │
│ Enable phone capture  │  │ Retry after 5s     │
└───────────────────────┘  └─────────┬──────────┘
                                     │
                                     └──→ Retry connection
```

## 🎨 Design Patterns Used

### 1. Observer Pattern (Event Listeners)
Content script observes DOM click events and reacts when tel: links are clicked.

```javascript
document.addEventListener('click', (e) => {
  const telLink = e.target.closest('a[href^="tel:"]');
  if (telLink) {
    notifyBackgroundWorker(telLink.href);
  }
});
```

### 2. Singleton Pattern (WebSocket Connection)
Only one WebSocket connection per extension instance.

```javascript
class WebSocketManager {
  constructor() {
    if (WebSocketManager.instance) {
      return WebSocketManager.instance;
    }
    this.connection = null;
    WebSocketManager.instance = this;
  }
}
```

### 3. Pub/Sub Pattern (Chrome Messaging)
Content scripts publish messages, background worker subscribes.

```javascript
// Publisher (content.js)
chrome.runtime.sendMessage({ type: 'EVENT', data: {} });

// Subscriber (background.js)
chrome.runtime.onMessage.addListener((msg) => {
  handleEvent(msg);
});
```

### 4. Retry Pattern (WebSocket Reconnection)
Automatic reconnection with exponential backoff.

```javascript
function connectWithRetry(retries = 0) {
  connect()
    .catch(() => {
      const delay = Math.min(1000 * Math.pow(2, retries), 30000);
      setTimeout(() => connectWithRetry(retries + 1), delay);
    });
}
```

## 🔐 Security Patterns

### MVP (No Authentication)
- Open WebSocket connection
- Any client can connect
- No message validation
- **Use only for local testing**

### Future (Authenticated)
- Token-based authentication
- JWT validation on WebSocket server
- User session tracking
- Encrypted WebSocket (WSS)

## 📊 State Management

### Extension State
Stored in background worker memory:
```javascript
const state = {
  wsConnected: false,
  lastNumber: null,
  lastSentAt: null,
  numbersSentToday: 0,
  serverUrl: 'ws://localhost:3000'
};
```

### Persistence
Using Chrome Storage API for settings:
```javascript
// Save
chrome.storage.local.set({ serverUrl: 'ws://localhost:3000' });

// Load
chrome.storage.local.get(['serverUrl'], (result) => {
  connectWebSocket(result.serverUrl);
});
```

## 🔄 Error Handling Patterns

### Pattern 1: Graceful Degradation
If WebSocket disconnects, queue messages and retry.

```javascript
const messageQueue = [];

function sendMessage(msg) {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(msg);
  } else {
    messageQueue.push(msg);
    attemptReconnect();
  }
}
```

### Pattern 2: User Feedback
Always notify user of success or failure.

```javascript
function handleSendResult(success, number) {
  chrome.notifications.create({
    type: 'basic',
    title: success ? 'Numero Inviato' : 'Errore',
    message: success 
      ? `${number} inviato al telefono`
      : 'Connessione WebSocket persa'
  });
}
```

### Pattern 3: Logging
Structured logging for debugging.

```javascript
function log(level, message, data = {}) {
  console[level](`[PhoneDialer] ${message}`, data);
  // In production: send to logging service
}
```

## 📱 Message Protocol

### Standard Message Format
```json
{
  "type": "CALL_REQUEST",
  "number": "+390445123456",
  "source": "https://example.com/contact",
  "timestamp": 1699876543210,
  "metadata": {
    "extension_version": "1.0.0"
  }
}
```

### Message Types
- `CALL_REQUEST`: Phone number captured, ready to dial
- `STATUS`: Connection status update
- `PING`: Keep-alive heartbeat
- `ERROR`: Error occurred

## 🏗️ Extension Structure Pattern

```
chrome-extension/
├── manifest.json              # Extension metadata
├── background.js              # Service worker (persistent)
├── content.js                 # Injected into web pages
├── popup/
│   ├── popup.html            # Popup UI structure
│   ├── popup.js              # Popup logic
│   └── popup.css             # Popup styling
├── icons/                     # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── utils/
    ├── phone-parser.js       # Phone number parsing
    └── websocket-client.js   # WebSocket wrapper
```

## 🔍 Key Decisions

### Decision 1: Manifest V3 vs V2
**Choice**: Manifest V3  
**Reason**: V2 is deprecated, V3 is the future  
**Trade-off**: More complex (Service Workers vs Background Pages)

### Decision 2: WebSocket vs HTTP Polling
**Choice**: WebSocket  
**Reason**: Real-time, low latency, persistent connection  
**Trade-off**: More complex server, connection management

### Decision 3: Content Script vs Page Action
**Choice**: Content Script on all pages  
**Reason**: Works everywhere, no manual activation  
**Trade-off**: Slightly more resource usage

### Decision 4: Node.js vs Laravel for WebSocket
**Choice**: Separate Node.js server  
**Reason**: Better WebSocket support, simpler to deploy  
**Trade-off**: Additional server to maintain

## 🎯 Performance Patterns

### Pattern 1: Event Delegation
Use single listener at document level instead of per-link.

```javascript
// Good: One listener
document.addEventListener('click', handleClick);

// Bad: Listener per link
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
  link.addEventListener('click', handleClick);
});
```

### Pattern 2: Debouncing
Prevent duplicate sends if user double-clicks.

```javascript
let lastSent = 0;
function sendIfNotRecent(number) {
  const now = Date.now();
  if (now - lastSent > 1000) {
    sendToWebSocket(number);
    lastSent = now;
  }
}
```

### Pattern 3: Lazy Loading
Only connect WebSocket when first number is captured (optional optimization).

```javascript
let wsReady = false;
function ensureConnected() {
  if (!wsReady) {
    connectWebSocket();
    wsReady = true;
  }
}
```

