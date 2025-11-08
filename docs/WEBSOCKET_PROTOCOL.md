# 📡 WebSocket Protocol Specification

Complete specification of the WebSocket message protocol for the Phone Dialer Extension system.

---

## 🎯 Overview

This document defines the message protocol used between:
- **Chrome Extension** ↔ **WebSocket Server**
- **WebSocket Server** ↔ **Android App** (future)

**Protocol Version**: 1.0.0  
**WebSocket Standard**: RFC 6455  
**Message Format**: JSON

---

## 🔌 Connection

### Server URL

**Development**:
```
ws://localhost:3000
```

**Production** (future):
```
wss://your-domain.com
```

### Connection Flow

```
Client (Extension/App)
    ↓
Opens WebSocket connection
    ↓
Server accepts connection
    ↓
Server sends CONNECTED message
    ↓
Client sends HANDSHAKE message
    ↓
Server acknowledges with HANDSHAKE_ACK
    ↓
Connection established ✓
    ↓
Ready to exchange messages
```

---

## 📨 Message Types

### Client → Server

#### 1. HANDSHAKE
Client identifies itself to the server.

**When**: Immediately after connection established  
**Required**: Yes  
**Response**: HANDSHAKE_ACK

**Format**:
```json
{
  "type": "HANDSHAKE",
  "client": "chrome-extension",
  "version": "1.0.0",
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string, required): Always "HANDSHAKE"
- `client` (string, required): Client identifier
  - `"chrome-extension"` for Chrome Extension
  - `"android-app"` for Android App
  - `"test"` for testing clients
- `version` (string, required): Protocol version (e.g., "1.0.0")
- `timestamp` (number, required): Unix timestamp in milliseconds

---

#### 2. CALL_REQUEST
Phone number captured and ready to dial.

**When**: User clicks tel: link in browser  
**Required**: Yes  
**Response**: ACK

**Format**:
```json
{
  "type": "CALL_REQUEST",
  "number": "+390445123456",
  "source": "https://example.com/contact",
  "linkText": "Call Us Now",
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string, required): Always "CALL_REQUEST"
- `number` (string, required): Normalized phone number
  - Format: International format with + (e.g., "+390445123456")
  - No spaces, dashes, or parentheses
  - Only digits after the +
- `source` (string, required): URL where number was captured
- `linkText` (string, optional): Text content of the tel: link
- `timestamp` (number, required): Unix timestamp in milliseconds

**Example with all fields**:
```json
{
  "type": "CALL_REQUEST",
  "number": "+12125551234",
  "source": "https://company.com/contact-us",
  "linkText": "Call our office",
  "timestamp": 1699876543210
}
```

---

#### 3. PING
Health check / keep-alive message.

**When**: Periodically or on demand  
**Required**: No  
**Response**: PONG

**Format**:
```json
{
  "type": "PING",
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string, required): Always "PING"
- `timestamp` (number, required): Unix timestamp in milliseconds

---

#### 4. GET_STATS
Request server statistics.

**When**: On demand (for monitoring)  
**Required**: No  
**Response**: STATS

**Format**:
```json
{
  "type": "GET_STATS"
}
```

**Fields**:
- `type` (string, required): Always "GET_STATS"

---

### Server → Client

#### 1. CONNECTED
Welcome message sent immediately after connection.

**When**: Immediately after WebSocket connection opens  
**Broadcast**: No (sent only to connecting client)

**Format**:
```json
{
  "type": "CONNECTED",
  "clientId": 1,
  "serverTime": 1699876543210,
  "message": "Connected to Phone Dialer WebSocket server"
}
```

**Fields**:
- `type` (string): Always "CONNECTED"
- `clientId` (number): Unique identifier assigned to this client
- `serverTime` (number): Server's current Unix timestamp
- `message` (string): Welcome message

---

#### 2. HANDSHAKE_ACK
Acknowledgment of client handshake.

**When**: In response to HANDSHAKE  
**Broadcast**: No

**Format**:
```json
{
  "type": "HANDSHAKE_ACK",
  "serverId": "phone-dialer-server-1",
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string): Always "HANDSHAKE_ACK"
- `serverId` (string): Server identifier
- `timestamp` (number): Server timestamp

---

#### 3. CALL_REQUEST (Broadcast)
Phone number broadcasted to all clients (especially Android App).

**When**: After receiving CALL_REQUEST from Chrome Extension  
**Broadcast**: Yes (to all clients except sender)

**Format**:
```json
{
  "type": "CALL_REQUEST",
  "number": "+390445123456",
  "source": "https://example.com/contact",
  "linkText": "Call Us Now",
  "timestamp": 1699876543210,
  "fromClientId": 1
}
```

