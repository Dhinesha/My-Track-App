import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { RootStackParamList } from "../../App";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  QuickActionsRow,
  TripProgressBar,
  TripCountdownWidget,
  WhatsHappeningNowCard,
  TodaySummaryCard,
  SmartCheckInBanner,
  InTripWeatherWidget,
  TripMemoriesCard,
} from "../components/trips";
import { EmergencyFAB } from "../components/common";

type Nav = NativeStackNavigationProp<RootStackParamList>;
type Route = RouteProp<RootStackParamList, "TripDetail">;

export default function TripDetailScreen() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { tripId, tripName } = route.params;
  const [isSelfCheckedIn, setIsSelfCheckedIn] = React.useState(false);

  React.useEffect(() => {
    const checkStatus = async () => {
      const saved = await AsyncStorage.getItem(`checkin_${tripId}`);
      if (saved) setIsSelfCheckedIn(true);
    };
    checkStatus();
  }, [tripId]);

  const menuItems = [
    {
      id: "itinerary",
      label: "Itinerary",
      sub: "View today's plan",
      icon: "calendar-clock",
      color: "#3B82F6",
      onPress: () => navigation.navigate("Itinerary", { tripId, tripName }),
    },
    {
      id: "vehicle",
      label: "Vehicle",
      sub: "Bus #2 - 12/15 here",
      icon: "bus",
      color: "#F59E0B",
      onPress: () => navigation.navigate("VehicleAttendance", { tripId }),
    },
    {
      id: "family",
      label: "Family",
      sub: "Manage Group",
      icon: "account-group",
      color: "#10B981",
      onPress: () => navigation.navigate("FamilyMembers", { tripId }),
    },
    {
      id: "hotel",
      label: "Hotel Details",
      sub: "Hotel Granvia",
      icon: "office-building",
      color: "#8B5CF6",
      onPress: () => navigation.navigate("Hotel", { tripId }),
    },
    {
      id: "notifications",
      label: "Notifications",
      sub: "2 New",
      icon: "bell",
      color: "#EF4444",
      badge: 2,
      onPress: () => navigation.navigate("Notifications"),
    },

    {
      id: "feedback",
      label: "Feedback",
      sub: "Rate your trip",
      icon: "star",
      color: "#F59E0B",
      onPress: () =>
        navigation.navigate("Feedback", {
          tripId,
          tripName,
          paxId: "demo-pax-1",
        }),
    },
    {
      id: "packing",
      label: "Packing List",
      sub: "Get ready for travel",
      icon: "briefcase-check",
      color: "#0D9488",
      onPress: () => navigation.navigate("PackingChecklist", { 
        tripId, 
        tripName, 
        tripType: "family" 
      }),
    },
    {
      id: "budget",
      label: "Budget",
      sub: "Track your spendings",
      icon: "currency-inr",
      color: "#10B981",
      onPress: () => navigation.navigate("BudgetTracker", { 
        tripId, 
        totalDays: 5 
      }),
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center">
          <Feather name="arrow-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text className="text-xl font-jakarta-bold text-[#1E293B]">Trip Dashboard</Text>
        <View className="w-10" />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        className="flex-1 px-6"
      >
        {/* Hero Section */}
        <View className="mt-4 rounded-[32px] overflow-hidden shadow-2xl shadow-black/20 h-72">
          <Image
            source={{
              uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuAF3zCS6btqNZMelf0lJdzX-H_fJ9p6fdz5_CS7se8XKtsDOlN7JfSb7tD-o_X9RCgeWMHN48QmoY3DcAzd3u01NIffCACoUdjhjWpxJkjVNMkXRaewwYmdMVEZi1K8gDmp52Z9Au96Li8xUYqHT_7-2Jw9EQqOLjpnBNHOdU3voC2IPBPdu3gNb475ulRAXJ-WHy7Po4Kzptiqz_FgwBdYdfOV_qt4wdtFsW4YzBr59LP0K3-wo7U7NPD48IxJ04iEp0ZetTbg8fM",
            }}
            className="absolute inset-0 w-full h-full"
          />
          <LinearGradient
            colors={["transparent", "rgba(0,0,0,0.8)"]}
            className="absolute inset-0"
          />
          <View className="absolute inset-0 p-6 flex-col justify-end">
            <View className="flex-row items-center mb-3">
              <View className="bg-white/90 px-3 py-1.5 rounded-full mr-2 shadow-sm">
                <TripCountdownWidget 
                  startDate="2023-10-12" 
                  endDate="2023-10-20" 
                  status="ongoing" 
                />
              </View>
            </View>
            <Text className="text-white text-3xl font-jakarta-extrabold mb-1">Family Kyoto Retreat</Text>
            <View className="flex-row items-center mb-6">
              <MaterialIcons name="location-on" size={16} color="white" />
              <Text className="text-white/90 font-jakarta-medium text-sm ml-1">Kyoto, Japan</Text>
            </View>
            
            <View className="mb-2">
              <TripProgressBar
                startDate="2023-10-12"
                endDate="2023-10-20"
                status="ongoing"
              />
              <Text className="text-white/60 text-[10px] font-jakarta-bold mt-2 uppercase tracking-widest">Day 2 of 9</Text>
            </View>
          </View>
        </View>

        {/* Dynamic Banners */}
        <View className="mt-6 gap-4">
          <TripMemoriesCard 
            tripId={tripId} 
            tripName={tripName} 
            startDate="2023-10-12" 
            endDate="2023-10-20" 
            paxId="demo-pax-1" 
          />
          <SmartCheckInBanner />
          <InTripWeatherWidget />
          <WhatsHappeningNowCard />
          <TodaySummaryCard />
        </View>

        {/* Quick Actions */}
        <QuickActionsRow isSelfCheckedIn={isSelfCheckedIn} />

        {/* Self Check-In Section */}
        <View className="mt-8 mb-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-xl font-jakarta-extrabold text-slate-900">Self Check-In</Text>
            {isSelfCheckedIn && (
              <View className="bg-emerald-50 px-3 py-1 rounded-full flex-row items-center border border-emerald-100">
                <MaterialIcons name="check-circle" size={12} color="#10B981" />
                <Text className="text-[#10B981] text-[10px] font-jakarta-bold ml-1 uppercase">Completed</Text>
              </View>
            )}
          </View>
          
          <TouchableOpacity 
            activeOpacity={0.8}
            className={`w-full py-5 rounded-[24px] items-center justify-center shadow-lg ${isSelfCheckedIn ? 'bg-slate-100' : 'bg-[#0F6E56]'}`}
            onPress={async () => {
              if (!isSelfCheckedIn) {
                await AsyncStorage.setItem(`checkin_${tripId}`, 'true');
                setIsSelfCheckedIn(true);
              }
            }}
          >
            <Text className={`text-lg font-jakarta-bold ${isSelfCheckedIn ? 'text-slate-400' : 'text-white'}`}>
              {isSelfCheckedIn ? 'Already Checked In' : 'Check In'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Status Section */}
        <View className="mb-8">
          <View className="bg-[#EFF6FF] self-start px-4 py-2 rounded-full mb-4 border border-blue-100">
            <Text className="text-[#3B82F6] text-xs font-jakarta-bold">Day 1 of 8 — Wednesday 13 May</Text>
          </View>
          
          <View className="flex-row gap-3">
            <View className="bg-[#FFFBEB] px-4 py-2 rounded-full border border-amber-100 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
              <Text className="text-[#92400E] text-xs font-jakarta-bold">My Check-in</Text>
            </View>
            <View className="bg-[#FFFBEB] px-4 py-2 rounded-full border border-amber-100 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
              <Text className="text-[#92400E] text-xs font-jakarta-bold">Family 2/4</Text>
            </View>
            <View className="bg-[#FFFBEB] px-4 py-2 rounded-full border border-amber-100 flex-row items-center">
              <View className="w-2 h-2 rounded-full bg-amber-500 mr-2" />
              <Text className="text-[#92400E] text-xs font-jakarta-bold">Hotel</Text>
            </View>
          </View>
        </View>

        {/* Menu Grid */}
        <View className="flex-row flex-wrap justify-between">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={item.onPress}
              className="w-[47%] bg-white rounded-[32px] p-6 mb-5 border border-slate-50 shadow-xl shadow-black/5 items-center"
            >
              <View className="w-16 h-16 rounded-full items-center justify-center mb-4 relative" style={{ backgroundColor: item.color + '10' }}>
                <MaterialCommunityIcons name={item.icon as any} size={30} color={item.color} />
                {item.badge && (
                  <View className="absolute top-0 right-0 bg-red-500 w-5 h-5 rounded-full items-center justify-center border-2 border-white">
                    <Text className="text-white text-[8px] font-jakarta-bold">{item.badge}</Text>
                  </View>
                )}
              </View>
              <Text className="text-slate-900 font-jakarta-extrabold text-[15px] mb-1">{item.label}</Text>
              <Text className="text-slate-400 font-jakarta-medium text-[11px] text-center">{item.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {}; // Removed old styles as we use NativeWind
