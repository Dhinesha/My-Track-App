import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { FadeInUp, FadeOutUp, Layout } from 'react-native-reanimated';

interface Props {
  isVisible: boolean;
  guidePhone?: string;
  onDismiss: () => void;
  onInformLate: () => void;
}

export function MissedCheckInBanner({ isVisible, guidePhone, onDismiss, onInformLate }: Props) {
  useEffect(() => {
    if (isVisible) {
      // Trigger a heavy warning haptic when the missed check-in banner appears
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  const handleCallGuide = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (guidePhone) {
      Linking.openURL(`tel:${guidePhone}`);
    }
  };

  const handleInformLate = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onInformLate();
  };

  return (
    <Animated.View 
      entering={FadeInUp.springify().damping(15)} 
      exiting={FadeOutUp.duration(200)}
      layout={Layout.springify()}
      style={styles.container}
    >
      <View style={styles.headerRow}>
        <View style={styles.alertIconContainer}>
          <MaterialCommunityIcons name="alert-circle-outline" size={24} color="#DC2626" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Missed Check-In!</Text>
          <Text style={styles.description}>
            The bus departure time has passed and you haven't checked in. The group is waiting.
          </Text>
        </View>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity 
          style={[styles.button, styles.primaryButton]} 
          onPress={handleCallGuide}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="phone" size={16} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Call Guide</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.secondaryButton]} 
          onPress={handleInformLate}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons name="run-fast" size={16} color="#DC2626" />
          <Text style={styles.secondaryButtonText}>I'm on my way</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.closeButton} 
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          onDismiss();
        }}
        hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
      >
        <MaterialCommunityIcons name="close" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEF2F2', // Red 50
    borderWidth: 1,
    borderColor: '#FECACA', // Red 200
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 16,
    paddingRight: 24, // Leave room for close button
  },
  alertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2', // Red 100
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontFamily: 'PlusJakartaSans-Bold',
    color: '#991B1B', // Red 800
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans-Medium',
    color: '#B91C1C', // Red 700
    lineHeight: 18,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 12,
    gap: 6,
  },
  primaryButton: {
    backgroundColor: '#DC2626', // Red 600
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FECACA', // Red 200
  },
  secondaryButtonText: {
    color: '#DC2626', // Red 600
    fontSize: 14,
    fontFamily: 'PlusJakartaSans-Bold',
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
  }
});
