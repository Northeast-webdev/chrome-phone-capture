/**
 * WebSocket Server for Phone Dialer Extension
 * Relays phone numbers from Chrome Extension to Android App
 */

const WebSocket = require('ws');

// Configuration
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

// Create WebSocket server
const wss = new WebSocket.Server({ 
  port: PORT,
  host: HOST
});

// Track connected clients
const clients = new Set();
let clientIdCounter = 0;

// Statistics
const stats = {
  startTime: Date.now(),
  totalConnections: 0,
  totalMessages: 0,
  totalPhoneNumbers: 0
};

/**
 * Broadcast message to all connected clients except sender
 */
function broadcast(message, senderWs = null) {
  const data = typeof message === 'string' ? message : JSON.stringify(message);
  
  clients.forEach(client => {
    if (client.ws !== senderWs && client.ws.readyState === WebSocket.OPEN) {
      try {
        client.ws.send(data);
        console.log(`[Server] Broadcasted to client ${client.id}`);
      } catch (error) {
        console.error(`[Server] Error broadcasting to client ${client.id}:`, error.message);
      }
    }
  });
}

/**
 * Send message to specific client
 */
function sendToClient(client, message) {
  if (client.ws.readyState === WebSocket.OPEN) {
    const data = typeof message === 'string' ? message : JSON.stringify(message);
    try {
      client.ws.send(data);
    } catch (error) {
      console.error(`[Server] Error sending to client ${client.id}:`, error.message);
    }
  }
}

/**
 * Handle new WebSocket connection
 */
wss.on('connection', (ws, req) => {
  // Create client info
  const clientId = ++clientIdCounter;
  const clientInfo = {
    id: clientId,
    ws: ws,
    connectedAt: Date.now(),
    ip: req.socket.remoteAddress,
    userAgent: req.headers['user-agent'],
    type: 'unknown' // chrome-extension or android-app
  };
  
  clients.add(clientInfo);
  stats.totalConnections++;
  
  console.log(`\n[Server] ✅ Client ${clientId} connected`);
  console.log(`[Server] IP: ${clientInfo.ip}`);
  console.log(`[Server] Total clients: ${clients.size}`);
  
  // Send welcome message
  sendToClient(clientInfo, {
    type: 'CONNECTED',
    clientId: clientId,
    serverTime: Date.now(),
    message: 'Connected to Phone Dialer WebSocket server'
  });
  
  /**
   * Handle incoming messages
   */
  ws.on('message', (data) => {
    stats.totalMessages++;
    
    try {
      const message = JSON.parse(data.toString());
      console.log(`\n[Server] 📨 Message from client ${clientId}:`, message.type);
      
      // Handle different message types
      switch (message.type) {
        case 'HANDSHAKE':
          // Client identifying itself
          clientInfo.type = message.client || 'unknown';
          console.log(`[Server] Client ${clientId} identified as: ${clientInfo.type}`);
          
          sendToClient(clientInfo, {
            type: 'HANDSHAKE_ACK',
            serverId: 'phone-dialer-server-1',
            timestamp: Date.now()
          });
          break;
        
        case 'CALL_REQUEST':
          // Phone number captured, broadcast to all clients (especially Android app)
          stats.totalPhoneNumbers++;
          console.log(`[Server] 📞 PHONE NUMBER: ${message.number}`);
          console.log(`[Server] Source: ${message.source}`);
          console.log(`[Server] Broadcasting to ${clients.size - 1} other clients...`);
          
          // Broadcast to all other clients
          broadcast({
            type: 'CALL_REQUEST',
            number: message.number,
            source: message.source,
            linkText: message.linkText,
            timestamp: message.timestamp,
            fromClientId: clientId
          }, ws);
          
          // Confirm receipt to sender
          sendToClient(clientInfo, {
            type: 'ACK',
            originalType: 'CALL_REQUEST',
            status: 'broadcasted',
            timestamp: Date.now()
          });
          break;
        
        case 'PING':
          // Health check
          sendToClient(clientInfo, {
            type: 'PONG',
            timestamp: Date.now()
          });
          break;
        
        case 'GET_STATS':
          // Request server statistics
          sendToClient(clientInfo, {
            type: 'STATS',
            stats: {
              ...stats,
              uptime: Date.now() - stats.startTime,
              activeClients: clients.size
            },
            timestamp: Date.now()
          });
          break;
        
        default:
          console.log(`[Server] ⚠️ Unknown message type: ${message.type}`);
          sendToClient(clientInfo, {
            type: 'ERROR',
            message: 'Unknown message type',
            timestamp: Date.now()
          });
      }
      
    } catch (error) {
      console.error(`[Server] ❌ Error parsing message from client ${clientId}:`, error.message);
      console.error('[Server] Raw data:', data.toString());
      
      sendToClient(clientInfo, {
        type: 'ERROR',
        message: 'Invalid message format',
        error: error.message,
        timestamp: Date.now()
      });
    }
  });
  
  /**
   * Handle connection close
   */
  ws.on('close', (code, reason) => {
    clients.delete(clientInfo);
    console.log(`\n[Server] ❌ Client ${clientId} disconnected`);
    console.log(`[Server] Code: ${code}, Reason: ${reason || 'None'}`);
    console.log(`[Server] Total clients: ${clients.size}`);
  });
  
  /**
   * Handle errors
   */
  ws.on('error', (error) => {
    console.error(`[Server] ⚠️ Error with client ${clientId}:`, error.message);
  });
});

