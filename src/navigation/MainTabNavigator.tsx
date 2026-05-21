import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, View, Text, Platform } from "react-native";

import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { fonts } from "../constants/theme";

// Tab screens
import { TripHomeScreen } from "../screens/home/TripHomeScreen";
import TripsListScreen from "../screens/TripsListScreen";
import ProfileScreen from "../screens/ProfileScreen";

import { useTripStore } from "../store/tripStore";

const Tab = createBottomTabNavigator();

function TabIcon({ name, color }: { name: string; color: string }) {
  return (
    <View style={styles.iconContainer}>
      <MaterialCommunityIcons name={name as any} size={24} color={color} />
    </View>
  );
}

export default function MainTabNavigator() {
  const { activeTripId, activeTripName } = useTripStore();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: "#0EA5E9",
        tabBarInactiveTintColor: "#94a3b8",
      }}
    >
      <Tab.Screen
        name="Home"
        component={TripHomeScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>Home</Text>
          ),
          tabBarIcon: ({ color }) => <TabIcon name="home" color={color} />,
        }}
      />
      <Tab.Screen
        name="My Trips"
        component={TripsListScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            if (activeTripId) {
              // Prevent default action
              e.preventDefault();
              // Navigate to TripDetail instead
              navigation.navigate("TripDetail", {
                tripId: activeTripId,
                tripName: activeTripName,
              });
            }
          },
        })}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>My Trips</Text>
          ),
          tabBarIcon: ({ color }) => (
            <TabIcon name="map-marker-distance" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={[styles.tabLabel, { color }]}>Profile</Text>
          ),
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    height: Platform.OS === "ios" ? 88 : 68,
    paddingBottom: Platform.OS === "ios" ? 30 : 12,
    paddingTop: 10,
    ...(Platform.OS === "web"
      ? { boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.1)" }
      : {
          elevation: 20,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
        }),
  },

  iconContainer: {
    position: "relative",
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeContainer: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#0EA5E9",
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: fonts.bold,
    marginTop: 2,
    letterSpacing: 0.5,
  },
  emergencyFab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.status.error,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    ...(Platform.OS === "web"
      ? { boxShadow: "0 4px 8px rgba(220, 38, 38, 0.3)" }
      : {
          shadowColor: Colors.status.error,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }),
  },
  emergencyFabFocused: {
    backgroundColor: "#9F1239", // Darker red when focused
    transform: [{ scale: 1.05 }],
  },
});
