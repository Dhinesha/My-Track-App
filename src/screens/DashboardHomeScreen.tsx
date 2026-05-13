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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons";
import { RootStackParamList } from "../../App";
import { Colors } from "../theme/colors";
import { EmergencyFAB } from "../components/common";
import { useTripStore } from "../store/tripStore";
import { useAuthStore } from "../store/authStore";


type Nav = NativeStackNavigationProp<RootStackParamList>;

interface ActionTileProps {
  icon: any;
  label: string;
  onPress: () => void;
  color: string;
  bgColor: string;
}

const ActionTile = ({ icon, label, onPress, color, bgColor }: ActionTileProps) => (
  <TouchableOpacity 
    onPress={onPress}
    activeOpacity={0.7}
    className="w-[30%] aspect-square items-center justify-center mb-6"
  >
    <View 
      style={{ backgroundColor: bgColor }} 
      className="w-16 h-16 rounded-3xl items-center justify-center mb-2 shadow-sm"
    >
      <MaterialCommunityIcons name={icon} size={28} color={color} />
    </View>
    <Text className="text-[11px] font-jakarta-bold text-text-primary text-center">
      {label}
    </Text>
  </TouchableOpacity>
);

export default function DashboardHomeScreen() {
  const navigation = useNavigation<Nav>();
  const { user } = useAuthStore();
  
  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "MTG";

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <View>
            <Text className="text-2xl font-jakarta-extrabold text-primary">
              MyTripGuide
            </Text>
          </View>
          <View className="flex-row items-center">
            <TouchableOpacity className="mr-4 relative">
              <Feather name="bell" size={24} color={Colors.text.primary} />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-status-error rounded-full border-2 border-white" />
            </TouchableOpacity>
            <TouchableOpacity className="w-10 h-10 bg-primary rounded-full items-center justify-center">
              <Text className="text-white font-jakarta-bold text-sm">{initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Welcome Text */}
          <View className="px-6 mb-6">
            <Text className="text-text-secondary font-jakarta-medium text-sm">
              Welcome back,
            </Text>
            <Text className="text-2xl font-jakarta-bold text-text-primary">
              {user?.name || "Traveler"} 👋
            </Text>
          </View>

          {/* Hero Trip Card */}
          <View className="px-6 mb-8">
            <TouchableOpacity 
              activeOpacity={0.9}
              className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-black/10"
            >
              <Image
                source={{ uri: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80" }}
                className="w-full h-56"
              />
              <View className="absolute inset-0 bg-black/30 p-6 justify-between">
                <View className="flex-row justify-between items-start">
                  <View className="bg-white/20 px-3 py-1 rounded-full border border-white/30">
                    <Text className="text-white text-[10px] font-jakarta-bold uppercase">Ongoing Trip</Text>
                  </View>
                  <View className="bg-primary px-3 py-1 rounded-full">
                    <Text className="text-white text-[10px] font-jakarta-bold">DAY 4 OF 7</Text>
                  </View>
                </View>

                <View>
                  <Text className="text-white text-2xl font-jakarta-bold mb-1">
                    Himachal Explorer
                  </Text>
                  <Text className="text-white/80 font-jakarta-medium text-sm mb-4">
                    Manali → Rohtang Pass
                  </Text>
                  
                  <View className="h-1.5 bg-white/30 rounded-full overflow-hidden">
                    <View className="h-full bg-white w-3/5" />
                  </View>
                  <View className="flex-row justify-between mt-2">
                    <Text className="text-white/70 text-[10px] font-jakarta-bold">57% COMPLETED</Text>
                    <Text className="text-white/70 text-[10px] font-jakarta-bold">3 DAYS LEFT</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Next Activity Section */}
          <View className="px-6 mb-8">
            <Text className="text-lg font-jakarta-bold text-text-primary mb-4">
              Happening Now
            </Text>
            <View className="bg-white rounded-3xl p-4 flex-row items-center border border-border-light shadow-sm">
              <View className="w-14 h-14 bg-teal-light rounded-2xl items-center justify-center mr-4">
                <MaterialCommunityIcons name="bus-clock" size={32} color={Colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-text-primary font-jakarta-bold text-base">
                  Departure to Manali
                </Text>
                <Text className="text-text-secondary font-jakarta-medium text-xs">
                  09:30 AM • Private Bus Terminal
                </Text>
              </View>
              <TouchableOpacity className="w-10 h-10 bg-background-input rounded-full items-center justify-center">
                <MaterialIcons name="chevron-right" size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions Grid */}
          <View className="px-6">
            <Text className="text-lg font-jakarta-bold text-text-primary mb-4">
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap justify-between">
              <ActionTile 
                icon="calendar-text" 
                label="Itinerary" 
                onPress={() => navigation.navigate("MainTabs", { screen: "Itinerary" })}
                color="#0D9488"
                bgColor="#F0FDFA"
              />
              <ActionTile 
                icon="bus-side" 
                label="My Vehicle" 
                onPress={() => navigation.navigate("MainTabs", { screen: "Attendance" })}
                color="#2563EB"
                bgColor="#EFF6FF"
              />
              <ActionTile 
                icon="account-check" 
                label="Attendance" 
                onPress={() => navigation.navigate("MainTabs", { screen: "Attendance" })}
                color="#7C3AED"
                bgColor="#F5F3FF"
              />
              <ActionTile 
                icon="office-building-marker" 
                label="Hotel" 
                onPress={() => navigation.navigate("HotelInfo" as any)}
                color="#D97706"
                bgColor="#FFFBEB"
              />
              <ActionTile 
                icon="shield-alert" 
                label="Emergency" 
                onPress={() => navigation.navigate("Emergency" as any)}
                color="#DC2626"
                bgColor="#FEF2F2"
              />
              <ActionTile 
                icon="account-group" 
                label="Fellow Group" 
                onPress={() => {}}
                color="#4B5563"
                bgColor="#F3F4F6"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      <EmergencyFAB />
    </View>
  );
}

const styles = {};





