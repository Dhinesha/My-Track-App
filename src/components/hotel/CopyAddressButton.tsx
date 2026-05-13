// components/hotel/CopyAddressButton.tsx
import { TouchableOpacity, Text, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { useState } from 'react';

interface Props { hotelName: string; address: string; }

export function CopyAddressButton({ hotelName, address }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(`${hotelName}\n${address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View className="flex-row items-center gap-2 my-1">
      <TouchableOpacity onPress={handleCopy}
        className="w-8 h-8 bg-gray-100 rounded-lg items-center justify-center">
        <Text className="text-sm">{copied ? '✓' : '📋'}</Text>
      </TouchableOpacity>
      {copied && (
        <Text className="text-xs text-green-600 font-medium">Address copied!</Text>
      )}
    </View>
  );
}