/**
 * Server started
 */
wss.on('listening', () => {
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║   📞 Phone Dialer WebSocket Server                    ║');
  console.log('╠════════════════════════════════════════════════════════╣');
  console.log(`║   🌐 Server running on: ws://${HOST}:${PORT}           ║`);
  console.log(`║   🕐 Started at: ${new Date().toLocaleString()}     ║`);
  console.log('║   ✅ Ready to accept connections                      ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log('[Server] Waiting for clients...\n');
});

/**
 * Handle server errors
 */
wss.on('error', (error) => {
  console.error('\n[Server] ❌ Server error:', error.message);
  console.error('[Server] Stack:', error.stack);
});

/**
 * Graceful shutdown
 */
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

function shutdown() {
  console.log('\n[Server] 🛑 Shutting down gracefully...');
  
  // Notify all clients
  clients.forEach(client => {
    sendToClient(client, {
      type: 'SERVER_SHUTDOWN',
      message: 'Server is shutting down',
      timestamp: Date.now()
    });
  });
  
  // Close server
  wss.close(() => {
    console.log('[Server] ✅ Server closed successfully');
    console.log('[Server] Statistics:');
    console.log(`  - Total connections: ${stats.totalConnections}`);
    console.log(`  - Total messages: ${stats.totalMessages}`);
    console.log(`  - Total phone numbers: ${stats.totalPhoneNumbers}`);
    console.log(`  - Uptime: ${Math.floor((Date.now() - stats.startTime) / 1000)}s`);
    process.exit(0);
  });
  
  // Force exit after 5 seconds
  setTimeout(() => {
    console.error('[Server] ⚠️ Forced shutdown after timeout');
    process.exit(1);
  }, 5000);
}

/**
 * Display stats periodically (optional)
 */
if (process.env.SHOW_STATS === 'true') {
  setInterval(() => {
    console.log('\n[Server] 📊 Current Stats:');
    console.log(`  - Active clients: ${clients.size}`);
    console.log(`  - Total messages: ${stats.totalMessages}`);
    console.log(`  - Phone numbers sent: ${stats.totalPhoneNumbers}`);
    console.log(`  - Uptime: ${Math.floor((Date.now() - stats.startTime) / 1000)}s\n`);
  }, 60000); // Every minute
}

