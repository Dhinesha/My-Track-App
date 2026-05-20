import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { Colors, Typography, Spacing, Shadows } from "../../constants/theme";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";

interface Contact {
  label: string;
  name: string;
  phone: string;
}

export default function UrgentEmergencyScreen() {
  const navigation = useNavigation<any>();
  const [personalContacts, setPersonalContacts] = useState<Contact[]>([]);

  useFocusEffect(
    React.useCallback(() => {
      const loadContacts = async () => {
        const saved1 = await AsyncStorage.getItem('emergency_contact_1');
        const saved2 = await AsyncStorage.getItem('emergency_contact_2');
        
        const pContacts: Contact[] = [];
        if (saved1) pContacts.push({ label: "PRIMARY CONTACT", name: "Family/Friend", phone: saved1 });
        if (saved2) pContacts.push({ label: "SECONDARY CONTACT", name: "Family/Friend", phone: saved2 });
        
        if (pContacts.length === 0) {
          pContacts.push({ label: "URGENT CONTACT", name: "Priya Sharma", phone: "+1 555 010 1203" });
        }
        setPersonalContacts(pContacts);
      };
      loadContacts();
    }, [])
  );

  const handleCall = async (phone: string) => {
    const sanitized = phone.replace(/\s+/g, "");
    await Linking.openURL(`tel:${sanitized}`);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[Colors.urgent.main, '#A61C1C']}
        style={styles.alertHeader}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Urgent Caller</Text>
          <View style={styles.backButtonPlaceholder} />
        </View>
        <View style={styles.alertIconWrap}>
          <Ionicons name="call" size={44} color="#FFFFFF" />
          <Text style={styles.alertMainText}>EMERGENCY CALL</Text>
          <Text style={styles.alertSubText}>Immediate assistance for urgent situations</Text>
        </View>
      </LinearGradient>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        style={styles.scrollView}
      >
        <Text style={styles.sectionLabel}>SEQUENTIAL EMERGENCY CONTACTS</Text>
        <View style={styles.urgentList}>
          {personalContacts.map((contact, idx) => {
            const isPrimary = idx === 0;
            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.urgentCallCard, 
                  isPrimary ? styles.primaryCard : styles.secondaryCard,
                  Shadows.sm
                ]}
                onPress={() => handleCall(contact.phone)}
                activeOpacity={0.9}
              >
                <View style={styles.cardHeader}>
                  <View style={[
                    styles.urgentIconCircle, 
                    isPrimary ? styles.primaryIconBg : styles.secondaryIconBg
                  ]}>
                    <Ionicons 
                      name={isPrimary ? "shield-checkmark" : "person"} 
                      size={24} 
                      color="#FFFFFF" 
                    />
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={[
                      styles.urgentLabel, 
                      isPrimary ? styles.primaryLabel : styles.secondaryLabel
                    ]}>
                      {isPrimary ? "PRIMARY CONTACT (CALL FIRST)" : "SECONDARY CONTACT"}
                    </Text>
                    <Text style={styles.urgentName}>{contact.name}</Text>
                  </View>
                </View>

                <View style={[
                  styles.callActionBtn, 
                  isPrimary ? styles.primaryCallBtn : styles.secondaryCallBtn
                ]}>
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                  <Text style={styles.callNowText}>CALL {contact.phone}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={20} color={Colors.neutral.textMuted} />
          <Text style={styles.infoText}>
            These contacts are managed in your profile. Ensure they are up to date for your safety during trips.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: Colors.neutral.pageBackground,
  },
  scrollView: {
    flex: 1,
  },
  alertHeader: {
    paddingBottom: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.screenPaddingH,
    height: Spacing.headerHeight,
  },
  backButton: { 
    width: 40, 
    height: 40, 
    alignItems: "center", 
    justifyContent: "center",
  },
  backButtonPlaceholder: {
    width: 40,
  },
  headerTitle: { 
    color: "#FFFFFF", 
    fontSize: Typography.fontSizes.screenTitle, 
    fontFamily: Typography.fontFamilies.semibold,
    fontWeight: "600",
  },
  alertIconWrap: { 
    alignItems: "center", 
    marginTop: 10,
  },
  alertMainText: { 
    color: "#FFFFFF", 
    fontSize: 22, 
    fontFamily: Typography.fontFamilies.bold, 
    fontWeight: "700",
    marginTop: 10, 
    letterSpacing: 1,
  },
  alertSubText: { 
    color: "rgba(255,255,255,0.85)", 
    fontSize: 13, 
    fontFamily: Typography.fontFamilies.regular, 
    marginTop: 4,
  },
  scrollContent: { 
    paddingHorizontal: Spacing.screenPaddingH, 
    paddingTop: 24, 
    paddingBottom: 40,
  },
  sectionLabel: { 
    fontSize: 10, 
    fontFamily: Typography.fontFamilies.bold, 
    fontWeight: "700",
    color: Colors.neutral.textMuted, 
    letterSpacing: 1.2, 
    marginBottom: 16, 
    textAlign: 'center',
  },
  urgentList: { 
    gap: 16,
  },
  urgentCallCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: Spacing.cardRadius,
    padding: 16,
    borderWidth: 0.5,
  },
  primaryCard: { 
    borderColor: '#FECACA', 
    backgroundColor: Colors.urgent.lightBg,
  },
  secondaryCard: { 
    borderColor: Colors.neutral.border,
  },
  cardHeader: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    gap: 12, 
    marginBottom: 16,
  },
  urgentIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryIconBg: { 
    backgroundColor: Colors.urgent.main,
  },
  secondaryIconBg: { 
    backgroundColor: Colors.neutral.textSecondary,
  },
  cardInfo: { 
    flex: 1,
  },
  urgentLabel: { 
    fontSize: 9, 
    fontFamily: Typography.fontFamilies.bold, 
    fontWeight: "700",
    marginBottom: 4,
  },
  primaryLabel: { 
    color: Colors.urgent.main,
  },
  secondaryLabel: { 
    color: Colors.neutral.textSecondary,
  },
  urgentName: { 
    fontSize: 16, 
    fontFamily: Typography.fontFamilies.bold, 
    fontWeight: "700",
    color: Colors.neutral.textPrimary,
  },
  callActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 12,
  },
  primaryCallBtn: { 
    backgroundColor: Colors.urgent.main,
  },
  secondaryCallBtn: { 
    backgroundColor: Colors.neutral.textPrimary,
  },
  callNowText: { 
    color: "#FFFFFF", 
    fontSize: 14, 
    fontFamily: Typography.fontFamilies.bold,
    fontWeight: "700",
  },
  infoBox: {
    marginTop: 32,
    flexDirection: "row",
    gap: 10,
    backgroundColor: Colors.neutral.pageBackground,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    padding: 14,
    borderRadius: 12,
  },
  infoText: { 
    flex: 1, 
    fontSize: 12, 
    color: Colors.neutral.textSecondary, 
    lineHeight: 18, 
    fontFamily: Typography.fontFamilies.regular,
  },
});
