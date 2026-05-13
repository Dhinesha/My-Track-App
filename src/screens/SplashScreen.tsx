import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  ActivityIndicator,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import { Colors } from "../theme/colors";
import { useAuthStore } from "../store/authStore";
import { useTripStore } from "../store/tripStore";
import Constants from "expo-constants";

type Nav = NativeStackNavigationProp<RootStackParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<Nav>();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const { loadPersistedAuth } = useAuthStore();
  const { loadPersistedTrip } = useTripStore();

  useEffect(() => {
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

  const version = Constants.expoConfig?.version || "1.0.0";

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1 items-center justify-center">
        <Animated.View
          style={{
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
            alignItems: "center",
          }}
        >
          <View className="w-32 h-32 bg-primary/10 rounded-[40px] items-center justify-center mb-6 shadow-xl shadow-primary/20">
            <MaterialCommunityIcons
              name="bus-side"
              size={72}
              color={Colors.primary}
            />
          </View>

          <Text className="text-4xl font-jakarta-extrabold text-primary tracking-tight">
            MyTripGuide
          </Text>

          <Text className="text-text-secondary font-jakarta-medium text-center px-12 mt-3 leading-5">
            Your complete guide for every group trip
          </Text>
        </Animated.View>

        <View className="absolute bottom-16 items-center">
          <ActivityIndicator color={Colors.primary} size="large" />
        </View>

        <View className="absolute bottom-6 right-6">
          <Text className="text-text-muted text-[10px] font-jakarta-bold uppercase tracking-widest">
            v{version}
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
}
