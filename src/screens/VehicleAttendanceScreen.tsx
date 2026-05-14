import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Platform,
  Linking,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const PASSENGERS = [
  {
    id: "1",
    name: "Sarah Jenkins",
    seat: "1A",
    status: "Checked In",
    time: "09:45 AM",
    role: "PRIMARY",
    selected: true,
    phone: "+91 9876543210",
  },
  {
    id: "2",
    name: "Michael Chen",
    seat: "1B",
    status: "Not Boarded",
    role: "SPOUSE",
    selected: true,
    phone: "+91 9876543211",
  },
  {
    id: "3",
    name: "Emily Davis",
    seat: "2A",
    status: "Checked In",
    role: "CHILD",
    selected: true,
    phone: "+91 9876543212",
  },
  {
    id: "4",
    name: "David Wilson",
    seat: "2B",
    status: "Checked In",
    time: "10:15 AM",
    role: "CHILD",
    selected: true,
    phone: "+91 9876543213",
  },
];

export default function VehicleAttendanceScreen() {
  const navigation = useNavigation();
  const [passengers, setPassengers] = useState(PASSENGERS);
  const [timer, setTimer] = useState("14:43");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const toggleSelect = (id: string) => {
    setPassengers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p
      )
    );
  };

  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="flex-row items-center px-6 py-4 bg-white border-b border-slate-100">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 items-center justify-center">
            <Feather name="arrow-left" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text className="flex-1 text-center text-xl font-jakarta-extrabold text-[#1E293B] mr-10">
            Vehicle and Attendance
          </Text>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Vehicle Details Section */}
          <View className="px-6 pt-6">
            <Text className="text-xl font-jakarta-extrabold text-[#1E293B] mb-4">Vehicle Details</Text>
            
            {/* Countdown Card */}
            <View className="bg-[#FFF1F2] rounded-[32px] p-8 border-2 border-[#FECACA] mb-6 relative overflow-hidden">
              <View className="items-center">
                <View className="flex-row items-center mb-2">
                  <MaterialIcons name="error-outline" size={16} color="#E11D48" />
                  <Text className="text-[#E11D48] text-xs font-jakarta-extrabold ml-1 tracking-widest uppercase">Board Now!</Text>
                </View>
                <Text className="text-[64px] font-jakarta-extrabold text-[#E11D48] leading-none mb-4">{timer}</Text>
                
                {/* Progress Bar */}
                <View className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <View className="h-full bg-[#E11D48] w-1/4 rounded-full" />
                </View>
              </View>
            </View>

            {/* Vehicle Info Card */}
            <View className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-50 mb-8">
              <View className="flex-row items-center justify-between mb-6">
                <View className="flex-row items-center">
                  <View className="w-14 h-14 bg-blue-50 rounded-2xl items-center justify-center mr-4">
                    <Ionicons name="bus" size={28} color="#0EA5E9" />
                  </View>
                  <View>
                    <Text className="text-xl font-jakarta-extrabold text-[#1E293B]">Toyota Alphard</Text>
                    <Text className="text-slate-400 font-jakarta-bold text-xs">KA-1923 • AC Mini Bus</Text>
                  </View>
                </View>
                <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                  <Text className="text-emerald-600 text-[10px] font-jakarta-bold">Live</Text>
                </View>
              </View>

              <View className="bg-slate-50 px-4 py-3 rounded-2xl flex-row items-center mb-6">
                <MaterialIcons name="location-on" size={18} color="#0EA5E9" />
                <Text className="text-slate-600 font-jakarta-medium text-sm ml-2">
                  Current: <Text className="text-[#0EA5E9] font-jakarta-extrabold">Kyoto Hotel Main Gate</Text>
                </Text>
              </View>

              <View className="flex-row items-center justify-between px-2">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3">
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#64748B" />
                  </View>
                  <View>
                    <Text className="text-slate-400 text-[9px] font-jakarta-extrabold uppercase">Stop Time</Text>
                    <Text className="text-[#1E293B] font-jakarta-extrabold text-sm">10:30 AM</Text>
                  </View>
                </View>
                <View className="h-8 w-[1px] bg-slate-100" />
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-full bg-slate-50 items-center justify-center mr-3">
                    <MaterialCommunityIcons name="bus-clock" size={20} color="#64748B" />
                  </View>
                  <View>
                    <Text className="text-slate-400 text-[9px] font-jakarta-extrabold uppercase">Departure</Text>
                    <Text className="text-[#1E293B] font-jakarta-extrabold text-sm">10:45 AM</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Live Tracking Section */}
          <View className="px-6 mb-8">
            <Text className="text-xl font-jakarta-extrabold text-[#1E293B] mb-4">Live Tracking</Text>
            <View className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-slate-50">
              <View className="h-48 w-full bg-blue-100 relative items-center justify-center">
                {/* Mock Map Image */}
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80' }} 
                  className="w-full h-full opacity-40"
                />
                <View className="absolute w-4 h-4 bg-[#0EA5E9] rounded-full border-2 border-white shadow-lg" />
                <View className="absolute top-20 right-32 w-10 h-10 bg-[#0EA5E9] rounded-2xl items-center justify-center shadow-xl border-2 border-white">
                  <Ionicons name="bus" size={20} color="white" />
                </View>
              </View>
              <View className="p-5 flex-row items-center justify-between">
                <View>
                  <Text className="text-slate-400 text-[9px] font-jakarta-extrabold uppercase mb-1">Exact Coordinates</Text>
                  <Text className="text-[#1E293B] font-jakarta-extrabold text-sm">35.0116° N, 135.7681° E</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => Linking.openURL('https://www.google.com/maps/search/?api=1&query=35.0116,135.7681')}
                  className="bg-[#0EA5E9] px-6 h-12 rounded-xl flex-row items-center shadow-lg shadow-blue-500/20"
                >
                  <Ionicons name="navigate" size={18} color="white" />
                  <Text className="text-white font-jakarta-extrabold text-sm ml-2">Navigate</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Family List Section */}
          <View className="px-6">
            <Text className="text-xl font-jakarta-extrabold text-[#1E293B] mb-4">Family List</Text>
            {passengers.map((p) => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.8}
                onPress={() => toggleSelect(p.id)}
                className="bg-white rounded-[24px] p-5 mb-4 flex-row items-center shadow-sm border border-slate-50"
              >
                <View className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-4 ${p.selected ? 'bg-[#0EA5E9] border-[#0EA5E9]' : 'border-slate-200 bg-white'}`}>
                  {p.selected && <MaterialIcons name="check" size={16} color="white" />}
                </View>
                
                <View className="w-12 h-12 bg-slate-100 rounded-full items-center justify-center mr-4">
                  <MaterialIcons name="person" size={24} color="#94A3B8" />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-base font-jakarta-extrabold text-[#1E293B] mr-2">{p.name}</Text>
                    <View className="bg-slate-100 px-2 py-0.5 rounded-md">
                      <Text className="text-slate-500 text-[9px] font-jakarta-extrabold uppercase">{p.role}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-slate-400 font-jakarta-bold text-[11px] mr-3">Seat {p.seat}</Text>
                    <View className={`w-1.5 h-1.5 rounded-full mr-1.5 ${p.status === 'Checked In' ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                    <Text className={`text-[11px] font-jakarta-bold ${p.status === 'Checked In' ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {p.status}{p.time ? ` • ${p.time}` : ''}
                    </Text>
                  </View>
                </View>

                {p.status === "Not Boarded" && (
                  <TouchableOpacity 
                    onPress={() => handleCall(p.phone)}
                    className="w-10 h-10 bg-red-50 rounded-full items-center justify-center border border-red-100"
                  >
                    <Feather name="phone-call" size={18} color="#EF4444" />
                  </TouchableOpacity>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Floating Confirm Button */}
        <View className="absolute bottom-6 left-6 right-6">
          <TouchableOpacity 
            onPress={() => setIsModalVisible(true)}
            className="bg-[#0EA5E9] h-16 rounded-2xl flex-row items-center justify-center shadow-xl shadow-blue-500/30"
            activeOpacity={0.9}
          >
            <Ionicons name="checkmark-circle" size={22} color="white" />
            <Text className="text-white font-jakarta-extrabold text-base ml-2">Confirm Attendance ({passengers.filter(p => p.selected).length})</Text>
          </TouchableOpacity>
        </View>

        {/* Custom Confirmation Popup - Using View instead of Modal to keep it inside the phone shell on web */}
        {isModalVisible && (
          <View className="absolute inset-0 z-50 bg-black/60 items-center justify-center px-6">
            <View className="bg-white w-full rounded-[40px] p-8 items-center shadow-2xl">
              <View className="w-24 h-24 bg-emerald-100 rounded-full items-center justify-center mb-6">
                <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              </View>
              
              <Text className="text-2xl font-jakarta-extrabold text-slate-900 mb-2">Attendance Confirmed!</Text>
              <Text className="text-slate-500 text-center font-jakarta-medium text-base mb-8">
                Your family members ({passengers.filter(p => p.selected).length}) have been successfully marked as boarded.
              </Text>

              <TouchableOpacity 
                onPress={() => {
                  setIsModalVisible(false);
                  navigation.goBack();
                }}
                className="bg-[#0EA5E9] w-full h-16 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20"
              >
                <Text className="text-white font-jakarta-extrabold text-lg">Great</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>
    </View>
  );
}



