# Frontend Plugins & Workflows — Complete Setup Guide

**Date**: May 5, 2026  
**Status**: ✅ Frontend Foundation Complete  
**Version**: 1.0

---

## 📦 What's Been Set Up

Your app now has a **complete frontend plugin and workflow system** with:

### ✅ 1. **Design System (Theme)**

- **Colors**: Comprehensive color tokens with semantic naming
- **Spacing**: 8px-based scale (xs=4px → huge=40px)
- **Radius**: Border radius tokens (sm=4px → full=999px)
- **Shadows**: Elevation system (sm, md, lg, xl)
- **Typography**: Font sizes, weights, families
- **Animations**: Predefined durations for consistency

**Files:**

- `src/theme/colors.ts` — Color palette
- `src/theme/typography.ts` — Font styles
- `src/theme/spacing.ts` — Spacing, radius, shadows, animations

### ✅ 2. **Common UI Components (9 Components)**

All components are **production-ready** with variants, sizes, and customization:

1. **Button** — Multiple variants (primary, secondary, danger, outline, ghost) and sizes (sm, md, lg)
2. **Card** — Container with shadow elevation, padding options, tapable
3. **TextInput** — Form input with validation, icons, error display, secure entry
4. **Badge** — Colored labels with icon support and size variants
5. **Avatar** — User initials with deterministic colors
6. **StatusPill** — Status indicators with icons (checked-in, pending, confirmed, etc.)
7. **AlertDialog** — Confirmation dialogs with custom buttons
8. **Loader** — Loading spinner overlay
9. **SegmentedControl** — Tab-like selector with multiple options

**Files:** `src/components/common/`

### ✅ 3. **Shared Components (3 Components)**

System-level components for app-wide features:

1. **OfflineBanner** — Shows when device is offline
2. **SyncIndicator** — Shows sync progress and pending actions
3. **EmptyState** — Friendly empty list/no-data states

**Files:** `src/components/shared/`

### ✅ 4. **Services (Notification Service)**

**NotificationService** — Cross-platform notifications

- `showToast()` — Native toast/alert
- `success()`, `error()`, `info()`, `warning()` — Typed notifications
- `confirm()` — Confirmation dialogs
- `alert()` — Alert dialogs

**Files:** `src/services/notification.service.ts`

### ✅ 5. **Utilities (2 Modules)**

**Validation** — Form validation rules

- `isValidPhone()` — Indian 10-digit validation
- `isValidEmail()` — Email validation
- `isValidOTP()` — 6-digit OTP
- `getErrorMessage()` — Semantic error messages

**Formatters** — Data formatting helpers

- `formatPhone()` — +91 XXX XXX XXXX format
- `formatDate()` — DD MMM YYYY
- `formatTime()` — HH:MM AM/PM
- `formatTimeAgo()` — "2 hours ago"
- `formatCurrency()` — ₹999 format
- `formatDayCount()` — "Day 3 of 7"
- `getInitials()` — Name to initials
- And 5 more formatters...

**Files:**

- `src/utils/validation.ts`
- `src/utils/formatters.ts`

### ✅ 6. **Custom Hooks (5 Hooks)**

Reusable React hooks for common patterns:

1. **useForm()** — Complete form state management with validation
2. **useFormField()** — Single form field management
3. **useAsync()** — Handle async operations (loading, error, success)
4. **useAppState()** — Track app foreground/background
5. **useLoading()** — Simple loading state
6. **useModal()** — Modal/dialog visibility management
7. **useNetwork()** — Network connectivity tracking

**Files:** `src/hooks/`

### ✅ 7. **Navigation Setup**

Navigation constants and helpers:

- **navigationConstants.ts** — Route names and deep link paths
- **navigationHelpers.ts** — Navigation utility functions

**Files:** `src/navigation/`

### ✅ 8. **Component Exports**

Barrel exports for easy importing:

```typescript
// Instead of this:
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";

// Do this:
import { Button, Card } from "../components";
```

---

## 🚀 How to Use

### 1. **Using UI Components**

```typescript
import { Button, Card, TextInput, Badge } from '../components';

export default function MyScreen() {
  return (
    <Card>
      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        error={error}
      />

      <Button
        label="Submit"
        onPress={handleSubmit}
        variant="primary"
        size="lg"
        fullWidth
      />

      <Badge label="Active" variant="success" />
    </Card>
  );
}
```

### 2. **Using Custom Hooks**

**Form Management:**

