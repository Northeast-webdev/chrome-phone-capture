# 📡 WebSocket Server - Phone Dialer Extension

Simple WebSocket server that relays phone numbers from Chrome Extension to Android App.

## 🚀 Quick Start

### Install Dependencies

```bash
npm install
```

### Start Server

```bash
npm start
```

Server will run on `ws://localhost:3000`

### Development Mode (Auto-reload)

```bash
npm run dev
```

## 📋 Requirements

- Node.js 18+ 
- npm or yarn

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
HOST=0.0.0.0
SHOW_STATS=false
```

Or pass via command line:

```bash
PORT=8080 npm start
```

## 📊 Features

- ✅ WebSocket server (RFC 6455 compliant)
- ✅ Multiple client support
- ✅ Message broadcasting
- ✅ Client identification (Chrome Extension vs Android App)
- ✅ Connection tracking and statistics
- ✅ Error handling and logging
- ✅ Graceful shutdown
- ✅ Health check (PING/PONG)

## 📡 Message Protocol

### Client → Server

#### HANDSHAKE
Client identifies itself:
```json
{
  "type": "HANDSHAKE",
  "client": "chrome-extension",
  "version": "1.0.0",
  "timestamp": 1699876543210
}
```

#### CALL_REQUEST
Phone number captured:
```json
{
  "type": "CALL_REQUEST",
  "number": "+390445123456",
  "source": "https://example.com",
  "linkText": "Call Us",
  "timestamp": 1699876543210
}
```

#### PING
Health check:
```json
{
  "type": "PING",
  "timestamp": 1699876543210
}
```

### Server → Client

#### CONNECTED
Welcome message:
```json
{
  "type": "CONNECTED",
  "clientId": 1,
  "serverTime": 1699876543210,
  "message": "Connected to Phone Dialer WebSocket server"
}
```

#### CALL_REQUEST (Broadcast)
Forwarded phone number:
```json
{
  "type": "CALL_REQUEST",
  "number": "+390445123456",
  "source": "https://example.com",
  "linkText": "Call Us",
  "timestamp": 1699876543210,
  "fromClientId": 1
}
```

#### PONG
Health check response:
```json
{
  "type": "PONG",
  "timestamp": 1699876543210
}
```

#### ERROR
Error occurred:
```json
{
  "type": "ERROR",
  "message": "Invalid message format",
  "timestamp": 1699876543210
}
```

## 🧪 Testing

### Test with wscat (CLI WebSocket client)

Install:
```bash
npm install -g wscat
```

Connect and send message:
```bash
wscat -c ws://localhost:3000

# After connected, send:
{"type":"HANDSHAKE","client":"test","version":"1.0.0","timestamp":1699876543210}

{"type":"CALL_REQUEST","number":"+390445123456","source":"test","timestamp":1699876543210}
```

### Test with Browser Console

```javascript
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected!');
  ws.send(JSON.stringify({
    type: 'HANDSHAKE',
    client: 'browser-test',
    version: '1.0.0',
    timestamp: Date.now()
  }));
};

ws.onmessage = (event) => {
  console.log('Received:', JSON.parse(event.data));
};

// Send phone number
ws.send(JSON.stringify({
  type: 'CALL_REQUEST',
  number: '+390445123456',
  source: 'test',
  timestamp: Date.now()
}));
```

## 📈 Monitoring

### Console Output

Server logs all events:
- Client connections/disconnections
- Messages received
- Phone numbers captured
- Errors

### Statistics

Request stats:
```javascript
// Send from client
{
  "type": "GET_STATS"
}

// Receive from server
{
  "type": "STATS",
  "stats": {
    "startTime": 1699876543210,
    "totalConnections": 5,
    "totalMessages": 120,
    "totalPhoneNumbers": 45,
    "uptime": 3600000,
    "activeClients": 2
  }
}
```

## 🚢 Deployment

### Local Development
```bash
npm start
```
Access at `ws://localhost:3000`

### Production (Render, Railway, etc.)

1. **Push to Git**
2. **Deploy as Web Service**
3. **Set Environment Variables**:
   - `PORT` (provided by platform)
   - `HOST=0.0.0.0`
4. **Use WSS (secure WebSocket)** with SSL certificate

### Example: Deploy to Render

1. Create new Web Service
2. Connect GitHub repo
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Add Environment Variables
6. Deploy!

Access at `wss://your-app.onrender.com`

## 🔒 Security

### MVP (Current)
- ⚠️ No authentication
- ⚠️ Open to all connections
- ⚠️ Use only for testing on localhost

### Production (TODO)
- ✅ Add JWT authentication
- ✅ Rate limiting
- ✅ WSS (encrypted WebSocket)
- ✅ CORS policies
- ✅ Input validation

## 🐛 Troubleshooting

### Server won't start

**Error**: `EADDRINUSE`
**Solution**: Port 3000 already in use. Change port:
```bash
PORT=3001 npm start
```

### Clients can't connect

**Check**:
1. Server is running
2. Firewall allows connections
3. Correct URL (ws://localhost:3000)
4. Chrome extension has correct server URL

### Messages not received

**Check**:
1. Message format is valid JSON
2. Required fields are present
3. WebSocket connection is open
4. Check server console for errors

## 📚 Further Reading

- [WebSocket RFC 6455](https://datatracker.ietf.org/doc/html/rfc6455)
- [ws Library Docs](https://github.com/websockets/ws)
- [Chrome Extension WebSocket](https://developer.chrome.com/docs/extensions/reference/sockets/)

## 📝 License

MIT

## 👥 Support

For issues, check server console logs and Chrome extension console.

