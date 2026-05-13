# MyTripGuide Traveler App — Requirements Mapping

## Document Reference

- **SRS Source**: MyTripGuide_Traveler_App_SRS.md
- **App Type**: React Native + Expo
- **Platform**: Android 10+
- **Status**: Development in Progress

---

## Executive Summary

The current React Native app has **10 core screens implemented** but is **missing critical backend integration, offline support, and several key features** outlined in the SRS.

| Category                | Status       | Count                  |
| ----------------------- | ------------ | ---------------------- |
| **Screens Built**       | ✅ Partial   | 10/15                  |
| **Authentication**      | ⚠️ Mock Only | 2-Tap Login            |
| **Backend Integration** | ❌ Missing   | 0%                     |
| **Offline Sync**        | ❌ Missing   | 0%                     |
| **Push Notifications**  | ❌ Missing   | 0%                     |
| **State Management**    | ⚠️ Partial   | React local state only |
| **Critical Features**   | ⚠️ Partial   | ~60%                   |

---

## Requirement Checklist

### 🔐 Authentication & Session (17 FRs) — **Status: Mock (0%)**

| FR-ID          | Requirement                                  | Current State  | Required Fix                                 |
| -------------- | -------------------------------------------- | -------------- | -------------------------------------------- |
| **TR-AUTH-01** | 10-digit mobile validation                   | ✅ Implemented | None                                         |
| **TR-AUTH-02** | Input validation (6-9 prefix)                | ❌ Missing     | Add validation for starting digit            |
| **TR-AUTH-03** | Send OTP API call to Supabase                | ❌ Mock        | Integrate `supabase.auth.signInWithOtp()`    |
| **TR-AUTH-04** | Navigate to OTP screen                       | ✅ Implemented | None                                         |
| **TR-AUTH-05** | API error handling                           | ⚠️ Partial     | Mock errors only, need real handling         |
| **TR-AUTH-06** | Offline state handling                       | ❌ Missing     | Add offline banner + disable button          |
| **TR-AUTH-07** | Helper text "Contact organiser"              | ✅ Implemented | None                                         |
| **TR-AUTH-08** | 6-box OTP input + auto-advance               | ❌ Partial     | Currently 4-box, needs 6. Add paste support. |
| **TR-AUTH-09** | OTP verification API                         | ❌ Mock        | Integrate `supabase.auth.verifyOtp()`        |
| **TR-AUTH-10** | Success flow + role routing                  | ⚠️ Partial     | Fetch user role. Route admin ↔ traveler.     |
| **TR-AUTH-11** | Wrong OTP — 3 attempt lock                   | ❌ Missing     | Add attempt counter + lock logic             |
| **TR-AUTH-12** | Expired OTP handling                         | ❌ Missing     | Add > 10min check                            |
| **TR-AUTH-13** | Resend OTP with 30s countdown                | ✅ Partial     | Has timer, needs to actually resend          |
| **TR-AUTH-14** | Change number link                           | ✅ Implemented | None                                         |
| **TR-AUTH-15** | Session persistence (Zustand + AsyncStorage) | ❌ Missing     | Create authStore. Persist session token.     |
| **TR-AUTH-16** | FCM token registration post-login            | ❌ Missing     | Integrate Firebase Cloud Messaging           |
| **TR-AUTH-17** | Unregistered number handling                 | ❌ Missing     | Check users table. Block self-registration.  |

**Action Items:**

- [ ] Install and configure Supabase client
- [ ] Create Zustand authStore with AsyncStorage persistence
- [ ] Replace mock auth with real Supabase Auth (phone + OTP)
- [ ] Implement FCM token registration
- [ ] Add network status detection
- [ ] Add error handling for all auth flows

---

### 📍 Trip List Screen (10 FRs) — **Status: Partial (50%)**

