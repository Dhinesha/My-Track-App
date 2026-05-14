# TrackMyTrip - Project Structure

**Last Updated:** May 14, 2026  
**Status:** ✅ Production Ready

---

## 📁 Directory Organization

```
TrackMyTrip/
├── .expo/                    # Expo configuration cache
├── .github/                  # GitHub workflows and CI/CD
├── android/                  # Android native code & build
│   ├── app/src/main/         # Android app source
│   └── gradle/               # Gradle build system
├── assets/                   # App-wide static assets
│   ├── onboarding/          # Onboarding screen images
│   ├── icon.png             # App icon
│   ├── splash-icon.png      # Splash screen icon
│   └── trackmytrip-logo.svg # App brand logo
├── docs/                     # Documentation (organized)
│   ├── AUDIT_SUMMARY.md
│   ├── FRONTEND_SETUP.md
│   ├── IMPLEMENTATION_CHECKLIST.md
│   ├── README_AUDIT.md
│   └── REQUIREMENTS_MAPPING.md
├── src/                      # Main source code
│   ├── assets/               # Component-specific assets
│   │   └── phrases.json      # Localization strings
│   ├── components/           # Reusable React components
│   │   ├── attendance/       # Attendance-related components
│   │   │   ├── DepartureCountdownTimer.tsx
│   │   │   ├── GroupHeadCountCard.tsx
│   │   │   ├── MissedCheckInBanner.tsx
│   │   │   ├── SelfCheckInSection.tsx
│   │   │   ├── VehicleInfoCard.tsx
│   │   │   └── index.ts
│   │   ├── auth/             # Authentication components
│   │   │   ├── OTPInput.tsx
│   │   │   ├── ResendOTPLink.tsx
│   │   │   └── index.ts
│   │   ├── common/           # Shared UI components (9 components)
│   │   │   ├── AlertDialog.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ConfirmDialog.tsx
│   │   │   ├── EmergencyFAB.tsx
│   │   │   ├── EmptyState.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── OTPInput.tsx
│   │   │   ├── SegmentedControl.tsx
│   │   │   ├── StatusPill.tsx
│   │   │   ├── TextInput.tsx
│   │   │   └── index.ts
│   │   ├── home/             # Home screen components
│   │   │   ├── HomeHeader.tsx
│   │   │   ├── OngoingTripBanner.tsx
│   │   │   ├── QuickShortcutRow.tsx
│   │   │   ├── UpcomingTripCard.tsx
│   │   │   └── index.ts
│   │   ├── hotel/            # Hotel-related components
│   │   │   └── index.ts
│   │   ├── itinerary/        # Itinerary components
│   │   │   └── index.ts
│   │   ├── notifications/    # Notification components
│   │   │   └── index.ts
│   │   ├── offline/          # Offline support components
│   │   │   ├── OfflineBanner.tsx
│   │   │   └── index.ts
│   │   ├── shared/           # System-level shared components
│   │   │   ├── SyncIndicator.tsx
│   │   │   ├── StoreTestPanel.tsx
│   │   │   └── index.ts
│   │   ├── trips/            # Trip-related components
│   │   │   └── index.ts
│   │   └── index.ts          # Barrel export for all components
│   ├── constants/            # App-wide constants
│   │   └── packingDefaults.ts
│   ├── core/                 # Core services & configuration
│   │   ├── supabase.ts      # Supabase client setup
│   │   └── powersync-mock.ts # PowerSync mock/fallback
│   ├── hooks/                # Custom React hooks (7 hooks)
│   │   ├── useAsync.ts
│   │   ├── useForm.ts
│   │   ├── useNetwork.ts
│   │   ├── useOffline.ts
│   │   └── index.ts
│   ├── navigation/           # Navigation setup
│   │   ├── MainTabNavigator.tsx
│   │   ├── navigationConstants.ts
│   │   └── navigationHelpers.ts
│   ├── screens/              # App screens
│   │   ├── auth/
│   │   │   └── OnboardingScreen.tsx
│   │   ├── emergency/
│   │   │   ├── EmergencyScreen.tsx
│   │   │   └── UrgentEmergencyScreen.tsx
│   │   ├── feedback/
│   │   ├── home/
│   │   │   └── TripHomeScreen.tsx
│   │   ├── trips/
│   │   │   ├── BudgetTrackerScreen.tsx
│   │   │   └── PackingChecklistScreen.tsx
│   │   ├── AdminDashboardScreen.tsx
│   │   ├── DashboardHomeScreen.tsx
│   │   ├── FamilyMembersScreen.tsx
│   │   ├── HotelScreen.tsx
│   │   ├── ItineraryScreen.tsx
│   │   ├── LoginScreen.tsx
│   │   ├── NotificationsScreen.tsx
│   │   ├── ProfileScreen.tsx
│   │   ├── SplashScreen.tsx
│   │   ├── TripDetailScreen.tsx
│   │   ├── VehicleAttendanceScreen.tsx
│   │   └── TripsListScreen.tsx
│   ├── services/             # Business logic services
│   │   └── notification.service.ts
│   ├── store/                # State management (Zustand)
│   │   ├── authStore.ts
│   │   ├── syncStore.ts
│   │   └── tripStore.ts
│   ├── theme/                # Design system tokens
│   │   ├── colors.ts        # Color palette & semantic colors
│   │   ├── spacing.ts       # Spacing, radius, shadows, animations
│   │   └── typography.ts    # Font styles & sizes
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts    # Data formatting helpers
│   │   └── validation.ts    # Form validation rules
│   ├── assets.ts            # Asset imports/exports
│   └── index.ts             # Root exports
├── App.tsx                  # Main app component
├── app.json                 # Expo app configuration
├── babel.config.js          # Babel transpilation config
├── eas.json                 # Expo Application Services config
├── global.css               # Global styles (Tailwind)
├── metro.config.js          # Metro bundler config
├── nativewind-env.d.ts      # NativeWind TypeScript definitions
├── tailwind.config.js       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # NPM dependencies & scripts
├── package-lock.json        # Dependency lock file
├── .gitignore               # Git ignore rules
├── README.md                # Project overview
└── PROJECT_STRUCTURE.md     # This file
```

