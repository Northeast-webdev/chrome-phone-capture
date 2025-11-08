/**
 * Popup Script - Phone Dialer Extension
 * Displays status and statistics
 */

console.log('[PhoneDialer Popup] Loading...');

// DOM elements
let statusDot, statusText, serverUrl, lastNumber, lastTime, todayCount, testBtn, reconnectBtn;

/**
 * Initialize DOM references
 */
function initializeDOMRefs() {
  statusDot = document.getElementById('statusDot');
  statusText = document.getElementById('statusText');
  serverUrl = document.getElementById('serverUrl');
  lastNumber = document.getElementById('lastNumber');
  lastTime = document.getElementById('lastTime');
  todayCount = document.getElementById('todayCount');
  testBtn = document.getElementById('testBtn');
  reconnectBtn = document.getElementById('reconnectBtn');
}

/**
 * Format timestamp to relative time
 */
function formatRelativeTime(timestamp) {
  if (!timestamp) return 'Mai inviato';
  
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (seconds < 60) return `${seconds} secondi fa`;
  if (minutes < 60) return `${minutes} minut${minutes === 1 ? 'o' : 'i'} fa`;
  if (hours < 24) return `${hours} or${hours === 1 ? 'a' : 'e'} fa`;
  return `${days} giorn${days === 1 ? 'o' : 'i'} fa`;
}

/**
 * Update UI with status data
 */
function updateUI(status) {
  console.log('[PhoneDialer Popup] Updating UI:', status);
  
  // Connection status
  if (status.connected) {
    statusDot.className = 'status-dot connected';
    statusText.textContent = 'Connesso';
  } else {
    statusDot.className = 'status-dot disconnected';
    statusText.textContent = 'Non Connesso';
  }
  
  // Server URL
  if (status.serverUrl) {
    serverUrl.textContent = status.serverUrl;
  }
  
  // Last number sent
  if (status.lastNumber) {
    const numberTextEl = lastNumber.querySelector('.number-text');
    numberTextEl.textContent = status.lastNumber;
    lastTime.textContent = formatRelativeTime(status.lastSentAt);
  } else {
    const numberTextEl = lastNumber.querySelector('.number-text');
    numberTextEl.textContent = '-';
    lastTime.textContent = 'Mai inviato';
  }
  
  // Today's count
  todayCount.textContent = status.numbersSentToday || 0;
}

/**
 * Request status from background worker
 */
async function refreshStatus() {
  try {
    const response = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
    updateUI(response);
  } catch (error) {
    console.error('[PhoneDialer Popup] Error getting status:', error);
    statusDot.className = 'status-dot disconnected';
    statusText.textContent = 'Errore';
  }
}

/**
 * Test connection
 */
async function testConnection() {
  testBtn.disabled = true;
  testBtn.textContent = 'Testing...';
  
  try {
    const response = await chrome.runtime.sendMessage({ type: 'TEST_CONNECTION' });
    
    if (response.success) {
      showTempMessage('Test inviato! Controlla la console del server.');
    } else {
      showTempMessage('Non connesso al server');
    }
  } catch (error) {
    console.error('[PhoneDialer Popup] Error testing connection:', error);
    showTempMessage('Errore durante il test');
  } finally {
    testBtn.disabled = false;
    testBtn.innerHTML = `
      <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
      Test Connessione
    `;
  }
}

/**
 * Reconnect to server
 */
async function reconnect() {
  reconnectBtn.disabled = true;
  reconnectBtn.textContent = 'Connessione...';
  
  try {
    await chrome.runtime.sendMessage({ type: 'RECONNECT' });
    showTempMessage('Tentativo di riconnessione...');
    
    // Refresh status after a delay
    setTimeout(refreshStatus, 2000);
  } catch (error) {
    console.error('[PhoneDialer Popup] Error reconnecting:', error);
    showTempMessage('Errore durante la riconnessione');
  } finally {
    reconnectBtn.disabled = false;
    reconnectBtn.innerHTML = `
      <svg class="btn-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="23 4 23 10 17 10"></polyline>
        <polyline points="1 20 1 14 7 14"></polyline>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
      </svg>
      Riconnetti
    `;
  }
}

/**
 * Show temporary message
 */
function showTempMessage(message) {
  const prevText = statusText.textContent;
  statusText.textContent = message;
  
  setTimeout(() => {
    refreshStatus();
  }, 2000);
}

/**
 * Initialize popup
 */
function initialize() {
  console.log('[PhoneDialer Popup] Initializing...');
  
  initializeDOMRefs();
  
  // Event listeners
  testBtn.addEventListener('click', testConnection);
  reconnectBtn.addEventListener('click', reconnect);
  
  // Initial status refresh
  refreshStatus();
  
  // Auto-refresh every 5 seconds
  setInterval(refreshStatus, 5000);
  
  console.log('[PhoneDialer Popup] Ready');
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