**Fields**:
- `type` (string): Always "CALL_REQUEST"
- `number` (string): Normalized phone number (same as received)
- `source` (string): URL where number was captured
- `linkText` (string): Text content of the link
- `timestamp` (number): Original timestamp from sender
- `fromClientId` (number): Client ID that sent the request

**Android App Action**:
When receiving this message, Android app should:
1. Parse the `number` field
2. Open the phone dialer
3. Pre-fill with the phone number
4. User can then press "Call"

---

#### 4. ACK
Acknowledgment of successful message receipt.

**When**: After processing certain messages (CALL_REQUEST, etc.)  
**Broadcast**: No

**Format**:
```json
{
  "type": "ACK",
  "originalType": "CALL_REQUEST",
  "status": "broadcasted",
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string): Always "ACK"
- `originalType` (string): Type of message being acknowledged
- `status` (string): Processing status
  - `"received"`: Message received
  - `"broadcasted"`: Message sent to other clients
  - `"processed"`: Message processed successfully
- `timestamp` (number): Server timestamp

---

#### 5. PONG
Response to PING health check.

**When**: In response to PING  
**Broadcast**: No

**Format**:
```json
{
  "type": "PONG",
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string): Always "PONG"
- `timestamp` (number): Server timestamp

---

#### 6. STATS
Server statistics.

**When**: In response to GET_STATS  
**Broadcast**: No

**Format**:
```json
{
  "type": "STATS",
  "stats": {
    "startTime": 1699870000000,
    "totalConnections": 15,
    "totalMessages": 342,
    "totalPhoneNumbers": 127,
    "uptime": 6543210,
    "activeClients": 2
  },
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string): Always "STATS"
- `stats` (object): Statistics object
  - `startTime` (number): Server start timestamp
  - `totalConnections` (number): Total connections since start
  - `totalMessages` (number): Total messages processed
  - `totalPhoneNumbers` (number): Total CALL_REQUEST messages
  - `uptime` (number): Milliseconds since server start
  - `activeClients` (number): Currently connected clients
- `timestamp` (number): Server timestamp

---

#### 7. ERROR
Error occurred during message processing.

**When**: When message is invalid or error occurs  
**Broadcast**: No

**Format**:
```json
{
  "type": "ERROR",
  "message": "Invalid message format",
  "error": "SyntaxError: Unexpected token",
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string): Always "ERROR"
- `message` (string): Human-readable error message
- `error` (string, optional): Technical error details
- `timestamp` (number): Server timestamp

**Common Errors**:
- `"Invalid message format"`: JSON parse error
- `"Unknown message type"`: Unrecognized type field
- `"Missing required field"`: Required field not present
- `"Invalid phone number format"`: Number field is malformed

---

#### 8. SERVER_SHUTDOWN
Server is shutting down gracefully.

**When**: Server is stopping  
**Broadcast**: Yes (to all clients)

**Format**:
```json
{
  "type": "SERVER_SHUTDOWN",
  "message": "Server is shutting down",
  "timestamp": 1699876543210
}
```

**Fields**:
- `type` (string): Always "SERVER_SHUTDOWN"
- `message` (string): Shutdown reason
- `timestamp` (number): Server timestamp

**Client Action**:
- Close connection gracefully
- Attempt to reconnect after delay

---

## 📋 Message Sequence Examples

### Example 1: Successful Phone Number Capture

```
Chrome Extension              Server              Android App
      |                         |                      |
      |--- HANDSHAKE ---------->|                      |
      |<-- HANDSHAKE_ACK -------|                      |
      |                         |<--- HANDSHAKE -------|
      |                         |--- HANDSHAKE_ACK --->|
      |                         |                      |
[User clicks tel: link]         |                      |
      |                         |                      |
      |--- CALL_REQUEST ------->|                      |
      |<-- ACK -----------------|                      |
      |                         |--- CALL_REQUEST ---->|
      |                         |                   [Opens dialer]
      |                         |                      |
```

### Example 2: Health Check

```
Extension                     Server
    |                           |
    |--- PING ----------------->|
    |<-- PONG ------------------|
    |                           |
```

### Example 3: Error Handling

```
Extension                     Server
    |                           |
    |--- {invalid json} ------->|
    |<-- ERROR -----------------|
    |                           |
```

---

## 🔧 Phone Number Format

### Input Format (from tel: links)
Any of these formats:
```
tel:+390445123456
tel:045 123 456
tel:(045) 123-456
tel:+39-045-123-456
tel:333 1234567
```

### Normalized Output Format
Always send in international format:
```
+390445123456
```

