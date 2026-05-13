// screens/trips/BudgetTrackerScreen.tsx
import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Entry { id: string; desc: string; amount: number; day: number; }
interface Props { route: { params: { tripId: string; totalDays: number } } }

export default function BudgetTrackerScreen({ route }: Props) {
  const { tripId, totalDays } = route.params;
  const KEY = `budget_${tripId}`;
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => raw && setEntries(JSON.parse(raw)));
  }, [tripId]);

  const save = (updated: Entry[]) => { setEntries(updated); AsyncStorage.setItem(KEY, JSON.stringify(updated)); };
  const addEntry = () => {
    if (!desc.trim() || !amount) return;
    save([...entries, { id: Date.now().toString(), desc: desc.trim(), amount: Number(amount), day: selectedDay }]);
    setDesc(''); setAmount('');
  };
  const remove = (id: string) => save(entries.filter((e) => e.id !== id));

  const todayEntries = entries.filter((e) => e.day === selectedDay);
  const todayTotal = todayEntries.reduce((s, e) => s + e.amount, 0);
  const tripTotal = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-teal-50 border-b border-teal-100 px-4 py-2">
        <Text className="text-xs text-teal-700 text-center">💡 Stored only on your phone — private to you</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-grow-0 bg-white border-b border-gray-100 px-4 py-2">
        {Array.from({ length: totalDays || 1 }, (_, i) => i + 1).map((d) => (
          <TouchableOpacity key={d} onPress={() => setSelectedDay(d)}
            className={`mr-2 px-4 py-1.5 rounded-full ${d === selectedDay ? 'bg-teal-600' : 'bg-gray-100'}`}>
            <Text className={`text-xs font-medium ${d === selectedDay ? 'text-white' : 'text-gray-600'}`}>Day {d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList data={todayEntries} keyExtractor={(e) => e.id}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        ListEmptyComponent={<Text className="text-center text-gray-400 text-sm py-8">No expenses for Day {selectedDay} yet</Text>}
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-white border border-gray-100 rounded-xl px-4 py-3 gap-3 shadow-sm">
            <Text className="flex-1 text-sm text-gray-800">{item.desc}</Text>
            <Text className="text-sm font-semibold text-gray-900">₹{item.amount}</Text>
            <TouchableOpacity onPress={() => remove(item.id)}>
              <Text className="text-gray-300 text-lg">✕</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      <View className="px-4 pb-6 gap-2">
        <View className="flex-row gap-2 mb-3">
          <TextInput value={desc} onChangeText={setDesc} placeholder="What did you spend on?"
            className="flex-1 bg-white border border-gray-200 rounded-xl px-3 h-11 text-sm" />
          <TextInput value={amount} onChangeText={setAmount} placeholder="₹0"
            keyboardType="numeric"
            className="w-20 bg-white border border-gray-200 rounded-xl px-3 h-11 text-sm" />
          <TouchableOpacity onPress={addEntry} className="bg-teal-600 h-11 px-3 rounded-xl items-center justify-center">
            <Text className="text-white font-semibold text-sm">Add</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row bg-white border border-gray-100 rounded-xl px-4 py-3 justify-between shadow-sm">
          <Text className="text-sm text-gray-600">Today: <Text className="font-bold text-gray-900">₹{todayTotal}</Text></Text>
          <Text className="text-sm text-gray-600">Trip total: <Text className="font-bold text-teal-700">₹{tripTotal}</Text></Text>
        </View>
      </View>
    </View>
  );
}
