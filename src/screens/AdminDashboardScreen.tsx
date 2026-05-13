import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { Typography, Radius, Spacing } from "../theme/typography";

const ACTIONS = [
  {
    id: "member",
    label: "Member Management",
    icon: "account-cog",
    color: "#2196F3",
  },
  {
    id: "vehicle",
    label: "Vehicle Management",
    icon: "bus-clock",
    color: "#FF9800",
  },
  {
    id: "trip",
    label: "Trip Overview",
    icon: "airplane-takeoff",
    color: "#4CAF50",
  },
  {
    id: "hotel",
    label: "Hotel Management",
    icon: "office-building-cog",
    color: "#9C27B0",
  },
];

export default function AdminDashboardScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <MaterialIcons
            name="arrow-back"
            size={24}
            color={Colors.text.primary}
          />
        </TouchableOpacity>
        <Text style={Typography.screenTitle}>Admin Dashboard</Text>
        <TouchableOpacity>
          <MaterialIcons
            name="settings"
            size={24}
            color={Colors.text.secondary}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Quick Actions Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>QUICK ACTIONS</Text>
          <View style={styles.actionsGrid}>
            {ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.id}
                style={styles.actionCard}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: action.color + "15" },
                  ]}
                >
                  <MaterialCommunityIcons
                    name={action.icon as any}
                    size={28}
                    color={action.color}
                  />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Analytics Placeholder */}
        <View style={styles.analyticsSection}>
          <Text style={styles.sectionLabel}>TRIP ACTIVITY (WEEKLY)</Text>
          <View style={styles.chartPlaceholder}>
            <MaterialCommunityIcons
              name="chart-bell-curve-cumulative"
              size={48}
              color={Colors.border.default}
            />
            <Text style={styles.placeholderText}>
              Activity chart visualization
            </Text>
          </View>
        </View>

        {/* Trip Status Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TRIP STATUS SUMMARY</Text>
          <View style={styles.summaryCard}>
            <View style={styles.statRow}>
              <Text style={styles.statName}>Total Passengers</Text>
              <Text style={styles.statValue}>15</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statName}>Checked In</Text>
              <Text
                style={[styles.statValue, { color: Colors.status.success }]}
              >
                12
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statName}>Remaining</Text>
              <Text style={[styles.statValue, { color: Colors.status.error }]}>
                3
              </Text>
            </View>

            <View style={styles.progressContainer}>
              <View style={styles.progressLabelRow}>
                <Text style={styles.progressText}>Check-in Progress</Text>
                <Text style={styles.progressText}>80%</Text>
              </View>
              <View style={styles.progressBarBg}>
                <View style={[styles.progressBarFill, { width: "80%" }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Active Trips List */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ACTIVE TRIPS PROGRESS</Text>
          <View style={styles.tripListItem}>
            <View style={styles.tripListHeader}>
              <Text style={styles.tripListName}>Tokyo Family Adventure</Text>
              <Text style={styles.tripListPax}>12/15 Pax</Text>
            </View>
            <View style={styles.progressBarBgSmall}>
              <View
                style={[
                  styles.progressBarFill,
                  { width: "80%", backgroundColor: Colors.primary },
                ]}
              />
            </View>
          </View>
          <View style={styles.tripListItem}>
            <View style={styles.tripListHeader}>
              <Text style={styles.tripListName}>Kyoto Spring Adventure</Text>
              <Text style={styles.tripListPax}>0/4 Pax</Text>
            </View>
            <View style={styles.progressBarBgSmall}>
              <View style={[styles.progressBarFill, { width: "0%" }]} />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  section: {
    padding: 16,
  },
  sectionLabel: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.muted,
    marginBottom: 12,
    letterSpacing: 1,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  actionCard: {
    width: "48%",
    backgroundColor: Colors.background.card,
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    alignItems: "center",
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: Radius.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  actionLabel: {
    fontSize: 13,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.primary,
    textAlign: "center",
  },
  analyticsSection: {
    padding: 16,
  },
  chartPlaceholder: {
    height: 160,
    backgroundColor: Colors.background.card,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: Colors.border.default,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  placeholderText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: Colors.text.muted,
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: Radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border.light,
    elevation: 2,
    ...(Platform.OS === "web"
      ? { boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)" }
      : {
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }),
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  statName: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Medium",
    color: Colors.text.secondary,
  },
  statValue: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.primary,
  },
  progressContainer: {
    marginTop: 16,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.primary,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: Colors.border.light,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarBgSmall: {
    height: 6,
    backgroundColor: Colors.border.light,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.status.success,
  },
  tripListItem: {
    marginBottom: 16,
  },
  tripListHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  tripListName: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-Bold",
    color: Colors.text.primary,
  },
  tripListPax: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: Colors.text.secondary,
  },
});
