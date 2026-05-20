import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActionSheetIOS, Platform, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows } from '../../constants/theme';

const QUIET_KEY = 'quiet_mode';

export async function isQuietModeActive(): Promise<boolean> {
  try {
    const raw = await AsyncStorage.getItem(QUIET_KEY);
    if (!raw) return false;
    const { quietMode, expiresAt } = JSON.parse(raw);
    if (!quietMode) return false;
    if (expiresAt && new Date(expiresAt) < new Date()) {
      await AsyncStorage.removeItem(QUIET_KEY);
      return false;
    }
    return true;
  } catch { return false; }
}

export function WhisperModeToggle() {
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState('');

  const checkStatus = async () => {
    const isActive = await isQuietModeActive();
    setActive(isActive);
    if (isActive) {
      const raw = await AsyncStorage.getItem(QUIET_KEY);
      if (raw) {
        const { expiresAt } = JSON.parse(raw);
        setLabel(expiresAt ? `Until ${new Date(expiresAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Until turned off');
      }
    }
  };

  useEffect(() => { checkStatus(); }, []);

  const showOptions = () => {
    const options = ['30 minutes', '1 hour', 'Until I turn it off', active ? 'Turn off Quiet Mode' : 'Cancel'];
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions({ 
        options, 
        cancelButtonIndex: 3,
        destructiveButtonIndex: active ? 3 : undefined
      }, async (idx) => {
        if (idx === 3) { 
          if (active) {
            await AsyncStorage.removeItem(QUIET_KEY); 
            setActive(false); 
          }
          return; 
        }
        if (idx === 0) await setQuiet(30);
        if (idx === 1) await setQuiet(60);
        if (idx === 2) await setQuiet(null);
        checkStatus();
      });
    } else {
      Alert.alert('Quiet Mode', 'How long?', [
        { text: '30 min', onPress: () => setQuiet(30).then(checkStatus) },
        { text: '1 hour', onPress: () => setQuiet(60).then(checkStatus) },
        { text: 'Until off', onPress: () => setQuiet(null).then(checkStatus) },
        { text: active ? 'Turn off' : 'Cancel', onPress: async () => { if (active) { await AsyncStorage.removeItem(QUIET_KEY); setActive(false); } } },
      ]);
    }
  };

  const setQuiet = async (mins: number | null) => {
    const expiresAt = mins ? new Date(Date.now() + mins * 60000).toISOString() : null;
    await AsyncStorage.setItem(QUIET_KEY, JSON.stringify({ quietMode: true, expiresAt }));
  };

  return (
    <TouchableOpacity 
      onPress={showOptions}
      activeOpacity={0.8}
      style={[styles.container, Shadows.sm]}
    >
      <View style={styles.left}>
        <View style={styles.titleRow}>
          <Ionicons name="volume-mute-outline" size={18} color={active ? Colors.info.main : Colors.neutral.textSecondary} />
          <Text style={styles.title}>Quiet Mode</Text>
          {active && (
            <View style={styles.activeBadge}>
              <Text style={styles.activeBadgeText}>zzz</Text>
            </View>
          )}
        </View>
        <Text style={styles.subtitle}>
          {active ? `Active — ${label}` : 'Silence notifications temporarily'}
        </Text>
      </View>
      <View style={[
        styles.switchTrack,
        active ? styles.switchTrackActive : styles.switchTrackInactive
      ]}>
        <View style={[
          styles.switchThumb,
          active ? styles.switchThumbActive : styles.switchThumbInactive
        ]} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    borderRadius: Spacing.cardRadius,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: Spacing.screenPaddingH,
    marginTop: 14,
    marginBottom: 6,
  },
  left: {
    gap: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.semibold,
  },
  activeBadge: {
    backgroundColor: Colors.info.lightBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  activeBadgeText: {
    color: Colors.info.text,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  switchTrackActive: {
    backgroundColor: Colors.info.main,
  },
  switchTrackInactive: {
    backgroundColor: Colors.neutral.divider,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: { boxShadow: '0 2px 4px rgba(0,0,0,0.1)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
      },
    }) as any,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  switchThumbInactive: {
    alignSelf: 'flex-start',
  },
});
