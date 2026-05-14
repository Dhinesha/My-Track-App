# TrackMyTrip - Development Guide

**Version:** 1.0  
**Last Updated:** May 14, 2026

---

## 📋 Table of Contents

1. [Development Setup](#development-setup)
2. [Project Structure](#project-structure)
3. [Component Development](#component-development)
4. [Screen Development](#screen-development)
5. [State Management](#state-management)
6. [Styling Guide](#styling-guide)
7. [Navigation](#navigation)
8. [Best Practices](#best-practices)
9. [Debugging](#debugging)
10. [Performance](#performance)

---

## Development Setup

### Initial Setup

```bash
# 1. Install Node.js 18+
node --version  # should be v18.0.0+

# 2. Install Expo CLI globally
npm install -g expo-cli

# 3. Install project dependencies
npm install

# 4. Start development server
npm start

# 5. Select platform:
# a - Android
# i - iOS
# w - Web
```

### Development Environment

**Recommended Tools:**

- VS Code with extensions:
  - ES7+ React/Redux/React-Native snippets
  - Tailwind CSS IntelliSense
  - TypeScript Vue Plugin
  - Thunder Client (for API testing)

**Emulators:**

- Android: Android Studio (Android 12+)
- iOS: Xcode (on Mac)
- Web: Chrome/Firefox

---

## Project Structure

### Core Folders

```
src/
├── components/      # Reusable UI components
├── screens/         # App screens
├── hooks/           # Custom React hooks
├── store/           # Zustand state stores
├── services/        # Business logic
├── theme/           # Design tokens
├── utils/           # Helper functions
├── navigation/      # Navigation config
├── core/            # Core services (Supabase, etc.)
└── constants/       # App constants
```

### Folder Ownership

| Folder                  | Purpose                     | When to Add                   |
| ----------------------- | --------------------------- | ----------------------------- |
| `components/common/`    | Shared UI components        | Reused in 2+ screens          |
| `components/[feature]/` | Feature-specific components | Only used in one feature      |
| `screens/`              | Full-screen components      | Navigation destination        |
| `hooks/`                | Custom React hooks          | Logic used in 2+ components   |
| `store/`                | Global state (Zustand)      | Data needed across screens    |
| `services/`             | Business logic              | Complex algorithms, API calls |
| `utils/`                | Pure utility functions      | Formatters, validators        |

---

## Component Development

### Basic Component Template

```typescript
// src/components/[feature]/MyComponent.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors } from '../../theme/colors';

interface MyComponentProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export function MyComponent({
  title,
  onPress,
  variant = 'primary'
}: MyComponentProps) {
  const bgColor = variant === 'primary'
    ? Colors.primary
    : Colors.secondary;

  return (
    <TouchableOpacity
      className="px-4 py-2 rounded-lg"
      onPress={onPress}
      style={{ backgroundColor: bgColor }}
    >
      <Text className="text-white font-semibold">
        {title}
      </Text>
    </TouchableOpacity>
  );
}
```

### Component File Structure

```
components/
├── feature/
│   ├── MyComponent.tsx       # Component implementation
│   ├── MyComponent.types.ts  # (optional) Type definitions
│   └── index.ts              # Export
```

### Barrel Export Pattern

```typescript
// src/components/myfeature/index.ts
export { MyComponent } from "./MyComponent";
export type { MyComponentProps } from "./MyComponent";

// Then import cleanly:
import { MyComponent } from "../components/myfeature";
```

### Styling Components

```typescript
// ✅ Use NativeWind/Tailwind classes
<View className="flex-1 items-center justify-center bg-white p-4 rounded-lg">
  <Text className="text-lg font-bold text-gray-900">Hello</Text>
</View>

// ✅ Use theme tokens for colors
import { Colors } from '../../theme/colors';
<View style={{ backgroundColor: Colors.primary }}>

// ✅ Combine both
<View
  className="p-4 rounded-lg"
  style={{ backgroundColor: Colors.primary }}
>
```

### Common Components Reference

```typescript
// Button
import { Button } from '../components';
<Button
  label="Click Me"
  variant="primary"  // primary | secondary | danger | outline | ghost
  size="lg"          // sm | md | lg
  fullWidth
  onPress={() => {}}
/>

// Card
import { Card } from '../components';
<Card className="p-4">
  <Text>Content</Text>
</Card>

// TextInput
import { TextInput } from '../components';
<TextInput
  label="Name"
  value={name}
  onChangeText={setName}
  error={error}
  icon="user"
/>

// Badge
import { Badge } from '../components';
<Badge variant="primary">Active</Badge>

// StatusPill
import { StatusPill } from '../components';
<StatusPill status="checked-in" />
```

---

## Screen Development

### Screen Template

```typescript
// src/screens/MyScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { Button, Card } from '../components';
import { Colors } from '../theme/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'MyScreen'>;

export default function MyScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const [data, setData] = useState(null);

  useEffect(() => {
    // Load data
  }, []);

  return (
    <View
      className="flex-1"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView className="flex-1 px-4">
        <Text className="text-2xl font-bold mb-4">My Screen</Text>

        {data && (
          <Card>
            {/* Content */}
          </Card>
        )}
      </ScrollView>

      <View className="p-4">
        <Button
          label="Next"
          onPress={() => navigation.navigate('NextScreen')}
        />
      </View>
    </View>
  );
}
```

### Screen Best Practices

1. **Use SafeAreaInsets** for proper padding
2. **Wrap main content in ScrollView** if needed
3. **Put action buttons in fixed footer**
4. **Use route params** for navigation data
5. **Add loading states** for async operations
6. **Handle empty states** gracefully

---

## State Management

### Using Zustand

```typescript
// src/store/myStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useMyStore = create(
  persist(
    (set, get) => ({
      // State
      count: 0,
      items: [] as string[],

      // Actions
      increment: () => set((state) => ({ count: state.count + 1 })),
      addItem: (item: string) => set((state) => ({
        items: [...state.items, item]
      })),

      // Getters
      getItemCount: () => get().items.length,

      // Async actions
      fetchItems: async () => {
        const items = await api.getItems();
        set({ items });
      },
    }),
    { name: 'my-store' }
  )
);

// Usage
import { useMyStore } from '../store/myStore';

function MyComponent() {
  const count = useMyStore(state => state.count);
  const increment = useMyStore(state => state.increment);

  return (
    <Button label={`Count: ${count}`} onPress={increment} />
  );
}
```

### Existing Stores

**authStore:**

```typescript
const { user, isAuthenticated, login, logout } = useAuthStore();
```

**tripStore:**

```typescript
const { activeTrip, trips, createTrip } = useTripStore();
```

**syncStore:**

```typescript
const { isSyncing, pending } = useSyncStore();
```

---

## Styling Guide

### Design Tokens

```typescript
// Colors
import { Colors } from "../theme/colors";
Colors.primary; // #1B6B8C
Colors.secondary; // #...
Colors.success; // Green
Colors.error; // Red
Colors.warning; // Orange
Colors.info; // Blue
Colors.background; // Light/dark depending on theme

// Spacing
import Spacing from "../theme/spacing";
Spacing.xs; // 4px
Spacing.sm; // 8px
Spacing.md; // 16px
Spacing.lg; // 24px
Spacing.xl; // 32px
Spacing.huge; // 40px
```

### NativeWind Classes

```typescript
// Layout
className = "flex-1 flex-row items-center justify-between";

// Padding/Margin
className = "p-4 pt-2 px-6 my-4";

// Colors
className = "bg-white text-gray-900 border border-gray-200";

// Rounded
className = "rounded-lg rounded-full rounded-t-lg";

// Shadow
className = "shadow-lg";

// Text
className = "text-lg font-semibold leading-tight";
```

### Color Variants

```typescript
// Light backgrounds
(bg - slate - 50, bg - gray - 50, bg - white);

// Primary colors
(bg - blue - 600, text - blue - 600);

// Status colors
(bg - green - 500, bg - red - 500, bg - yellow - 500);

// Neutral text
(text - gray - 900, text - gray - 600, text - gray - 400);
```

---

## Navigation

### Adding a New Screen

1. **Add to RootStackParamList (App.tsx):**

```typescript
export type RootStackParamList = {
  Splash: undefined;
  Main: undefined;
  MyNewScreen: { id: string }; // Params
};
```

2. **Add to Stack Navigator:**

```typescript
<Stack.Screen
  name="MyNewScreen"
  component={MyNewScreen}
  options={{ title: 'My Screen' }}
/>
```

3. **Navigate from another screen:**

```typescript
navigation.navigate("MyNewScreen", { id: "123" });
```

### Tab Navigation

Edit `src/navigation/MainTabNavigator.tsx` to add new tabs.

---

## Best Practices

### 1. **Component Props**

```typescript
// ✅ Good: Specific props interface
interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: "primary" | "secondary";
}

// ❌ Avoid: Generic any or object
function Button(props: any) {}
```

### 2. **State Management Decision Tree**

```
Local component state (useState)
    ↓ Needed by sibling?
    ↓ Use prop drilling or context
    ↓ Needed across many screens?
    ↓ Use Zustand store
```

### 3. **Imports**

```typescript
// ✅ Good: Use barrel exports
import { Button, Card } from "../components";
import { useNetwork } from "../hooks";
import { Colors } from "../theme/colors";

// ❌ Avoid: Deep imports
import Button from "../components/common/Button";
```

### 4. **Error Handling**

```typescript
// ✅ Good
try {
  await fetchData();
} catch (error) {
  NotificationService.error('Failed to load data');
  console.error('Error:', error);
}

// ✅ Good: Graceful degradation
const data = await fetchData().catch(() => null);
if (!data) return <EmptyState />;
```

### 5. **Performance**

```typescript
// ✅ Use memo for expensive components
export const MyComponent = React.memo(({ data }) => (
  <Text>{data}</Text>
));

// ✅ Use useCallback for callbacks
const handlePress = useCallback(() => {
  // Action
}, [dependencies]);

// ✅ Avoid inline functions
// ❌ Bad: <Button onPress={() => doSomething()} />
// ✅ Good: <Button onPress={handlePress} />
```

---

## Debugging

### Console Logging

```typescript
// Regular logging
console.log("Value:", value);

// Styled console
console.log("%c Debug", "color: blue; font-weight: bold", data);

// Error logging
console.error("Error:", error);
```

### React Native Debugger

1. **Download:** React Native Debugger (GitHub)
2. **Start:** `npm start`
3. **Shake phone** (or Cmd+M Android, Cmd+D iOS)
4. **Select:** "Open Debugger"

### Network Debugging

```typescript
// Log network requests
const response = await fetch(url);
console.log("Response:", response.status, response);
```

### Component Inspection

```typescript
// Print component props
console.log("Props:", props);

// Print state updates
const [count, setCount] = useState(0);
console.log("Count updated to:", count);
```

---

## Performance

### Optimization Tips

1. **Lazy Load Screens**

```typescript
const MyScreen = lazy(() => import("./MyScreen"));
```

2. **Optimize List Rendering**

```typescript
<FlatList
  data={items}
  renderItem={({ item }) => <Item item={item} />}
  keyExtractor={(item) => item.id}
  maxToRenderPerBatch={10}
  updateCellsBatchingPeriod={50}
/>
```

3. **Memoize Expensive Components**

```typescript
export const MyComponent = React.memo(MyComponentInner);
```

4. **Avoid Inline Objects**

```typescript
// ❌ Bad: Creates new object on every render
<View style={{ marginTop: 10 }}>

// ✅ Good: Style is constant
const styles = { marginTop: 10 };
<View style={styles}>
```

5. **Use Lazy Evaluation**

```typescript
// ✅ Only evaluate if needed
const hasItems = items.length > 0;
if (hasItems) {
  // Use items
}
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes and commit
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request on GitHub
```

### Commit Message Format

```
type(scope): subject

feat(auth): add OTP login
fix(trips): fix date parsing bug
docs(readme): update setup instructions
```

---

## Useful Commands

```bash
# Start dev server
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios

# Run on Web
npm run web

# Install new dependency
npm install package-name

# Type checking
npx tsc --noEmit

# Format code
npx prettier --write src/

# Update all packages
npm update
```

---

## Resources

- [React Native Docs](https://reactnative.dev)
- [Expo Documentation](https://docs.expo.dev)
- [React Navigation](https://reactnavigation.org)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS](https://tailwindcss.com)
- [NativeWind](https://www.nativewind.dev)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Last Updated:** May 14, 2026  
**Status:** ✅ Ready for Development
