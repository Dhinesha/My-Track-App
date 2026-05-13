// screens/trips/PackingChecklistScreen.tsx
import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PACKING_DEFAULTS: Record<string, string[]> = {
  pilgrimage: ['ID proof (Aadhaar)', 'Medicines', 'Comfortable footwear', 'Light clothing', 'Mobile charger', 'Cash for offerings', 'Water bottle', 'Small bag'],
  corporate:  ['Laptop + charger', 'Formal wear', 'Notebook + pen', 'Business cards', 'ID proof', 'Travel adapter'],
  school:     ['ID card', 'Lunch box', 'Water bottle', 'Notebook', 'Permission slip', 'Medicines'],
  family:     ['ID proofs (all members)', 'Medicines', 'Children\'s essentials', 'Camera', 'Mobile charger', 'Snacks'],
};

interface Item { id: string; label: string; checked: boolean; }
interface Props { route: { params: { tripId: string; tripName: string; tripType: string } } }

export default function PackingChecklistScreen({ route }: Props) {
  const { tripId, tripName, tripType } = route.params;
  const KEY = `packing_${tripId}`;
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) { setItems(JSON.parse(raw)); return; }
      const defaults = (PACKING_DEFAULTS[tripType] ?? PACKING_DEFAULTS.family).map((label, i) => ({
        id: `default_${i}`, label, checked: false,
      }));
      setItems(defaults);
      AsyncStorage.setItem(KEY, JSON.stringify(defaults));
    });
  }, [tripId]);

  const save = (updated: Item[]) => { setItems(updated); AsyncStorage.setItem(KEY, JSON.stringify(updated)); };
  const toggle = (id: string) => save(items.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  const addItem = () => {
    if (!newItem.trim()) return;
    const updated = [...items, { id: Date.now().toString(), label: newItem.trim(), checked: false }];
    save(updated); setNewItem('');
  };
  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  const checkedCount = items.filter((i) => i.checked).length;

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white px-4 py-4 gap-1 border-b border-gray-100">
        <Text className="text-xl font-bold text-gray-900">Pack for {tripName}</Text>
        <Text className="text-sm text-teal-700 font-medium">{checkedCount} of {items.length} items packed</Text>
        <View className="h-1.5 bg-gray-100 rounded-full mt-1">
          <View className="h-full bg-teal-500 rounded-full" style={{ width: `${items.length ? (checkedCount / items.length) * 100 : 0}%` }} />
        </View>
      </View>
      <FlatList data={items} keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        renderItem={({ item }) => (
          <View className="flex-row items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 shadow-sm">
            <TouchableOpacity onPress={() => toggle(item.id)}
              className={`w-6 h-6 rounded-md border-2 items-center justify-center
                ${item.checked ? 'bg-teal-600 border-teal-600' : 'border-gray-300'}`}>
              {item.checked && <Text className="text-white text-xs font-bold">✓</Text>}
            </TouchableOpacity>
            <Text className={`flex-1 text-sm ${item.checked ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.label}</Text>
            <TouchableOpacity onPress={() => remove(item.id)}>
              <Text className="text-gray-300 text-lg">✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />
      <View className="px-4 pb-6 gap-2">
        <View className="flex-row gap-2">
          <TextInput value={newItem} onChangeText={setNewItem} placeholder="Add item..."
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 h-12 text-sm"
            onSubmitEditing={addItem} returnKeyType="done" />
          <TouchableOpacity onPress={addItem} className="bg-teal-600 h-12 px-4 rounded-xl items-center justify-center">
            <Text className="text-white font-semibold">Add</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => save(items.map((i) => ({ ...i, checked: false })))}>
          <Text className="text-center text-xs text-gray-400 underline">Reset all checks</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
