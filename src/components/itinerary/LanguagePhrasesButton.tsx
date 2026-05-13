import { TouchableOpacity, Text, View, TextInput, FlatList } from 'react-native';
import { useRef, useState } from 'react';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
// @ts-ignore
import phrasesData from '../../assets/phrases.json';

interface Phrase { en: string; local: string; phonetic: string; }

interface Props { destinationState: string; }

export function LanguagePhrasesButton({ destinationState }: Props) {
  const sheetRef = useRef<BottomSheet>(null);
  const [search, setSearch] = useState('');

  const phrases: Phrase[] = (phrasesData as any)[destinationState] ?? [];
  const filtered = phrases.filter((p) => p.en.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <TouchableOpacity
        onPress={() => sheetRef.current?.expand()}
        className="absolute bottom-20 right-4 bg-teal-600 flex-row items-center gap-2 px-4 py-3 rounded-full shadow-lg z-50"
      >
        <Text className="text-white text-sm font-semibold">🗣️ Phrases</Text>
      </TouchableOpacity>

      <BottomSheet ref={sheetRef} index={-1} snapPoints={['50%', '85%']} enablePanDownToClose>
        <BottomSheetView className="flex-1 px-4 pt-2">
          <Text className="text-base font-bold text-gray-900 mb-3">Useful Phrases — {destinationState}</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search phrases..."
            className="bg-gray-100 rounded-xl px-4 h-10 text-sm mb-3" />
          <FlatList data={filtered} keyExtractor={(_, i) => i.toString()}
            renderItem={({ item }) => (
              <View className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-2 gap-0.5">
                <Text className="text-sm font-semibold text-gray-900">{item.en}</Text>
                <Text className="text-base text-teal-700">{item.local}</Text>
                <Text className="text-xs text-gray-500 italic">{item.phonetic}</Text>
              </View>
            )}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
