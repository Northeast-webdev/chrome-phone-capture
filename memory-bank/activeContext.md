# Active Context - Phone Dialer Extension

**Last Updated**: November 8, 2025  
**Current Phase**: MVP Development - Phase 1  
**Status**: 🟡 In Progress

## 🎯 Current Focus

Building the core Chrome Extension and WebSocket server to enable phone number capture and transmission for future mobile app dialing.

## 📋 What We're Working On

### Active Tasks
1. ✅ **Memory Bank Creation** - Setting up project documentation
2. 🔄 **Chrome Extension Structure** - Creating manifest and folder structure
3. ⏳ **Content Script** - Implementing tel: link interceptor
4. ⏳ **Background Worker** - WebSocket connection handler
5. ⏳ **Popup UI** - Status display and controls
6. ⏳ **WebSocket Server** - Node.js relay server
7. ⏳ **Testing** - Test page and validation

## 🔍 Recent Decisions

### Decision 1: No Authentication for MVP
**Date**: November 8, 2025  
**Reason**: Simplify development and testing. Add auth in Phase 2.  
**Impact**: WebSocket is open (localhost only), no user tracking yet

### Decision 2: Focus on Extension Only
**Date**: November 8, 2025  
**Reason**: Android app will be developed separately later  
**Impact**: WebSocket protocol designed to be app-agnostic

### Decision 3: Tel Links Only (Not Auto-Detection)
**Date**: November 8, 2025  
**Reason**: User explicitly requests these features  
**Impact**: Simpler implementation, no ambiguity about user intent

### Decision 4: Manifest V3
**Date**: November 8, 2025  
**Reason**: V2 is deprecated by Google  
**Impact**: Must use Service Workers instead of background pages

## 💡 Key Insights

### User Workflow
The existing contact management system has employees who:
- Work through daily batches of 50 contacts
- Make calls manually from their mobile phones
- Track call status (chiamato, non_risposto, etc.)
- Set callback dates and reminders

This extension fits into their workflow by:
- Capturing phone numbers from prospect websites
- Sending directly to their mobile phone
- Eliminating manual copy-paste

### Technical Context
- Contact management system is Laravel + React (already built)
- Extension is separate component (not integrated yet)
- WebSocket is intermediary between browser and future mobile app
- No integration with Laravel API in Phase 1 (MVP)

## 🔄 Current Implementation Approach

### Phase 1 (Now): Standalone Extension
- Extension works independently
- WebSocket server is separate from Laravel
- No database integration
- No user authentication
- Focus: Prove the capture → transmit flow

### Phase 2 (Later): Integration
- Connect extension to Laravel API
- Save captured numbers to contacts table
- User authentication with Sanctum tokens
- Automatically create contacts from captured numbers

## 📊 Progress Status

### Completed ✅
- Project planning and architecture
- Memory Bank documentation
- Technical decisions finalized

### In Progress 🔄
- Memory Bank creation (this file)
- Extension structure setup (next)

### Pending ⏳
- Content script implementation
- Background worker implementation
- Popup UI development
- WebSocket server creation
- Testing and validation
- User documentation

## 🎯 Success Criteria for Phase 1

1. **Extension loads successfully** in Chrome
2. **Tel links are intercepted** when clicked
3. **Phone numbers extracted** correctly (various formats)
4. **WebSocket connection** established and stable
5. **Messages transmitted** to WebSocket server
6. **Notifications shown** to confirm send
7. **Popup displays** connection status and last number

## 🔧 Current Technical Stack

### Extension
- Manifest V3
- Pure JavaScript (no frameworks)
- Chrome APIs: runtime, notifications, storage
- WebSocket API (native browser)

### Server
- Node.js 18+
- `ws` library for WebSocket
- Port 3000 (localhost)
- JSON message protocol

## 🚧 Known Limitations (MVP)

1. **No authentication** - Open WebSocket (localhost only)
2. **No database** - Numbers not saved anywhere
3. **No Android app** - Server logs messages only
4. **Tel links only** - Won't detect plain text numbers
5. **Chrome only** - No Firefox/Safari support yet
6. **Local only** - WebSocket on localhost, not production-ready

## 🔮 Next Immediate Steps

1. Complete Memory Bank (progress.md)
2. Create chrome-extension folder structure
3. Write manifest.json with V3 configuration
4. Implement content.js to intercept tel: clicks
5. Implement background.js with WebSocket logic
6. Create popup UI with status indicators
7. Build Node.js WebSocket server
8. Create test HTML page with tel: links
9. Test end-to-end flow
10. Document installation and usage

## 💬 Open Questions

### For User
- ✅ **Authentication**: No auth for MVP (answered: Option D)
- ❓ **WebSocket Server Location**: Should it be part of Laravel project or separate?
- ❓ **Phone Format**: Any specific format preference for Italian numbers?
- ❓ **Error Handling**: What if WebSocket disconnects during call capture?
- ❓ **Multiple Clicks**: Should we prevent double-sends if user clicks twice?

### Technical
- ✅ **Manifest Version**: V3 (decided)
- ✅ **WebSocket Library**: `ws` for Node.js (decided)
- ❓ **Icon Design**: Do you have brand icons or should I create placeholder?
- ❓ **Extension Name**: "Contact Management Phone Dialer" or something shorter?

## 📝 Notes for Future Reference

### Phase 2 Planning
When adding authentication:
- Use existing Laravel Sanctum tokens
- Extension login form mimics main app login
- Store token in chrome.storage.local
- Include token in WebSocket handshake

### Phase 3 Planning
When integrating with contact management:
- Add API endpoint: POST /api/contacts/capture
- Extension sends number + page URL + timestamp
- Laravel creates contact in "Non Lavorati" status
- Employee sees it in their dashboard

### Android App Coordination
WebSocket message format designed for:
- Easy parsing by mobile app
- Extensible (can add fields later)
- Clear phone number format
- Timestamp for tracking

## 🎨 UI/UX Considerations

### Notification Design
- **Success**: "Numero inviato: +39 045 123456"
- **Error**: "Errore: WebSocket disconnesso"
- **Info**: "Tentativo di riconnessione..."

### Icon States
- 🟢 **Green**: Connected and ready
- 🔴 **Red**: Disconnected or error
- 🟡 **Yellow**: Connecting...

### Popup Layout
Keep it minimal:
- Connection status (large indicator)
- Last number sent (with timestamp)
- Today's count
- Test button (for debugging)
- Settings button (for Phase 2)

## 🔗 Integration Points

### With Existing Contact Management System
**Not in Phase 1**, but planned:
- Extension will call Laravel API endpoints
- Use same authentication (Sanctum tokens)
- Follow same data structure (contacts table)
- Respect same business rules (required fields)

### With Future Android App
**Protocol ready**:
- WebSocket message format defined
- Number format normalized
- Metadata included (source URL, timestamp)
- Extensible for future fields

## 📚 Reference to Existing System

### Contact Management Features (For Context)
- Daily batch system (50 contacts/day)
- Call status tracking (chiamato, non_risposto)
- Contact status (mandare_mail, non_interessato)
- Callback dates and reminders
- CSV import functionality
- Dark mode UI

### Existing Tech Stack (For Integration Later)
- **Backend**: Laravel 10, MySQL/PostgreSQL
- **Frontend**: React 18, Vite, Tailwind CSS
- **Auth**: Laravel Sanctum (token-based)
- **API**: RESTful, deployed on Render
- **Database**: PostgreSQL (production)

