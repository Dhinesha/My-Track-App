import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Linking,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { DepartureCountdownTimer } from "../components/attendance";
import { Button } from "../components/common";


const PASSENGERS = [
  {
    id: "1",
    name: "Sarah Jenkins",
    seat: "1A",
    status: "Checked In",
    statusCode: "SUCCESS",
    selected: true,
    relation: "Self",
    checkInTime: "09:45 AM",
    phone: "+91 9876543210",
  },
  {
    id: "2",
    name: "Michael Chen",
    seat: "1B",
    status: "Not Boarded",
    statusCode: "MUTED",
    selected: true,
    relation: "Spouse",
    phone: "+91 9876543211",
  },
  {
    id: "3",
    name: "Emily Davis",
    seat: "2A",
    status: "Pending",
    statusCode: "WARNING",
    selected: true,
    relation: "Child",
    phone: "+91 9876543212",
  },
];

export default function VehicleAttendanceScreen() {
  const navigation = useNavigation();
  const [passengers, setPassengers] = useState(PASSENGERS);

  const toggleSelect = (id: string) => {
    setPassengers((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, selected: !p.selected } : p,
      ),
    );
  };

  const handleCheckInSelected = () => {
    const selectedCount = passengers.filter(p => p.selected).length;
    if (selectedCount === 0) {
      Alert.alert("Error", "Please select at least one traveler.");
      return;
    }
    Alert.alert("Success", "Attendance confirmed for " + selectedCount + " travelers.");
  };

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
            Vehicle & Attendance
          </Text>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Vehicle Info Card */}
          <View className="px-6 mb-8">
            <View className="bg-white rounded-[32px] p-6 border border-border-light shadow-sm">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-row items-center">
                  <View className="w-12 h-12 bg-teal-light rounded-2xl items-center justify-center mr-4">
                    <MaterialCommunityIcons name="bus" size={28} color={Colors.primary} />
                  </View>
                  <View>
                    <Text className="text-lg font-jakarta-extrabold text-text-primary">Toyota Alphard</Text>
                    <Text className="text-text-muted font-jakarta-bold text-xs uppercase tracking-widest">HP 34A 1234 • AC Bus</Text>
                  </View>
                </View>
                <View className="bg-status-success/10 px-3 py-1 rounded-full border border-status-success/20">
                  <Text className="text-status-success text-[10px] font-jakarta-bold uppercase">Assigned</Text>
                </View>
              </View>

              <View className="flex-row items-center bg-background-input p-3 rounded-2xl mb-4">
                <Feather name="map-pin" size={14} color={Colors.primary} />
                <Text className="text-text-secondary font-jakarta-medium text-xs ml-2">
                  Location: <Text className="font-jakarta-bold text-text-primary">Manali Main Terminal</Text>
                </Text>
              </View>

              <DepartureCountdownTimer departureISO={new Date(Date.now() + 15 * 60000).toISOString()} />
            </View>
          </View>

          {/* Traveler List */}
          <View className="px-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-jakarta-bold text-text-primary">My Group (3)</Text>
              <TouchableOpacity>
                <Text className="text-primary font-jakarta-bold text-xs uppercase">Select All</Text>
              </TouchableOpacity>
            </View>

            {passengers.map((p) => (
              <TouchableOpacity
                key={p.id}
                activeOpacity={0.8}
                onPress={() => toggleSelect(p.id)}
                className={`
                  flex-row items-center bg-white rounded-3xl p-4 mb-4 border
                  ${p.selected ? "border-primary/30 shadow-md shadow-primary/5" : "border-border-light"}
                `}
              >
                <View className={`
                  w-6 h-6 rounded-lg border-2 items-center justify-center mr-4
                  ${p.selected ? "bg-primary border-primary" : "border-border-light"}
                `}>
                  {p.selected && <MaterialIcons name="check" size={16} color="#fff" />}
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-base font-jakarta-extrabold text-text-primary mr-2">{p.name}</Text>
                    <View className="bg-background-input px-2 py-0.5 rounded-md">
                      <Text className="text-text-muted text-[10px] font-jakarta-bold uppercase">{p.relation}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center">
                    <Text className="text-text-muted font-jakarta-bold text-xs mr-3">Seat {p.seat}</Text>
                    <View className={`w-1.5 h-1.5 rounded-full mr-2 ${p.statusCode === 'SUCCESS' ? 'bg-status-success' : 'bg-status-warning'}`} />
                    <Text className={`text-[11px] font-jakarta-bold ${p.statusCode === 'SUCCESS' ? 'text-status-success' : 'text-status-warning'}`}>
                      {p.status}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity className="w-10 h-10 bg-teal-light rounded-full items-center justify-center">
                  <Feather name="phone" size={18} color={Colors.primary} />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer Action */}
        <View className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-border-light px-6 pt-4 pb-10">
          <Button 
            label={`Confirm Attendance (${passengers.filter(p => p.selected).length})`}
            variant="teal"
            size="lg"
            onPress={handleCheckInSelected}
            fullWidth
            className="rounded-2xl shadow-xl shadow-primary/20"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}





