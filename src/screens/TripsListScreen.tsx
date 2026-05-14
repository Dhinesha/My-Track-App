import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons, MaterialIcons, Feather } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Colors } from '../theme/colors';
import { TripProgressBar, TripCountdownWidget } from '../components/trips';


type Nav = NativeStackNavigationProp<RootStackParamList>;

const TRIPS = [
  {
    id: '1', name: 'Himachal Explorer', dates: 'Oct 12 - Oct 20', status: 'ongoing',
    startDate: '2023-10-12', endDate: '2023-10-20',
    group: 'Doon School Batch of 2005', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=600&q=80',
  },
  {
    id: '2', name: 'Kyoto Spring Adventure', dates: 'Dec 15 - Dec 22', status: 'upcoming',
    startDate: '2023-12-15', endDate: '2023-12-22',
    group: 'Family & Friends', image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80',
  },
  {
    id: '3', name: 'Goa Beach Party', dates: 'Mar 10 - Mar 24', status: 'past',
    startDate: '2024-03-10', endDate: '2024-03-24',
    group: 'College Reunion', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80',
  },
];

const FILTERS = ['All', 'Ongoing', 'Upcoming', 'Past'];

export default function TripsListScreen() {
  const navigation = useNavigation<Nav>();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTrips = TRIPS.filter(trip => {
    const matchesFilter = activeFilter === 'All' || trip.status.toLowerCase() === activeFilter.toLowerCase();
    const matchesSearch = trip.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <View className="flex-1 bg-background">
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="px-6 py-4 flex-row items-center justify-between">
          <Text className="text-2xl font-jakarta-extrabold text-text-primary">
            My Trips
          </Text>
          <TouchableOpacity className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-border-light">
            <Feather name="plus" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="px-6 mb-4">
          <View className="flex-row items-center bg-white border border-border-light rounded-2xl px-4 h-12 shadow-sm">
            <Feather name="search" size={20} color={Colors.text.muted} />
            <TextInput
              className="flex-1 ml-3 font-jakarta-medium text-text-primary"
              placeholder="Search your trips..."
              placeholderTextColor={Colors.text.muted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View className="mb-6">
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 24 }}
          >
            {FILTERS.map(filter => (
              <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                className={`
                  mr-3 px-6 py-2.5 rounded-full border
                  ${activeFilter === filter ? "bg-primary border-primary shadow-lg shadow-primary/20" : "bg-white border-border-light"}
                `}
              >
                <Text className={`
                  font-jakarta-bold text-xs
                  ${activeFilter === filter ? "text-white" : "text-text-secondary"}
                `}>
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <ScrollView 
          className="flex-1 px-6" 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {filteredTrips.map(trip => (
            <TouchableOpacity
              key={trip.id}
              activeOpacity={0.9}
              onPress={() => navigation.navigate('Main', { screen: 'Home' })}
              className="bg-white rounded-[32px] mb-6 overflow-hidden shadow-xl shadow-black/5 border border-border-light"
            >
              <View className="h-44 relative">
                <Image source={{ uri: trip.image }} className="w-full h-full" />
                <View className="absolute top-4 left-4">
                  <View className={`
                    px-3 py-1.5 rounded-full border border-white/30 backdrop-blur-md
                    ${trip.status === 'ongoing' ? "bg-status-success/80" : trip.status === 'upcoming' ? "bg-secondary/80" : "bg-text-muted/80"}
                  `}>
                    <Text className="text-white text-[10px] font-jakarta-bold uppercase tracking-wider">
                      {trip.status}
                    </Text>
                  </View>
                </View>
              </View>
              
              <View className="p-5">
                <Text className="text-text-primary font-jakarta-extrabold text-lg mb-1">{trip.name}</Text>
                <Text className="text-text-muted font-jakarta-bold text-[11px] mb-4 uppercase tracking-tighter">
                  {trip.group}
                </Text>
                
                <View className="flex-row items-center justify-between mb-4">
                  <View className="flex-row items-center">
                    <Feather name="calendar" size={14} color={Colors.primary} />
                    <Text className="text-text-secondary font-jakarta-bold text-xs ml-2">{trip.dates}</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Feather name="users" size={14} color={Colors.text.muted} />
                    <Text className="text-text-muted font-jakarta-bold text-xs ml-2">5 members</Text>
                  </View>
                </View>

                {trip.status !== 'past' && (
                  <View>
                    <TripProgressBar 
                      startDate={trip.startDate} 
                      endDate={trip.endDate} 
                      status={trip.status} 
                    />
                    <View className="mt-3 flex-row items-center justify-between">
                      <TripCountdownWidget 
                        startDate={trip.startDate} 
                        endDate={trip.endDate} 
                        status={trip.status as any} 
                      />
                      <Text className="text-primary font-jakarta-extrabold text-xs">VIEW DETAILS ›</Text>
                    </View>
                  </View>
                )}
                {trip.status === 'past' && (
                  <View className="flex-row items-center justify-between border-t border-border-light pt-4">
                    <Text className="text-text-muted font-jakarta-bold text-xs">Completed Oct 20, 2023</Text>
                    <TouchableOpacity className="bg-background-input px-4 py-2 rounded-xl">
                      <Text className="text-text-primary font-jakarta-bold text-xs">Recap</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredTrips.length === 0 && (
            <View className="items-center justify-center py-20">
              <View className="w-20 h-20 bg-background-input rounded-full items-center justify-center mb-4">
                <Feather name="search" size={40} color={Colors.text.muted} />
              </View>
              <Text className="text-text-primary font-jakarta-bold text-lg mb-1">No trips found</Text>
              <Text className="text-text-secondary font-jakarta-medium text-sm">Try a different search or filter</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}






