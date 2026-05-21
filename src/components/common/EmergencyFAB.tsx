import { TouchableOpacity, Text, View, StyleSheet, Platform } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { Colors, fonts, textStyles } from '../../constants/theme';

interface Props { onPress: () => void; }

export function EmergencyFAB({ onPress }: Props) {
  const { emergencyContact, emergencyContactName } = useAuthStore();
  const [toast, setToast] = useState('');

  const handleLongPress = async () => {
    if (!emergencyContact) { 
      onPress(); 
      return; 
    }
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    setToast(`Calling ${emergencyContactName ?? emergencyContact}...`);
    setTimeout(() => setToast(''), 2000);
    Linking.openURL(`tel:${emergencyContact}`);
  };

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        onLongPress={handleLongPress}
        delayLongPress={500}
        style={styles.fab}
        activeOpacity={0.85}
      >
        <Ionicons name="warning" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {toast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      ) : null}
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E53935',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(229,57,53,0.3)' },
      default: {
        shadowColor: '#E53935',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 8,
      },
    }) as any,
  },
  toast: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#1E293B',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    zIndex: 50,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: fonts.medium,
  },
});