```typescript
import { useForm } from '../hooks';

export default function LoginScreen() {
  const form = useForm(
    { phone: '' },
    {
      onValidate: (values) => {
        const errors = {};
        if (!values.phone) errors.phone = 'Phone required';
        return errors;
      },
      onSubmit: async (values) => {
        await loginUser(values);
      },
    }
  );

  return (
    <TextInput
      value={form.values.phone}
      onChangeText={(val) => form.handleChange('phone', val)}
      error={form.errors.phone}
    />
  );
}
```

**Network Detection:**

```typescript
import { useNetwork } from '../hooks';

export default function MyScreen() {
  const { isOnline, isWifi } = useNetwork();

  if (!isOnline) {
    return <OfflineBanner visible />;
  }

  return <YourContent />;
}
```

**Async Operations:**

```typescript
import { useAsync } from '../hooks';

export default function DataScreen() {
  const { value: data, isLoading, error } = useAsync(
    () => fetchData(),
    true // Run immediately
  );

  if (isLoading) return <Loader visible />;
  if (error) return <EmptyState title="Error loading data" />;

  return <DataList data={data} />;
}
```

### 3. **Using Notifications**

```typescript
import { NotificationService } from "../services/notification.service";

// Simple notifications
NotificationService.success("Operation successful!");
NotificationService.error("Something went wrong");
NotificationService.warning("Please check this");

// Confirmation dialog
NotificationService.confirm(
  "Logout?",
  "Are you sure you want to logout?",
  () => handleLogout(),
  () => console.log("Cancelled"),
);
```

### 4. **Using Validation**

```typescript
import { Validation } from "../utils/validation";

// Validate phone
if (!Validation.isValidPhone(phoneNumber)) {
  const error = Validation.getErrorMessage("phone", "invalid");
  setPhoneError(error);
}

// Validate email
if (!Validation.isValidEmail(email)) {
  // Invalid email
}
```

### 5. **Using Formatters**

```typescript
import {
  formatPhone,
  formatDate,
  formatTime,
  formatTimeAgo,
  formatCurrency,
  getInitials,
} from "../utils/formatters";

const phone = formatPhone("9999999999"); // +91 999 999 9999
const date = formatDate(new Date()); // 05 May 2026
const time = formatTime(new Date()); // 02:30 PM
const ago = formatTimeAgo("2 hours"); // 2h ago
const price = formatCurrency(500); // ₹500
const initials = getInitials("John Doe"); // JD
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx ✨
│   │   ├── Card.tsx ✨
│   │   ├── TextInput.tsx ✨
│   │   ├── Badge.tsx ✨
│   │   ├── Avatar.tsx ✨
│   │   ├── StatusPill.tsx ✨
│   │   ├── AlertDialog.tsx ✨
│   │   ├── Loader.tsx ✨
│   │   ├── SegmentedControl.tsx ✨
│   │   └── index.ts (barrel export)
│   ├── shared/
│   │   ├── OfflineBanner.tsx ✨
│   │   ├── SyncIndicator.tsx ✨
│   │   ├── EmptyState.tsx ✨
│   │   └── index.ts (barrel export)
│   └── index.ts (main export)
├── hooks/
│   ├── useForm.ts ✨
│   ├── useAsync.ts ✨
│   ├── useNetwork.ts ✨
│   └── index.ts (barrel export)
├── services/
│   └── notification.service.ts ✨
├── utils/
│   ├── validation.ts ✨
│   └── formatters.ts ✨
├── theme/
│   ├── colors.ts (enhanced)
│   ├── typography.ts (existing)
│   └── spacing.ts ✨ (new)
└── navigation/
    ├── navigationConstants.ts ✨
    └── navigationHelpers.ts ✨

✨ = New or enhanced
```

---

## 🎯 Component Features at a Glance

| Component            | Variants                                                      | Sizes          | Features                                       |
| -------------------- | ------------------------------------------------------------- | -------------- | ---------------------------------------------- |
| **Button**           | primary, secondary, danger, outline, ghost                    | sm, md, lg     | loading, disabled, icons, fullWidth            |
| **Card**             | —                                                             | —              | elevation, padding, onPress, borderRadius      |
| **TextInput**        | —                                                             | —              | validation, icons, secureEntry, counter, error |
| **Badge**            | success, error, warning, info, neutral, primary               | sm, md, lg     | icon support                                   |
| **Avatar**           | —                                                             | sm, md, lg, xl | initials, deterministic colors                 |
| **StatusPill**       | checked-in, pending, confirmed, completed, delayed, cancelled | sm, md, lg     | icons, animations                              |
| **AlertDialog**      | —                                                             | —              | confirmation, dangerous variant                |
| **Loader**           | —                                                             | small, large   | custom colors                                  |
| **SegmentedControl** | —                                                             | —              | multiple options, selected state               |

---

## 🎨 Theme Tokens Reference

