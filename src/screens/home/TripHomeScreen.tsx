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
import { LinearGradient } from 'expo-linear-gradient';

import { usePowerSync } from '../../core/powersync-mock';
import { useAuthStore } from '../../store/authStore';
import { useTripStore } from '../../store/tripStore';
import { useSyncStore } from '../../store/syncStore';
import { Colors } from '../../theme/colors';
import { EmergencyFAB } from '../../components/common';


export const TripHomeScreen = () => {
  const { user } = useAuthStore();
  const navigation = useNavigation<any>();
  const { setActiveTrip, activeTripId } = useTripStore();
  
  const [loading, setLoading] = useState(true);
  const [ongoingTrip, setOngoingTrip] = useState<any>(null);

  const initials = user?.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "DT";

  useEffect(() => {
    const trip = {
      id: 'kyoto-1',
      name: 'Kyoto Spring Adventure',
      departure_city: 'Osaka',
      destination_city: 'Kyoto',
      current_day: 9,
      total_days: 9,
      progress: 100,
      image_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF3zCS6btqNZMelf0lJdzX-H_fJ9p6fdz5_CS7se8XKtsDOlN7JfSb7tD-o_X9RCgeWMHN48QmoY3DcAzd3u01NIffCACoUdjhjWpxJkjVNMkXRaewwYmdMVEZi1K8gDmp52Z9Au96Li8xUYqHT_7-2Jw9EQqOLjpnBNHOdU3voC2IPBPdu3gNb475ulRAXJ-WHy7Po4Kzptiqz_FgwBdYdfOV_qt4wdtFsW4YzBr59LP0K3-wo7U7NPD48IxJ04iEp0ZetTbg8fM',
    };
    setOngoingTrip(trip);
    
    // Sync ongoing trip to store so tab navigation works
    if (!activeTripId) {
      setActiveTrip(trip.id, trip.name);
    }
    
    setLoading(false);
  }, []);

  if (loading || !ongoingTrip) return null;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 py-4 bg-white">
        <Text className="text-2xl font-jakarta-extrabold text-[#0F6E56]">
          MyTripGuide
        </Text>
        <View className="flex-row items-center gap-4">
          <TouchableOpacity className="w-10 h-10 items-center justify-center">
            <Feather name="bell" size={24} color="#1E293B" />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')} 
            className="w-10 h-10 rounded-full border border-slate-100 overflow-hidden"
          >
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' }} 
              className="w-full h-full"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        className="flex-1"
      >
        {/* Quick Actions Row */}
        <View className="flex-row justify-between px-6 py-6 border-b border-slate-50">
          {[
            { id: 'itinerary', label: 'Itinerary', icon: 'calendar-month', color: '#0F6E56' },
            { id: 'vehicle', label: 'Vehicle', icon: 'bus', color: '#0F6E56' },
            { id: 'notifications', label: 'Notifications', icon: 'bell', color: '#64748b', count: 2 },
            { id: 'emergency', label: 'Emergency', icon: 'alert-decagram', color: '#ef4444' },
          ].map((action) => (
            <TouchableOpacity 
              key={action.id}
              className="items-center"
              onPress={() => {
                if (action.id === 'emergency') navigation.navigate('Emergency');
                else if (action.id === 'itinerary') navigation.navigate('Itinerary', { tripId: ongoingTrip.id, tripName: ongoingTrip.name });
                else if (action.id === 'vehicle') navigation.navigate('VehicleAttendance', { tripId: ongoingTrip.id });
                else if (action.id === 'notifications') navigation.navigate('Notifications');
              }}
            >
              <View className="relative w-14 h-14 bg-white rounded-full items-center justify-center border border-slate-100 shadow-sm mb-2">
                <MaterialCommunityIcons name={action.icon as any} size={26} color={action.color} />
                {action.count > 0 && (
                  <View className="absolute -top-1 -right-1 bg-red-500 min-w-[20px] h-5 rounded-full items-center justify-center border-2 border-white px-1">
                    <Text className="text-white text-[10px] font-jakarta-bold">{action.count}</Text>
                  </View>
                )}
              </View>
              <Text className="text-slate-500 text-[11px] font-jakarta-bold">{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Ongoing Trip Hero Card */}
        <View className="px-6 mt-8">
          <TouchableOpacity 
            activeOpacity={0.9}
            onPress={() => navigation.navigate('TripDetail', { tripId: ongoingTrip.id, tripName: ongoingTrip.name })}
            className="relative w-full h-64 rounded-[32px] overflow-hidden shadow-2xl shadow-black/20"
          >
            <Image
              source={{ uri: ongoingTrip.image_url }}
              className="absolute inset-0 w-full h-full"
            />
            <LinearGradient
              colors={['transparent', 'rgba(15, 110, 86, 0.9)']}
              className="absolute inset-0"
            />
            <View className="absolute inset-0 p-6 flex-col justify-between">
              <View>
                <View className="bg-black/30 self-start px-4 py-1.5 rounded-full backdrop-blur-md mb-4">
                  <Text className="text-white text-[10px] font-jakarta-extrabold tracking-widest">ONGOING</Text>
                </View>
                <Text className="text-white text-3xl font-jakarta-extrabold mb-1">
                  Kyoto Spring Adventure
                </Text>
                <View className="bg-white/20 self-start px-3 py-1 rounded-full backdrop-blur-md mb-6">
                  <Text className="text-white text-[11px] font-jakarta-bold">Day 9 of 9</Text>
                </View>
                <View className="h-0.5 bg-white/40 w-full rounded-full" />
              </View>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Text className="text-white font-jakarta-extrabold text-base">Osaka</Text>
                  <MaterialIcons name="arrow-right-alt" size={24} color="white" style={{ marginHorizontal: 8 }} />
                  <Text className="text-white font-jakarta-extrabold text-base">Kyoto</Text>
                </View>
                <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center backdrop-blur-md">
                  <Feather name="arrow-right" size={18} color="white" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Upcoming Trips Section */}
        <View className="mt-10">
          <View className="flex-row items-center justify-between mb-6 px-6">
            <Text className="text-xl font-jakarta-extrabold text-slate-900">Upcoming Trips</Text>
            <TouchableOpacity>
              <Text className="text-[#0F6E56] font-jakarta-bold text-sm">See All ›</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ 
              paddingHorizontal: 24, 
              paddingBottom: 20,
              flexDirection: 'row'
            }}
            style={{ width: '100%' }}
            decelerationRate="fast"
            snapToInterval={272} // card width (256) + margin (16)
            snapToAlignment="start"
          >
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('TripDetail', { tripId: 'kyoto-2', tripName: 'Kyoto Spring Adventure' })}
              className="w-64 bg-white rounded-3xl overflow-hidden border border-slate-50 shadow-lg shadow-black/5 mr-4"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80' }} 
                className="w-full h-40"
              />
              <View className="p-4">
                <Text className="text-slate-900 font-jakarta-extrabold text-base mb-1">Kyoto Spring Adventure</Text>
                <Text className="text-slate-400 font-jakarta-medium text-[10px] mb-3">12 Oct - 20 Oct 2023</Text>
                <View className="bg-blue-50 self-start px-3 py-1 rounded-md">
                  <Text className="text-blue-600 text-[10px] font-jakarta-extrabold tracking-wider">UPCOMING</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('TripDetail', { tripId: 'goa-1', tripName: 'Goa Beach Party' })}
              className="w-64 bg-white rounded-3xl overflow-hidden border border-slate-50 shadow-lg shadow-black/5 mr-4"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80' }} 
                className="w-full h-40"
              />
              <View className="p-4">
                <Text className="text-slate-900 font-jakarta-extrabold text-base mb-1">Goa Beach Party</Text>
                <Text className="text-slate-400 font-jakarta-medium text-[10px] mb-3">15 Dec - 22 Dec 2023</Text>
                <View className="bg-blue-50 self-start px-3 py-1 rounded-md">
                  <Text className="text-blue-600 text-[10px] font-jakarta-extrabold tracking-wider">UPCOMING</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity 
              activeOpacity={0.9}
              onPress={() => navigation.navigate('TripDetail', { tripId: 'paris-1', tripName: 'Paris Getaway' })}
              className="w-64 bg-white rounded-3xl overflow-hidden border border-slate-50 shadow-lg shadow-black/5 mr-6"
            >
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80' }} 
                className="w-full h-40"
              />
              <View className="p-4">
                <Text className="text-slate-900 font-jakarta-extrabold text-base mb-1">Paris Getaway</Text>
                <Text className="text-slate-400 font-jakarta-medium text-[10px] mb-3">05 Jan - 12 Jan 2024</Text>
                <View className="bg-blue-50 self-start px-3 py-1 rounded-md">
                  <Text className="text-blue-600 text-[10px] font-jakarta-extrabold tracking-wider">UPCOMING</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};







