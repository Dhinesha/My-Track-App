import React, { useEffect, useRef } from "react";
import { View, Text, Animated, StatusBar, useColorScheme } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { Colors } from "../theme/colors";
import { useAuthStore } from "../store/authStore";
import { useTripStore } from "../store/tripStore";
import Constants from "expo-constants";
import TrackMyTripLogo from "../components/shared/TrackMyTripLogo";

type Nav = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const colorScheme = useColorScheme();

  const { loadPersistedAuth } = useAuthStore();
  const { loadPersistedTrip } = useTripStore();

  useEffect(() => {
    // Fade-in and scale animation for main content
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for loading text
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.4,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();

    const initializeAndNavigate = async () => {
      // Load persisted data
      await loadPersistedAuth();
      await loadPersistedTrip();

      const authUser = useAuthStore.getState().user;
      const tripId = useTripStore.getState().activeTripId;

      if (authUser) {
        if (tripId) {
          navigation.replace("Main");
        } else {
          navigation.replace("Main"); // Or TripList if that's the home
        }
      } else {
        navigation.replace("Login");
      }
    };

    const timer = setTimeout(initializeAndNavigate, 2500);
    return () => clearTimeout(timer);
  }, []);

  const isDark = colorScheme === "dark";
  const bgColor = isDark ? "#101922" : "#f6f7f8";
  const textColor = isDark ? "#ffffff" : "#0f172a";
  const secondaryTextColor = isDark ? "#94a3b8" : "#64748b";

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: bgColor,
      }}
    >
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <SafeAreaView className="flex-1">
        {/* Background Pattern (optional subtle texture - not visible on mobile but kept for structure) */}
        <View className="absolute inset-0 opacity-5 pointer-events-none" />

        {/* Main Content */}
        <View className="flex-1 items-center justify-center">
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              alignItems: "center",
            }}
          >
            {/* Logo Container */}
            <View
              className="mb-6 items-center justify-center w-32 h-32 rounded-3xl shadow-lg"
              style={{
                backgroundColor: isDark ? "#1e293b" : "#ffffff",
                borderColor: isDark ? "#334155" : "#e2e8f0",
                borderWidth: 1,
              }}
            >
              <TrackMyTripLogo size={80} />
            </View>

            {/* App Name */}
            <Text
              className="text-4xl font-extrabold tracking-tight pb-2 pt-2 text-center"
              style={{
                color: Colors.primary,
              }}
            >
              MyTrip<span>Guide</span>
            </Text>

            {/* Tagline */}
            <Text
              className="text-lg font-medium leading-tight tracking-wide text-center px-4"
              style={{
                color: secondaryTextColor,
              }}
            >
              Sync Your Journey
            </Text>
          </Animated.View>
        </View>

        {/* Loading Indicator */}
        <View className="items-center justify-end pb-16">
          <Animated.Text
            style={{
              opacity: pulseAnim,
              color: isDark ? "#475569" : "#cbd5e1",
            }}
            className="text-xs font-semibold tracking-widest uppercase"
          >
            Loading...
          </Animated.Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
