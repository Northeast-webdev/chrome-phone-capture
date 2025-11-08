/**
 * Background Service Worker - Phone Dialer Extension
 * Manages WebSocket connection and message relay
 */

console.log('[PhoneDialer Background] Service worker started');

// WebSocket connection
let ws = null;
let reconnectAttempts = 0;
let reconnectTimer = null;
const MAX_RECONNECT_ATTEMPTS = 10;

// State
const state = {
  wsConnected: false,
  wsUrl: 'ws://localhost:3000',
  lastNumber: null,
  lastSentAt: null,
  numbersSentToday: 0,
  todayDate: new Date().toDateString()
};

/**
 * Load settings from Chrome storage
 */
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get(['serverUrl', 'numbersSentToday', 'todayDate']);
    
    if (result.serverUrl) {
      state.wsUrl = result.serverUrl;
    }
    
    // Reset daily counter if it's a new day
    const today = new Date().toDateString();
    if (result.todayDate === today) {
      state.numbersSentToday = result.numbersSentToday || 0;
    } else {
      state.numbersSentToday = 0;
      state.todayDate = today;
      await chrome.storage.local.set({ todayDate: today, numbersSentToday: 0 });
    }
    
    console.log('[PhoneDialer Background] Settings loaded:', state);
  } catch (error) {
    console.error('[PhoneDialer Background] Error loading settings:', error);
  }
}

/**
 * Save state to Chrome storage
 */
async function saveState() {
  try {
    await chrome.storage.local.set({
      lastNumber: state.lastNumber,
      lastSentAt: state.lastSentAt,
      numbersSentToday: state.numbersSentToday,
      todayDate: state.todayDate
    });
  } catch (error) {
    console.error('[PhoneDialer Background] Error saving state:', error);
  }
}

/**
 * Update extension icon based on connection status
 */
function updateIcon(connected) {
  const iconName = connected ? 'icon48' : 'icon48'; // Could use different icons
  const title = connected ? 'Phone Dialer - Connected' : 'Phone Dialer - Disconnected';
  
  chrome.action.setTitle({ title });
  
  // Could change badge or icon color here
  if (connected) {
    chrome.action.setBadgeBackgroundColor({ color: '#10b981' }); // Green
    chrome.action.setBadgeText({ text: '✓' });
  } else {
    chrome.action.setBadgeBackgroundColor({ color: '#ef4444' }); // Red
    chrome.action.setBadgeText({ text: '✗' });
  }
}

/**
 * Connect to WebSocket server
 */
function connectWebSocket() {
  if (ws && (ws.readyState === WebSocket.CONNECTING || ws.readyState === WebSocket.OPEN)) {
    console.log('[PhoneDialer Background] Already connected or connecting');
    return;
  }
  
  console.log(`[PhoneDialer Background] Connecting to ${state.wsUrl}...`);
  
  try {
    ws = new WebSocket(state.wsUrl);
    
    ws.onopen = () => {
      console.log('[PhoneDialer Background] WebSocket connected!');
      state.wsConnected = true;
      reconnectAttempts = 0;
      updateIcon(true);
      
      // Send initial handshake
      ws.send(JSON.stringify({
        type: 'HANDSHAKE',
        client: 'chrome-extension',
        version: '1.0.0',
        timestamp: Date.now()
      }));
    };
    
    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('[PhoneDialer Background] Message received:', message);
        
        // Handle different message types from server
        if (message.type === 'PONG') {
          console.log('[PhoneDialer Background] Pong received');
        }
      } catch (error) {
        console.error('[PhoneDialer Background] Error parsing message:', error);
      }
    };
    
    ws.onerror = (error) => {
      console.error('[PhoneDialer Background] WebSocket error:', error);
      state.wsConnected = false;
      updateIcon(false);
    };
    
    ws.onclose = () => {
      console.log('[PhoneDialer Background] WebSocket disconnected');
      state.wsConnected = false;
      updateIcon(false);
      
      // Attempt to reconnect
      if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++;
        const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
        console.log(`[PhoneDialer Background] Reconnecting in ${delay}ms (attempt ${reconnectAttempts})`);
        
        reconnectTimer = setTimeout(() => {
          connectWebSocket();
        }, delay);
      } else {
        console.error('[PhoneDialer Background] Max reconnect attempts reached');
        showNotification('Errore', 'Connessione al server persa. Riavviare l\'estensione.', 'error');
      }
    };
  } catch (error) {
    console.error('[PhoneDialer Background] Error creating WebSocket:', error);
    state.wsConnected = false;
    updateIcon(false);
  }
}

