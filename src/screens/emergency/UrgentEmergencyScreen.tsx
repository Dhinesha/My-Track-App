import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  ScrollView,
  StyleSheet,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "../../theme/colors";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

interface Contact {
  label: string;
  name: string;
  phone: string;
}

export default function UrgentEmergencyScreen() {
  const navigation = useNavigation();
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
      <LinearGradient
        colors={['#EF4444', '#B91C1C']}
        style={styles.alertHeader}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Urgent Caller</Text>
          <View style={styles.backButton} />
        </View>
        <View style={styles.alertIconWrap}>
          <MaterialCommunityIcons name="phone-alert" size={48} color="#FFFFFF" />
          <Text style={styles.alertMainText}>EMERGENCY CALL</Text>
          <Text style={styles.alertSubText}>Immediate assistance for urgent situations</Text>
        </View>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionLabel}>SEQUENTIAL EMERGENCY CONTACTS</Text>
        <View style={styles.urgentList}>
          {personalContacts.map((contact, idx) => (
            <TouchableOpacity
              key={idx}
              style={[styles.urgentCallCard, idx === 0 ? styles.primaryCard : styles.secondaryCard]}
              onPress={() => handleCall(contact.phone)}
              activeOpacity={0.9}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.urgentIconCircle, idx === 0 ? styles.primaryIconBg : styles.secondaryIconBg]}>
                  <MaterialIcons 
                    name={idx === 0 ? "emergency-share" : "contact-phone"} 
                    size={28} 
                    color="#FFFFFF" 
                  />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={[styles.urgentLabel, idx === 0 ? styles.primaryLabel : styles.secondaryLabel]}>
                    {idx === 0 ? "PRIMARY CONTACT (CALL FIRST)" : "SECONDARY CONTACT"}
                  </Text>
                  <Text style={styles.urgentName}>{contact.name}</Text>
                </View>
              </View>

              <View style={[styles.callActionBtn, idx === 0 ? styles.primaryCallBtn : styles.secondaryCallBtn]}>
                <MaterialIcons name="call" size={24} color="#FFFFFF" />
                <Text style={styles.callNowText}>CALL {contact.phone}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <MaterialIcons name="info-outline" size={20} color="#64748B" />
          <Text style={styles.infoText}>
            These contacts are managed in your profile. Ensure they are up to date for your safety during trips.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  alertHeader: {
    paddingBottom: 30,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  backButton: { width: 44, height: 44, alignItems: "center", justifyContent: "center" },
  headerTitle: { color: "#FFFFFF", fontSize: 18, fontFamily: "PlusJakartaSans-Bold" },
  alertIconWrap: { alignItems: "center", marginTop: 10 },
  alertMainText: { color: "#FFFFFF", fontSize: 22, fontFamily: "PlusJakartaSans-ExtraBold", marginTop: 12, letterSpacing: 1 },
  alertSubText: { color: "rgba(255,255,255,0.8)", fontSize: 14, fontFamily: "PlusJakartaSans-Medium", marginTop: 4 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  sectionLabel: { fontSize: 11, fontFamily: "PlusJakartaSans-Bold", color: "#94A3B8", letterSpacing: 1, marginBottom: 20, textAlign: 'center' },
  urgentList: { gap: 16 },
  urgentCallCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    width: '100%',
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  primaryCard: { borderColor: "#FEE2E2", backgroundColor: "#FFF5F5" },
  secondaryCard: { borderColor: "#E2E8F0" },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  urgentIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryIconBg: { backgroundColor: "#EF4444" },
  secondaryIconBg: { backgroundColor: "#64748B" },
  cardInfo: { flex: 1 },
  urgentLabel: { fontSize: 10, fontFamily: "PlusJakartaSans-Bold", marginBottom: 4 },
  primaryLabel: { color: "#EF4444" },
  secondaryLabel: { color: "#64748B" },
  urgentName: { fontSize: 18, fontFamily: "PlusJakartaSans-Bold", color: "#1E293B" },
  callActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 16,
    borderRadius: 16,
  },
  primaryCallBtn: { backgroundColor: "#EF4444" },
  secondaryCallBtn: { backgroundColor: "#1E293B" },
  callNowText: { color: "#FFFFFF", fontSize: 16, fontFamily: "PlusJakartaSans-ExtraBold" },
  infoBox: {
    marginTop: 40,
    flexDirection: "row",
    gap: 12,
    backgroundColor: "#F1F5F9",
    padding: 16,
    borderRadius: 16,
  },
  infoText: { flex: 1, fontSize: 12, color: "#64748B", lineHeight: 18, fontFamily: "PlusJakartaSans-Medium" },
});
