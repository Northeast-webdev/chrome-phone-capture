/**
 * Content Script - Phone Dialer Extension
 * Intercepts clicks on tel: links and captures phone numbers
 */

console.log('[PhoneDialer] Content script loaded');

// Track last sent number to prevent duplicates
let lastSentNumber = null;
let lastSentTime = 0;

/**
 * Extract and normalize phone number from tel: link
 * @param {string} telHref - The href attribute (e.g., "tel:+390445123456")
 * @returns {string} - Normalized phone number
 */
function parsePhoneNumber(telHref) {
  // Remove "tel:" prefix
  let number = telHref.replace(/^tel:/, '');
  
  // Remove spaces, dashes, dots, parentheses
  number = number.replace(/[\s\-\.\(\)]/g, '');
  
  // Ensure it starts with +
  if (!number.startsWith('+')) {
    // If it doesn't have +, assume it starts with country code
    number = '+' + number;
  }
  
  return number;
}

/**
 * Check if enough time has passed since last send (debouncing)
 * @param {string} number - Phone number to check
 * @returns {boolean} - True if OK to send
 */
function shouldSendNumber(number) {
  const now = Date.now();
  const timeSinceLastSend = now - lastSentTime;
  
  // Prevent duplicate sends within 2 seconds
  if (number === lastSentNumber && timeSinceLastSend < 2000) {
    console.log('[PhoneDialer] Duplicate number, ignoring');
    return false;
  }
  
  return true;
}

/**
 * Send phone number to background script
 * @param {string} number - Normalized phone number
 * @param {string} linkText - Text content of the link
 */
function sendToBackground(number, linkText) {
  if (!shouldSendNumber(number)) {
    return;
  }
  
  // Update tracking
  lastSentNumber = number;
  lastSentTime = Date.now();
  
  // Check if extension context is valid
  if (!chrome.runtime || !chrome.runtime.id) {
    console.error('[PhoneDialer] Extension context invalidated - please reload the page');
    return;
  }
  
  // Send message to background worker
  try {
    chrome.runtime.sendMessage({
      type: 'PHONE_CAPTURED',
      number: number,
      linkText: linkText,
      url: window.location.href,
      timestamp: Date.now()
    }, (response) => {
      if (chrome.runtime.lastError) {
        console.error('[PhoneDialer] Error sending message:', chrome.runtime.lastError);
      } else {
        console.log('[PhoneDialer] Number sent successfully:', response);
      }
    });
  } catch (error) {
    console.error('[PhoneDialer] Exception sending message:', error);
  }
}

/**
 * Handle click on tel: link
 * @param {Event} event - Click event
 */
function handleTelLinkClick(event) {
  const target = event.target.closest('a[href^="tel:"]');
  
  if (!target) {
    return;
  }
  
  // Don't prevent default - let the tel: link work normally
  // This ensures the first click always works (service worker might be asleep)
  
  const telHref = target.getAttribute('href');
  const linkText = target.textContent.trim();
  
  console.log('[PhoneDialer] Tel link clicked:', telHref);
  
  try {
    const phoneNumber = parsePhoneNumber(telHref);
    console.log('[PhoneDialer] Parsed number:', phoneNumber);
    
    sendToBackground(phoneNumber, linkText);
  } catch (error) {
    console.error('[PhoneDialer] Error parsing phone number:', error);
  }
}

/**
 * Add visual indicator to tel: links (optional)
 */
function addVisualIndicators() {
  const telLinks = document.querySelectorAll('a[href^="tel:"]');
  
  telLinks.forEach(link => {
    // Add a small indicator icon or style
    if (!link.hasAttribute('data-phoneDialer')) {
      link.setAttribute('data-phoneDialer', 'true');
      link.style.cursor = 'pointer';
      // Could add a small icon here if desired
    }
  });
}

// Listen for clicks on the entire document (event delegation)
document.addEventListener('click', handleTelLinkClick, true);

// Add visual indicators on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', addVisualIndicators);
} else {
  addVisualIndicators();
}

// Re-scan for new tel: links added dynamically (for SPAs)
const observer = new MutationObserver(() => {
  addVisualIndicators();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

console.log('[PhoneDialer] Content script ready');

