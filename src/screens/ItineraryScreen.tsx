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
import { MaterialIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { format, parseISO } from 'date-fns';
import { Colors } from "../theme/colors";
import { EmergencyFAB } from "../components/common";


const DAYS = ["Oct 12", "Oct 13", "Oct 14", "Oct 15", "Oct 16"];

const ACTIVITIES = [
  {
    id: "1",
    time: "08:00 AM",
    title: "Breakfast at Hotel",
    location: "Main Dining Hall",
    icon: "restaurant",
    color: "#0D9488",
    bgColor: "#F0FDFA",
    note: "Continental & Indian options available.",
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&q=80"
  },
  {
    id: "2",
    time: "10:00 AM",
    title: "Departure to Rohtang Pass",
    location: "Private Bus Terminal",
    icon: "bus",
    color: "#2563EB",
    bgColor: "#EFF6FF",
    note: "Please carry your photo ID cards.",
  },
  {
    id: "3",
    time: "01:30 PM",
    title: "Lunch Break",
    location: "Solang Valley Riverside",
    icon: "food",
    color: "#D97706",
    bgColor: "#FFFBEB",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80"
  },
  {
    id: "4",
    time: "04:30 PM",
    title: "Leisure Time & Shopping",
    location: "Mall Road, Manali",
    icon: "shopping",
    color: "#7C3AED",
    bgColor: "#F5F3FF",
  }
];

export default function ItineraryScreen() {
  const navigation = useNavigation<any>();
  const [activeDay, setActiveDay] = useState(0);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center px-6 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Feather name="arrow-left" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text className="text-xl font-jakarta-extrabold text-text-primary">
            Itinerary
          </Text>
        </View>

        {/* Day Tabs */}
        <View className="mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {DAYS.map((day, index) => (
              <TouchableOpacity
                key={day}
                onPress={() => setActiveDay(index)}
                className={`
                  mr-3 px-6 py-3 rounded-2xl border
                  ${activeDay === index ? "bg-primary border-primary shadow-lg shadow-primary/20" : "bg-white border-border-light"}
                `}
              >
                <Text className={`
                  font-jakarta-bold text-[10px] uppercase tracking-widest mb-0.5
                  ${activeDay === index ? "text-white/70" : "text-text-muted"}
                `}>
                  Day {index + 1}
                </Text>
                <Text className={`
                  font-jakarta-extrabold text-sm
                  ${activeDay === index ? "text-white" : "text-text-primary"}
                `}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Timeline */}
        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {ACTIVITIES.map((activity, index) => (
            <View key={activity.id} className="flex-row">
              {/* Timeline Indicator */}
              <View className="items-center mr-4">
                <View className={`w-10 h-10 rounded-full items-center justify-center z-10 ${index === 0 ? "bg-primary" : "bg-white border-2 border-border-light"}`}>
                  <MaterialCommunityIcons 
                    name={activity.icon as any} 
                    size={20} 
                    color={index === 0 ? "#fff" : Colors.text.secondary} 
                  />
                </View>
                {index !== ACTIVITIES.length - 1 && (
                  <View className="w-0.5 flex-1 bg-border-light my-1" />
                )}
              </View>

              {/* Activity Card */}
              <View className="flex-1 pb-10">
                <View className="bg-white rounded-3xl p-5 border border-border-light shadow-sm">
                  <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-xs font-jakarta-extrabold text-primary uppercase tracking-widest">
                      {activity.time}
                    </Text>
                    {index === 0 && (
                      <View className="bg-status-success/10 px-2 py-0.5 rounded-full">
                        <Text className="text-status-success text-[8px] font-jakarta-bold uppercase">Now</Text>
                      </View>
                    )}
                  </View>
                  
                  <Text className="text-lg font-jakarta-extrabold text-text-primary mb-1">
                    {activity.title}
                  </Text>
                  <View className="flex-row items-center mb-4">
                    <Feather name="map-pin" size={12} color={Colors.text.muted} />
                    <Text className="text-text-secondary font-jakarta-medium text-xs ml-1">
                      {activity.location}
                    </Text>
                  </View>

                  {activity.image && (
                    <Image 
                      source={{ uri: activity.image }} 
                      className="w-full h-32 rounded-2xl mb-4"
                      resizeMode="cover"
                    />
                  )}

                  <View style={{ backgroundColor: activity.bgColor }} className="rounded-xl p-3 border border-black/5">
                    <Text style={{ color: activity.color }} className="text-xs font-jakarta-medium leading-5">
                      {activity.note}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
      <EmergencyFAB />
    </View>
  );
}





