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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { usePowerSync } from "@powersync/react-native";
import { Colors, Typography, Spacing, Shadows } from "../constants/theme";
import { useAttendance, TransportLeg } from "../hooks/useAttendance";
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

interface Passenger {
  id: string;
  name: string;
  seat: string;
  berth?: string;
  pnr?: string;
  status: string;
  time?: string;
  role: string;
  selected: boolean;
  phone: string;
  meal?: string;
}

export default function VehicleAttendanceScreen() {
  const navigation = useNavigation<any>();
  const db = usePowerSync();
  const { activeTripId } = useTripStore();

  const { allLegs, currentDay, currentLeg, loading } = useAttendance();

  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [selectedLeg, setSelectedLeg] = useState<TransportLeg | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Get unique days from legs
  const uniqueDays = Array.from(new Set(allLegs.map((l) => l.trip_day))).sort(
    (a, b) => a - b
  );

  // Set initial selected day and leg once data is loaded
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

  // Sync selected leg when day changes
  const handleDaySelect = (dayNum: number) => {
    setSelectedDay(dayNum);
    const dayLegs = allLegs.filter((l) => l.trip_day === dayNum);
    const initialLeg =
      currentLeg && currentLeg.trip_day === dayNum
        ? currentLeg
        : dayLegs[0] || null;
    setSelectedLeg(initialLeg);
  };

  // Fetch passengers for the selected leg
  useEffect(() => {
    if (!selectedLeg) return;

    const loadPassengers = async () => {
      try {
        const rows = (await db.getAll(
          `SELECT pv.*, p.name as pax_name, p.user_id 
           FROM pax_vehicles pv 
           JOIN pax p ON pv.pax_id = p.id 
           WHERE pv.vehicle_id = ?`,
          [selectedLeg.id]
        )) as any[];

        if (rows.length > 0) {
          setPassengers(
            rows.map((r) => ({
              id: r.pax_id,
              name: r.pax_name || "Traveller",
              seat: r.seat_number || "",
              berth: r.berth_number || "",
              pnr: r.pnr_number || "",
              status: r.status || "Not Boarded",
              time: r.checked_in_at || "",
              role: r.role || "FAMILY",
              selected: r.status === "Checked In" || r.status === "Not Boarded" || !r.status,
              phone: r.phone || "+91 98765 43210",
              meal: r.meal_preference || "",
            }))
          );
        } else {
          // Fallback static passengers if database relation is empty
          setPassengers([
            {
              id: "pax-1",
              name: "Dhinesha G",
              role: "PRIMARY",
              seat: selectedLeg.transport_type === "flight" ? "12A" : "Seat 24",
              berth: "Upper",
              pnr: selectedLeg.transport_type === "flight" ? "FLIGHT123" : "TRAIN456",
              status: "Checked In",
              time: "09:45 AM",
              selected: true,
              phone: "+91 98765 43210",
              meal: "Veg Meal",
            },
            {
              id: "pax-2",
              name: "Ananya G",
              role: "SPOUSE",
              seat: selectedLeg.transport_type === "flight" ? "12B" : "Seat 25",
              berth: "Middle",
              pnr: selectedLeg.transport_type === "flight" ? "FLIGHT123" : "TRAIN456",
              status: "Not Boarded",
              selected: true,
              phone: "+91 98765 43211",
              meal: "Non-Veg Meal",
            },
            {
              id: "pax-3",
              name: "Rahul G",
              role: "CHILD",
              seat: selectedLeg.transport_type === "flight" ? "12C" : "Seat 26",
              berth: "Lower",
              pnr: selectedLeg.transport_type === "flight" ? "FLIGHT123" : "TRAIN456",
              status: "Checked In",
              time: "10:15 AM",
              selected: true,
              phone: "+91 98765 43212",
            },
          ]);
        }
      } catch (error) {
        console.error("Error loading passengers:", error);
      }
    };

    loadPassengers();
  }, [selectedLeg?.id]);

  const toggleSelect = (id: string) => {
    setPassengers((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleConfirmAttendance = async () => {
    if (!selectedLeg) return;
    try {
      // Persist checked-in statuses in database
      const nowStr = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
      for (const p of passengers) {
        const status = p.selected ? "Checked In" : "Not Boarded";
        await db.execute(
          `INSERT OR REPLACE INTO attendance(pax_id, vehicle_id, checked_in_at, status) 
           VALUES(?, ?, ?, ?)`,
          [p.id, selectedLeg.id, p.selected ? nowStr : "", status]
        );
      }
      setIsModalVisible(true);
    } catch (e) {
      console.error("Failed to confirm attendance:", e);
      setIsModalVisible(true);
    }
  };

  const getDepartureISO = (timeStr?: string) => {
    if (!timeStr) return null;
    try {
      const [h, m] = timeStr.split(":").map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      return d.toISOString();
    } catch {
      return null;
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
        <Text style={styles.loadingText}>Loading transport info...</Text>
      </View>
    );
  }

  const dayLegs = allLegs.filter((l) => l.trip_day === selectedDay);
  const primaryPax = passengers.find((p) => p.role === "PRIMARY") || passengers[0];
  const primarySeat = primaryPax?.seat || "";
  const primaryPNR = selectedLeg?.pnr_number || primaryPax?.pnr || "";
  const primaryMeal = primaryPax?.meal || "";
  const primaryBerth = primaryPax?.berth || "";

  const checkedCount = passengers.filter((p) => p.selected).length;

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={["top"]}>
        {/* Header Bar */}
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

        {/* Day Selector Tabs Row */}
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

        {/* Leg Selector Chips for Multiple Legs */}
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
              {/* Countdown Timer */}
              <View style={styles.timerSection}>
                <DepartureCountdownTimer
                  departureISO={getDepartureISO(selectedLeg.departure_time)}
                  transportType={selectedLeg.transport_type}
                />
              </View>

              {/* Dynamic Transport Details Card */}
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

              {/* PNR Quick Action Row */}
              {(selectedLeg.transport_type === "flight" ||
                selectedLeg.transport_type === "train") &&
                primaryPNR && (
                  <PNRQuickAction
                    pnrNumber={primaryPNR}
                    transportType={selectedLeg.transport_type}
                  />
                )}

              {/* Self Check-In Button / Success Banner */}
              <View style={styles.checkinWrapper}>
                <SelfCheckInSection
                  paxId="pax-1"
                  vehicleId={selectedLeg.id}
                  tripId={activeTripId || "trip-1"}
                  transportType={selectedLeg.transport_type}
                />
              </View>

              {/* Family List Checklist */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Traveller Boarding Checklist</Text>
                {passengers.map((p) => {
                  const isChecked = p.selected;
                  return (
                    <TouchableOpacity
                      key={p.id}
                      activeOpacity={0.85}
                      onPress={() => toggleSelect(p.id)}
                      style={[styles.paxCard, Shadows.sm]}
                    >
                      <View
                        style={[
                          styles.checkbox,
                          isChecked
                            ? styles.checkboxSelected
                            : styles.checkboxUnselected,
                        ]}
                      >
                        {isChecked && (
                          <Ionicons name="checkmark" size={14} color="white" />
                        )}
                      </View>

                      <View style={styles.paxIconCircle}>
                        <Ionicons
                          name="person-circle-outline"
                          size={32}
                          color={Colors.neutral.textMuted}
                        />
                      </View>

                      <View style={styles.paxDetails}>
                        <View style={styles.paxNameRow}>
                          <Text style={styles.paxName}>{p.name}</Text>
                          <View style={styles.roleBadge}>
                            <Text style={styles.roleBadgeText}>{p.role}</Text>
                          </View>
                        </View>
                        <View style={styles.paxStatusRow}>
                          {p.seat ? (
                            <Text style={styles.paxSeat}>Seat {p.seat}</Text>
                          ) : null}
                          <Ionicons
                            name={isChecked ? "checkmark-circle" : "ellipse-outline"}
                            size={14}
                            color={
                              isChecked
                                ? Colors.success.checkIcon
                                : Colors.neutral.textMuted
                            }
                            style={styles.statusDotIcon}
                          />
                          <Text
                            style={[
                              styles.paxStatusText,
                              isChecked
                                ? styles.statusCheckedInText
                                : styles.statusNotBoardedText,
                            ]}
                          >
                            {isChecked ? "Checked In" : "Not Boarded"}
                            {isChecked && p.time ? ` • ${p.time}` : ""}
                          </Text>
                        </View>
                      </View>

                      {!isChecked && p.phone ? (
                        <TouchableOpacity
                          onPress={() => Linking.openURL(`tel:${p.phone}`)}
                          style={styles.callBtn}
                          activeOpacity={0.7}
                        >
                          <Ionicons
                            name="call-outline"
                            size={18}
                            color={Colors.primary.main}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Full Trip transport timeline */}
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

        {/* Floating Confirm Button */}
        {selectedLeg && (
          <View style={styles.footerContainer}>
            <TouchableOpacity
              onPress={handleConfirmAttendance}
              style={[styles.confirmBtn, Shadows.md]}
              activeOpacity={0.9}
            >
              <Ionicons name="checkmark-circle" size={22} color="white" />
              <Text style={styles.confirmBtnText}>
                Confirm Boarding ({checkedCount})
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Confirmation Modal */}
        {isModalVisible && (
          <View style={styles.modalOverlay}>
            <View style={[styles.modalContent, Shadows.md]}>
              <View style={styles.modalCheckCircle}>
                <Ionicons
                  name="checkmark-circle"
                  size={64}
                  color={Colors.success.checkIcon}
                />
              </View>

              <Text style={styles.modalTitle}>Attendance Confirmed!</Text>
              <Text style={styles.modalSub}>
                Your travellers ({checkedCount}) have been marked as ready for
                departure.
              </Text>

              <TouchableOpacity
                onPress={() => {
                  setIsModalVisible(false);
                  navigation.goBack();
                }}
                style={styles.modalBtn}
                activeOpacity={0.8}
              >
                <Text style={styles.modalBtnText}>Great</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
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
    fontFamily: Typography.fontFamilies.regular,
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
    fontFamily: Typography.fontFamilies.semibold,
  },
  headerRightPlaceholder: {
    width: 40,
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
    fontFamily: Typography.fontFamilies.semibold,
  },
  dayTabTextActive: {
    color: Colors.primary.main,
    fontFamily: Typography.fontFamilies.semibold,
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
    fontFamily: Typography.fontFamilies.bold,
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
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  paxDetails: {
    flex: 1,
  },
  paxNameRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    gap: 8,
  },
  paxName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  roleBadge: {
    backgroundColor: Colors.neutral.pageBackground,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleBadgeText: {
    color: Colors.neutral.textSecondary,
    fontSize: 8,
    fontWeight: "700",
    fontFamily: Typography.fontFamilies.bold,
    textTransform: "uppercase",
  },
  paxStatusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paxSeat: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.bold,
    marginRight: 8,
  },
  statusDotIcon: {
    marginRight: 4,
  },
  paxStatusText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: Typography.fontFamilies.bold,
  },
  statusCheckedInText: {
    color: Colors.success.checkIcon,
  },
  statusNotBoardedText: {
    color: Colors.neutral.textMuted,
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
    fontFamily: Typography.fontFamilies.semibold,
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
    fontFamily: Typography.fontFamilies.bold,
    marginBottom: 8,
    textAlign: "center",
  },
  modalSub: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
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
    fontFamily: Typography.fontFamilies.bold,
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
    fontFamily: Typography.fontFamilies.regular,
  },
});
