import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../App";
import { Colors } from "../theme/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography, Radius, Spacing } from "../theme/typography";

import { SelfCheckInSection } from "../components/attendance/SelfCheckInSection";
import { DayPill, StatusSummaryRow, QuickActionsRow, TripProgressBar, TripCountdownWidget, WhatsHappeningNowCard, TodaySummaryCard, SmartCheckInBanner } from "../components/trips";
import { EmergencyFAB } from "../components/common";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tripId, tripName } = route.params;
  const [isSelfCheckedIn, setIsSelfCheckedIn] = React.useState(false);

  React.useEffect(() => {
    const checkStatus = async () => {
      const saved = await AsyncStorage.getItem(`checkin_${tripId}`);
      if (saved) setIsSelfCheckedIn(true);
    };
    checkStatus();
  }, [tripId]);

  const menuItems = [
    {
      id: "itinerary",
      label: "Itinerary",
      sub: "View today's plan",
      icon: "calendar-clock",
      color: "#2196F3",
      onPress: () => navigation.navigate("Itinerary", { tripId, tripName }),
    },
    {
      id: "vehicle",
      label: "Vehicle",
      sub: "Bus #2 - 12/15 here",
      icon: "bus",
      color: "#FF9800",
      onPress: () => navigation.navigate("VehicleAttendance", { tripId }),
    },
    {
      id: "family",
      label: "Family",
      sub: "Manage Group",
      icon: "account-group",
      color: "#4CAF50",
      onPress: () => navigation.navigate("FamilyMembers", { tripId }),
    },
    {
      id: "hotel",
      label: "Hotel Details",
      sub: "Hotel Granvia",
      icon: "office-building",
      color: "#9C27B0",
      onPress: () => navigation.navigate("Hotel", { tripId }),
    },
    {
      id: "notifications",
      label: "Notifications",
      sub: "2 New",
      icon: "bell",
      color: "#F44336",
      badge: 2,
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      id: "help",
      label: "Emergency",
      sub: "SOS & Help",
      icon: "lifebuoy",
      color: "#E91E63",
      onPress: () => navigation.navigate("Emergency"),
    },
    {
      id: "packing",
      label: "Packing List",
      sub: "What to carry",
      icon: "bag-personal",
      color: "#009688",
      onPress: () => navigation.navigate("PackingChecklist", { tripId, tripName, tripType: 'family' }),
    },
    {
      id: "budget",
      label: "Daily Budget",
      sub: "Track expenses",
      icon: "wallet",
      color: "#FF5722",
      onPress: () => navigation.navigate("BudgetTracker", { tripId, totalDays: 5 }),
    },
    {
      id: "feedback",
      label: "Feedback",
      sub: "Rate your trip",
      icon: "star-circle",
      color: "#F59E0B",
      onPress: () =>
        navigation.navigate("Feedback", {
          tripId,
          tripName,
          paxId: "demo-pax-1",
        }),
    },
  ];


  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={Typography.screenTitle}>Trip Dashboard</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >


        {/* Hero Section */}
        <View style={styles.heroContainer}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80",
            }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            style={styles.heroOverlay}
          >
            <View style={styles.heroContent}>
              <View style={styles.heroTopRow}>
                <View style={styles.dayBadge}>
                  <Text style={styles.dayBadgeText}>Day 2 of 5</Text>
                </View>
                <TripCountdownWidget 
                  startDate="2023-10-12" 
                  endDate="2023-10-20" 
                  status="ongoing" 
                />
              </View>
              <Text style={styles.heroTitle}>{tripName}</Text>
              <View style={styles.locRow}>
                <MaterialIcons name="location-on" size={16} color="#fff" />
                <Text style={styles.locText}>Kyoto, Japan</Text>
              </View>
              <View style={{ marginTop: 12, backgroundColor: 'rgba(255,255,255,0.15)', padding: 12, borderRadius: 12 }}>
                <TripProgressBar 
                  startDate="2023-10-12" 
                  endDate="2023-10-20" 
                  status="ongoing" 
                />
              </View>
            </View>
          </LinearGradient>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: -20, gap: 12 }}>
          <SmartCheckInBanner />
          <WhatsHappeningNowCard />
          <TodaySummaryCard />
        </View>

        {/* Quick Actions Row */}
        <QuickActionsRow isSelfCheckedIn={isSelfCheckedIn} />

        {/* Self Check-In Section - Prominently placed right below the hero image */}
        <View style={styles.checkInWrapper}>
          <View style={styles.checkInHeader}>
            <Text style={styles.checkInTitle}>Self Check-In</Text>
            {isSelfCheckedIn && (
              <View style={styles.checkInStatusBadge}>
                <MaterialIcons name="check-circle" size={14} color="#059669" />
                <Text style={styles.checkInStatusText}>COMPLETED</Text>
              </View>
            )}
          </View>
          <SelfCheckInSection
            paxId={"demo-pax-1"}
            vehicleId={"demo-veh-1"}
            tripId={tripId}
            onCheckInSuccess={() => setIsSelfCheckedIn(true)}
          />
        </View>

        <View style={styles.gridContainer}>
          {/* Status Pills */}
          <View style={styles.statusSection}>
            <DayPill
              startDate={new Date().toISOString()}
              endDate={new Date(Date.now() + 7 * 86400000).toISOString()}
            />
            <View style={{ height: 12 }} />
            <StatusSummaryRow
              selfCheckedIn={isSelfCheckedIn}
              familyCheckedIn={2}
              familyTotal={4}
              hotelCheckedIn={false}
            />
          </View>

          {/* Menu Grid */}
          <View style={styles.grid}>
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.gridItem}
                onPress={item.onPress}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconWrap,
                    { backgroundColor: item.color + "15" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={item.icon as any}
                    size={30}
                    color={item.color}
                  />
                  {item.badge && (
                    <View style={styles.itemBadge}>
                      <Text style={styles.itemBadgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.itemLabel}>{item.label}</Text>
                <Text style={styles.itemSub}>{item.sub}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
          <View style={{ height: 100 }} />
      </ScrollView>

      <EmergencyFAB onPress={() => navigation.navigate('Emergency')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  heroContainer: {
    width: "100%",
    height: 220,
    backgroundColor: "#000",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    justifyContent: "flex-end",
    padding: 20,
  },
  heroContent: {
    gap: 4,
  },
  heroTopRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 4,
  },
  dayBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  dayBadgeText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Bold",
  },
  weatherBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    gap: 4,
  },
  weatherText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Bold",
  },
  heroTitle: {
    fontSize: 24,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#FFFFFF",
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Regular",
    color: "#FFFFFF",
    opacity: 0.9,
  },
  checkInWrapper: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  checkInHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  checkInTitle: {
    fontSize: 18,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#0F172A",
  },
  checkInStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  checkInStatusText: {
    color: "#059669",
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Bold",
  },
  gridContainer: {
    padding: 20,
  },
  statusSection: {
    marginBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  gridItem: {
    width: "47.5%",
    backgroundColor: "#FFFFFF",
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    position: "relative",
  },
  itemBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.status.error,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  itemBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontFamily: "PlusJakartaSans-Bold",
  },
  itemLabel: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.primary,
    marginBottom: 4,
  },
  itemSub: {
    fontSize: 11,
    fontFamily: "PlusJakartaSans-Regular",
    color: Colors.text.secondary,
    textAlign: "center",
  },
});
