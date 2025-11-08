# Changelog

All notable changes to the Phone Dialer Extension project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2025-11-08

### 🎉 Initial Release (MVP)

#### Added
- **Chrome Extension (Manifest V3)**
  - Tel link interception on all web pages
  - Phone number capture and normalization
  - WebSocket client implementation
  - Background service worker for connection management
  - Popup UI with status dashboard
  - Chrome notifications for user feedback
  - Auto-reconnect functionality
  - Debouncing to prevent duplicate sends
  - Statistics tracking (numbers sent per day)

- **WebSocket Server (Node.js)**
  - WebSocket relay server using `ws` library
  - Client connection management
  - Message broadcasting to connected devices
  - Client identification (chrome-extension vs android-app)
  - Graceful shutdown handling
  - Error handling and logging
  - Statistics tracking
  - Health check (PING/PONG)

- **Testing & Documentation**
  - Test HTML page with various phone number formats
  - Complete README with project overview
  - QUICKSTART guide for 5-minute setup
  - Detailed INSTALLATION guide
  - WebSocket PROTOCOL specification
  - Setup checklist for verification
  - Memory Bank with full project context

- **Project Infrastructure**
  - .gitignore files for all components
  - MIT License
  - Changelog (this file)
  - Icon placeholder guide

#### Features
- ✅ Universal tel: link support (works on any website)
- ✅ Phone number format normalization (+39 prefix)
- ✅ Real-time WebSocket communication
- ✅ Visual status indicators (connected/disconnected)
- ✅ Chrome notification on successful capture
- ✅ Automatic reconnection with exponential backoff
- ✅ Daily statistics counter
- ✅ Manual test connection button
- ✅ Server-side message broadcasting

#### Technical Specifications
- Chrome Extension Manifest V3
- Node.js 18+ for WebSocket server
- WebSocket Protocol (RFC 6455)
- JSON message format
- No authentication (MVP - localhost only)

---

## [Unreleased]

### Planned for Version 1.1.0 (Phase 2)

#### To Add
- User authentication (JWT tokens)
- Integration with Laravel Contact Management API
- Save captured numbers to database
- User session tracking
- Settings page in extension popup
- WebSocket Secure (WSS) support
- Server URL configuration in UI
- Multiple device management
- Rate limiting on server

#### To Improve
- Professional icon design
- Enhanced error messages
- Better reconnection UI feedback
- Statistics dashboard
- Export captured numbers

---

## [Future Versions]

### Version 2.0.0 (Phase 3) - Android Integration
- Android app development
- Automatic phone dialer opening
- Call history tracking
- Cross-device synchronization
- Push notifications

### Version 3.0.0 (Phase 4) - Advanced Features
- Right-click context menu for any selected text
- Automatic phone number detection (no tel: link needed)
- Multiple WebSocket server support
- Company name extraction from web pages
- Email address capture
- Contact enrichment from page metadata
- AI-powered contact suggestions
- Integration with VoIP services
- Chrome Web Store publication

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2025-11-08 | Initial MVP release |

---

## Migration Notes

### From Nothing to 1.0.0
- This is the first release - no migration needed
- Fresh installation instructions in INSTALLATION.md

---

## Breaking Changes

None - this is the first version.

Future breaking changes will be documented here.

---

## Known Issues

### Version 1.0.0
- Icons not included (placeholder guide provided)
- No user authentication (not secure for production)
- WebSocket runs on localhost only
- No persistent storage of captured numbers
- No settings UI (server URL hardcoded)

These will be addressed in future versions.

---

## Contributors

- Luca - Initial development and architecture
- AI Assistant (Claude) - Implementation support

---

## Support

For issues and questions:
- Check documentation in /docs folder
- Review SETUP_CHECKLIST.md
- See TROUBLESHOOTING section in INSTALLATION.md

---

**For detailed changes in each version, see the Git commit history.**

Last Updated: November 8, 2025

