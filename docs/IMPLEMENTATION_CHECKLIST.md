# Implementation Checklist — MyTripGuide Traveler App

Use this checklist to track progress against the SRS requirements. Check items off as you complete them.

---

## 🔐 Sprint 1: Authentication & Session Management

### Backend Setup

- [ ] Create Supabase project
- [ ] Configure Supabase Auth (phone OTP)
- [ ] Create users table schema
- [ ] Set up Row-Level Security (RLS)
- [ ] Create MSG91 integration for OTP delivery

### NPM Packages

- [ ] `npm install @supabase/supabase-js`
- [ ] `npm install zustand`
- [ ] `npm install @react-native-community/netinfo`

### Zustand Stores

- [ ] Create `src/store/authStore.ts` with:
  - [ ] user (name, mobile, role)
  - [ ] sessionToken
  - [ ] FCM token
  - [ ] onboarding_complete flag
  - [ ] AsyncStorage persistence

- [ ] Create `src/store/tripStore.ts` with:
  - [ ] activeTrip ID
  - [ ] trip metadata (dates, status)

- [ ] Create `src/store/syncStore.ts` with:
  - [ ] isOnline status
  - [ ] pending actions count
  - [ ] lastSyncTime

### Login Screen Updates

- [ ] Replace mock auth with `supabase.auth.signInWithOtp(phone)`
- [ ] Add phone validation (starts with 6-9)
- [ ] Add offline banner when no network
- [ ] Add "Send OTP" API error handling

### OTP Screen Updates

- [ ] Change from 4-box to 6-box OTP input
- [ ] Add paste support for OTP
- [ ] Replace mock verification with `supabase.auth.verifyOtp(phone, token)`
- [ ] Add attempt counter (max 3)
- [ ] Add OTP expiry check (> 10 min)
- [ ] Add wrong OTP message with remaining attempts
- [ ] Implement 30s resend countdown

### User Profile Fetch

- [ ] After OTP verify: fetch user record from `users` table
- [ ] Get user name, role, emergency_contact
- [ ] Save to authStore
- [ ] Detect and route admin users separately (if needed)

### Session Persistence

- [ ] Save session token to Zustand + AsyncStorage
- [ ] Check session on app launch (Splash screen)
- [ ] Implement 30-day session expiry
- [ ] Implement logout + clear all data

### Unregistered User Handling

- [ ] Check if mobile exists in users table after OTP verify
- [ ] Show "Contact your organiser to register" if not found
- [ ] Prevent self-registration

**Sprint 1 Acceptance Criteria:**

- [ ] Real OTP received via SMS on test number
- [ ] OTP verified successfully
- [ ] Session persists across app restart
- [ ] Logout clears auth state
- [ ] Unregistered number shows correct message

---

## 📍 Sprint 2: PowerSync Offline Sync

### PowerSync Setup

- [ ] `npm install @powersync/powersync-js`
- [ ] Create `src/powersync/schema.ts` with table definitions:
  - [ ] trips
  - [ ] pax
  - [ ] itinerary
  - [ ] vehicles
  - [ ] pax_vehicles
  - [ ] attendance
  - [ ] hotels
  - [ ] hotel_rooms
  - [ ] pax_rooms
  - [ ] hotel_checkins
  - [ ] notifications
  - [ ] notif_receipts
  - [ ] users

- [ ] Create `src/powersync/syncRules.ts`:
  - [ ] Define sync filters (what data syncs to this device)
  - [ ] trips: WHERE user is assigned as pax
  - [ ] pax: WHERE trip in user's trips
  - [ ] attendance: WHERE trip in user's trips
  - [ ] etc.

- [ ] Create `src/powersync/PowerSyncProvider.tsx`:
  - [ ] Wrap app with PowerSync context
  - [ ] Handle sync status changes
  - [ ] Emit sync events to syncStore

### UI Components

- [ ] Create `src/components/offline/OfflineBanner.tsx`:
  - [ ] Shows teal banner when offline
  - [ ] Slides in/out on network change
  - [ ] Non-blocking (44px height)

- [ ] Create `src/components/offline/SyncIndicator.tsx`:
  - [ ] Shows animated sync icon in header
  - [ ] Displays "Syncing N items..."
  - [ ] Hidden when not syncing

### Trip List Integration

- [ ] Replace mock data with PowerSync query: `trips JOIN pax`
- [ ] Display OfflineBanner when offline
- [ ] Show "Last synced X min ago" timestamp
- [ ] Implement pull-to-refresh (triggers PowerSync sync)

### Trip Dashboard Integration

- [ ] Load trip data from PowerSync
- [ ] Load attendance counts from PowerSync
- [ ] Load hotel check-in status from PowerSync
- [ ] Load unread notification count from PowerSync

### Itinerary Integration

- [ ] Load itinerary from PowerSync
- [ ] Fully functional in airplane mode
- [ ] Show "Available offline" badge