**Rules**:
1. Always starts with `+`
2. Only digits after `+`
3. No spaces, dashes, parentheses
4. International country code included

**Normalization Process**:
```javascript
// Remove "tel:" prefix
number = number.replace(/^tel:/, '');

// Remove formatting characters
number = number.replace(/[\s\-\.\(\)]/g, '');

// Ensure starts with +
if (!number.startsWith('+')) {
  number = '+' + number;
}

// Result: "+390445123456"
```

---

## 🔒 Security Considerations

### MVP (Current - No Auth)
- ⚠️ Any client can connect
- ⚠️ No message encryption (use localhost only)
- ⚠️ No rate limiting
- ⚠️ No user tracking

**Use only for development/testing on localhost!**

### Production (Phase 2 - With Auth)

#### Authentication Flow
```json
// 1. Client connects with token
{
  "type": "HANDSHAKE",
  "client": "chrome-extension",
  "version": "1.0.0",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "timestamp": 1699876543210
}

// 2. Server validates token
// 3. If valid, sends HANDSHAKE_ACK
// 4. If invalid, sends ERROR and closes connection
```

#### Security Features (TODO)
- ✅ JWT token authentication
- ✅ WSS (WebSocket Secure) over TLS
- ✅ Rate limiting (max messages per minute)
- ✅ User session tracking
- ✅ Message validation
- ✅ IP filtering/whitelisting

---

## 🧪 Testing the Protocol

### Test with JavaScript (Browser Console)

```javascript
// Connect to server
const ws = new WebSocket('ws://localhost:3000');

// Connection opened
ws.onopen = () => {
  console.log('Connected!');
  
  // Send handshake
  ws.send(JSON.stringify({
    type: 'HANDSHAKE',
    client: 'test-client',
    version: '1.0.0',
    timestamp: Date.now()
  }));
};

// Receive messages
ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('Received:', message);
};

// Send phone number
ws.send(JSON.stringify({
  type: 'CALL_REQUEST',
  number: '+390445123456',
  source: 'test',
  timestamp: Date.now()
}));

// Send ping
ws.send(JSON.stringify({
  type: 'PING',
  timestamp: Date.now()
}));
```

### Test with wscat (CLI tool)

```bash
# Install
npm install -g wscat

# Connect
wscat -c ws://localhost:3000

# Send messages (paste after connected)
{"type":"HANDSHAKE","client":"test","version":"1.0.0","timestamp":1699876543210}
{"type":"CALL_REQUEST","number":"+390445123456","source":"test","timestamp":1699876543210}
{"type":"PING","timestamp":1699876543210}
```

---

## 📊 Message Validation

### Required Fields by Type

| Type | Required Fields |
|------|----------------|
| HANDSHAKE | type, client, version, timestamp |
| CALL_REQUEST | type, number, source, timestamp |
| PING | type, timestamp |
| GET_STATS | type |

### Field Types

| Field | Type | Format |
|-------|------|--------|
| type | string | Uppercase with underscores |
| number | string | International format (+digits) |
| timestamp | number | Unix timestamp (milliseconds) |
| client | string | Kebab-case identifier |
| version | string | Semantic versioning (x.y.z) |

---

## 🔄 Connection Management

### Reconnection Strategy (Client)

```javascript
let reconnectAttempts = 0;
const MAX_ATTEMPTS = 10;

function connect() {
  ws = new WebSocket('ws://localhost:3000');
  
  ws.onclose = () => {
    if (reconnectAttempts < MAX_ATTEMPTS) {
      reconnectAttempts++;
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      setTimeout(connect, delay);
    }
  };
  
  ws.onopen = () => {
    reconnectAttempts = 0;  // Reset on successful connection
  };
}
```

### Heartbeat / Keep-Alive

Send PING every 30 seconds to keep connection alive:

```javascript
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'PING',
      timestamp: Date.now()
    }));
  }
}, 30000);
```

---

## 📝 Protocol Versioning

**Current Version**: 1.0.0

### Version Compatibility

| Protocol Version | Extension Version | Server Version |
|-----------------|-------------------|----------------|
| 1.0.0 | 1.0.0 | 1.0.0 |

### Breaking Changes

Version 2.0.0 will introduce:
- Authentication (JWT tokens)
- Encrypted messages
- Additional message types
- Field changes

---

## 📚 References

- **WebSocket RFC**: https://datatracker.ietf.org/doc/html/rfc6455
- **JSON Specification**: https://www.json.org/
- **Chrome Extension WebSocket**: https://developer.chrome.com/docs/extensions/reference/sockets/

---

**Last Updated**: November 8, 2025  
**Protocol Version**: 1.0.0  
**Status**: Stable (MVP)

