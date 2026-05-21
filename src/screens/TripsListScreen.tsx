import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  Image, TextInput, StyleSheet, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../../App';
import { Colors, Typography, Spacing, Shadows, fonts, textStyles } from '../constants/theme';
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
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Trips</Text>
          <TouchableOpacity 
            style={[styles.plusBtn, Shadows.sm]}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={24} color={Colors.primary.main} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={[styles.searchBar, Shadows.sm]}>
            <Ionicons name="search" size={20} color={Colors.neutral.textMuted} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search your trips..."
              placeholderTextColor={Colors.neutral.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Filter Chips */}
        <View style={styles.filtersWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersScrollContent}
          >
            {FILTERS.map(filter => {
              const isActive = activeFilter === filter;
              return (
                <TouchableOpacity
                  key={filter}
                  onPress={() => setActiveFilter(filter)}
                  activeOpacity={0.8}
                  style={[
                    styles.filterChip,
                    isActive ? styles.filterChipActive : styles.filterChipInactive,
                    isActive && Shadows.sm
                  ]}
                >
                  <Text style={[
                    styles.filterText,
                    isActive ? styles.filterTextActive : styles.filterTextInactive
                  ]}>
                    {filter}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false} 
          contentContainerStyle={styles.scrollContent}
        >
          {filteredTrips.map(trip => {
            const isUpcoming = trip.status === 'upcoming';
            const isOngoing = trip.status === 'ongoing';
            const isPast = trip.status === 'past';
            
            let statusBg = Colors.neutral.textMuted + 'CC';
            if (isOngoing) statusBg = Colors.success.checkIcon + 'CC';
            if (isUpcoming) statusBg = Colors.info.main + 'CC';

            return (
              <TouchableOpacity
                key={trip.id}
                disabled={isUpcoming}
                activeOpacity={isUpcoming ? 1 : 0.9}
                onPress={() => navigation.navigate('Main')}
                style={[styles.tripCard, Shadows.sm]}
              >
                <View style={styles.cardImageContainer}>
                  <Image source={{ uri: trip.image }} style={styles.cardImg} />
                  <View style={styles.statusBadgeContainer}>
                    <View style={[styles.statusBadge, { backgroundColor: statusBg }]}>
                      <Text style={styles.statusBadgeText}>
                        {trip.status}
                      </Text>
                    </View>
                  </View>
                </View>
                
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>{trip.name}</Text>
                  <Text style={styles.cardGroup}>{trip.group}</Text>
                  
                  <View style={styles.metaRow}>
                    <View style={styles.metaItem}>
                      <Ionicons name="calendar-outline" size={14} color={Colors.warning.main} />
                      <Text style={styles.metaText}>{trip.dates}</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Ionicons name="people-outline" size={14} color={Colors.neutral.textSecondary} />
                      <Text style={[styles.metaText, { color: Colors.neutral.textSecondary }]}>5 members</Text>
                    </View>
                  </View>

                  {!isPast && (
                    <View style={styles.progressSection}>
                      <TripProgressBar 
                        startDate={trip.startDate} 
                        endDate={trip.endDate} 
                        status={trip.status} 
                      />
                      <View style={styles.countdownRow}>
                        <TripCountdownWidget 
                          startDate={trip.startDate} 
                          endDate={trip.endDate} 
                          status={trip.status as any} 
                        />
                        {!isUpcoming && (
                          <Text style={styles.viewDetailsText}>VIEW DETAILS ›</Text>
                        )}
                      </View>
                    </View>
                  )}
                  {isPast && (
                    <View style={styles.pastSection}>
                      <Text style={styles.pastText}>Completed Oct 20, 2023</Text>
                      <TouchableOpacity 
                        style={styles.recapBtn}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.recapBtnText}>Recap</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
          
          {filteredTrips.length === 0 && (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="search" size={40} color={Colors.neutral.textMuted} />
              </View>
              <Text style={styles.emptyTitle}>No trips found</Text>
              <Text style={styles.emptySub}>Try a different search or filter</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
  },
  safe: {
    flex: 1,
  },
  header: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
  },
  plusBtn: {
    width: 40,
    height: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  searchContainer: {
    paddingHorizontal: Spacing.screenPaddingH,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    borderRadius: 14,
    paddingHorizontal: 12,
    height: 48,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: Typography.fontSizes.body,
    fontFamily: fonts.regular,
    color: Colors.neutral.textPrimary,
  },
  filtersWrapper: {
    marginBottom: 16,
  },
  filtersScrollContent: {
    paddingHorizontal: Spacing.screenPaddingH,
  },
  filterChip: {
    marginRight: 10,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 0.5,
  },
  filterChipActive: {
    backgroundColor: Colors.primary.main,
    borderColor: Colors.primary.main,
  },
  filterChipInactive: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.neutral.border,
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    fontFamily: fonts.semiBold,
  },
  filterTextActive: {
    color: '#FFFFFF',
    fontFamily: fonts.regular,},
  filterTextInactive: {
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,},
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingBottom: 100,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.cardRadius,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  cardImageContainer: {
    height: 140,
    position: 'relative',
  },
  cardImg: {
    width: '100%',
    height: '100%',
  },
  statusBadgeContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    fontFamily: fonts.regular,},
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    fontFamily: fonts.regular,},
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
    fontFamily: fonts.bold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  cardBody: {
    padding: 16,
  },
  cardTitle: {
    fontSize: Typography.fontSizes.cardTitle,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  cardGroup: {
    fontSize: Typography.fontSizes.smallLabel,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.bold,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.semiBold,
  },
  progressSection: {
    marginTop: 4,
  },
  countdownRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontFamily: fonts.regular,},
  viewDetailsText: {
    color: Colors.primary.medium,
    fontWeight: '700',
    fontSize: 12,
    fontFamily: fonts.bold,
  },
  pastSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderColor: Colors.neutral.divider,
    paddingTop: 12,
    marginTop: 4,
  },
  pastText: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.bold,
  },
  recapBtn: {
    backgroundColor: Colors.neutral.pageBackground,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  recapBtnText: {
    color: Colors.neutral.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    backgroundColor: Colors.neutral.divider,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.regular,
  },
});
