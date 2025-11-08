# Project Brief - Phone Dialer Chrome Extension

**Project Name**: Contact Management Phone Dialer Extension  
**Created**: November 8, 2025  
**Status**: In Development (MVP Phase)

## 🎯 Project Goal

Create a Chrome Extension that captures phone numbers from `tel:` links on web pages and sends them via WebSocket to a mobile app, which will automatically open the phone dialer with the number ready to call.

## 🔍 Problem Statement

Sales employees using the Contact Management System need to quickly dial phone numbers they find on websites. Currently, they must:
1. Manually copy the phone number
2. Open their contact management system
3. Paste the number
4. Click to dial

This is time-consuming and breaks their workflow.

## ✨ Solution

A Chrome Extension that:
1. Intercepts clicks on `tel:` links
2. Captures the phone number
3. Sends it to a WebSocket server
4. (Future) Mobile app receives it and opens the phone dialer automatically

## 👥 Users

- **Primary**: Sales employees who make calls from their mobile phones
- **Secondary**: Admin users who manage the contact system

## 📋 Core Requirements

### Must Have (MVP - Phase 1)
- ✅ Intercept clicks on `tel:` links
- ✅ Extract phone number from `href="tel:+123456789"`
- ✅ Send phone number to WebSocket server
- ✅ Show notification when number is sent
- ✅ Display connection status in popup
- ✅ No authentication (open WebSocket for testing)

### Should Have (Phase 2)
- User authentication with existing contact management system
- Save captured numbers to database
- History of sent numbers
- Settings configuration (WebSocket URL)

### Could Have (Future)
- Integration with contact management API
- Multiple device support
- Auto-capture without clicking
- Context menu option for selected text

## 🏗️ Technical Architecture

```
Web Page (tel: link)
       ↓
Chrome Extension (Content Script)
       ↓
Background Service Worker
       ↓
WebSocket Server (Node.js)
       ↓
Android App (Future)
       ↓
Phone Dialer
```

## 🎨 Design Principles

1. **Simple**: Minimal UI, works in background
2. **Fast**: Instant capture and send
3. **Reliable**: Auto-reconnect if WebSocket drops
4. **User-Friendly**: Clear status indicators
5. **Secure**: Will add authentication in Phase 2

## 📊 Success Metrics

- Extension successfully intercepts `tel:` clicks
- Phone numbers sent to WebSocket server
- Connection remains stable during work session
- User receives notification of successful send

## 🔗 Related Systems

- **Contact Management System**: Laravel + React (existing)
- **WebSocket Server**: Node.js (new)
- **Android App**: To be developed (future)

## ⏱️ Timeline

- **Phase 1 (MVP)**: 5 hours - Extension + WebSocket server
- **Phase 2**: TBD - Authentication + Database integration
- **Phase 3**: TBD - Android app development

## 📝 Constraints

- Must work on any website (not just contact management system)
- Must support international phone number formats
- WebSocket server must be lightweight and reliable
- Extension must be Chrome Manifest V3 compliant

## 🎯 Out of Scope (for MVP)

- Android app development
- User authentication
- Contact database integration
- Email capture
- Company name extraction
- VoIP calling integration

