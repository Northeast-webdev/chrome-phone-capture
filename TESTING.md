# Testing Guide for Chrome Phone Capture

This guide will help you test the Chrome Phone Capture extension to ensure it works correctly.

## Prerequisites

- Google Chrome browser (version 88 or later)
- The extension loaded in developer mode (see [Installation](README.md#installation))

## Manual Testing Steps

### 1. Load the Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top-right corner)
3. Click "Load unpacked"
4. Select the `chrome-phone-capture` directory
5. Verify the extension icon appears in the toolbar

### 2. Test with the Included Test Page

1. Open the `test-page.html` file in Chrome:
   - Navigate to `file:///path/to/chrome-phone-capture/test-page.html`
   - Or right-click the file and select "Open with Chrome"

2. Click the Phone Number Capture extension icon in the toolbar

3. Click the "Extract Numbers" button

4. **Expected Results:**
   - Status message: "Successfully extracted X phone number(s)"
   - The results panel should show phone numbers including:
     - `555-123-4567`
     - `(555) 987-6543`
     - `555.456.7890`
     - `1-800-555-0199`
     - `+44 20 7123 4567`
     - `+61 2 1234 5678`
     - `+1 416 555 0123`
     - `555-111-2222`
     - `(555) 333-4444`
     - `555-222-3333`
     - `(555) 444-5555`
     - `555.666.7777`
   - Should NOT include false positives like:
     - `1.2.3` (version number)
     - `12.31.2023` (date)
     - `123.45` (price)

### 3. Test Copy to Clipboard

1. After extracting numbers, click the "Copy All" button
2. Open a text editor (Notepad, TextEdit, etc.)
3. Paste (Ctrl+V or Cmd+V)
4. **Expected Result:** All phone numbers should be pasted, one per line

### 4. Test CSV Export

1. After extracting numbers, click the "Export CSV" button
2. A file named `phone-numbers-YYYY-MM-DD.csv` should download
3. Open the file in Excel, Google Sheets, or a text editor
4. **Expected Result:**
   - First line: "Phone Number"
   - Following lines: One phone number per line

### 5. Test with Real Websites

Test the extension on various real websites to ensure it works correctly:

#### Test Case 1: Business Directory
1. Navigate to a business listing site (e.g., Yelp, Yellow Pages)
2. Click the extension icon
3. Click "Extract Numbers"
4. Verify it extracts business phone numbers

#### Test Case 2: Company Contact Page
1. Navigate to a company's contact page
2. Click the extension icon
3. Click "Extract Numbers"
4. Verify it extracts contact phone numbers

#### Test Case 3: Page with No Phone Numbers
1. Navigate to a page without phone numbers (e.g., Wikipedia homepage)
2. Click the extension icon
3. Click "Extract Numbers"
4. **Expected Result:** "No phone numbers found on this page"

### 6. Test Edge Cases

#### Empty Page
1. Create a new blank tab
2. Click the extension icon
3. Click "Extract Numbers"
4. **Expected Result:** "No phone numbers found on this page"

#### International Numbers
Create a test page with international numbers:
- UK: `+44 20 7946 0958`
- Germany: `+49 30 123456`
- France: `+33 1 23 45 67 89`
- Japan: `+81 3-1234-5678`

Click extract and verify these formats are captured.

#### Phone Numbers in Different Contexts
Test extraction from:
- Plain text paragraphs
- HTML lists (`<ul>`, `<ol>`)
- Tables (`<table>`)
- Form fields (visible text only)
- Headers and footers

### 7. Performance Testing

1. Navigate to a page with many phone numbers (100+)
2. Click "Extract Numbers"
3. **Expected Results:**
   - Extraction completes within 2-3 seconds
   - UI remains responsive
   - All numbers are captured
   - No duplicate numbers appear

### 8. Privacy Testing

1. Open Chrome DevTools (F12)
2. Go to the Network tab
3. Click "Extract Numbers"
4. **Expected Result:** No network requests should be made
5. Verify all processing happens locally

## Automated Testing (Future Enhancement)

For developers who want to add automated tests, consider:

1. **Unit Tests**: Test the phone number extraction regex patterns
2. **Integration Tests**: Test the extension with mock Chrome APIs
3. **E2E Tests**: Use Selenium or Puppeteer to test the extension in a real browser

## Reporting Issues

If you find any bugs or issues during testing:

1. Note the Chrome version: `chrome://version/`
2. Describe the steps to reproduce
3. Include the URL where the issue occurred (if applicable)
4. Provide screenshots if relevant
5. Open an issue on the GitHub repository

## Test Checklist

Use this checklist to ensure comprehensive testing:

- [ ] Extension loads without errors
- [ ] Icon appears in toolbar
- [ ] Popup opens when icon is clicked
- [ ] Extract button works on test page
- [ ] Correct number of phone numbers extracted
- [ ] No false positives (dates, versions, etc.)
- [ ] Copy to clipboard works
- [ ] CSV export works and file downloads
- [ ] Works on multiple real websites
- [ ] Handles pages with no phone numbers gracefully
- [ ] International formats are recognized
- [ ] No network requests are made (privacy)
- [ ] UI is responsive and user-friendly
- [ ] Status messages are clear and helpful

## Known Limitations

Document any known limitations found during testing:

1. Phone numbers embedded in images are not extracted (requires OCR)
2. Heavily obfuscated phone numbers (e.g., "five five five...") are not detected
3. Phone numbers split across multiple lines may not be detected
4. JavaScript-rendered content loaded after page load may not be captured

## Conclusion

Thorough testing ensures the extension works reliably across different scenarios. If all tests pass, the extension is ready for use!
