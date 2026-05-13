import { TouchableOpacity, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Linking from 'expo-linking';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';

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
        className="absolute bottom-6 right-6 w-16 h-16 bg-red-600 rounded-full
          items-center justify-center shadow-lg z-50"
      >
        <Text className="text-white text-2xl">🚨</Text>
      </TouchableOpacity>

      {toast ? (
        <View className="absolute bottom-24 right-4 bg-gray-900 px-4 py-2 rounded-xl z-50">
          <Text className="text-white text-xs">{toast}</Text>
        </View>
      ) : null}
    </>
  );
}