### Spacing Scale

```typescript
Spacing = {
  xs: 4, // Tight spacing
  sm: 8, // Small gaps
  md: 12, // Medium (default)
  lg: 16, // Large sections
  xl: 20,
  xxl: 24, // Extra large
  xxxl: 32,
  huge: 40, // Very large
};
```

### Color Palette

```typescript
Colors = {
  primary: '#2979FF',           // Brand blue
  white: '#FFFFFF',
  black: '#212121',              // Primary text
  text: { primary, secondary, muted, inverse },
  background: { default, card, input, blue },
  status: { success, error, warning, info, ongoing, upcoming, inactive },
  badge: { greenBg, greenText, blueBg, ... },
  border: { light, default },
  nav: { active, inactive },
}
```

### Border Radius

```typescript
Radius = {
  none: 0,
  sm: 4, // Subtle curves
  md: 8, // Buttons, inputs
  lg: 12, // Cards
  xl: 16, // Large elements
  xxl: 24, // Extra large
  full: 999, // Perfect circles
};
```

### Shadows/Elevation

```typescript
Shadows = {
  sm: { elevation: 2 }, // Subtle shadow
  md: { elevation: 4 }, // Default shadow
  lg: { elevation: 6 }, // Prominent shadow
  xl: { elevation: 8 }, // Very prominent shadow
};
```

---

## 🔄 Best Practices

### 1. **Component Usage**

- Always use barrel exports: `import { Button } from '../components'`
- Pass variant and size for consistency
- Keep components simple and focused

### 2. **Form Handling**

- Use `useForm()` for multi-field forms
- Use `useFormField()` for single-field components
- Validate on blur and submit

### 3. **Error Handling**

- Use `NotificationService` for all user feedback
- Use semantic error messages from `Validation`
- Always show loading states during async operations

### 4. **Network Awareness**

- Check `useNetwork()` before making API calls
- Show `OfflineBanner` when offline
- Queue actions for sync when back online

### 5. **Navigation**

- Use navigation helpers from `navigationHelpers.ts`
- Always pass required params to navigate functions
- Use deep links for push notifications

---

## 🔧 Extending the System

### Add a New Component

1. **Create file:** `src/components/common/NewComponent.tsx`
2. **Export in:** `src/components/common/index.ts`
3. **Export in:** `src/components/index.ts`

### Add a New Hook

1. **Create file:** `src/hooks/useNewHook.ts`
2. **Export in:** `src/hooks/index.ts`

### Add Validation Rules

1. **Edit:** `src/utils/validation.ts`
2. **Add new rule method**
3. **Use in forms**

---

## ✅ Checklist for Screen Implementation

- [ ] Import all needed components from `../components`
- [ ] Use hooks for state management
- [ ] Add validation using `Validation` utilities
- [ ] Show `OfflineBanner` if needed
- [ ] Use `NotificationService` for feedback
- [ ] Use formatters for data display
- [ ] Check network state for critical actions
- [ ] Add loading states with `useLoading()`
- [ ] Provide empty states with `EmptyState`
- [ ] Test on different screen sizes

---

## 📚 Example: Complete Refactored Screen

See `src/screens/LoginScreenRefactored.example.tsx` for a complete example of:

- Using all the new components
- Form validation
- Network detection
- Notifications
- Proper styling

---

## 🚀 Next Steps

1. **Review** the example refactored login screen
2. **Refactor** existing screens to use new components
3. **Install backend packages** (Supabase, PowerSync, FCM)
4. **Connect backend** to replace mock data
5. **Test** on physical devices

---

## 📞 Component API Quick Reference

```typescript
// Button
<Button
  label="Click Me"
  onPress={() => {}}
  variant="primary" | "secondary" | "danger" | "outline" | "ghost"
  size="sm" | "md" | "lg"
  loading={false}
  disabled={false}
  fullWidth
/>

// Card
<Card
  onPress={() => {}}
  elevation="sm" | "md" | "lg" | "xl"
  padding="none" | "sm" | "md" | "lg"
/>

// TextInput
<TextInput
  label="Field Name"
  value=""
  onChangeText={() => {}}
  error="Error message"
  keyboardType="default" | "email-address" | "numeric" | "phone-pad"
  secureTextEntry
  leftIcon="icon-name"
  rightIcon="icon-name"
/>

// Badge
<Badge
  label="Label"
  variant="success" | "error" | "warning" | "info" | "neutral" | "primary"
  size="sm" | "md" | "lg"
/>

// And more...
```

---

**Status**: ✅ Frontend Foundation Complete  
**Ready for**: Backend Integration (Sprint 1)  
**Location**: All files in `src/`
