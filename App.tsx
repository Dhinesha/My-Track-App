import "./global.css";
import "react-native-gesture-handler";
import React, { useState, useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreenNative from "expo-splash-screen";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from "@expo-google-fonts/plus-jakarta-sans";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import {
  View,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Colors } from "./src/theme/colors";

// Screens
import SplashScreen from "./src/screens/SplashScreen";
import LoginScreen from "./src/screens/LoginScreen";
import OnboardingScreen from "./src/screens/auth/OnboardingScreen";
import MainTabNavigator from "./src/navigation/MainTabNavigator";
import TripDetailScreen from "./src/screens/TripDetailScreen";
import ItineraryScreen from "./src/screens/ItineraryScreen";
import HotelScreen from "./src/screens/HotelScreen";
import VehicleAttendanceScreen from "./src/screens/VehicleAttendanceScreen";
import FamilyMembersScreen from "./src/screens/FamilyMembersScreen";
import NotificationsScreen from "./src/screens/NotificationsScreen";
import AdminDashboardScreen from "./src/screens/AdminDashboardScreen";
import EmergencyScreen from "./src/screens/emergency/EmergencyScreen";
import FeedbackScreen from "./src/screens/feedback/FeedbackScreen";
import PackingChecklistScreen from "./src/screens/trips/PackingChecklistScreen";
import BudgetTrackerScreen from "./src/screens/trips/BudgetTrackerScreen";
import PersonalInformationScreen from "./src/screens/PersonalInformationScreen";
import { StoreTestPanel } from "./src/components/shared/StoreTestPanel";
import { OfflineBanner } from "./src/components/offline";

// Stores for initialization
import { useAuthStore } from "./src/store/authStore";
import { useTripStore } from "./src/store/tripStore";

export type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Onboarding: undefined;
  Main: undefined;
  TripDetail: { tripId: string; tripName: string; tripStatus?: string };
  Itinerary: { tripId: string; tripName: string };
  Hotel: { tripId: string };
  VehicleAttendance: { tripId: string };
  FamilyMembers: { tripId: string };
  Notifications: undefined;
  AdminDashboard: undefined;
  Emergency: undefined;
  Feedback: { tripId: string; tripName: string; paxId: string };
  PackingChecklist: { tripId: string; tripName: string; tripType: string };
  BudgetTracker: { tripId: string; totalDays: number };
  PersonalInformation: undefined;
};

const NativeStack = createNativeStackNavigator<RootStackParamList>();
const JSStack = createStackNavigator<RootStackParamList>();

