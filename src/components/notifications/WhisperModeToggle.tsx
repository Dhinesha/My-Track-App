import { View, Text, TouchableOpacity, ActionSheetIOS, Platform, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';

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
    <TouchableOpacity onPress={showOptions}
      className="flex-row items-center justify-between bg-white border border-gray-100 rounded-xl px-4 py-3 mx-4 my-2">
      <View className="gap-0.5">
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-semibold text-gray-800">🔕 Quiet Mode</Text>
          {active && <View className="bg-purple-100 px-2 py-0.5 rounded-full"><Text className="text-purple-700 text-xs">zzz</Text></View>}
        </View>
        <Text className="text-xs text-gray-400">
          {active ? `Active — ${label}` : 'Silence notifications temporarily'}
        </Text>
      </View>
      <View className={`w-12 h-6 rounded-full ${active ? 'bg-purple-500' : 'bg-gray-200'} justify-center px-0.5`}>
        <View className={`w-5 h-5 bg-white rounded-full shadow-sm ${active ? 'self-end' : 'self-start'}`} />
      </View>
    </TouchableOpacity>
  );
}
