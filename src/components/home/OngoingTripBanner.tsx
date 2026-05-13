import React, { useEffect, useRef } from 'react';
import { View, Text, ImageBackground, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface OngoingTripBannerProps {
  trip: {
    id: string;
    name: string;
    image_url?: string;
    current_day: number;
    total_days: number;
    progress: number;
    from: string;
    to: string;
  };
}

export const OngoingTripBanner: React.FC<OngoingTripBannerProps> = ({ trip }) => {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      style={styles.container}
      onPress={() => navigation.navigate('TripDetail', { tripId: trip.id, tripName: trip.name })}
    >
      <ImageBackground
        source={{ uri: trip.image_url || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80' }}
        style={styles.imageBg}
        imageStyle={{ borderRadius: 20 }}
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.1)', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        >
          <View style={styles.topSection}>
            <View style={styles.ongoingBadge}>
              <Text style={styles.ongoingText}>ONGOING</Text>
            </View>
            
            <Text style={styles.tripTitle}>{trip.name}</Text>
            <Text style={styles.dayText}>Day {trip.current_day} of {trip.total_days}</Text>
            
            <View style={styles.progressTrack}>
              <View style={[styles.progressBar, { width: `${trip.progress}%` }]} />
            </View>
          </View>

          <View style={styles.bottomSection}>
            <View style={styles.routeContainer}>
              <Text style={styles.routeText}>{trip.from}</Text>
              <MaterialCommunityIcons name="arrow-right" size={14} color="white" style={{ mx: 4 }} />
              <Text style={styles.routeText}>{trip.to}</Text>
            </View>

            <View style={styles.viewTripButton}>
              <Text style={styles.viewTripText}>View Trip →</Text>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 8,
  },
  imageBg: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    flex: 1,
    padding: 24,
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 1,
  },
  ongoingBadge: {
    backgroundColor: '#FFFFFF20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#FFFFFF40',
    marginBottom: 12,
  },
  ongoingText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  tripTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 4,
  },
  dayText: {
    color: '#FFFFFFCC',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
  },
  progressTrack: {
    height: 2,
    backgroundColor: '#FFFFFF40',
    borderRadius: 1,
    width: '100%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 1,
  },
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewTripButton: {
    backgroundColor: '#FFFFFF20',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFFFFF40',
  },
  viewTripText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
});
