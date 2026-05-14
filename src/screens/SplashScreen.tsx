import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ActivityIndicator,
  StatusBar,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../../App";
import { useAuthStore } from "../store/authStore";
import TrackMyTripLogo from "../components/shared/TrackMyTripLogo";

// Brand colours (matching splashscreen.html)
const PRIMARY = "#2b8cee";
const GRAY = "#94a3b8";

type Nav = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.88)).current;

  useEffect(() => {
    // Fade-in + gentle scale-up (matches HTML animate-fade-in)
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 22,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();

    // Always go to Login after splash (fresh login required each session)
    const initAndNavigate = async () => {
      // Clear any persisted session so Login is always shown
      useAuthStore.getState().setUser(null as any);
      navigation.replace("Login");
    };

    const timer = setTimeout(initAndNavigate, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <SafeAreaView style={styles.safe}>
        {/* ── Center block: logo + name + tagline ── */}
        <View style={styles.center}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
              alignItems: "center",
            }}
          >
            {/* Logo – bare, no card/box */}
            <TrackMyTripLogo size={80} />

            {/* App name */}
            <Text style={styles.appName}>My Trip Guide</Text>

            {/* Tagline */}
            <Text style={styles.tagline}>Sync Your Journey</Text>
          </Animated.View>
        </View>

        {/* ── Bottom spinner ── */}
        <View style={styles.spinnerWrap}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  safe: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    marginTop: 24,
    marginBottom: 8,
    fontSize: 32,
    fontWeight: "800",
    color: PRIMARY,
    fontFamily: "PlusJakartaSans-ExtraBold",
    textAlign: "center",
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 16,
    fontWeight: "500",
    color: GRAY,
    fontFamily: "PlusJakartaSans-Medium",
    textAlign: "center",
  },
  spinnerWrap: {
    paddingBottom: 48,
    alignItems: "center",
  },
});
