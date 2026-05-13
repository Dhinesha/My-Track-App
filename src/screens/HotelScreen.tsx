import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { MaterialIcons, MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { Colors } from "../theme/colors";
import { Button } from "../components/common";


const GUESTS = [
  { id: "1", name: "Dhinesha G", type: "Primary", room: "302", status: "Checked In" },
  { id: "2", name: "Ananya G", type: "Family", room: "302", status: "Checked In" },
  { id: "3", name: "Rahul G", type: "Family", room: "303", status: "Pending" },
];

const FACILITIES = [
  { name: "Free Wi-Fi", icon: "wifi" },
  { name: "Pool", icon: "pool" },
  { name: "Spa", icon: "spa" },
  { name: "Gym", icon: "fitness-center" },
];

export default function HotelScreen() {
  const navigation = useNavigation<any>();

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
            Hotel Details
          </Text>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Hotel Hero */}
          <View className="px-6 mb-8">
            <View className="bg-white rounded-[32px] overflow-hidden border border-border-light shadow-sm">
              <Image 
                source={{ uri: "https://images.unsplash.com/photo-1590490359683-658d3d23f972?w=800&q=80" }}
                className="w-full h-56"
              />
              <View className="p-6">
                <Text className="text-2xl font-jakarta-extrabold text-text-primary mb-2">The Orchid Shimla</Text>
                <View className="flex-row items-center mb-4">
                  <Feather name="map-pin" size={14} color={Colors.primary} />
                  <Text className="text-text-secondary font-jakarta-medium text-xs ml-2">Mall Road, Shimla, HP</Text>
                </View>
                
                <View className="flex-row flex-wrap gap-4">
                  {FACILITIES.map(f => (
                    <View key={f.name} className="flex-row items-center bg-background-input px-3 py-1.5 rounded-full">
                      <MaterialIcons name={f.icon as any} size={14} color={Colors.text.secondary} />
                      <Text className="text-text-secondary font-jakarta-bold text-[10px] ml-1.5 uppercase">{f.name}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* Room Allocation */}
          <View className="px-6 mb-8">
            <Text className="text-lg font-jakarta-bold text-text-primary mb-4">Room Allocation</Text>
            <View className="bg-teal-light rounded-3xl p-6 border border-primary/20 flex-row items-center">
              <View className="w-14 h-14 bg-white rounded-2xl items-center justify-center mr-4">
                <MaterialCommunityIcons name="key-variant" size={28} color={Colors.primary} />
              </View>
              <View className="flex-1">
                <Text className="text-primary font-jakarta-extrabold text-lg">Room 302</Text>
                <Text className="text-primary/70 font-jakarta-bold text-xs uppercase tracking-widest">Deluxe Mountain View</Text>
              </View>
              <TouchableOpacity className="bg-primary px-4 py-2 rounded-xl shadow-sm">
                <Text className="text-white font-jakarta-bold text-xs">Voucher</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Guest List */}
          <View className="px-6">
            <Text className="text-lg font-jakarta-bold text-text-primary mb-4">Guest Checklist</Text>
            {GUESTS.map(g => (
              <View key={g.id} className="bg-white rounded-2xl p-4 mb-3 flex-row items-center border border-border-light">
                <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${g.status === 'Checked In' ? 'bg-status-success/10' : 'bg-background-input'}`}>
                  <Feather name="user" size={20} color={g.status === 'Checked In' ? Colors.status.success : Colors.text.muted} />
                </View>
                <View className="flex-1">
                  <Text className="text-text-primary font-jakarta-bold text-base">{g.name}</Text>
                  <Text className="text-text-muted font-jakarta-medium text-xs">{g.type} • Room {g.room}</Text>
                </View>
                <View className={`px-3 py-1 rounded-full ${g.status === 'Checked In' ? 'bg-status-success/10' : 'bg-status-warning/10'}`}>
                  <Text className={`text-[10px] font-jakarta-bold uppercase ${g.status === 'Checked In' ? 'text-status-success' : 'text-status-warning'}`}>
                    {g.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-white/95 border-t border-border-light px-6 pt-4 pb-10">
          <Button 
            label="Digital Check-in Guide"
            variant="teal"
            size="lg"
            onPress={() => Alert.alert("Guide", "Please show your ID at the reception.")}
            fullWidth
            className="rounded-2xl"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}





