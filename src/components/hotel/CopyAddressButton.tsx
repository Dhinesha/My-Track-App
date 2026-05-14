import React, { useState } from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';

interface Props { 
  hotelName: string; 
  address: string; 
}

export function CopyAddressButton({ hotelName, address }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(`${hotelName}\n${address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="flex-row items-center gap-2">
      <TouchableOpacity 
        onPress={handleCopy}
        activeOpacity={0.7}
        className={`w-10 h-10 rounded-xl items-center justify-center shadow-sm ${copied ? 'bg-emerald-50' : 'bg-slate-50'}`}
      >
        <Ionicons 
          name={copied ? "checkmark-circle" : "copy-outline"} 
          size={20} 
          color={copied ? "#10B981" : "#64748B"} 
        />
      </TouchableOpacity>
      {copied && (
        <Text className="text-[11px] text-emerald-600 font-jakarta-bold uppercase tracking-wider">Copied!</Text>
      )}
    </View>
  );
}
