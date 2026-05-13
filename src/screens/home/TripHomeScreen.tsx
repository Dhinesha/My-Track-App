import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  RefreshControl, 
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
import { format, differenceInDays, parseISO } from 'date-fns';

import { usePowerSync } from '../../core/powersync-mock';
import { useAuthStore } from '../../store/authStore';
import { useSyncStore } from '../../store/syncStore';
import { Colors } from '../../theme/colors';
import { EmergencyFAB } from '../../components/common';
import { 
  TripProgressBar, 
  TripCountdownWidget, 
  WhatsHappeningNowCard, 
  TodaySummaryCard, 
  SmartCheckInBanner 
} from '../../components/trips';


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

export const TripHomeScreen = () => {
  const { user } = useAuthStore();
  const { lastSyncedAt, isOnline, setLastSynced } = useSyncStore();
  const db = usePowerSync();
  const navigation = useNavigation<any>();
  
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ongoingTrip, setOngoingTrip] = useState<any>(null);

  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      const ongoing = await db.getAll(
        "SELECT * FROM trips WHERE status = 'ongoing' AND id IN (SELECT trip_id FROM pax WHERE user_id = ?) LIMIT 1",
        [user.id]
      );
      
      if (ongoing && ongoing.length > 0) {
        const trip = ongoing[0] as any;
        const start = parseISO(trip.start_date);
        const end = parseISO(trip.end_date);
        const today = new Date();
        const total = differenceInDays(end, start) + 1;
        const current = differenceInDays(today, start) + 1;
        const progress = Math.min(Math.max((current / total) * 100, 0), 100);
        
        setOngoingTrip({
          ...trip,
          current_day: Math.min(Math.max(current, 1), total),
          total_days: total,
          progress: progress,
        });
      } else {
        setOngoingTrip(null);
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, db]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setLastSynced();
  };

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "MTG";

  if (loading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text className="mt-4 text-text-muted font-jakarta-bold">Syncing your journey...</Text>
      </View>
    );
  }

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
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} className="mr-4 relative">
              <Feather name="bell" size={24} color={Colors.text.primary} />
              <View className="absolute top-0 right-0 w-2.5 h-2.5 bg-status-error rounded-full border-2 border-white" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} className="w-10 h-10 bg-primary rounded-full items-center justify-center">
              <Text className="text-white font-jakarta-bold text-sm">{initials}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[Colors.primary]} />
          }
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

          {/* Hero Section */}
          <View className="px-6 mb-8">
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('TripDetail', { tripId: ongoingTrip?.id, tripName: ongoingTrip?.name })}
              className="bg-white rounded-[32px] overflow-hidden shadow-xl shadow-black/10 h-56"
            >
              <Image
                source={{ uri: ongoingTrip?.image_url || "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80" }}
                className="w-full h-full"
              />
              <View className="absolute inset-0 bg-black/40 p-6 justify-between">
                <View className="flex-row justify-between items-start">
                  <View className="bg-white/20 px-3 py-1 rounded-full border border-white/30 backdrop-blur-sm">
                    <Text className="text-white text-[10px] font-jakarta-bold uppercase">
                      {ongoingTrip ? 'Ongoing Trip' : 'Plan a Trip'}
                    </Text>
                  </View>
                  {ongoingTrip && (
                    <View className="bg-primary px-3 py-1 rounded-full">
                      <Text className="text-white text-[10px] font-jakarta-bold uppercase">
                        DAY {ongoingTrip.current_day} OF {ongoingTrip.total_days}
                      </Text>
                    </View>
                  )}
                </View>

                <View>
                  <Text className="text-white text-2xl font-jakarta-bold mb-1">
                    {ongoingTrip?.name || "Start Your Adventure"}
                  </Text>
                  <View className="flex-row items-center mb-4">
                    <MaterialIcons name="location-on" size={14} color="#fff" style={{ opacity: 0.8 }} />
                    <Text className="text-white/80 font-jakarta-medium text-sm ml-1">
                      {ongoingTrip ? `${ongoingTrip.departure_city} → ${ongoingTrip.destination_city}` : "Your group trips await"}
                    </Text>
                  </View>
                  
                  {ongoingTrip && (
                    <View className="bg-white/10 p-3 rounded-2xl backdrop-blur-md">
                      <TripProgressBar 
                        startDate={ongoingTrip.start_date} 
                        endDate={ongoingTrip.end_date} 
                        status="ongoing" 
                      />
                      <View className="mt-2 flex-row justify-between items-center">
                        <TripCountdownWidget 
                          startDate={ongoingTrip.start_date} 
                          endDate={ongoingTrip.end_date} 
                          status="ongoing" 
                        />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          </View>

          {/* Premium Awareness Components */}
          <View className="px-6 mb-8 gap-y-4">
            <SmartCheckInBanner />
            <WhatsHappeningNowCard />
            <TodaySummaryCard />
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
                onPress={() => navigation.navigate("Itinerary", { tripId: ongoingTrip?.id, tripName: ongoingTrip?.name })}
                color="#0D9488"
                bgColor="#F0FDFA"
              />
              <ActionTile 
                icon="bus-side" 
                label="Vehicle" 
                onPress={() => navigation.navigate("VehicleAttendance", { tripId: ongoingTrip?.id })}
                color="#2563EB"
                bgColor="#EFF6FF"
              />
              <ActionTile 
                icon="account-check" 
                label="Attendance" 
                onPress={() => navigation.navigate("VehicleAttendance", { tripId: ongoingTrip?.id })}
                color="#7C3AED"
                bgColor="#F5F3FF"
              />
              <ActionTile 
                icon="office-building-marker" 
                label="Hotel" 
                onPress={() => navigation.navigate("Hotel", { tripId: ongoingTrip?.id })}
                color="#D97706"
                bgColor="#FFFBEB"
              />
              <ActionTile 
                icon="shield-alert" 
                label="Emergency" 
                onPress={() => navigation.navigate("Emergency")}
                color="#DC2626"
                bgColor="#FEF2F2"
              />
              <ActionTile 
                icon="account-group" 
                label="Fellow Group" 
                onPress={() => navigation.navigate("FamilyMembers", { tripId: ongoingTrip?.id })}
                color="#4B5563"
                bgColor="#F3F4F6"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
      
      <EmergencyFAB onPress={() => navigation.navigate('Emergency')} />
    </View>
  );
};






