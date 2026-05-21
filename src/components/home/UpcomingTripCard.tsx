import React from 'react';
import { fonts, textStyles } from '../../constants/theme';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { format, parseISO } from 'date-fns';

interface UpcomingTripCardProps {
  trip: {
    id: string;
    name: string;
    start_date: string;
    end_date: string;
    image_url?: string;
    days_left: number;
    status: 'upcoming' | 'completed';
  };
}

export const UpcomingTripCard: React.FC<UpcomingTripCardProps> = ({ trip }) => {
  const navigation = useNavigation<any>();
  const isCompleted = trip.status === 'completed';

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={styles.container}
      onPress={() => navigation.navigate('TripDetail', { tripId: trip.id, tripName: trip.name })}
    >
      <Image 
        source={{ uri: trip.image_url || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80' }}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.content}>
        <Text style={styles.tripName} numberOfLines={2}>{trip.name}</Text>
        <Text style={styles.dates}>
          {format(parseISO(trip.start_date), 'dd MMM')} - {format(parseISO(trip.end_date), 'dd MMM yyyy')}
        </Text>
        
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{trip.status.toUpperCase()}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: 120,
  },
  content: {
    padding: 16,
  },
  tripName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
    fontFamily: fonts.bold,},
  dates: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
    marginBottom: 12,
    fontFamily: fonts.medium,},
  badge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#2B8CEE',
    letterSpacing: 0.5,
    fontFamily: fonts.extraBold,},
});
