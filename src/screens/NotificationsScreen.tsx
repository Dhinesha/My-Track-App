import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../constants/theme';
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
  const navigation = useNavigation<any>();
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
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.headerBackBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.neutral.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <MarkAllReadButton onPress={markAllRead} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <WhisperModeToggle />

        {["TODAY", "EARLIER"].map((category) => {
          const catNotifs = notifs.filter((n) => n.category === category);
          if (catNotifs.length === 0) return null;
          
          return (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>{category}</Text>
              {catNotifs.map((n) => (
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
          );
        })}

        {/* Catch-up Message */}
        <View style={styles.catchUp}>
          <Text style={styles.catchUpText}>You're all caught up!</Text>
        </View>
      </ScrollView>

      {/* Bottom Nav Mockup */}
      <View style={styles.bottomNav}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Main', { screen: 'My Trips' })} 
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Ionicons name="map-outline" size={22} color={Colors.neutral.textMuted} />
          <Text style={styles.navLabelInactive}>My Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Main', { screen: 'Home' })} 
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <View style={styles.navActiveWrapper}>
            <Ionicons name="grid" size={22} color={Colors.primary.main} />
            <View style={styles.navActiveDot} />
          </View>
          <Text style={styles.navLabelActive}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Main', { screen: 'Profile' })} 
          style={styles.navItem}
          activeOpacity={0.7}
        >
          <Ionicons name="person-outline" size={22} color={Colors.neutral.textMuted} />
          <Text style={styles.navLabelInactive}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
  },
  headerBar: {
    height: Spacing.headerHeight,
    backgroundColor: Colors.neutral.headerBg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPaddingH,
  },
  headerBackBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: Typography.fontSizes.screenTitle,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.semiBold,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 150,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: Spacing.screenPaddingH,
  },
  sectionTitle: {
    fontSize: Typography.fontSizes.sectionLabel,
    fontWeight: '700',
    color: Colors.primary.medium,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  catchUp: {
    marginTop: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  catchUpText: {
    fontSize: 12,
    fontFamily: fonts.regular,
    color: Colors.neutral.textMuted,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: Colors.neutral.border,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    paddingBottom: Platform.OS === 'ios' ? 12 : 0,
    ...Platform.select({
      web: { boxShadow: '0 -4px 12px rgba(0,0,0,0.05)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 6,
        elevation: 10,
      },
    }) as any,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  navActiveWrapper: {
    position: 'relative',
    alignItems: 'center',
  },
  navActiveDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary.main,
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  navLabelActive: {
    fontSize: 10,
    fontWeight: '700',
    fontFamily: fonts.bold,
    color: Colors.primary.main,
  },
  navLabelInactive: {
    fontSize: 10,
    fontWeight: '500',
    fontFamily: fonts.regular,
    color: Colors.neutral.textMuted,
  },
});
