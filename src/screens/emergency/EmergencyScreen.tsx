import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Share,
  Linking,
  ScrollView,
  StatusBar,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useTripStore } from "../../store/tripStore";
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../../constants/theme';

interface Contact {
  label: string;
  name: string;
  phone: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
}

export default function EmergencyScreen() {
  const navigation = useNavigation<any>();
  const { activeTripId, activeTripName } = useTripStore();
  
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    setContacts([
      { 
        label: "Tour Organiser", 
        name: "Suresh Khanna", 
        phone: "+91 98765 00001", 
        icon: 'person-outline', 
        color: Colors.primary.main, 
        bg: Colors.primary.lightBg 
      },
      { 
        label: "Bus Driver", 
        name: "Ramesh Kumar", 
        phone: "+91 98765 00002", 
        icon: 'bus-outline', 
        color: Colors.warning.main, 
        bg: Colors.warning.lightBg 
      },
      { 
        label: "Hotel Helpdesk", 
        name: "The Grand Residency", 
        phone: "+91 98765 00003", 
        icon: 'business-outline', 
        color: Colors.info.main, 
        bg: Colors.info.lightBg 
      },
      { 
        label: "Family Emergency", 
        name: "Priya Sharma", 
        phone: "+91 98765 00004", 
        icon: 'heart-outline', 
        color: Colors.urgent.main, 
        bg: Colors.urgent.lightBg 
      },
    ]);
  }, [activeTripId, activeTripName]);

  const handleSOS = () => {
    Alert.alert(
      "EMERGENCY SOS",
      "This will notify the trip coordinator and send your current location. Proceed?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "SEND SOS", style: "destructive", onPress: () => Alert.alert("SOS Sent", "Help is on the way. Please stay where you are.") }
      ]
    );
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone.replace(/\s+/g, "")}`);
  };

  const shareLocation = () => {
    Share.share({ message: "Help! I am on a trip and need assistance. My location: https://maps.google.com/?q=32.2396,77.1887" });
  };

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
          <Text style={styles.headerTitle}>Emergency Help</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* SOS Button Section */}
          <View style={styles.sosSection}>
            <TouchableOpacity 
              activeOpacity={0.85}
              onPress={handleSOS}
              style={[styles.sosOuterCircle, Shadows.md]}
            >
              <View style={[styles.sosInnerCircle, Shadows.md]}>
                <Ionicons name="alert-circle" size={60} color="#FFFFFF" />
                <Text style={styles.sosText}>SOS</Text>
              </View>
            </TouchableOpacity>
            <Text style={styles.sosHeading}>Emergency Assistance</Text>
            <Text style={styles.sosSub}>
              Press the SOS button to immediately notify the trip coordinator.
            </Text>
          </View>

          {/* Location Sharing Card */}
          <View style={styles.section}>
            <TouchableOpacity 
              onPress={shareLocation}
              style={[styles.shareCard, Shadows.sm]}
              activeOpacity={0.8}
            >
              <View style={styles.shareCardLeft}>
                <View style={styles.shareIconCircle}>
                  <Ionicons name="location" size={26} color="#FFFFFF" />
                </View>
                <View style={styles.shareTextCol}>
                  <Text style={styles.shareTitle}>Share Location</Text>
                  <Text style={styles.shareSub}>Send current GPS coordinates</Text>
                </View>
              </View>
              <Ionicons name="share-social-outline" size={20} color={Colors.primary.main} />
            </TouchableOpacity>
          </View>

          {/* Support Contacts */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Support Contacts</Text>
            {contacts.map((contact, idx) => (
              <View 
                key={idx} 
                style={[styles.contactCard, Shadows.sm]}
              >
                <View style={[styles.contactIconBg, { backgroundColor: contact.bg }]}>
                  <Ionicons name={contact.icon} size={22} color={contact.color} />
                </View>
                <View style={styles.contactDetails}>
                  <Text style={styles.contactLabel}>{contact.label}</Text>
                  <Text style={styles.contactName}>{contact.name}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCall(contact.phone)}
                  style={styles.callBtn}
                  activeOpacity={0.7}
                >
                  <Ionicons name="call" size={20} color={Colors.success.text} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Local Emergency Numbers */}
          <View style={[styles.localCard, Shadows.sm]}>
            <Text style={styles.localHeading}>Local Emergency</Text>
            <View style={styles.localRow}>
              <Text style={styles.localLabel}>Police</Text>
              <TouchableOpacity onPress={() => handleCall("100")}>
                <Text style={styles.localNumber}>100</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.localDivider} />
            <View style={styles.localRow}>
              <Text style={styles.localLabel}>Ambulance</Text>
              <TouchableOpacity onPress={() => handleCall("102")}>
                <Text style={styles.localNumber}>102</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  headerRightPlaceholder: {
    width: 40,
    fontFamily: fonts.regular,},
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  sosSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: Spacing.screenPaddingH,
  },
  sosOuterCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: Colors.urgent.lightBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FECACA',
  },
  sosInnerCircle: {
    width: 144,
    height: 144,
    borderRadius: 72,
    backgroundColor: Colors.urgent.main,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: { boxShadow: '0 8px 24px rgba(217,64,64,0.4)' },
      default: {
        shadowColor: Colors.urgent.main,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 12,
        elevation: 12,
      },
    }) as any,
  },
  sosText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
    fontFamily: fonts.bold,
    marginTop: 4,
  },
  sosHeading: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginTop: 20,
  },
  sosSub: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
    textAlign: 'center',
    paddingHorizontal: 24,
    marginTop: 6,
    lineHeight: 20,
  },
  section: {
    paddingHorizontal: Spacing.screenPaddingH,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.semiBold,
    marginBottom: 12,
  },
  shareCard: {
    backgroundColor: Colors.info.lightBg,
    borderColor: '#C5DDF5',
    borderWidth: 0.5,
    borderRadius: Spacing.cardRadius,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  shareCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  shareIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primary.main,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareTextCol: {
    flex: 1,
    fontFamily: fonts.regular,},
  shareTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary.main,
    fontFamily: fonts.bold,
  },
  shareSub: {
    fontSize: 12,
    color: Colors.primary.medium,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.cardRadius,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  contactIconBg: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  contactDetails: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.neutral.textMuted,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  contactName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
  },
  callBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.success.lightBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  localCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.cardRadius,
    padding: 20,
    marginHorizontal: Spacing.screenPaddingH,
    marginTop: 16,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  localHeading: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.neutral.textMuted,
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  localRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  localLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.semiBold,
  },
  localNumber: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary.main,
    fontFamily: fonts.bold,
  },
  localDivider: {
    height: 0.5,
    backgroundColor: Colors.neutral.border,
    marginVertical: 12,
  },
});