### Other Screens

- [ ] Update Family Members to use PowerSync data
- [ ] Update Attendance to query PowerSync

**Sprint 2 Acceptance Criteria:**

- [ ] Trip list visible in airplane mode
- [ ] Itinerary fully accessible without network
- [ ] Offline banner appears/disappears correctly
- [ ] Data syncs when connection restored
- [ ] "Last synced" timestamp updates

---

## 🔔 Sprint 3: Push Notifications & Attendance Check-In

### Firebase Setup

- [ ] `npm install @react-native-firebase/messaging`
- [ ] Configure Firebase Cloud Messaging
- [ ] Set up notification channels in Android

### FCM Integration

- [ ] Create `src/services/fcm.service.ts`:
  - [ ] Request notification permissions on login
  - [ ] Get FCM token via `messaging().getToken()`
  - [ ] Save token to `users.fcm_token` in Supabase
  - [ ] Register FCM token refresh handler
  - [ ] Set up foreground message handler
  - [ ] Set up background message handler

- [ ] Create notification channels:
  - [ ] trip_notifications (HIGH)
  - [ ] emergency_alerts (MAX)
  - [ ] sync_status (LOW)

### Deep Linking

- [ ] Create `src/services/deeplink.service.ts`:
  - [ ] Handle notification tap deep links
  - [ ] Route to correct screen based on notification type
  - [ ] Load correct trip context

- [ ] Configure app.json linking scheme
- [ ] Update react-navigation linking config

### Notification Handlers

- [ ] Foreground: Show Notifee in-app banner
- [ ] Background: Deliver via Android notification tray
- [ ] Tapping notification: Deep link to correct screen

### Attendance Check-In Updates

- [ ] On check-in button tap:
  - [ ] Create attendance record in PowerSync SQLite immediately
  - [ ] Show loading state on button
  - [ ] Show confirmation with animated tick
  - [ ] If online: sync to Supabase via PowerSync
  - [ ] If offline: add to pending queue, show "(syncing...)"

- [ ] Show "Checked in at HH:MM AM" message
- [ ] Disable check-in button after confirmation (cannot undo)

### Family Bulk Check-In

- [ ] Add checkboxes for each unchecked family member
- [ ] "Select All" checkbox at top
- [ ] "Check In Selected" button
- [ ] On submit: create attendance records for all selected with `via_rep = true`
- [ ] Show confirmation with timestamp for each member

### Offline Check-In Queuing

- [ ] When offline: write to PowerSync SQLite
- [ ] Show "(syncing...)" indicator
- [ ] When network restored: PowerSync syncs automatically
- [ ] Remove indicator when sync complete

**Sprint 3 Acceptance Criteria:**

- [ ] FCM token registered after login
- [ ] Push notification received when app closed
- [ ] Tapping notification opens correct screen
- [ ] Check-in works offline
- [ ] Offline check-in syncs when reconnected
- [ ] Family bulk check-in creates correct records

---

## 🎯 Sprint 4: Missing Screens & Features

### Emergency Info Screen

- [ ] Create `src/screens/emergency/EmergencyScreen.tsx`
- [ ] Add "Always available offline" badge
- [ ] Create organiser contact card (tap-to-call)
- [ ] Create driver contact card (tap-to-call, from vehicles table)
- [ ] Create hotel reception card (from hotels table)
- [ ] Create personal emergency contact (from users table)
- [ ] Add "Share emergency contacts" button
- [ ] Ensure all buttons ≥ 64px height

### Post-Trip Feedback Screen

- [ ] Create `src/screens/feedback/FeedbackScreen.tsx`
- [ ] Show only after trip is marked Completed
- [ ] Show only once per trip (not on every app launch)
- [ ] Add 5-star interactive rating
- [ ] Add text comment area (500 char limit with counter)
- [ ] On submit: write to `trip_feedback` table
- [ ] Show "Thank you for your feedback!" message
- [ ] "Skip" link to dismiss without saving
- [ ] After skip: don't show again for this trip

### First-Time Onboarding

- [ ] Create `src/screens/onboarding/OnboardingScreen.tsx`
- [ ] Show only if `users.onboarding_complete = false`
- [ ] 3 swipeable slides:
  - [ ] Slide 1: "Your trip, on your phone — itinerary, hotel, everything offline"
  - [ ] Slide 2: "Check in to your bus with one tap — for yourself and family"
  - [ ] Slide 3: "Get updates from your organiser instantly"
- [ ] Skip button always visible
- [ ] Last slide: "Get Started" button
- [ ] On Get Started: set `users.onboarding_complete = true`
- [ ] Navigate to Trip List

### Profile Screen Enhancements

- [ ] Add emergency contact edit (inline TextInput)
- [ ] Save button when editing
- [ ] Add notification preferences toggle:
  - [ ] "Receive push notifications" (default ON)
  - [ ] When OFF: clear FCM token
  - [ ] Persist preference

