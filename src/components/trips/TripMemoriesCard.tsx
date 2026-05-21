import React, { useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, Share,
  StyleSheet, Platform,
} from 'react-native';
import { usePowerSync } from '@powersync/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { differenceInDays, parseISO } from 'date-fns';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { fonts } from '@/constants/theme';

interface Props {
  tripId: string;
  tripName: string;
  startDate: string;
  endDate: string;
  paxId: string;
}

const STATS_CONFIG = [
  { icon: 'map-marker-radius',     label: 'Places Visited',       key: 'places',   color: '#5EEAD4', accent: '#2DD4BF' },
  { icon: 'calendar-range',        label: 'Days on the Road',     key: 'days',     color: '#7DD3FC', accent: '#38BDF8' },
  { icon: 'check-decagram',        label: 'Departures on Time',   key: 'checkins', color: '#6EE7B7', accent: '#34D399' },
  { icon: 'office-building-marker',label: 'Hotels Stayed',        key: 'hotels',   color: '#FCA5A5', accent: '#FB923C' },
  { icon: 'bell-ring',             label: 'Messages Received',    key: 'notifs',   color: '#F9A8D4', accent: '#F472B6' },
] as const;

export function TripMemoriesCard({ tripId, tripName, startDate, endDate, paxId }: Props) {
  const [stats, setStats] = useState<any>(null);
  const [visible, setVisible] = useState(false);
  const db = usePowerSync();

  useEffect(() => {
    (async () => {
      const now = new Date();
      const end = parseISO(endDate);
      if (now < end) return;

      const seen = await AsyncStorage.getItem(`memories_seen_${tripId}`);
      if (seen) return;

      setVisible(true);

      const placesRows  = await db.getAll(`SELECT COUNT(*) as cnt FROM itinerary WHERE trip_id=?`, [tripId]) as any[];
      const checkinsRows= await db.getAll(`SELECT COUNT(*) as cnt FROM attendance WHERE pax_id=?`, [paxId]) as any[];
      const hotelsRows  = await db.getAll(`SELECT COUNT(DISTINCT hotel_id) as cnt FROM hotel_checkins WHERE pax_id=?`, [paxId]) as any[];
      const notifsRows  = await db.getAll(`SELECT COUNT(*) as cnt FROM notifications WHERE trip_id=?`, [tripId]) as any[];

      const days = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;

      setStats({
        places:   placesRows[0]?.cnt   ?? 0,
        days,
        checkins: checkinsRows[0]?.cnt ?? 0,
        hotels:   hotelsRows[0]?.cnt   ?? 0,
        notifs:   notifsRows[0]?.cnt   ?? 0,
      });
    })();
  }, [tripId, endDate]);

  if (!visible || !stats) return null;

  const shareText =
    `✈️ I just completed ${tripName}!\n` +
    `📍 ${stats.places} places · 📅 ${stats.days} days · ✅ ${stats.checkins} departures on time\n` +
    `Tracked with TrackMyTrip`;

  const handleShare = async () => {
    try { await Share.share({ message: shareText }); }
    catch (e) { console.log('Share error:', e); }
  };

  return (
    <View style={styles.wrapper}>
      {/* Main card gradient */}
      <LinearGradient
        colors={['#0D4F49', '#0F766E', '#115E59']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative glowing orbs */}
        <View style={[styles.orb, styles.orbTopRight]} />
        <View style={[styles.orb, styles.orbBottomLeft]} />

        {/* ── TOP SECTION ── */}
        <View style={styles.topSection}>
          {/* Badge + congrats row */}
          <View style={styles.badgeRow}>
            <LinearGradient
              colors={['rgba(255,255,255,0.25)', 'rgba(255,255,255,0.08)']}
              style={styles.medalBadge}
            >
              <MaterialCommunityIcons name="trophy-award" size={30} color="#FCD34D" />
            </LinearGradient>

            <View style={styles.congrats}>
              <Text style={styles.congratsLabel}>TRIP RECAP</Text>
              <View style={styles.sparkRow}>
                <Ionicons name="star" size={10} color="#FCD34D" />
                <Ionicons name="star" size={10} color="#FCD34D" />
                <Ionicons name="star" size={10} color="#FCD34D" />
              </View>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>Journey{'\n'}Completed! 🎉</Text>
          <Text style={styles.tripName}>{tripName.toUpperCase()}</Text>
        </View>

        {/* ── DIVIDER ── */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.25)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.divider}
        />

        {/* ── STATS ── */}
        <View style={styles.statsSection}>
          {STATS_CONFIG.map((s, i) => (
            <View key={i} style={styles.statRow}>
              {/* Left: icon + label */}
              <View style={styles.statLeft}>
                <View style={[styles.statIconWrap, { backgroundColor: `${s.accent}22` }]}>
                  <MaterialCommunityIcons
                    name={s.icon as any}
                    size={18}
                    color={s.color}
                  />
                </View>
                <Text style={styles.statLabel}>{s.label}</Text>
              </View>

              {/* Right: value pill */}
              <View style={[styles.statPill, { borderColor: `${s.accent}55` }]}>
                <Text style={[styles.statValue, { color: s.color }]}>
                  {stats[s.key]}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── DIVIDER ── */}
        <LinearGradient
          colors={['transparent', 'rgba(255,255,255,0.15)', 'transparent']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.divider}
        />

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          {/* Share button */}
          <TouchableOpacity
            onPress={handleShare}
            activeOpacity={0.85}
            style={styles.shareBtn}
          >
            <LinearGradient
              colors={['#FFFFFF', '#F0FDFA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.shareBtnInner}
            >
              <Feather name="share-2" size={17} color="#0F766E" />
              <Text style={styles.shareBtnText}>Share Your Journey</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Dismiss */}
          <TouchableOpacity
            onPress={() => setVisible(false)}
            activeOpacity={0.7}
            style={styles.dismissBtn}
          >
            <Text style={styles.dismissText}>DISMISS RECAP</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 12,
    marginHorizontal: 2,
    borderRadius: 28,
    ...Platform.select({
      web: { boxShadow: '0 20px 60px rgba(15,118,110,0.35)' },
      default: {
        shadowColor: '#0F766E',
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.4,
        shadowRadius: 24,
        elevation: 16,
      },
    }) as any,
  },
  card: {
    borderRadius: 28,
    overflow: 'hidden',
  },

  // ── Decorative orbs ──────────────────────────────
  orb: {
    position: 'absolute',
    borderRadius: 999,
    opacity: 0.15,
  },
  orbTopRight: {
    width: 180,
    height: 180,
    backgroundColor: '#2DD4BF',
    top: -60,
    right: -60,
  },
  orbBottomLeft: {
    width: 140,
    height: 140,
    backgroundColor: '#38BDF8',
    bottom: 60,
    left: -50,
  },

  // ── Top section ──────────────────────────────────
  topSection: {
    paddingTop: 28,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  medalBadge: {
    width: 56,
    height: 56,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  congrats: {
    gap: 4,
  },
  congratsLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: 'rgba(255,255,255,0.55)',
    letterSpacing: 2,
  },
  sparkRow: {
    flexDirection: 'row',
    gap: 3,
  },
  title: {
    fontFamily: fonts.extraBold,
    fontSize: 30,
    color: '#FFFFFF',
    lineHeight: 36,
    marginBottom: 6,
  },
  tripName: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#5EEAD4',
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  // ── Divider ──────────────────────────────────────
  divider: {
    height: 1,
    marginHorizontal: 24,
    marginVertical: 4,
  },

  // ── Stats ─────────────────────────────────────────
  statsSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    gap: 14,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
  },
  statPill: {
    minWidth: 40,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontFamily: fonts.extraBold,
    fontSize: 16,
  },

  // ── Footer ─────────────────────────────────────────
  footer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 28,
    gap: 14,
    alignItems: 'center',
  },
  shareBtn: {
    width: '100%',
    borderRadius: 18,
    ...Platform.select({
      web: { boxShadow: '0 8px 20px rgba(255,255,255,0.15)' },
      default: {
        shadowColor: '#FFFFFF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 6,
      },
    }) as any,
  },
  shareBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  shareBtnText: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
    color: '#0F766E',
    letterSpacing: 0.3,
  },
  dismissBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  dismissText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: 'rgba(255,255,255,0.3)',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