---

## 🗂️ Key Folders Explained

### `/src/components`

**Organized by feature/domain for easy navigation:**

- **common/** - UI components used across the app (9 reusable components)
- **auth/** - Authentication UI components
- **attendance/** - Trip attendance tracking components
- **home/** - Home screen specific components
- **hotel/** - Hotel management components
- **itinerary/** - Trip itinerary components
- **notifications/** - Push notification UI
- **offline/** - Offline mode indicators
- **shared/** - System-level components (sync, testing)
- **trips/** - Trip list/management components

### `/src/screens`

**Screen components organized by feature:**

- **auth/** - Onboarding/login screens
- **emergency/** - Emergency contacts/SOS
- **feedback/** - User feedback screens
- **home/** - Home tab screens
- **trips/** - Trip management screens
- Root level: Dashboard, profile, notifications, hotel, itinerary screens

### `/src/store` (Zustand)

**State management stores:**

- `authStore.ts` - Authentication state
- `tripStore.ts` - Trip data & active trip
- `syncStore.ts` - Sync status & offline queue

### `/src/theme`

**Design system tokens:**

- `colors.ts` - 50+ color tokens with semantic naming
- `spacing.ts` - 8px-based spacing scale
- `typography.ts` - Font families, sizes, weights

### `/src/hooks`

**Reusable custom hooks:**

- `useForm` - Form state & validation
- `useAsync` - Async operations handling
- `useNetwork` - Network connectivity
- `useOffline` - Offline mode tracking

### `/src/utils`

**Helper functions:**

- `formatters.ts` - Date, time, currency, phone formatting
- `validation.ts` - Email, phone, OTP validation

### `/assets` (Root Level)

**Purpose:** Build-time app resources for Expo  
**Why kept at root:** Expo reads these during build process

- `icon.png` - App icon (iOS, Android, Web)
- `adaptive-icon.png` - Android adaptive icon
- `favicon.png` - Web browser favicon
- `splash-icon.png` - Splash screen for launch
- `onboarding/` - Onboarding flow images
- `trackmytrip-logo.svg` - App brand logo

**Referenced in:**

- `app.json` - Expo app metadata
- `eas.json` - Build configuration

---

### `/src/assets`

**Purpose:** Runtime assets loaded during app execution  
**When to add:** App logic needs these files

- `phrases.json` - Localization/translation strings

**Different from root `/assets`:**

- These are bundled with the app code
- Used by components at runtime
- Not for build system configuration

---

### `/docs`

**Project documentation:**

- `FRONTEND_SETUP.md` - Complete frontend guide
- `IMPLEMENTATION_CHECKLIST.md` - Feature checklist
- `AUDIT_SUMMARY.md` - Code audit findings
- `README_AUDIT.md` - Audit methodology
- `REQUIREMENTS_MAPPING.md` - Requirements traceability

---

## ✅ Cleanup Done

**Removed:**

- ❌ `App.tsx.bak` - Backup file
- ❌ `App.tsx.minimal` - Alternative version
- ❌ `core/supabase.ts` (root-level) - Moved to src/core/
- ❌ `docs/` (empty) - Replaced with populated docs folder
- ❌ `src/powersync/` (empty folder)
- ❌ `src/types/` (empty folder)
- ❌ `TrackMyTrip/` (duplicate folder)
- ❌ `MyTripGuide_Traveler_App_SRS.docx` (outdated)
- ❌ `src/assets/splash-icon.png` (duplicate) - Kept in root `/assets`

**Organized:**

- ✅ All documentation moved to `/docs`
- ✅ `supabase.ts` moved to `/src/core/`
- ✅ Empty folders removed
- ✅ Root directory cleaned
- ✅ Duplicate assets consolidated

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Build for web
npm run web
```

---

## 📝 Naming Conventions

### Components

- `PascalCase.tsx` for React components
- Group related components in folders with `index.ts` barrel exports
- Example: `components/common/Button.tsx` + `components/common/index.ts`

### Screens

- `PascalCase.tsx` for screen components
- Suffix with `Screen` for clarity
- Example: `screens/LoginScreen.tsx`

### Files & Folders

- `camelCase.ts` for utilities, hooks, services
- `kebab-case` for folders grouping similar items
- Example: `utils/formatters.ts`, `components/home/`

### Imports

Use barrel exports for cleaner imports:

```typescript
// ✅ Good
import { Button, Card, TextInput } from "../components";

// ❌ Avoid
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
```

---

## 🔧 Configuration Files

| File                  | Purpose                         |
| --------------------- | ------------------------------- |
| `tsconfig.json`       | TypeScript compilation settings |
| `tailwind.config.js`  | Tailwind CSS theming            |
| `babel.config.js`     | JS transformation rules         |
| `metro.config.js`     | React Native bundler config     |
| `eas.json`            | Expo build & deployment config  |
| `app.json`            | Expo app metadata               |
| `nativewind-env.d.ts` | NativeWind type definitions     |

---

## 📚 Next Steps

1. **Update imports** if any files reference the old locations
2. **Review** src/core/supabase.ts for correctness
3. **Document** any custom conventions specific to your team
4. **Backup** this structure document for future reference

---

**Project Status:** Ready for Development ✅