function AppNavigator() {
  console.log("AppNavigator rendering...");
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
    "PlusJakartaSans-Regular": PlusJakartaSans_400Regular,
    "PlusJakartaSans-Medium": PlusJakartaSans_500Medium,
    "PlusJakartaSans-SemiBold": PlusJakartaSans_600SemiBold,
    "PlusJakartaSans-Bold": PlusJakartaSans_700Bold,
    "PlusJakartaSans-ExtraBold": PlusJakartaSans_800ExtraBold,
  });

  const [isLoading, setIsLoading] = useState(true);
  const { setUser } = useAuthStore();
  const { setActiveTrip } = useTripStore();

  useEffect(() => {
    // Initialize demo data for web - COMMENTED OUT TO SHOW LOGIN SCREEN
    // if (Platform.OS === "web") {
    //   setUser({
    //     id: "demo-user-1",
    //     name: "Dhinesha Gnanavel",
    //     mobile: "+91 98765 43210",
    //     role: "traveler",
    //   });
    //   setActiveTrip("demo-trip-kyoto", "Kyoto Spring Tour");
    // }

    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || !fontsLoaded) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: Colors.primary,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="#fff" size="large" />
        <Text
          style={{
            color: "white",
            marginTop: 20,
            fontFamily: "PlusJakartaSans_700Bold",
          }}
        >
          Loading Premium Experience...
        </Text>
      </View>
    );
  }

  const Stack = Platform.OS === "web" ? JSStack : NativeStack;

  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Main" component={MainTabNavigator} />
      <Stack.Screen name="TripDetail" component={TripDetailScreen} />
      <Stack.Screen name="Itinerary" component={ItineraryScreen} />
      <Stack.Screen name="Hotel" component={HotelScreen} />
      <Stack.Screen
        name="VehicleAttendance"
        component={VehicleAttendanceScreen}
      />
      <Stack.Screen name="FamilyMembers" component={FamilyMembersScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
      />
      <Stack.Screen name="Emergency" component={EmergencyScreen} />
      <Stack.Screen name="Feedback" component={FeedbackScreen} />
      <Stack.Screen name="PackingChecklist" component={PackingChecklistScreen} />
      <Stack.Screen name="BudgetTracker" component={BudgetTrackerScreen} />
      <Stack.Screen name="PersonalInformation" component={PersonalInformationScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  console.log("App rendering, platform:", Platform.OS);
  if (Platform.OS === "web") {
    return (
      <SafeAreaProvider style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <OfflineBanner />
        <NavigationContainer>
          <View style={styles.webBg}>
            {/* Background glow blobs */}
            <View style={styles.blob1} />
            <View style={styles.blob2} />
            <View style={styles.blob3} />

            {/* Phone mockup */}
              <View style={styles.phoneBody}>
                {/* Status bar / notch area */}
                {/* App Screen */}
                <View style={styles.screen}>
                  <AppNavigator />
                </View>

                {/* Home indicator */}
                <View style={styles.homeBar}>
                  <View style={styles.homeBar_pill} />
                </View>
              </View>

            {/* Brand watermark */}
            <View style={styles.watermark}>
              <View style={styles.wmDot} />
              <View style={styles.wmLine} />
              <View style={styles.wmDot} />
            </View>

            <StoreTestPanel />
          </View>
        </NavigationContainer>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <StatusBar style="auto" />
      <OfflineBanner />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const PW = 390; // phone width
const PH = 844; // phone height

const styles = StyleSheet.create({
  webBg: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#080c14",
    minHeight: "100vh" as any,
    width: "100vw" as any,
    overflow: "hidden" as any,
  },

  /* Glowing background orbs */
  blob1: {
    position: "absolute",
    width: 600,
    height: 600,
    borderRadius: 300,
    backgroundColor: "#2b8cee",
    opacity: 0.07,
    top: -200,
    left: -200,
  },
  blob2: {
    position: "absolute",
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: "#7c3aed",
    opacity: 0.07,
    bottom: -150,
    right: -120,
  },
  blob3: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#06b6d4",
    opacity: 0.05,
    top: "30%" as any,
    right: "10%" as any,
  },

  /* Outer frame (holds side buttons too) */
  phoneOuter: {
    width: PW + 24,
    height: PH + 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },

  /* Physical buttons on left side */
  btnVolUp: {
    position: "absolute",
    left: 0,
    top: 130,
    width: 4,
    height: 34,
    borderRadius: 2,
    backgroundColor: "#1e3a5f",
  },
  btnVolDown: {
    position: "absolute",
    left: 0,
    top: 176,
    width: 4,
    height: 34,
    borderRadius: 2,
    backgroundColor: "#1e3a5f",
  },
  /* Power button on right */
  btnPower: {
    position: "absolute",
    right: 0,
    top: 156,
    width: 4,
    height: 64,
    borderRadius: 2,
    backgroundColor: "#1e3a5f",
  },

  /* Phone body/shell */
  phoneBody: {
    width: PW,
    height: PH,
    borderRadius: 52,
    backgroundColor: "#fff",
    borderWidth: 2.5,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    // Subtle sky blue glow shadow
    ...(Platform.OS === "web"
      ? { boxShadow: "0 0 40px rgba(14, 165, 233, 0.15)" }
      : {
          shadowColor: "#0ea5e9",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.15,
          shadowRadius: 40,
          elevation: 40,
        }),
  },

  /* Top status bar */
  topBar: {
    height: 48,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  topBarLeft: { flex: 1 },
  timeBlock: {
    width: 44,
    height: 10,
    borderRadius: 3,
    backgroundColor: "#fff",
    opacity: 0.75,
  },
  dynamicIsland: {
    width: 126,
    height: 34,
    borderRadius: 20,
    backgroundColor: "#111",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#1a1a2e",
  },
  islandCamera: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#1c1c1e",
    borderWidth: 1.5,
    borderColor: "#2b8cee33",
  },
  topBarRight: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 5,
  },
  sigIcon: {
    width: 12,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#fff",
    opacity: 0.65,
  },
  wifiIcon: {
    width: 14,
    height: 10,
    borderRadius: 2,
    backgroundColor: "#fff",
    opacity: 0.65,
  },
  battIcon: {
    width: 22,
    height: 11,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: "#ffffff88",
    backgroundColor: "#2b8cee",
    opacity: 0.9,
  },

  /* Scrollable app screen */
  screen: {
    flex: 1,
    backgroundColor: "#fff",
    overflow: "hidden" as any,
  },

  /* Home indicator at bottom */
  homeBar: {
    height: 30,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  homeBar_pill: {
    width: 134,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#64748b",
    opacity: 0.5,
  },

  /* Bottom decorative watermark */
  watermark: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 18,
    opacity: 0.2,
  },
  wmDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: "#2b8cee" },
  wmLine: { width: 60, height: 1, backgroundColor: "#475569" },
});
