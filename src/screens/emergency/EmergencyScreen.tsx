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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useTripStore } from "../../store/tripStore";
import { Colors } from "../../theme/colors";


interface Contact {
  label: string;
  name: string;
  phone: string;
  icon: any;
  color: string;
}

export default function EmergencyScreen() {
  const navigation = useNavigation();
  const { activeTripId, activeTripName } = useTripStore();
  
  const [contacts, setContacts] = useState<Contact[]>([]);

  useEffect(() => {
    const tripLabel = activeTripName || (activeTripId ? `Trip ${activeTripId}` : "Active Trip");
    
    setContacts([
      { label: "Tour Organiser", name: "Suresh Khanna", phone: "+91 98765 00001", icon: 'user', color: '#0D9488' },
      { label: "Bus Driver", name: "Ramesh Kumar", phone: "+91 98765 00002", icon: 'truck', color: '#2563EB' },
      { label: "Hotel Helpdesk", name: "The Grand Residency", phone: "+91 98765 00003", icon: 'home', color: '#D97706' },
      { label: "Family Emergency", name: "Priya Sharma", phone: "+91 98765 00004", icon: 'heart', color: '#DC2626' },
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
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-border-light">
            <Feather name="arrow-left" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text className="text-xl font-jakarta-extrabold text-text-primary">Emergency Help</Text>
          <View className="w-10" />
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* SOS Section */}
          <View className="items-center py-8 px-6">
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleSOS}
              className="w-48 h-48 rounded-full bg-status-error/10 items-center justify-center border-2 border-status-error/20"
            >
              <View className="w-36 h-36 rounded-full bg-status-error items-center justify-center shadow-2xl shadow-status-error/50">
                <MaterialCommunityIcons name="alarm-light" size={64} color="#fff" />
                <Text className="text-white font-jakarta-extrabold text-2xl mt-2">SOS</Text>
              </View>
            </TouchableOpacity>
            <Text className="text-text-primary font-jakarta-extrabold text-lg mt-6">Emergency Assistance</Text>
            <Text className="text-text-muted font-jakarta-medium text-center mt-2 px-10">
              Press and hold the SOS button to notify the trip coordinator immediately.
            </Text>
          </View>

          {/* Location Sharing Card */}
          <View className="px-6 mb-8">
            <TouchableOpacity 
              onPress={shareLocation}
              className="bg-primary/5 rounded-[32px] p-6 border border-primary/10 flex-row items-center"
            >
              <View className="w-14 h-14 bg-primary rounded-2xl items-center justify-center mr-4">
                <Feather name="map-pin" size={28} color="#fff" />
              </View>
              <View className="flex-1">
                <Text className="text-primary font-jakarta-extrabold text-base">Share Location</Text>
                <Text className="text-primary/60 font-jakarta-bold text-xs">Send current GPS coordinates</Text>
              </View>
              <Feather name="share-2" size={20} color={Colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Support Contacts */}
          <View className="px-6">
            <Text className="text-lg font-jakarta-bold text-text-primary mb-4">Support Contacts</Text>
            {contacts.map((contact, idx) => (
              <View 
                key={idx} 
                className="bg-white rounded-[24px] p-4 mb-3 border border-border-light shadow-sm flex-row items-center"
              >
                <View 
                  style={{ backgroundColor: `${contact.color}15` }}
                  className="w-12 h-12 rounded-xl items-center justify-center mr-4"
                >
                  <Feather name={contact.icon as any} size={22} color={contact.color} />
                </View>
                <View className="flex-1">
                  <Text className="text-text-muted font-jakarta-bold text-[10px] uppercase">{contact.label}</Text>
                  <Text className="text-text-primary font-jakarta-extrabold text-base">{contact.name}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => handleCall(contact.phone)}
                  className="w-12 h-12 bg-status-success/10 rounded-full items-center justify-center"
                >
                  <Feather name="phone" size={20} color={Colors.status.success} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Local Emergency Numbers */}
          <View className="mx-6 mt-6 p-6 bg-slate-100 rounded-[32px] border border-slate-200">
            <Text className="text-slate-500 font-jakarta-extrabold text-[10px] uppercase mb-4 tracking-widest">Local Emergency</Text>
            <View className="flex-row justify-between mb-4">
              <Text className="text-slate-800 font-jakarta-bold">Police</Text>
              <TouchableOpacity onPress={() => handleCall("100")}>
                <Text className="text-primary font-jakarta-extrabold">100</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-slate-800 font-jakarta-bold">Ambulance</Text>
              <TouchableOpacity onPress={() => handleCall("102")}>
                <Text className="text-primary font-jakarta-extrabold">102</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}