### Hotel Screen Multi-Night

- [ ] Query hotel for current/next night based on trip day
- [ ] Show correct hotel info
- [ ] Handle case where no hotel assigned for tonight

### Trip Dashboard - Family Alert

- [ ] Check if any family member not checked in
- [ ] Show amber alert card: "X family members not checked in"
- [ ] Tapping alert navigates to Attendance screen

### Notification Screen - Mark as Read

- [ ] Implement "Mark as read" on notification item tap
- [ ] Update `notif_receipts.read_at` timestamp
- [ ] Remove blue unread dot
- [ ] If offline: mark locally, sync when reconnected

- [ ] Add "Mark all read" button
- [ ] Add notification types with visual treatment:
  - [ ] General = default
  - [ ] Urgent = amber left border
  - [ ] Departure = green left border
  - [ ] Delay = red left border
  - [ ] Emergency = full red background

**Sprint 4 Acceptance Criteria:**

- [ ] Emergency screen shows all 4 contact cards
- [ ] Tap phone opens dialler
- [ ] Feedback screen shown once after trip completion
- [ ] Onboarding shown once after first login
- [ ] Profile emergency contact editable + saved
- [ ] Notifications mark as read works

---

## 🎨 Sprint 5: Polish & Accessibility

### Animations

- [ ] Add Lottie check-in confirmation animation
- [ ] Improve screen transitions
- [ ] Add loading spinners on all async actions

### Accessibility

- [ ] Audit all touch targets (min 48px, emergency 64px)
- [ ] Verify text sizes (body 16sp, heading 20-24sp)
- [ ] Check color contrast (4.5:1 for body text, WCAG AA)
- [ ] Ensure status not conveyed by color alone
- [ ] Test with Expo accessibility inspector

### Performance

- [ ] Test cold start time on low-end device (< 4s target)
- [ ] Profile memory usage (< 200MB on 2GB device)
- [ ] Check app bundle size (< 50MB APK)
- [ ] Test scroll performance on long lists (60 FPS)

### Device Testing

- [ ] Test on 2GB RAM device (Android 10)
- [ ] Test on 4GB RAM device (Android 12)
- [ ] Test on 6.5" screen (large device)
- [ ] Test on 5.0" screen (small device)

### Network Testing

- [ ] Airplane mode tests (all offline features)
- [ ] 2G simulation (app stable for 30 min)
- [ ] Network switch (reconnect scenarios)
- [ ] Offline check-in → sync → verification

### E2E Testing

- [ ] End-to-end: Login → Trip List → Check-in → Notification
- [ ] End-to-end: Offline check-in → reconnect → sync verification
- [ ] End-to-end: Feedback submission after trip

**Sprint 5 Acceptance Criteria:**

- [ ] App launches in < 4s on low-end device
- [ ] All touch targets ≥ 48px
- [ ] No memory leaks over 30-minute session
- [ ] App stable on 2G network
- [ ] E2E flows working end-to-end

---

## 📊 Completion Tracker

| Sprint | Module             | Status | Notes       |
| ------ | ------------------ | ------ | ----------- |
| 1      | Authentication     | ⬜     | Not started |
| 1      | Session Management | ⬜     | Not started |
| 2      | PowerSync Setup    | ⬜     | Not started |
| 2      | Offline UI         | ⬜     | Not started |
| 3      | FCM Notifications  | ⬜     | Not started |
| 3      | Check-in Logic     | ⬜     | Not started |
| 4      | Emergency Screen   | ⬜     | Not started |
| 4      | Feedback Screen    | ⬜     | Not started |
| 4      | Onboarding         | ⬜     | Not started |
| 5      | Performance        | ⬜     | Not started |
| 5      | Accessibility      | ⬜     | Not started |
| 5      | Testing            | ⬜     | Not started |

---

## 🚨 Critical Blockers (Must Complete First)

1. ❌ **Supabase Project Setup** — Can't test anything without backend
2. ❌ **Real OTP Auth** — Mock auth blocks feature development
3. ❌ **PowerSync Setup** — Offline features depend on this
4. ❌ **FCM Configuration** — Notifications depend on this

**Recommendation**: Complete Sprint 1 (Auth) before starting any other feature development.

---

## 📞 Support Contacts

For issues with:

- **Supabase**: Check supabase.io docs, SRS API section
- **PowerSync**: Check powersync.co docs, schema.ts reference
- **Firebase**: Check firebase.google.com, notification channels
- **React Navigation**: Check reactnavigation.org docs

---

## Notes

- Use this checklist to track daily progress
- Check off items as they're completed (not as "mostly done")
- Update regularly during standups
- Reference REQUIREMENTS_MAPPING.md for detailed requirements

**Last Updated**: May 5, 2026  
**Next Review**: After Sprint 1
