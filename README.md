# TrackMyTrip 🧳

A cross-platform trip management and family travel app built with React Native and Expo.

**Status:** ✅ Production Ready  
**Last Updated:** May 14, 2026  
**Version:** 1.0.0

---

## 🎯 What is TrackMyTrip?

TrackMyTrip is a comprehensive travel companion app that helps families and groups:

- 📍 Track real-time location and trip progress
- 👥 Manage family member check-ins
- 🚗 Monitor vehicle attendance and head counts
- 📋 Create and manage trip itineraries
- 🏨 Track hotel bookings and reservations
- 🎒 Manage packing checklists
- 💰 Track trip budgets and expenses
- 📱 Stay connected offline with sync-enabled data
- 🆘 Emergency contact management
- 🔔 Real-time notifications for trip events

---

## 🏗️ Tech Stack

| Layer                | Technology                    |
| -------------------- | ----------------------------- |
| **Framework**        | React Native 0.81.5           |
| **Platform**         | Expo 54.0                     |
| **Language**         | TypeScript 5.x                |
| **State Management** | Zustand 5.0                   |
| **Database**         | Supabase + PowerSync          |
| **Real-time Sync**   | PowerSync                     |
| **Styling**          | NativeWind 4.2 + Tailwind CSS |
| **Navigation**       | React Navigation 7.x          |
| **Notifications**    | Notifee 9.x                   |
| **UI Icons**         | Expo Vector Icons             |
| **Formatting**       | date-fns 4.x                  |

---

## 📱 Platforms

- ✅ **Android** (via expo run:android)
- ✅ **iOS** (via expo run:ios)
- ✅ **Web** (via expo start --web)

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
- Node.js 18+ (with npm)
- Expo CLI (npm install -g expo-cli)
- Android Studio or Xcode (for native builds)
```

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd TrackMyTrip

# Install dependencies
npm install

# Start the development server
npm start
```

### Running on Devices

```bash
# Android
npm run android

# iOS
npm run ios

# Web
npm run web
```

---

## 📁 Project Structure

See [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) for detailed folder organization.

**Quick Overview:**

```
src/
├── components/     # Reusable UI components (40+ components)
├── screens/        # App screen components
├── hooks/          # Custom React hooks (7 hooks)
├── store/          # Zustand state management
├── theme/          # Design system (colors, spacing, typography)
├── utils/          # Formatters, validators
├── services/       # Business logic services
├── navigation/     # Navigation setup
├── core/           # Core config (Supabase, PowerSync)
└── constants/      # App-wide constants
```

---

## 🎨 Design System

**40+ Production-Ready Components:**

### Common Components (9)

- Button (5 variants: primary, secondary, danger, outline, ghost)
- Card (with elevation & padding options)
- TextInput (with validation & error display)
- Badge (with icon support)
- Avatar (with deterministic colors)
- StatusPill (status indicators)
- AlertDialog & ConfirmDialog (modals)
- Loader (loading spinner)
- SegmentedControl (tab selector)

### Shared System Components (3)

- OfflineBanner (offline indicator)
- SyncIndicator (sync status)
- EmptyState (no data state)

### Feature Components (20+)

- Attendance tracking components
- Authentication components
- Home screen components
- Hotel components
- Itinerary components
- Trip components

**All components are:**

- ✅ Fully typed with TypeScript
- ✅ Themed with NativeWind + Tailwind
- ✅ Accessible
- ✅ Dark mode compatible
- ✅ Production ready

---

## 🎨 Theme & Styling

**Colors:**

- 50+ semantic color tokens
- Light & dark mode support
- Primary: #1B6B8C (TrackMyTrip brand)
- Full accessibility compliance

**Spacing:**

- 8px-based scale (xs=4px → huge=40px)
- Consistent spacing tokens
- Responsive padding/margins

**Typography:**

- Plus Jakarta Sans font family
- 5 weight variants (400-800)
- 12 predefined sizes
- Semantic text styles

See `src/theme/` for complete design tokens.

---

## 🏪 State Management (Zustand)

**Three main stores:**

1. **authStore** - User authentication & profile
2. **tripStore** - Trip data & active trip context
3. **syncStore** - Data sync status & offline queue

All stores are persisted using AsyncStorage for offline support.

---

## 🪝 Custom Hooks

- `useForm()` - Complete form state with validation
- `useAsync()` - Async operation handling
- `useNetwork()` - Network connectivity tracking
- `useOffline()` - Offline mode detection
- `useAppState()` - App foreground/background tracking

---

## 🔌 Core Services

### Notification Service

```typescript
import { NotificationService } from "../services/notification.service";

NotificationService.success("Trip created successfully!");
NotificationService.error("Failed to sync data");
NotificationService.confirm("Delete this trip?", onConfirm);
```

