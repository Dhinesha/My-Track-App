import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Linking,
  Share,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Shadows } from "../constants/theme";
import { useHotel, Hotel } from "../hooks/useHotel";
import { useSyncStore } from "../store/syncStore";
import { HotelDayTabs } from "../components/hotel/HotelDayTabs";
import { StayDurationBanner } from "../components/hotel/StayDurationBanner";
import { CheckOutReminderBanner } from "../components/hotel/CheckOutReminderBanner";
import { TransitionDayCard } from "../components/hotel/TransitionDayCard";
import { HotelTimeline } from "../components/hotel/HotelTimeline";

interface Roommate {
  id: string;
  name: string;
  initials: string;
  color: string;
  role: string;
}

interface FamilyMember {
  id: string;
  name: string;
  status: "confirmed" | "pending";
  checkedInAt?: string;
}

export default function HotelScreen() {
  const navigation = useNavigation<any>();
  const { isOnline } = useSyncStore();
  const {
    hotels,
    currentDay,
    currentHotel,
    transitionDay: isTodayTransit,
    nextHotel: todayNextHotel,
    loading,
  } = useHotel();

  // State to track the currently selected day tab
  const [selectedDay, setSelectedDay] = useState<number>(1);
  
  // Track check-in states locally for high interactivity
  const [isSelfConfirmed, setIsSelfConfirmed] = useState<boolean>(false);
  const [selfConfirmedAt, setSelfConfirmedAt] = useState<string>("");
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: "pax-2", name: "Ananya G", status: "confirmed", checkedInAt: "4:40 PM" },
    { id: "pax-3", name: "Rahul G", status: "pending" },
  ]);

  // Set the default tab to the current day on load
  useEffect(() => {
    if (!loading && currentDay) {
      setSelectedDay(currentDay);
    }
  }, [loading, currentDay]);

  // Find hotel for the selected day tab
  const getHotelForSelectedDay = (): Hotel | null => {
    return (
      hotels.find(
        (h) => selectedDay >= h.check_in_day && selectedDay < h.check_out_day
      ) || hotels.find((h) => selectedDay === h.check_out_day) || null
    );
  };

  const hotel = getHotelForSelectedDay();

  // Reset confirmation statuses or adapt to hotel shifts
  useEffect(() => {
    if (hotel) {
      if (hotel.id === "hotel-1") {
        setIsSelfConfirmed(true);
        setSelfConfirmedAt("4:35 PM");
        setFamilyMembers([
          { id: "pax-2", name: "Ananya G", status: "confirmed", checkedInAt: "4:40 PM" },
          { id: "pax-3", name: "Rahul G", status: "pending" },
        ]);
      } else {
        setIsSelfConfirmed(false);
        setSelfConfirmedAt("");
        setFamilyMembers([
          { id: "pax-2", name: "Ananya G", status: "pending" },
          { id: "pax-3", name: "Rahul G", status: "pending" },
        ]);
      }
    }
  }, [hotel]);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={Colors.primary.main} />
      </View>
    );
  }

  // Fallback if no hotels are found
  if (hotels.length === 0) {
    return (
      <SafeAreaView style={styles.root} edges={["top"]}>
        <View style={styles.headerBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerBackBtn}>
            <Ionicons name="arrow-back" size={22} color={Colors.neutral.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hotel Details</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="business-outline" size={48} color={Colors.neutral.textMuted} />
          <Text style={styles.emptyText}>No hotel bookings registered for this trip.</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Roommates details
  const roommates: Roommate[] = [
    { id: "pax-1", name: "Dhinesha G", initials: "DG", color: Colors.primary.main, role: "Primary" },
    { id: "pax-2", name: "Ananya G", initials: "AG", color: "#1D9E75", role: "Family" },
    { id: "pax-3", name: "Rahul G", initials: "RG", color: "#BA7517", role: "Family" },
  ];

  // Actions
  const handleConfirmArrival = () => {
    if (!isOnline) {
      Alert.alert("Network Required", "Confirming arrival requires an active internet connection.");
      return;
    }
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsSelfConfirmed(true);
    setSelfConfirmedAt(timeNow);
  };

  const handleConfirmFamilyMember = (id: string) => {
    if (!isOnline) {
      Alert.alert("Network Required", "Confirming family members requires an active internet connection.");
      return;
    }
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFamilyMembers(prev =>
      prev.map(member =>
        member.id === id
          ? { ...member, status: "confirmed", checkedInAt: timeNow }
          : member
      )
    );
  };

  const handleConfirmAllPending = () => {
    if (!isOnline) {
      Alert.alert("Network Required", "Confirming family members requires an active internet connection.");
      return;
    }
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setFamilyMembers(prev =>
      prev.map(member =>
        member.status === "pending"
          ? { ...member, status: "confirmed", checkedInAt: timeNow }
          : member
      )
    );
  };

  const handleOpenMaps = (address: string) => {
    Linking.openURL("https://maps.google.com/?q=" + encodeURIComponent(address)).catch(() =>
      Alert.alert("Error", "Could not open Google Maps.")
    );
  };

  const handleCallPhone = (phone: string) => {
    Linking.openURL("tel:" + phone).catch(() =>
      Alert.alert("Error", "Could not place phone call.")
    );
  };

  const handleShareAddress = async (name: string, address: string, room: string, checkIn: string) => {
    try {
      await Share.share({
        message: `Hotel: ${name}\nAddress: ${address}\nRoom: ${room || "TBD"}\nCheck-in: ${checkIn}`,
      });
    } catch (error) {
      console.error("Error sharing address:", error);
    }
  };

  const renderStars = (count: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= count ? "star" : "star-outline"}
          size={16}
          color="#F5A623"
        />
      );
    }
    return <View style={styles.starsRow}>{stars}</View>;
  };

  // Find next hotel details if selected day is transit
  const getNextHotelForTransit = (): Hotel | null => {
    return hotels.find((h) => h.check_in_day > selectedDay) || null;
  };

  const nextHotelInfo = getNextHotelForTransit();

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
            <Ionicons name="arrow-back" size={22} color={Colors.neutral.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Hotel Details</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        {/* Day selection tabs */}
        <HotelDayTabs
          hotels={hotels}
          activeDay={selectedDay}
          currentDay={currentDay}
          onSelectDay={(day) => setSelectedDay(day)}
        />

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Dynamic alerts for Check-in / Check-out */}
          {hotel && (
            <CheckOutReminderBanner
              currentDay={currentDay}
              checkInDay={hotel.check_in_day}
              checkOutDay={hotel.check_out_day}
              checkInTime={hotel.check_in_time}
              checkOutTime={hotel.check_out_time}
            />
          )}

          {hotel ? (
            <>
              {/* Stay Duration Banner */}
              <StayDurationBanner
                checkInDay={hotel.check_in_day}
                checkOutDay={hotel.check_out_day}
              />

              {/* Hotel Info Card */}
              <View style={[styles.card, styles.hotelCard, Shadows.sm]}>
                {hotel.image_url ? (
                  <Image source={{ uri: hotel.image_url }} style={styles.hotelImage} />
                ) : (
                  <View style={styles.imagePlaceholder}>
                    <Text style={styles.imagePlaceholderText}>
                      {hotel.name ? hotel.name.charAt(0) : "H"}
                    </Text>
                  </View>
                )}

                <View style={styles.hotelDetails}>
                  <Text style={styles.hotelName}>{hotel.name}</Text>
                  {renderStars(hotel.stars)}

                  {/* Address row */}
                  <TouchableOpacity
                    onPress={() => handleOpenMaps(hotel.address)}
                    activeOpacity={0.7}
                    style={styles.infoRow}
                  >
                    <Ionicons name="location" size={16} color={Colors.primary.main} />
                    <Text style={styles.infoText}>{hotel.address}</Text>
                  </TouchableOpacity>

                  {/* Phone row */}
                  <TouchableOpacity
                    onPress={() => handleCallPhone(hotel.phone)}
                    activeOpacity={0.7}
                    style={styles.infoRow}
                  >
                    <Ionicons name="call-outline" size={16} color={Colors.primary.main} />
                    <Text style={styles.infoText}>{hotel.phone}</Text>
                  </TouchableOpacity>

                  <View style={styles.divider} />

                  {/* Check-in / Check-out timings */}
                  <View style={styles.timingRow}>
                    <View style={styles.timingCol}>
                      <Text style={styles.timingLabel}>CHECK-IN</Text>
                      <Text style={styles.timingValue}>{hotel.check_in_time}</Text>
                    </View>
                    <View style={styles.timingColDivider} />
                    <View style={styles.timingCol}>
                      <Text style={styles.timingLabel}>CHECK-OUT</Text>
                      <Text style={styles.timingValue}>{hotel.check_out_time}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Room Card */}
              <View style={[styles.card, styles.roomCard, Shadows.sm]}>
                <Text style={styles.roomLabel}>YOUR ROOM</Text>
                <Text style={styles.roomNumber}>{hotel.room_number || "304"}</Text>
                <Text style={styles.roomMeta}>
                  Floor {hotel.floor || 3}  ·  {hotel.room_type || "Deluxe Room"}
                </Text>

                {/* Roommates section */}
                <View style={styles.roommatesSection}>
                  <Text style={styles.roommatesLabel}>Sharing with:</Text>
                  <View style={styles.chipsRow}>
                    {roommates.map((rm) => (
                      <View key={rm.id} style={styles.roommateChip}>
                        <View style={[styles.avatarCircle, { backgroundColor: rm.color }]}>
                          <Text style={styles.avatarText}>{rm.initials}</Text>
                        </View>
                        <Text style={styles.roommateName}>{rm.name.split(" ")[0]}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              {/* Check-In Status Button */}
              <View style={styles.interactiveSection}>
                {isSelfConfirmed ? (
                  <View style={styles.confirmedBanner}>
                    <Ionicons name="checkmark-circle" size={28} color="#1D9E75" />
                    <View>
                      <Text style={styles.confirmedTitle}>Arrival Confirmed</Text>
                      <Text style={styles.confirmedTime}>
                        Confirmed at {selfConfirmedAt || "4:35 PM"}
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View>
                    <TouchableOpacity
                      onPress={handleConfirmArrival}
                      disabled={!isOnline}
                      style={[styles.confirmBtn, !isOnline && styles.disabledBtn]}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="checkmark-circle-outline" size={20} color="#FFFFFF" />
                      <Text style={styles.confirmBtnText}>Confirm Arrival</Text>
                    </TouchableOpacity>
                    {!isOnline && (
                      <Text style={styles.offlineWarning}>Requires internet to confirm</Text>
                    )}
                  </View>
                )}
              </View>

              {/* Family Hotel Check-In */}
              <View style={[styles.card, styles.familyCard]}>
                <Text style={styles.familyTitle}>Family Members</Text>
                {familyMembers.map((member) => {
                  const isConfirmed = member.status === "confirmed";
                  return (
                    <View key={member.id} style={styles.familyRow}>
                      <View style={styles.familyMemberLeft}>
                        <View style={styles.familyAvatar}>
                          <Text style={styles.familyAvatarText}>
                            {member.name.charAt(0)}
                          </Text>
                        </View>
                        <Text style={styles.familyName}>{member.name}</Text>
                      </View>

                      <View style={styles.familyMemberRight}>
                        <View
                          style={[
                            styles.familyStatusPill,
                            isConfirmed ? styles.pillConfirmed : styles.pillPending,
                          ]}
                        >
                          <Text
                            style={[
                              styles.familyStatusText,
                              isConfirmed ? styles.textConfirmed : styles.textPending,
                            ]}
                          >
                            {isConfirmed ? "✓ Confirmed" : "Pending"}
                          </Text>
                        </View>

                        {!isConfirmed && (
                          <TouchableOpacity
                            onPress={() => handleConfirmFamilyMember(member.id)}
                            disabled={!isOnline}
                            style={[styles.smallConfirmBtn, !isOnline && styles.disabledSmallBtn]}
                          >
                            <Text style={styles.smallConfirmBtnText}>Confirm</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  );
                })}

                {/* Bulk Confirm */}
                {familyMembers.some((m) => m.status === "pending") && (
                  <TouchableOpacity
                    onPress={handleConfirmAllPending}
                    disabled={!isOnline}
                    style={[styles.bulkConfirmBtn, !isOnline && styles.disabledBulkBtn]}
                  >
                    <Text style={styles.bulkConfirmText}>Confirm All Pending</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Share Address Button */}
              <View style={styles.shareWrapper}>
                <TouchableOpacity
                  onPress={() =>
                    handleShareAddress(
                      hotel.name,
                      hotel.address,
                      hotel.room_number || "304",
                      hotel.check_in_time
                    )
                  }
                  activeOpacity={0.8}
                  style={styles.shareBtn}
                >
                  <Ionicons name="share-social-outline" size={18} color={Colors.primary.main} />
                  <Text style={styles.shareBtnText}>Share Hotel Address</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            /* Transition Day Display */
            <TransitionDayCard
              nextHotelName={nextHotelInfo ? nextHotelInfo.name : "Grand Kyoto Inn"}
              checkInDay={nextHotelInfo ? nextHotelInfo.check_in_day : 1}
              checkInTime={nextHotelInfo ? nextHotelInfo.check_in_time : "15:00"}
            />
          )}

          {/* Full Trip Accommodation Timeline */}
          <HotelTimeline hotels={hotels} currentDay={currentDay} />
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loaderContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.neutral.pageBackground,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: Spacing.screenPaddingH,
    marginTop: 16,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    overflow: "hidden",
  },
  hotelCard: {},
  hotelImage: {
    width: "100%",
    height: 160,
  },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    backgroundColor: Colors.primary.lightBg,
    alignItems: "center",
    justifyContent: "center",
  },
  imagePlaceholderText: {
    fontSize: 48,
    fontWeight: "bold",
    color: Colors.primary.main,
  },
  hotelDetails: {
    padding: 16,
  },
  hotelName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
    marginBottom: 6,
  },
  starsRow: {
    flexDirection: "row",
    gap: 3,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 13,
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
    flex: 1,
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.neutral.border,
    marginVertical: 14,
  },
  timingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  timingCol: {
    flex: 1,
  },
  timingColDivider: {
    width: 0.5,
    height: 32,
    backgroundColor: Colors.neutral.border,
    marginHorizontal: 16,
  },
  timingLabel: {
    fontSize: 11,
    color: Colors.neutral.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  timingValue: {
    fontSize: 16,
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
    marginTop: 4,
  },
  roomCard: {
    borderLeftWidth: 4,
    borderLeftColor: Colors.primary.main,
    padding: 16,
  },
  roomLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: Colors.neutral.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  roomNumber: {
    fontSize: 40,
    fontWeight: "800",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
    marginTop: 4,
  },
  roomMeta: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: Typography.fontFamilies.regular,
    marginTop: 4,
  },
  roommatesSection: {
    marginTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: Colors.neutral.border,
    paddingTop: 12,
  },
  roommatesLabel: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
    marginBottom: 8,
  },
  chipsRow: {
    flexDirection: "row",
    gap: 16,
  },
  roommateChip: {
    alignItems: "center",
    gap: 4,
  },
  avatarCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  roommateName: {
    fontSize: 10,
    color: Colors.neutral.textSecondary,
  },
  interactiveSection: {
    marginHorizontal: Spacing.screenPaddingH,
    marginTop: 16,
  },
  confirmBtn: {
    backgroundColor: Colors.primary.main,
    height: 54,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  confirmBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledBtn: {
    opacity: 0.5,
  },
  offlineWarning: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    textAlign: "center",
    marginTop: 6,
  },
  confirmedBanner: {
    backgroundColor: "#E8F5EE",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  confirmedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1D9E75",
  },
  confirmedTime: {
    fontSize: 13,
    color: Colors.neutral.textMuted,
    marginTop: 2,
  },
  familyCard: {
    padding: 16,
  },
  familyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.semibold,
    marginBottom: 12,
  },
  familyRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
  },
  familyMemberLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  familyAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary.lightBg,
    alignItems: "center",
    justifyContent: "center",
  },
  familyAvatarText: {
    color: Colors.primary.main,
    fontWeight: "700",
  },
  familyName: {
    fontSize: 14,
    color: Colors.neutral.textPrimary,
  },
  familyMemberRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  familyStatusPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  pillConfirmed: {
    backgroundColor: "#ECFDF5",
  },
  pillPending: {
    backgroundColor: "#FFFBEB",
  },
  familyStatusText: {
    fontSize: 11,
    fontWeight: "600",
  },
  textConfirmed: {
    color: "#059669",
  },
  textPending: {
    color: "#D97706",
  },
  smallConfirmBtn: {
    backgroundColor: Colors.primary.main,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  disabledSmallBtn: {
    opacity: 0.5,
  },
  smallConfirmBtnText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "700",
  },
  bulkConfirmBtn: {
    borderColor: Colors.primary.main,
    borderWidth: 1,
    borderRadius: 14,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
  },
  disabledBulkBtn: {
    opacity: 0.5,
  },
  bulkConfirmText: {
    color: Colors.primary.main,
    fontWeight: "700",
    fontSize: 14,
  },
  shareWrapper: {
    marginHorizontal: Spacing.screenPaddingH,
    marginTop: 16,
  },
  shareBtn: {
    borderColor: Colors.primary.main,
    borderWidth: 1.5,
    borderRadius: 14,
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareBtnText: {
    color: Colors.primary.main,
    fontWeight: "700",
    fontSize: 14,
  },
});