| FR-ID          | Requirement                                   | Current State  | Required Fix                                    |
| -------------- | --------------------------------------------- | -------------- | ----------------------------------------------- |
| **TR-TRIP-01** | Trip card layout                              | ✅ Implemented | All fields visible                              |
| **TR-TRIP-02** | Status badge colours                          | ✅ Partial     | Has badges, pulsing dot for Ongoing needs check |
| **TR-TRIP-03** | Filter chips (All/Upcoming/Ongoing/Completed) | ❌ Missing     | Add filter tabs                                 |
| **TR-TRIP-04** | Search bar                                    | ❌ Missing     | Add real-time search input                      |
| **TR-TRIP-05** | Tap to open trip detail                       | ✅ Implemented | None                                            |
| **TR-TRIP-06** | Empty state illustration                      | ✅ Implemented | None                                            |
| **TR-TRIP-07** | Offline indicator + "Last synced"             | ❌ Missing     | Add OfflineBanner + sync timestamp              |
| **TR-TRIP-08** | Profile icon + unread badge                   | ✅ Partial     | Icon exists, badge count needs to be dynamic    |
| **TR-TRIP-09** | Pull to refresh (PowerSync sync)              | ❌ Missing     | Integrate with PowerSync                        |
| **TR-TRIP-10** | Sort order (Ongoing first, then date)         | ✅ Implemented | Verify sort order in data                       |

**Action Items:**

- [ ] Add status filter chips below header
- [ ] Add search bar with local filtering
- [ ] Add OfflineBanner component
- [ ] Connect to PowerSync for trip data
- [ ] Display last sync timestamp

---

### 📊 Trip Dashboard (12 FRs) — **Status: Partial (40%)**

| FR-ID          | Requirement                            | Current State  | Required Fix                            |
| -------------- | -------------------------------------- | -------------- | --------------------------------------- |
| **TR-DASH-01** | Trip name + current day ("Day 3 of 7") | ✅ Implemented | Verify day calculation                  |
| **TR-DASH-02** | Next activity card                     | ⚠️ Partial     | Needs to connect to Itinerary data      |
| **TR-DASH-03** | Status summary row (Check-in counts)   | ⚠️ Partial     | Needs to pull real attendance data      |
| **TR-DASH-04** | Family alert card (missing check-ins)  | ❌ Missing     | Show when family members not checked in |
| **TR-DASH-05** | 6 navigation grid cards                | ✅ Implemented | All cards present                       |
| **TR-DASH-06** | Itinerary card — activity count        | ⚠️ Partial     | Needs data connection                   |
| **TR-DASH-07** | Attendance card — check-in status      | ⚠️ Partial     | Needs data connection                   |
| **TR-DASH-08** | Hotel card — status                    | ⚠️ Partial     | Needs data connection                   |
| **TR-DASH-09** | Notifications card — unread badge      | ⚠️ Partial     | Badge needs dynamic count               |
| **TR-DASH-10** | Emergency Info card                    | ✅ Implemented | Need actual Emergency screen            |
| **TR-DASH-11** | Profile card                           | ✅ Implemented | None                                    |
| **TR-DASH-12** | Trip completion read-only state        | ❌ Missing     | Hide action buttons when Completed      |

**Action Items:**

- [ ] Connect dashboard to PowerSync data
- [ ] Implement day counter calculation
- [ ] Show next activity from itinerary
- [ ] Display real check-in statuses
- [ ] Add family alert card logic

---

### 📅 Itinerary Screen (11 FRs) — **Status: Partial (50%)**

| FR-ID          | Requirement                               | Current State  | Required Fix                                  |
| -------------- | ----------------------------------------- | -------------- | --------------------------------------------- |
| **TR-ITIN-01** | Day selector tabs + current day indicator | ✅ Implemented | None                                          |
| **TR-ITIN-02** | Activity card layout                      | ✅ Implemented | All fields visible                            |
| **TR-ITIN-03** | Entry fee badge (Free/Agency/Self)        | ⚠️ Partial     | Implemented but needs colour mapping          |
| **TR-ITIN-04** | Activity status badge                     | ❌ Missing     | Need In Progress / Delayed / Completed states |
| **TR-ITIN-05** | Timeline connector visual                 | ✅ Partial     | Basic timeline, refine if needed              |
| **TR-ITIN-06** | Notes expansion (Read more)               | ⚠️ Partial     | May need refinement                           |
| **TR-ITIN-07** | Image offline caching                     | ❌ Missing     | Use expo-image. Integrate with PowerSync.     |
| **TR-ITIN-08** | Empty day state                           | ⚠️ Partial     | May already be handled                        |
| **TR-ITIN-09** | "Available offline" badge                 | ❌ Missing     | Add to header                                 |
| **TR-ITIN-10** | Next activity highlight                   | ❌ Missing     | Add border accent to current activity         |
| **TR-ITIN-11** | Auto-scroll to today + next activity      | ❌ Missing     | Implement scrollTo on mount                   |

