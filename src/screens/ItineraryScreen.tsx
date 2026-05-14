import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ItineraryScreen() {
  const navigation = useNavigation<any>();
  const [activeDay, setActiveDay] = useState(0);

  const days = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"];
  
  const dailyActivities: Record<number, any[]> = {
    0: [ // Day 1
      {
        id: "1-1",
        time: "08:00 AM",
        title: "Breakfast at Hotel",
        location: "Main Lobby",
        icon: "restaurant",
        iconBg: "#DBEAFE",
        iconColor: "#2563EB",
        note: "Meet near the concierge desk.",
      },
      {
        id: "1-2",
        time: "10:00 AM",
        title: "Sightseeing Bus Tour",
        location: "Station A, Pickup Point",
        icon: "bus",
        iconBg: "#E0E7FF",
        iconColor: "#4F46E5",
        alert: "Note: Bring water bottles & sunscreen.",
      },
      {
        id: "1-3",
        time: "01:00 PM",
        title: "Lunch at Ramen Street",
        location: "Tokyo Station",
        icon: "ramen-dining",
        iconBg: "#FFEDD5",
        iconColor: "#EA580C",
      },
      {
        id: "1-4",
        time: "04:00 PM",
        title: "Check-in to Ryokan",
        location: "Hakone",
        icon: "hotel",
        iconBg: "#CCFBF1",
        iconColor: "#0D9488",
        note: "Booking Ref: #JP-8829",
      },
    ],
    1: [ // Day 2
      {
        id: "2-1",
        time: "09:00 AM",
        title: "Fushimi Inari Shrine",
        location: "Kyoto",
        icon: "map-marker",
        iconBg: "#FEE2E2",
        iconColor: "#EF4444",
        note: "Wear comfortable walking shoes.",
      },
      {
        id: "2-2",
        time: "12:30 PM",
        title: "Traditional Kaiseki Lunch",
        location: "Gion District",
        icon: "food-variant",
        iconBg: "#FDF4FF",
        iconColor: "#D946EF",
      },
      {
        id: "2-3",
        time: "03:00 PM",
        title: "Bamboo Forest Walk",
        location: "Arashiyama",
        icon: "tree",
        iconBg: "#F0FDF4",
        iconColor: "#22C55E",
      },
    ],
    2: [ // Day 3
      {
        id: "3-1",
        time: "10:00 AM",
        title: "Universal Studios Japan",
        location: "Osaka",
        icon: "star",
        iconBg: "#FEF9C3",
        iconColor: "#EAB308",
        alert: "Express Passes are in your digital vault.",
      },
      {
        id: "3-2",
        time: "07:00 PM",
        title: "Street Food Tour",
        location: "Dotonbori",
        icon: "food-drumstick",
        iconBg: "#FFEDD5",
        iconColor: "#F97316",
      },
    ],
    3: [ // Day 4
      {
        id: "4-1",
        time: "09:00 AM",
        title: "Nara Deer Park",
        location: "Nara",
        icon: "heart",
        iconBg: "#FCE7F3",
        iconColor: "#EC4899",
        note: "Purchase deer crackers at the entrance.",
      },
      {
        id: "4-2",
        time: "01:00 PM",
        title: "Todai-ji Temple Visit",
        location: "Nara",
        icon: "home-variant",
        iconBg: "#E0F2FE",
        iconColor: "#0EA5E9",
      },
    ],
    4: [ // Day 5
      {
        id: "5-1",
        time: "08:00 AM",
        title: "Last Minute Shopping",
        location: "Shinjuku",
        icon: "shopping",
        iconBg: "#F1F5F9",
        iconColor: "#475569",
      },
      {
        id: "5-2",
        time: "02:00 PM",
        title: "Airport Transfer",
        location: "Narita Airport",
        icon: "airplane",
        iconBg: "#EFF6FF",
        iconColor: "#3B82F6",
        note: "Flight departs at 05:30 PM",
      },
    ],
  };

  const activities = dailyActivities[activeDay] || [];

  return (
    <SafeAreaView className="flex-1 bg-[#f6f7f8]" edges={["top"]}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-slate-200">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2">
          <MaterialIcons name="arrow-back" size={24} color="#475569" />
        </TouchableOpacity>
        <Text className="text-base font-jakarta-bold text-slate-900">Itinerary</Text>
        <TouchableOpacity className="p-2">
          <MaterialIcons name="more-horiz" size={24} color="#475569" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1"
      >
        {/* Trip Headline */}
        <View className="px-5 pt-6 pb-2 flex-row justify-between items-start">
          <View className="flex-1 mr-4">
            <Text className="text-2xl font-jakarta-extrabold text-slate-900 leading-tight">
              Tokyo Family Adventure
            </Text>
            <View className="flex-row items-center mt-2">
              <MaterialCommunityIcons name="calendar-month" size={18} color="#94a3b8" />
              <Text className="text-slate-500 font-jakarta-medium text-sm ml-2">Oct 12 - Oct 20, 2023</Text>
            </View>
          </View>
          <LinearGradient
            colors={['#60a5fa', '#4f46e5']}
            className="h-14 w-14 rounded-2xl items-center justify-center shadow-sm"
          >
            <MaterialIcons name="flight-takeoff" size={24} color="white" />
          </LinearGradient>
        </View>

        {/* Day Selector */}
        <View className="py-4">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 20 }}
          >
            {days.map((day, index) => (
              <TouchableOpacity
                key={day}
                onPress={() => setActiveDay(index)}
                className={`
                  mr-3 px-6 py-2.5 rounded-full
                  ${activeDay === index ? "bg-[#2b8cee] shadow-md shadow-blue-200" : "bg-white border border-slate-200"}
                `}
              >
                <Text className={`
                  text-sm font-jakarta-bold
                  ${activeDay === index ? "text-white" : "text-slate-600"}
                `}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Timeline Section */}
        <View className="px-5 mt-4">
          <Text className="text-[10px] font-jakarta-extrabold uppercase tracking-widest text-slate-400 mb-6 ml-1">
            {activeDay === 0 ? "OCTOBER 12TH" : activeDay === 1 ? "OCTOBER 13TH" : activeDay === 2 ? "OCTOBER 14TH" : activeDay === 3 ? "OCTOBER 15TH" : "OCTOBER 16TH"} SCHEDULE
          </Text>

          {activities.map((activity, index) => (
            <View key={activity.id} className="flex-row">
              {/* Timeline Indicator */}
              <View className="items-center w-10">
                <View className="h-4 w-0.5 bg-slate-200" />
                <View 
                  style={{ backgroundColor: activity.iconBg }}
                  className="w-10 h-10 rounded-full items-center justify-center z-10 border-4 border-[#f6f7f8]"
                >
                  <MaterialCommunityIcons 
                    name={activity.icon as any} 
                    size={20} 
                    color={activity.iconColor} 
                  />
                </View>
                <View className={`w-0.5 flex-1 ${index === activities.length - 1 ? "bg-transparent" : "bg-slate-200"}`} />
              </View>

              {/* Activity Card */}
              <View className="flex-1 pl-3 pb-8">
                <View className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                  <View className="flex-row justify-between items-start mb-1">
                    <Text className="text-slate-900 font-jakarta-extrabold text-base leading-tight">
                      {activity.title}
                    </Text>
                    <View className="bg-blue-50 px-2.5 py-1 rounded-full">
                      <Text className="text-[#2b8cee] text-[10px] font-jakarta-extrabold">{activity.time}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center mb-2">
                    <MaterialIcons name="location-on" size={14} color="#94a3b8" />
                    <Text className="text-slate-500 font-jakarta-medium text-xs ml-1">
                      {activity.location}
                    </Text>
                  </View>

                  {activity.note && (
                    <Text className="text-slate-400 font-jakarta-medium italic text-xs leading-5">
                      {activity.note}
                    </Text>
                  )}

                  {activity.alert && (
                    <View className="flex-row items-start gap-2 bg-amber-50 p-3 rounded-xl mt-2">
                      <MaterialIcons name="info" size={14} color="#d97706" style={{ marginTop: 2 }} />
                      <Text className="text-amber-800 font-jakarta-bold text-[11px] leading-tight flex-1">
                        {activity.alert}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Nav Mockup */}
      <View className="absolute bottom-0 w-full bg-white border-t border-slate-100 flex-row justify-around items-center py-3 px-6 shadow-2xl">
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'My Trips' })} className="items-center gap-1">
          <MaterialCommunityIcons name="map" size={24} color="#cbd5e1" />
          <Text className="text-[10px] font-jakarta-medium text-slate-400">My Trips</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Home' })} className="items-center gap-1">
          <View className="relative">
            <MaterialCommunityIcons name="view-dashboard" size={24} color="#2b8cee" />
            <View className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#2b8cee] rounded-full border-2 border-white" />
          </View>
          <Text className="text-[10px] font-jakarta-extrabold text-[#2b8cee]">Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Main', { screen: 'Profile' })} className="items-center gap-1">
          <MaterialCommunityIcons name="account" size={24} color="#cbd5e1" />
          <Text className="text-[10px] font-jakarta-medium text-slate-400">Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
