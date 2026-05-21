import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Linking,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { usePowerSync } from "@powersync/react-native";
import * as Haptics from "expo-haptics";
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../constants/theme';
import { useAttendance, TransportLeg } from "../hooks/useAttendance";
import { useFamilyAttendance } from "../hooks/useFamilyAttendance";
import { useTripStore } from "../store/tripStore";

// Component imports
import { BusCard } from "../components/attendance/BusCard";
import { FlightCard } from "../components/attendance/FlightCard";
import { TrainCard } from "../components/attendance/TrainCard";
import { CabCard } from "../components/attendance/CabCard";
import { LegSelectorChips } from "../components/attendance/LegSelectorChips";
import { PNRQuickAction } from "../components/attendance/PNRQuickAction";
import { SelfCheckInSection } from "../components/attendance/SelfCheckInSection";
import { DepartureCountdownTimer } from "../components/attendance/DepartureCountdownTimer";
import { TransportTimeline } from "../components/attendance/TransportTimeline";
import { FamilyAttendanceSection } from "../components/attendance/FamilyAttendanceSection";

import type { AttendanceStatus, PaxRole, FamilyMember, AttendanceRecord } from '../types/attendance';

export default function VehicleAttendanceScreen() {
  const navigation = useNavigation<any>();
  const db = usePowerSync();
  const { activeTripId } = useTripStore();

  const { allLegs, currentDay, currentLeg, loading } = useAttendance();

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedLeg, setSelectedLeg] = useState<TransportLeg | null>(null);
  const {
    familyMembers: passengers,
    loading: hookLoading,
  } = useFamilyAttendance(selectedLeg?.id || "");

  const uniqueDays = Array.from(new Set(allLegs.map((l) => l.trip_day))).sort(
    (a, b) => a - b
  );

  useEffect(() => {
    if (!loading && allLegs.length > 0) {
      const initialDay = uniqueDays.includes(currentDay)
        ? currentDay
        : uniqueDays[0] || 1;
      setSelectedDay(initialDay);

      const dayLegs = allLegs.filter((l) => l.trip_day === initialDay);
      const initialLeg =
        currentLeg && currentLeg.trip_day === initialDay
          ? currentLeg
          : dayLegs[0] || null;
      setSelectedLeg(initialLeg);
    }
  }, [loading, allLegs.length]);

  const handleDaySelect = (dayNum: number) => {
    setSelectedDay(dayNum);
    const dayLegs = allLegs.filter((l) => l.trip_day === dayNum);
    const initialLeg =
      currentLeg && currentLeg.trip_day === dayNum
        ? currentLeg
        : dayLegs[0] || null;
    setSelectedLeg(initialLeg);
  };



  const getDepartureISO = (timeStr?: string, tripDay?: number) => {
    if (!timeStr) return null;
    try {
      const [h, m] = timeStr.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      if (tripDay !== undefined && currentDay !== undefined) {
        const diffDays = tripDay - currentDay;
        d.setDate(d.getDate() + diffDays);
      }
      return d.toISOString();
    } catch {
      return null;
    }
  };

  if (loading || (selectedLeg && hookLoading)) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
        <Text style={styles.loadingText}>Loading transport info...</Text>
      </View>
    );
  }

  const dayLegs = allLegs.filter((l) => l.trip_day === selectedDay);
  const primaryPax = passengers.find((p) => p.role === "PRIMARY") || passengers[0];
  const primarySeat = primaryPax?.seatNumber || "";
  const primaryPNR = selectedLeg?.pnr_number || primaryPax?.pnrNumber || "";
  const primaryMeal = primaryPax?.meal || "";
  const primaryBerth = primaryPax?.berthNumber || "";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerBackBtn}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color={Colors.neutral.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Vehicle and Attendance</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {(uniqueDays.length > 0 ? uniqueDays : [1]).map((dayNum) => {
              const isActive = selectedDay === dayNum;
              return (
                <TouchableOpacity
                  key={dayNum}
                  onPress={() => handleDaySelect(dayNum)}
                  activeOpacity={0.8}
                  style={[styles.dayTab, isActive && styles.dayTabActive]}
                >
                  <Text
                    style={[
                      styles.dayTabText,
                      isActive && styles.dayTabTextActive,
                    ]}
                  >
                    Day {dayNum}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {selectedLeg && (
          <LegSelectorChips
            legs={dayLegs}
            selectedLegId={selectedLeg.id}
            onSelectLeg={(leg) => setSelectedLeg(leg)}
          />
        )}

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {selectedLeg ? (
            <>
              <View style={styles.timerSection}>
                <DepartureCountdownTimer
                  departureISO={getDepartureISO(selectedLeg.departure_time, selectedLeg.trip_day)}
                  transportType={selectedLeg.transport_type}
                />
              </View>

              {selectedLeg.transport_type === "bus" && (
                <BusCard leg={selectedLeg} seatNumber={primarySeat} />
              )}
              {selectedLeg.transport_type === "flight" && (
                <FlightCard
                  leg={selectedLeg}
                  seatNumber={primarySeat}
                  pnrNumber={primaryPNR}
                  mealPreference={primaryMeal}
                />
              )}
              {selectedLeg.transport_type === "train" && (
                <TrainCard
                  leg={selectedLeg}
                  seatNumber={primarySeat}
                  pnrNumber={primaryPNR}
                  berthNumber={primaryBerth}
                />
              )}
              {selectedLeg.transport_type === "cab" && (
                <CabCard
                  leg={selectedLeg}
                  isSharing={selectedLeg.cab_sharing === 1}
                  sharingCount={passengers.length}
                />
              )}

              {(selectedLeg.transport_type === "flight" ||
                selectedLeg.transport_type === "train") &&
                primaryPNR && (
                  <PNRQuickAction
                    pnrNumber={primaryPNR}
                    transportType={selectedLeg.transport_type}
                  />
                )}

              <View style={styles.checkinWrapper}>
                <SelfCheckInSection
                  paxId="pax-1"
                  vehicleId={selectedLeg.id}
                  tripId={activeTripId || "trip-1"}
                  transportType={selectedLeg.transport_type}
                />
              </View>

              <View style={styles.section}>
                <FamilyAttendanceSection
                  vehicleId={selectedLeg.id}
                  transportType={selectedLeg.transport_type as any}
                />
              </View>

              <TransportTimeline
                legs={allLegs}
                currentLegId={selectedLeg.id}
                currentDay={currentDay}
              />
            </>
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={Colors.neutral.textMuted}
              />
              <Text style={styles.emptyText}>No transport scheduled for this trip.</Text>
            </View>
          )}
        </ScrollView>


      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
  },
  safe: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.neutral.pageBackground,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
  },
  headerBar: {
    height: Spacing.headerHeight,
    backgroundColor: Colors.neutral.headerBg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenPaddingH,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: Typography.fontSizes.screenTitle,
    fontWeight: "600",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.semiBold,
  },
  headerRightPlaceholder: {
    width: 40,
    fontFamily: fonts.regular,
  },
  tabsContainer: {
    backgroundColor: Colors.neutral.headerBg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
  },
  tabsScrollContent: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingVertical: 12,
    gap: 12,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F4F5F7",
  },
  dayTabActive: {
    backgroundColor: Colors.primary.lightBg,
    borderWidth: 1,
    borderColor: Colors.primary.main,
  },
  dayTabText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.semiBold,
  },
  dayTabTextActive: {
    color: Colors.primary.main,
    fontFamily: fonts.semiBold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  timerSection: {
    marginHorizontal: 16,
    marginTop: 16,
    fontFamily: fonts.regular,
  },
  checkinWrapper: {
    marginHorizontal: 16,
    marginTop: 16,
  },
  section: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 12,
  },
  paxCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: Spacing.cardRadius,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    fontFamily: fonts.regular,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  checkboxSelected: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  checkboxUnselected: {
    borderColor: Colors.neutral.border,
    backgroundColor: "#FFFFFF",
  },
  paxIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F4F5F7",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  paxDetails: {
    flex: 1,
    fontFamily: fonts.regular,
  },
  paxNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 8,
    fontFamily: fonts.regular,
  },
  paxName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
  },
  roleBadge: {
    backgroundColor: Colors.neutral.pageBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  primaryRoleBadge: {
    backgroundColor: Colors.primary.lightBg,
  },
  secondaryRoleBadge: {
    backgroundColor: Colors.neutral.pageBackground,
  },
  roleBadgeText: {
    color: Colors.neutral.textSecondary,
    fontSize: 8,
    fontWeight: "700",
    fontFamily: fonts.bold,
    textTransform: "uppercase",
  },
  primaryRoleText: {
    color: Colors.primary.main,
  },
  secondaryRoleText: {
    color: Colors.neutral.textSecondary,
  },
  seatBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary.lightBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  seatBadgeText: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.primary.main,
    fontFamily: fonts.semiBold,
  },
  paxBerthText: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
  },
  paxStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    fontFamily: fonts.regular,
  },
  paxSeat: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.bold,
    marginRight: 8,
  },
  statusDotIcon: {
    marginRight: 4,
    fontFamily: fonts.regular,
  },
  paxStatusText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: fonts.bold,
  },
  statusCheckedInText: {
    color: Colors.success.checkIcon,
    fontFamily: fonts.regular,
  },
  statusNotBoardedText: {
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
  },
  statusAbsentText: {
    color: Colors.urgent.main,
    fontFamily: fonts.regular,
  },
  paxDot: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
  },
  callBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary.lightBg,
    alignItems: "center",
    justifyContent: "center",
  },
  footerContainer: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  confirmBtn: {
    backgroundColor: Colors.primary.main,
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    ...Platform.select({
      web: { boxShadow: "0 4px 12px rgba(43,140,238,0.2)" },
      default: {
        shadowColor: Colors.primary.main,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
      },
    }),
  } as any,
  confirmBtnText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
    fontFamily: fonts.semiBold,
  },
  modalOverlay: {
    position: "absolute",
    inset: 0,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    width: "100%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
  },
  modalCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success.lightBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 8,
    textAlign: "center",
  },
  modalSub: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalBtn: {
    backgroundColor: Colors.primary.main,
    width: "100%",
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: fonts.bold,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.regular,
  },
});