**Action Items:**

- [ ] Improve entry fee badge styling
- [ ] Add activity status badges
- [ ] Implement image caching with expo-image
- [ ] Add offline badge
- [ ] Add activity highlighting for current/next
- [ ] Auto-scroll functionality

---

### ✅ Vehicle & Attendance (13 FRs) — **Status: Partial (50%)**

| FR-ID         | Requirement                     | Current State  | Required Fix                      |
| ------------- | ------------------------------- | -------------- | --------------------------------- |
| **TR-ATT-01** | Vehicle info card               | ✅ Partial     | Need phone tap-to-call            |
| **TR-ATT-02** | My check-in status display      | ✅ Implemented | Need to show real status          |
| **TR-ATT-03** | Large check-in button           | ✅ Implemented | Verify 56px height                |
| **TR-ATT-04** | Check-in confirmation animation | ⚠️ Partial     | May need Lottie animation         |
| **TR-ATT-05** | Family members section          | ✅ Implemented | None                              |
| **TR-ATT-06** | Family bulk check-in            | ✅ Partial     | Need checkbox logic + bulk action |
| **TR-ATT-07** | Family confirmation detail      | ⚠️ Partial     | Needs timestamp per member        |
| **TR-ATT-08** | Offline check-in (PowerSync)    | ❌ Missing     | Queue to PowerSync SQLite         |
| **TR-ATT-09** | Sync confirmation               | ❌ Missing     | Show "syncing..." indicator       |
| **TR-ATT-10** | Already checked in state        | ⚠️ Partial     | Hide button when checked in       |
| **TR-ATT-11** | Duplicate check-in protection   | ❌ Missing     | Upsert instead of insert          |
| **TR-ATT-12** | Multiple vehicles edge case     | ❌ Missing     | Sentry logging                    |
| **TR-ATT-13** | No vehicle assigned message     | ✅ Implemented | None                              |

**Action Items:**

- [ ] Add PowerSync integration for attendance writes
- [ ] Implement "syncing..." indicator
- [ ] Add phone tap-to-call links
- [ ] Implement checkbox select-all for family
- [ ] Add Lottie animation for confirmation
- [ ] Add offline check-in queuing

---

### 👨‍👩‍👧‍👦 Family Members Screen (4 FRs) — **Status: Partial (50%)**

| FR-ID         | Requirement                      | Current State  | Required Fix                       |
| ------------- | -------------------------------- | -------------- | ---------------------------------- |
| **TR-FAM-01** | Member card with statuses        | ✅ Partial     | Real status data needed            |
| **TR-FAM-02** | Quick check-in from member card  | ❌ Missing     | Add check-in button per member     |
| **TR-FAM-03** | Solo traveler state              | ✅ Implemented | None                               |
| **TR-FAM-04** | Emergency contacts + tap-to-call | ❌ Missing     | Add phone number with dialler link |

**Action Items:**

- [ ] Add check-in button to each member card
- [ ] Add tap-to-call for emergency contacts
- [ ] Connect to real attendance data

---

### 🏨 Hotel Screen (10 FRs) — **Status: Partial (60%)**

