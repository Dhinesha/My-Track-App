import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import {
  MarkAllReadButton,
  NotificationItem,
  WhisperModeToggle,
  type NotifType,
} from "../components/notifications";


const NOTIFICATIONS = [
  {
    id: "1",
    type: "delay" as NotifType,
    message:
      "Flight UA455 to London delayed. The flight has been delayed by 30 mins. Please check the airline app for details.",
    sentAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    unread: true,
    category: "TODAY",
  },
  {
    id: "2",
    type: "general" as NotifType,
    message:
      "New itinerary suggestion. Sarah added a new suggestion for dinner on Friday night at Le Petit Bistro.",
    sentAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    unread: true,
    category: "TODAY",
  },
  {
    id: "3",
    type: "urgent" as NotifType,
    message:
      "Hotel check-in instructions. Use code 1234 at the front desk kiosk for express check-in.",
    sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
    category: "EARLIER",
  },
  {
    id: "4",
    type: "departure" as NotifType,
    message:
      "Trip starts soon! Your trip to Tokyo starts in 3 days! Don't forget to pack your passport.",
    sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    unread: false,
    category: "EARLIER",
  },
];

export default function NotificationsScreen() {
  const navigation = useNavigation();
  const [notifs, setNotifs] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleRead = (id: string) => {
    setNotifs((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: false } : n)),
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Area */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#64748B" />
          </TouchableOpacity>
          <MarkAllReadButton onPress={markAllRead} />
        </View>
        <Text style={styles.headerTitle}>Notifications</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <WhisperModeToggle />

        {["TODAY", "EARLIER"].map((category) => (
          <View key={category} style={styles.section}>
            <Text style={styles.sectionTitle}>{category}</Text>
            {notifs
              .filter((n) => n.category === category)
              .map((n) => (
                <NotificationItem
                  key={n.id}
                  id={n.id}
                  receiptId={n.id}
                  type={n.type}
                  message={n.message}
                  sentAt={n.sentAt}
                  isRead={!n.unread}
                  onRead={() => handleRead(n.id)}
                />
              ))}
          </View>
        ))}

        {/* Catch-up Message */}
        <View style={styles.catchUp}>
          <Text style={styles.catchUpText}>You're all caught up!</Text>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="luggage" size={24} color="#94A3B8" />
          <Text style={styles.navText}>My Trips</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <View style={styles.activeIndicator} />
          <MaterialIcons name="dashboard" size={24} color={Colors.primary} />
          <Text style={[styles.navText, styles.activeNavText]}>Dashboard</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem}>
          <MaterialIcons name="person" size={24} color="#94A3B8" />
          <Text style={styles.navText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F7F8",
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
    zIndex: 10,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  markReadText: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: Colors.primary,
  },
  headerTitle: {
    fontSize: 32,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
    marginLeft: 4,
  },
  notifItem: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  notifInner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBoxUnread: {
    backgroundColor: "rgba(43, 140, 238, 0.1)",
  },
  iconBoxRead: {
    backgroundColor: "#F1F5F9",
  },
  notifContent: {
    flex: 1,
    paddingRight: 12,
  },
  notifTitle: {
    fontSize: 14,
    fontFamily: "PlusJakartaSans-SemiBold",
    color: "#334155",
    lineHeight: 20,
  },
  unreadTitle: {
    fontFamily: "PlusJakartaSans-Bold",
    color: "#0F172A",
  },
  notifBody: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#64748B",
    lineHeight: 18,
    marginTop: 4,
  },
  notifFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 8,
  },
  tripBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  tripBadgeText: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Bold",
    color: "#64748B",
  },
  timeText: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#94A3B8",
  },
  unreadDot: {
    position: "absolute",
    right: 0,
    top: 4,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  catchUp: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  catchUpText: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#94A3B8",
  },
  bottomNav: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingBottom: 20,
  },
  navItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    width: 32,
    height: 4,
    backgroundColor: "rgba(43, 140, 238, 0.1)",
    borderRadius: 2,
  },
  navText: {
    fontSize: 10,
    fontFamily: "PlusJakartaSans-Medium",
    color: "#94A3B8",
  },
  activeNavText: {
    color: "#2B8CEE",
    fontFamily: "PlusJakartaSans-Bold",
  },
});