/**
 * Send phone number to WebSocket server
 */
function sendPhoneNumber(data) {
  if (!ws || ws.readyState !== WebSocket.OPEN) {
    console.error('[PhoneDialer Background] WebSocket not connected');
    showNotification('Errore', 'Server non connesso', 'error');
    
    // Try to reconnect
    connectWebSocket();
    return false;
  }
  
  const message = {
    type: 'CALL_REQUEST',
    number: data.number,
    source: data.url,
    linkText: data.linkText,
    timestamp: data.timestamp
  };
  
  try {
    ws.send(JSON.stringify(message));
    console.log('[PhoneDialer Background] Phone number sent:', message);
    
    // Update state
    state.lastNumber = data.number;
    state.lastSentAt = data.timestamp;
    state.numbersSentToday++;
    
    // Save to storage
    saveState();
    
    // Show success notification
    showNotification(
      'Numero Inviato', 
      `${data.number}\nInviato al telefono`,
      'success'
    );
    
    return true;
  } catch (error) {
    console.error('[PhoneDialer Background] Error sending message:', error);
    showNotification('Errore', 'Errore durante l\'invio', 'error');
    return false;
  }
}

/**
 * Show Chrome notification
 */
function showNotification(title, message, type = 'basic') {
  // Don't specify iconUrl since we don't have icons (Chrome will use default)
  chrome.notifications.create({
    type: 'basic',
    title: title,
    message: message,
    priority: 2
  }).catch(error => {
    console.error('[PhoneDialer Background] Notification error:', error);
  });
}

/**
 * Handle messages from content scripts and popup
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[PhoneDialer Background] Message received:', message);
  
  if (message.type === 'PHONE_CAPTURED') {
    // Phone number captured from content script
    const success = sendPhoneNumber(message);
    sendResponse({ success: success, state: state });
    return true; // Keep message channel open for async response
  }
  
  if (message.type === 'GET_STATUS') {
    // Popup requesting current status
    sendResponse({
      connected: state.wsConnected,
      lastNumber: state.lastNumber,
      lastSentAt: state.lastSentAt,
      numbersSentToday: state.numbersSentToday,
      serverUrl: state.wsUrl
    });
    return true;
  }
  
  if (message.type === 'TEST_CONNECTION') {
    // Popup requesting connection test
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'PING', timestamp: Date.now() }));
      sendResponse({ success: true, message: 'Ping sent' });
    } else {
      sendResponse({ success: false, message: 'Not connected' });
    }
    return true;
  }
  
  if (message.type === 'RECONNECT') {
    // Popup requesting manual reconnect
    connectWebSocket();
    sendResponse({ success: true, message: 'Reconnecting...' });
    return true;
  }
});

/**
 * Initialize on extension install/update
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('[PhoneDialer Background] Extension installed/updated:', details.reason);
  
  if (details.reason === 'install') {
    // First time install
    await chrome.storage.local.set({
      serverUrl: 'ws://localhost:3000',
      numbersSentToday: 0,
      todayDate: new Date().toDateString()
    });
    
    showNotification(
      'Phone Dialer Installato',
      'Clicca su numeri di telefono per inviarli al tuo cellulare',
      'success'
    );
  }
});

/**
 * Initialize on service worker startup
 */
async function initialize() {
  console.log('[PhoneDialer Background] Initializing...');
  await loadSettings();
  connectWebSocket();
}

// Start initialization
initialize();

/**
 * Keep-alive: Send PING every 25 seconds to keep WebSocket and service worker active
 */
setInterval(() => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({
      type: 'PING',
      timestamp: Date.now()
    }));
    console.log('[PhoneDialer Background] Keep-alive PING sent');
  }
}, 25000); // Every 25 seconds

console.log('[PhoneDialer Background] Service worker ready');