| FR-ID         | Requirement                           | Current State  | Required Fix                 |
| ------------- | ------------------------------------- | -------------- | ---------------------------- |
| **TR-HTL-01** | Hotel info card                       | ✅ Implemented | Add tap-to-open Maps         |
| **TR-HTL-02** | Room number (large, prominent)        | ✅ Implemented | Verify 24sp+ font size       |
| **TR-HTL-03** | Roommates list                        | ✅ Partial     | Real data needed             |
| **TR-HTL-04** | Check-in status                       | ✅ Partial     | Real data needed             |
| **TR-HTL-05** | Confirm arrival button + confirmation | ✅ Partial     | Need API call                |
| **TR-HTL-06** | Family hotel check-in                 | ⚠️ Partial     | Need checkbox logic          |
| **TR-HTL-07** | Share address button                  | ✅ Implemented | Verify functionality         |
| **TR-HTL-08** | Multi-night hotel switching           | ❌ Missing     | Show correct hotel per night |
| **TR-HTL-09** | No hotel assigned message             | ✅ Implemented | None                         |
| **TR-HTL-10** | Offline hotel info                    | ⚠️ Partial     | Need offline data caching    |

**Action Items:**

- [ ] Connect to real hotel data via PowerSync
- [ ] Add Maps integration for address
- [ ] Implement hotel check-in API call
- [ ] Add multi-night hotel switching logic

---

### 🔔 Notifications Screen (10 FRs) — **Status: Partial (30%)**

| FR-ID           | Requirement                   | Current State  | Required Fix                             |
| --------------- | ----------------------------- | -------------- | ---------------------------------------- |
| **TR-NOTIF-01** | Notification item layout      | ✅ Implemented | Need unread indicator                    |
| **TR-NOTIF-02** | Unread count badge            | ⚠️ Partial     | Dynamic count needed                     |
| **TR-NOTIF-03** | Mark as read                  | ❌ Missing     | Update notif_receipts                    |
| **TR-NOTIF-04** | Mark all as read              | ❌ Missing     | Bulk action                              |
| **TR-NOTIF-05** | Type-based visual treatment   | ❌ Missing     | General/Urgent/Departure/Delay/Emergency |
| **TR-NOTIF-06** | Empty state                   | ✅ Implemented | None                                     |
| **TR-NOTIF-07** | FCM push notification receive | ❌ Missing     | Firebase integration                     |
| **TR-NOTIF-08** | Foreground in-app banner      | ❌ Missing     | Notifee integration                      |
| **TR-NOTIF-09** | Deep link navigation          | ❌ Missing     | Handle notification tap deep links       |
| **TR-NOTIF-10** | Notification history          | ❌ Missing     | Show all past notifications              |

**Action Items:**

- [ ] Integrate FCM for push notifications
- [ ] Implement Notifee for in-app banners
- [ ] Add notification type icons
- [ ] Implement mark as read functionality
- [ ] Add deep link handling for notification taps

---

### 🚨 Emergency Info Screen — **Status: Missing (0%)**

| FR-ID          | Requirement                | Current State | Required Fix           |
| -------------- | -------------------------- | ------------- | ---------------------- |
| **TR-EMRG-01** | "Always offline" badge     | ❌ Missing    | Add component          |
| **TR-EMRG-02** | Organiser contact card     | ❌ Missing    | Create screen + card   |
| **TR-EMRG-03** | Driver contact card        | ❌ Missing    | Add with tap-to-call   |
| **TR-EMRG-04** | Hotel reception card       | ❌ Missing    | Add current hotel info |
| **TR-EMRG-05** | Personal emergency contact | ❌ Missing    | Add from user profile  |
| **TR-EMRG-06** | Share button               | ❌ Missing    | Native share sheet     |
| **TR-EMRG-07** | Large touch targets (64px) | ❌ Missing    | All buttons ≥ 64px     |

**Action Items:**

- [ ] **CREATE EmergencyScreen.tsx**
- [ ] Add all contact cards
- [ ] Implement tap-to-call for all phones
- [ ] Add native share functionality
- [ ] Ensure 64px min touch targets

---

### 👤 Profile Screen (8 FRs) — **Status: Partial (40%)**

