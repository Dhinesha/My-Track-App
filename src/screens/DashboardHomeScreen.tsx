import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useAuthStore } from "../store/authStore";

export default function DashboardHomeScreen() {
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  
  const [loading, setLoading] = useState(true);
  const [ongoingTrip, setOngoingTrip] = useState<any>(null);

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "DT";

  useEffect(() => {
    setOngoingTrip({
      id: 'kyoto-1',
      name: 'Kyoto Spring Adventure',
      departure_city: 'Osaka',
      destination_city: 'Kyoto',
      current_day: 2,
      total_days: 5,
      progress: 40,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF3zCS6btqNZMelf0lJdzX-H_fJ9p6fdz5_CS7se8XKtsDOlN7JfSb7tD-o_X9RCgeWMHN48QmoY3DcAzd3u01NIffCACoUdjhjWpxJkjVNMkXRaewwYmdMVEZi1K8gDmp52Z9Au96Li8xUYqHT_7-2Jw9EQqOLjpnBNHOdU3voC2IPBPdu3gNb475ulRAXJ-WHy7Po4Kzptiqz_FgwBdYdfOV_qt4wdtFsW4YzBr59LP0K3-wo7U7NPD48IxJ04iEp0ZetTbg8fM',
    });
    setLoading(false);
  }, []);

  if (loading || !ongoingTrip) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#F8FAFC]" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-slate-100">
        <TouchableOpacity className="w-10 h-10 items-center justify-center">
          <Feather name="menu" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-xl font-jakarta-extrabold text-[#1E293B]">
          Trip Dashboard
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} className="w-10 h-10 bg-[#2B8CEE] rounded-full items-center justify-center border-2 border-white shadow-sm">
          <Text className="text-white font-jakarta-bold text-xs">{initials}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1"
      >
        {/* Hero Section */}
        <View className="px-4 pt-6 mb-8">
          <View className="relative w-full h-56 rounded-[32px] overflow-hidden shadow-2xl shadow-black/20">
            <Image
              source={{ uri: ongoingTrip.image_url }}
              className="absolute inset-0 w-full h-full"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              className="absolute inset-0"
            />
            <View className="absolute bottom-0 left-0 w-full p-6">
              <View className="flex-row items-center gap-2 mb-2">
                <View className="bg-[#2b8cee] px-3 py-1 rounded-full">
                  <Text className="text-white text-[10px] font-jakarta-extrabold">Day {ongoingTrip.current_day} of {ongoingTrip.total_days}</Text>
                </View>
                <View className="bg-black/30 px-3 py-1 rounded-full backdrop-blur-md flex-row items-center">
                  <Feather name="cloud" size={12} color="white" />
                  <Text className="text-white text-[10px] font-jakarta-bold ml-1">18°C</Text>
                </View>
              </View>
              <Text className="text-white text-2xl font-jakarta-extrabold mb-1">{ongoingTrip.name}</Text>
              <View className="flex-row items-center">
                <MaterialIcons name="location-on" size={16} color="#2b8cee" />
                <Text className="text-white/80 font-jakarta-medium text-sm ml-1">{ongoingTrip.destination_city}, Japan</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Grid */}
        <View className="px-4 mb-8">
          <View className="flex-row flex-wrap justify-between">
            {/* Itinerary */}
            <TouchableOpacity 
              onPress={() => navigation.navigate("Itinerary", { tripId: ongoingTrip.id, tripName: ongoingTrip.name })}
              className="w-[48%] bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4"
            >
              <View className="w-12 h-12 bg-blue-50 rounded-2xl items-center justify-center mb-4">
                <MaterialCommunityIcons name="calendar-month" size={24} color="#2b8cee" />
              </View>
              <Text className="text-[#1E293B] font-jakarta-extrabold text-base mb-1">Itinerary</Text>
              <Text className="text-slate-400 text-[11px] font-jakarta-medium">View today's plan</Text>
            </TouchableOpacity>

            {/* Vehicle */}
            <TouchableOpacity 
              onPress={() => navigation.navigate("VehicleAttendance", { tripId: ongoingTrip.id })}
              className="w-[48%] bg-white p-5 rounded-3xl border border-slate-100 shadow-sm mb-4"
            >
              <View className="w-12 h-12 bg-indigo-50 rounded-2xl items-center justify-center mb-4">
                <MaterialCommunityIcons name="bus" size={24} color="#6366f1" />
              </View>
              <Text className="text-[#1E293B] font-jakarta-extrabold text-base mb-1">Vehicle</Text>
              <Text className="text-slate-400 text-[11px] font-jakarta-medium">Bus #2 • 12/15 here</Text>
            </TouchableOpacity>

            {/* Family */}
            <TouchableOpacity 
              onPress={() => navigation.navigate("FamilyMembers", { tripId: ongoingTrip.id })}
              className="w-[48%] bg-white p-5 rounded-3xl border border-slate-100 shadow-sm"
            >
              <View className="w-12 h-12 bg-emerald-50 rounded-2xl items-center justify-center mb-4">
                <MaterialCommunityIcons name="account-group" size={24} color="#10b981" />
              </View>
              <Text className="text-[#1E293B] font-jakarta-extrabold text-base mb-1">Family</Text>
              <Text className="text-slate-400 text-[11px] font-jakarta-medium">Manage Group</Text>
            </TouchableOpacity>

            {/* Hotel */}
            <TouchableOpacity 
              onPress={() => navigation.navigate("Hotel", { tripId: ongoingTrip.id })}
              className="w-[48%] bg-white p-5 rounded-3xl border border-slate-100 shadow-sm"
            >
              <View className="w-12 h-12 bg-amber-50 rounded-2xl items-center justify-center mb-4">
                <MaterialCommunityIcons name="office-building" size={24} color="#f59e0b" />
              </View>
              <Text className="text-[#1E293B] font-jakarta-extrabold text-base mb-1">Hotel Details</Text>
              <Text className="text-slate-400 text-[11px] font-jakarta-medium">Hotel Granvia</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Notifications Bar */}
        <View className="px-4 mb-4">
          <TouchableOpacity 
            onPress={() => navigation.navigate("Notifications")}
            className="flex-row items-center bg-white p-4 rounded-3xl border border-slate-100 shadow-sm"
          >
            <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center relative">
              <MaterialCommunityIcons name="bell-ring" size={24} color="#2b8cee" />
              <View className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-[#1E293B] font-jakarta-extrabold text-base">Notifications</Text>
              <Text className="text-slate-500 text-sm font-jakarta-medium">Meeting in lobby at 9:00 AM</Text>
            </View>
            <View className="bg-red-50 px-3 py-1 rounded-full">
              <Text className="text-red-500 text-[10px] font-jakarta-extrabold uppercase">2 New</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Emergency Button */}
        <View className="px-4">
          <TouchableOpacity 
            onPress={() => navigation.navigate("Emergency")}
            className="flex-row items-center justify-center bg-white p-5 rounded-2xl border-2 border-slate-100 shadow-sm"
          >
            <Feather name="headphones" size={20} color="#2b8cee" />
            <Text className="text-slate-500 font-jakarta-extrabold text-base ml-3">Emergency or Help</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