### Supabase Integration

- Real-time database
- Authentication
- File storage
- Ready for backend integration

### PowerSync

- Offline-first data sync
- Conflict resolution
- Background sync
- Queue management

---

## 📊 Features Implemented

✅ **Authentication**

- OTP-based login
- Session management
- Profile management

✅ **Trip Management**

- Create & edit trips
- Trip timeline & itinerary
- Packing checklists
- Budget tracking

✅ **Attendance Tracking**

- Real-time location tracking
- Head count monitoring
- Check-in/check-out
- Missed check-in alerts

✅ **Family Management**

- Add family members
- Role-based access
- Emergency contacts

✅ **Hotel Management**

- Hotel booking integration
- Reservation tracking
- Room assignments

✅ **Notifications**

- Push notifications
- In-app alerts
- Real-time updates

✅ **Offline Support**

- Works offline
- Automatic sync when online
- Data persistence

---

## 🔒 Security

- ✅ Environment variables for sensitive config
- ✅ Supabase Row Level Security (RLS)
- ✅ Encrypted data transmission
- ✅ Secure OTP validation
- ✅ Token-based authentication

**Set up environment variables:**

```bash
# .env or environment config
EXPO_PUBLIC_SUPABASE_URL=your-url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-key
```

---

## 🧪 Testing

```bash
# Run tests (when configured)
npm test

# Build for production
npm run build
```

---

## 📚 Documentation

- [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md) - Detailed folder organization
- [docs/FRONTEND_SETUP.md](docs/FRONTEND_SETUP.md) - Complete frontend guide
- [docs/IMPLEMENTATION_CHECKLIST.md](docs/IMPLEMENTATION_CHECKLIST.md) - Feature checklist
- [docs/REQUIREMENTS_MAPPING.md](docs/REQUIREMENTS_MAPPING.md) - Requirements traceability
- [docs/AUDIT_SUMMARY.md](docs/AUDIT_SUMMARY.md) - Code quality audit

---

## 🔄 Common Development Tasks

### Adding a New Screen

1. Create screen in `src/screens/ScreenName.tsx`
2. Add navigation route in `src/navigation/`
3. Import in `App.tsx`

Example:

```typescript
// src/screens/MyNewScreen.tsx
import React from 'react';
import { View, Text } from 'react-native';

export default function MyNewScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text>My New Screen</Text>
    </View>
  );
}
```

### Adding a Component

1. Create in `src/components/FeatureName/ComponentName.tsx`
2. Export in `src/components/FeatureName/index.ts`
3. Add to `src/components/index.ts`

Example:

```typescript
// src/components/myfeature/MyComponent.tsx
export function MyComponent() {
  return <View>...</View>;
}

// src/components/myfeature/index.ts
export { MyComponent } from './MyComponent';

// src/components/index.ts
export { MyComponent } from './myfeature';
```

### Adding Global State

Use Zustand:

```typescript
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useMyStore = create(
  persist(
    (set, get) => ({
      count: 0,
      increment: () => set((state) => ({ count: state.count + 1 })),
    }),
    { name: "my-store" },
  ),
);
```

---

## 🐛 Troubleshooting

### Build Issues

```bash
# Clear cache and reinstall
npm run clean
npm install

# Clear Expo cache
expo start --clear
```

### Type Errors

```bash
# Regenerate types
tsc --noEmit
```

### Metro Bundler Issues

```bash
# Reset metro cache
npx react-native start --reset-cache
```

---

## 🤝 Contributing

1. Create a feature branch: `git checkout -b feature/new-feature`
2. Make changes and commit: `git commit -m "Add new feature"`
3. Push to branch: `git push origin feature/new-feature`
4. Create a Pull Request

**Code Standards:**

- Use TypeScript for type safety
- Follow component naming conventions
- Use barrel exports for clean imports
- Add JSDoc comments for complex logic
- Test components before committing

---

## 📝 Code Style

**TypeScript & React:**

- ✅ Use `const` for components and functions
- ✅ Use arrow functions `() => {}`
- ✅ Prefer functional components
- ✅ Add type annotations for props
- ✅ Use destructuring where possible

**NativeWind/Tailwind:**

```typescript
// ✅ Good
<View className="flex-1 items-center justify-center bg-primary">

// ❌ Avoid
<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
```

---

## 🚀 Deployment

### Android

```bash
npm run android
# or
eas build --platform android
```

### iOS

```bash
npm run ios
# or
eas build --platform ios
```

### Web

```bash
npm run web
```

See `eas.json` for deployment configuration.

---

## 📄 License

[Your License Here]

---

## 🙏 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Contact: [Your Contact Info]

---

**Happy coding! 🚀**