| FR-ID          | Requirement                                  | Current State  | Required Fix                         |
| -------------- | -------------------------------------------- | -------------- | ------------------------------------ |
| **TR-PROF-01** | User avatar with initials                    | ✅ Implemented | None                                 |
| **TR-PROF-02** | Name + mobile + emergency contact (editable) | ⚠️ Partial     | Need edit functionality              |
| **TR-PROF-03** | Edit emergency contact inline                | ❌ Missing     | Add text edit + save                 |
| **TR-PROF-04** | Family member count                          | ⚠️ Partial     | Show count for current trip          |
| **TR-PROF-05** | Trip statistics                              | ✅ Partial     | Show completed trip count            |
| **TR-PROF-06** | Logout button + confirmation                 | ✅ Implemented | Verify clears authStore + local data |
| **TR-PROF-07** | App version                                  | ✅ Implemented | None                                 |
| **TR-PROF-08** | Notification preferences toggle              | ❌ Missing     | Toggle push notifications            |

**Action Items:**

- [ ] Implement emergency contact edit with save
- [ ] Add notification preferences toggle
- [ ] Connect to real user data
- [ ] Ensure logout clears all data

---

### 💬 Post-Trip Feedback Screen — **Status: Missing (0%)**

| FR-ID          | Requirement                   | Current State | Required Fix                    |
| -------------- | ----------------------------- | ------------- | ------------------------------- |
| **TR-FEED-01** | Trigger on trip completion    | ❌ Missing    | Show modal once after trip ends |
| **TR-FEED-02** | 5-star rating                 | ❌ Missing    | Interactive stars               |
| **TR-FEED-03** | Text comment (500 char limit) | ❌ Missing    | TextArea with counter           |
| **TR-FEED-04** | Submit + thank you            | ❌ Missing    | Save to trip_feedback table     |
| **TR-FEED-05** | Skip without saving           | ❌ Missing    | Dismiss modal                   |

**Action Items:**

- [ ] **CREATE FeedbackScreen.tsx**
- [ ] Add star rating component
- [ ] Implement character counter
- [ ] Connect to Supabase trip_feedback table
- [ ] Add one-time display logic

---

### 🎯 First-Time Onboarding — **Status: Missing (0%)**

| FR-ID          | Requirement                 | Current State | Required Fix                    |
| -------------- | --------------------------- | ------------- | ------------------------------- |
| **TR-ONBD-01** | Show once after first login | ❌ Missing    | Check users.onboarding_complete |
| **TR-ONBD-02** | 3 walkthrough slides        | ❌ Missing    | Swipeable slides                |
| **TR-ONBD-03** | Skip anytime                | ❌ Missing    | Skip button                     |
| **TR-ONBD-04** | Get started → Trip List     | ❌ Missing    | Mark complete + navigate        |

**Action Items:**

- [ ] **CREATE OnboardingScreen.tsx**
- [ ] Implement swipeable slides
- [ ] Add skip/next buttons
- [ ] Set onboarding_complete flag on DB

---

### 🔌 Offline & Sync State (6 FRs) — **Status: Missing (0%)**

| FR-ID          | Requirement                             | Current State | Required Fix                       |
| -------------- | --------------------------------------- | ------------- | ---------------------------------- |
| **TR-SYNC-01** | Offline banner on loss of network       | ❌ Missing    | Add global OfflineBanner component |
| **TR-SYNC-02** | Disappears + "Back online" on reconnect | ❌ Missing    | Network status detection           |
| **TR-SYNC-03** | Sync indicator in header                | ❌ Missing    | Show during PowerSync sync         |
| **TR-SYNC-04** | Per-action offline messages             | ❌ Missing    | Feature-specific messages          |
| **TR-SYNC-05** | Pending sync badge                      | ❌ Missing    | Show "X actions pending"           |
| **TR-SYNC-06** | Last synced timestamp                   | ❌ Missing    | Show on Trip List footer           |

**Action Items:**

- [ ] Add network status detection (NetInfo)
- [ ] **CREATE OfflineBanner component**
- [ ] **CREATE SyncIndicator component**
- [ ] Implement offline queue tracking

---

## Technology Stack Status

