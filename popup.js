let currentPhoneNumbers = [];

// Get DOM elements
const extractBtn = document.getElementById('extractBtn');
const copyBtn = document.getElementById('copyBtn');
const exportBtn = document.getElementById('exportBtn');
const phoneList = document.getElementById('phoneList');
const countElement = document.getElementById('count');
const emptyState = document.getElementById('emptyState');
const resultsContainer = document.getElementById('resultsContainer');
const statusDiv = document.getElementById('status');

// Extract phone numbers from the current tab
extractBtn.addEventListener('click', async () => {
  try {
    // Show loading state
    showStatus('Extracting phone numbers...', 'info');
    
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Execute the content script to extract phone numbers
    const results = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: extractPhoneNumbers
    });
    
    const phoneNumbers = results[0].result;
    
    if (phoneNumbers.length > 0) {
      currentPhoneNumbers = phoneNumbers;
      displayPhoneNumbers(phoneNumbers);
      showStatus(`Successfully extracted ${phoneNumbers.length} phone number(s)`, 'success');
      
      // Enable action buttons
      copyBtn.disabled = false;
      exportBtn.disabled = false;
    } else {
      currentPhoneNumbers = [];
      showEmptyState();
      showStatus('No phone numbers found on this page', 'error');
      
      // Disable action buttons
      copyBtn.disabled = true;
      exportBtn.disabled = true;
    }
  } catch (error) {
    console.error('Error extracting phone numbers:', error);
    showStatus('Error extracting phone numbers. Please try again.', 'error');
  }
});

// Copy all phone numbers to clipboard
copyBtn.addEventListener('click', () => {
  const text = currentPhoneNumbers.join('\n');
  navigator.clipboard.writeText(text).then(() => {
    showStatus('Phone numbers copied to clipboard!', 'success');
  }).catch(err => {
    console.error('Failed to copy:', err);
    showStatus('Failed to copy to clipboard', 'error');
  });
});

// Export phone numbers as CSV
exportBtn.addEventListener('click', () => {
  const csv = 'Phone Number\n' + currentPhoneNumbers.join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `phone-numbers-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showStatus('CSV file downloaded!', 'success');
});

// Display phone numbers in the list
function displayPhoneNumbers(phoneNumbers) {
  emptyState.classList.add('hidden');
  resultsContainer.classList.remove('hidden');
  
  phoneList.innerHTML = '';
  countElement.textContent = phoneNumbers.length;
  
  phoneNumbers.forEach(number => {
    const li = document.createElement('li');
    li.className = 'phone-item';
    li.textContent = number;
    phoneList.appendChild(li);
  });
}

// Show empty state
function showEmptyState() {
  emptyState.classList.remove('hidden');
  resultsContainer.classList.add('hidden');
}

// Show status message
function showStatus(message, type) {
  statusDiv.textContent = message;
  statusDiv.className = 'status';
  
  if (type === 'success') {
    statusDiv.classList.add('status-success');
  } else if (type === 'error') {
    statusDiv.classList.add('status-error');
  }
  
  statusDiv.classList.remove('hidden');
  
  // Hide status after 3 seconds
  setTimeout(() => {
    statusDiv.classList.add('hidden');
  }, 3000);
}

// This function will be injected into the page to extract phone numbers
function extractPhoneNumbers() {
  // Regular expression patterns for different phone number formats
  const patterns = [
    // US/Canada formats
    /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    /\b\(\d{3}\)\s*\d{3}[-.]?\d{4}\b/g,
    /\b1[-.]?\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    /\b\+1[-.]?\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
    
    // International formats
    /\b\+\d{1,3}[-.\s]?\(?\d{1,4}\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}\b/g,
    
    // Generic formats
    /\b\d{3}[-.\s]\d{3}[-.\s]\d{4}\b/g,
    /\b\d{3}[-.\s]\d{4}\b/g
  ];
  
  // Get all text content from the page
  const bodyText = document.body.innerText;
  
  // Extract phone numbers using all patterns
  const phoneNumbers = new Set();
  
  patterns.forEach(pattern => {
    const matches = bodyText.match(pattern);
    if (matches) {
      matches.forEach(match => {
        // Clean up the phone number
        const cleaned = match.trim();
        
        // Filter out common false positives (like dates, times, etc.)
        if (!isFalsePositive(cleaned)) {
          phoneNumbers.add(cleaned);
        }
      });
    }
  });
  
  // Convert Set to Array and sort
  return Array.from(phoneNumbers).sort();
}

// Helper function to filter out false positives
function isFalsePositive(str) {
  // Filter out common patterns that aren't phone numbers
  
  // Skip if it's a date-like pattern (e.g., 12.31.2023)
  if (/^\d{1,2}[.-]\d{1,2}[.-]\d{4}$/.test(str)) {
    return true;
  }
  
  // Skip if it's a version number (e.g., 1.2.3)
  if (/^\d{1,2}\.\d{1,2}\.\d{1,2}$/.test(str)) {
    return true;
  }
  
  // Skip if all digits are the same (e.g., 111-111-1111)
  const digitsOnly = str.replace(/\D/g, '');
  if (/^(\d)\1+$/.test(digitsOnly)) {
    return true;
  }
  
  return false;
}