| Technology         | Required       | Current           | Action                                     |
| ------------------ | -------------- | ----------------- | ------------------------------------------ |
| **Supabase**       | ✅ Critical    | ❌ Not integrated | Install @supabase/supabase-js              |
| **PowerSync**      | ✅ Critical    | ❌ Missing        | Install @powersync/powersync-js            |
| **Zustand**        | ✅ Critical    | ❌ Missing        | Install zustand                            |
| **Firebase (FCM)** | ✅ Critical    | ❌ Missing        | Install @react-native-firebase/messaging   |
| **NativeWind**     | ✅ Recommended | ⚠️ Not used       | Install nativewind (optional, for styling) |
| **React Query**    | ⚠️ Recommended | ❌ Missing        | Optional for server state                  |
| **Sentry**         | ⚠️ Recommended | ❌ Missing        | Error tracking (optional)                  |

---

## Installation & Setup Checklist

### Backend Services

- [ ] Set up Supabase project
- [ ] Create database schema (trips, pax, itinerary, attendance, hotels, etc.)
- [ ] Enable Row-Level Security (RLS)
- [ ] Set up Firebase Cloud Messaging (FCM)
- [ ] Deploy Supabase Edge Functions for hotel-checkin, etc.

### NPM Packages to Install

```bash
npm install @supabase/supabase-js zustand @react-native-firebase/messaging expo-app-loading
# Optional but recommended:
npm install @powersync/powersync-js @react-native-community/netinfo
```

### Configuration Files

- [ ] Create `.env.local` with Supabase URL + Anon Key
- [ ] Create FCM configuration
- [ ] Configure deep linking in app.json

### Code Changes Required

- [ ] Create Zustand stores (authStore, tripStore, syncStore)
- [ ] Create PowerSync provider wrapper
- [ ] Create FCM service handlers
- [ ] Replace mock auth with real Supabase auth
- [ ] Add offline banner component
- [ ] Add sync indicator component
- [ ] Create missing screens (Emergency, Feedback, Onboarding)

---

## Development Sprint Roadmap

### Sprint 1: Authentication & Foundation

- [ ] Install Supabase + Zustand
- [ ] Create authStore with persistence
- [ ] Replace mock login with real Supabase Auth
- [ ] Implement session management
- [ ] Add network detection

### Sprint 2: Offline & PowerSync

- [ ] Install PowerSync
- [ ] Create local SQLite schema
- [ ] Implement PowerSync provider
- [ ] Connect Trip List to PowerSync
- [ ] Add OfflineBanner + SyncIndicator

### Sprint 3: Push Notifications & FCM

- [ ] Install Firebase messaging
- [ ] Implement FCM token registration
- [ ] Create notification channels
- [ ] Add deep link routing
- [ ] Add in-app banner (Notifee)

### Sprint 4: Missing Screens

- [ ] Create EmergencyScreen
- [ ] Create FeedbackScreen
- [ ] Create OnboardingScreen
- [ ] Implement profile edit

### Sprint 5: Polish & Testing

- [ ] Connect all screens to PowerSync
- [ ] Test offline workflows
- [ ] Add animations (Lottie)
- [ ] Accessibility audit
- [ ] Performance testing

---

## Key Integration Points

### Supabase Tables to Sync

```
trips → Dashboard, Trip List
pax → Family Members, Attendance
itinerary → Itinerary, Dashboard
vehicles → Attendance, Emergency
attendance → Attendance, Dashboard
hotels → Hotel, Emergency
hotel_checkins → Hotel, Dashboard
notifications → Notifications
notif_receipts → Notifications (mark read)
users → Profile, Emergency
```

### FCM Notification Types

```
General → NotificationsScreen
Urgent → NotificationsScreen (red badge)
Departure → VehicleAttendanceScreen
Delay → ItineraryScreen
Emergency → NotificationsScreen (full screen)
Hotel → HotelScreen
```

### Deep Links to Implement

```
exp://...trip?id=<tripId>
exp://...trip/<tripId>/itinerary
exp://...trip/<tripId>/attendance
exp://...trip/<tripId>/hotel
exp://...trip/<tripId>/notifications
exp://...emergency
```

---

## References

- SRS Document: MyTripGuide_Traveler_App_SRS.md (May 2026)
- Architecture: React Native 0.81 + Expo 54
- Backend: Supabase PostgreSQL + Edge Functions
- Offline: PowerSync React Native SDK

---

**Last Updated**: May 5, 2026  
**Document Status**: Approved for Development  
**Next Review**: After Sprint 1 Completion
