import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';

interface Entry { id: string; desc: string; amount: number; day: number; }
type Route = RouteProp<{ params: { tripId: string; totalDays: number } }, 'params'>;

export default function BudgetTrackerScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { tripId, totalDays = 5 } = route.params || {};
  const KEY = `budget_${tripId}`;
  
  const [entries, setEntries] = useState<Entry[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => raw && setEntries(JSON.parse(raw)));
  }, [tripId]);

  const save = (updated: Entry[]) => { 
    setEntries(updated); 
    AsyncStorage.setItem(KEY, JSON.stringify(updated)); 
  };

  const addEntry = () => {
    if (!desc.trim() || !amount) return;
    const newEntry = { 
      id: Date.now().toString(), 
      desc: desc.trim(), 
      amount: Number(amount), 
      day: selectedDay 
    };
    save([...entries, newEntry]);
    setDesc(''); 
    setAmount('');
  };

  const remove = (id: string) => save(entries.filter((e) => e.id !== id));

  const todayEntries = entries.filter((e) => e.day === selectedDay);
  const todayTotal = todayEntries.reduce((s, e) => s + e.amount, 0);
  const tripTotal = entries.reduce((s, e) => s + e.amount, 0);

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-jakarta-extrabold text-[#1E293B]">Budget Tracker</Text>
          <Text className="text-xs font-jakarta-bold text-emerald-600 uppercase tracking-widest">Private Expenses</Text>
        </View>
      </View>

      <View className="bg-emerald-50/50 px-6 py-3 flex-row items-center justify-center gap-2">
        <Ionicons name="lock-closed" size={14} color="#059669" />
        <Text className="text-[11px] font-jakarta-bold text-emerald-700 uppercase tracking-tighter">Stored locally on your device</Text>
      </View>

      {/* Day Selector */}
      <View className="bg-white border-b border-slate-100">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}>
          {Array.from({ length: totalDays }, (_, i) => i + 1).map((d) => (
            <TouchableOpacity 
              key={d} 
              onPress={() => setSelectedDay(d)}
              className={`mr-3 px-6 py-2.5 rounded-full border ${d === selectedDay ? 'bg-[#0EA5E9] border-[#0EA5E9] shadow-lg shadow-blue-500/20' : 'bg-slate-50 border-slate-100'}`}
            >
              <Text className={`text-xs font-jakarta-bold ${d === selectedDay ? 'text-white' : 'text-slate-500'}`}>Day {d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Total Cards */}
      <View className="flex-row px-6 py-6 gap-4">
        <View className="flex-1 bg-slate-900 p-5 rounded-[28px] shadow-xl">
          <Text className="text-slate-400 text-[10px] font-jakarta-bold uppercase mb-1">Today's Spend</Text>
          <Text className="text-white text-2xl font-jakarta-extrabold">₹{todayTotal}</Text>
        </View>
        <View className="flex-1 bg-emerald-500 p-5 rounded-[28px] shadow-xl shadow-emerald-500/20">
          <Text className="text-emerald-100 text-[10px] font-jakarta-bold uppercase mb-1">Total Trip</Text>
          <Text className="text-white text-2xl font-jakarta-extrabold">₹{tripTotal}</Text>
        </View>
      </View>

      {/* Expense List */}
      <FlatList 
        data={todayEntries} 
        keyExtractor={(e) => e.id}
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center py-10 opacity-40">
            <MaterialCommunityIcons name="cash-remove" size={48} color="#94A3B8" />
            <Text className="text-slate-500 font-jakarta-bold mt-2">No expenses for Day {selectedDay}</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="flex-row items-center bg-white border border-slate-100 rounded-[24px] px-5 py-4 mb-3 shadow-sm">
            <View className="w-10 h-10 bg-slate-50 rounded-full items-center justify-center mr-4">
              <MaterialCommunityIcons name="wallet-outline" size={20} color="#64748B" />
            </View>
            <View className="flex-1">
              <Text className="text-[15px] font-jakarta-bold text-slate-700">{item.desc}</Text>
            </View>
            <Text className="text-lg font-jakarta-extrabold text-slate-900 mr-4">₹{item.amount}</Text>
            <TouchableOpacity onPress={() => remove(item.id)} className="p-1">
              <Feather name="trash-2" size={16} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Footer Add Entry */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 pt-5 pb-10">
        <View className="flex-row gap-3">
          <TextInput 
            value={desc} 
            onChangeText={setDesc} 
            placeholder="Expense description..."
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 h-14 font-jakarta-bold text-slate-700"
          />
          <View className="relative w-28">
            <Text className="absolute left-4 top-4.5 z-10 text-slate-400 font-jakarta-bold">₹</Text>
            <TextInput 
              value={amount} 
              onChangeText={setAmount} 
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor="#94A3B8"
              className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-8 pr-4 h-14 font-jakarta-bold text-slate-700"
            />
          </View>
        </View>
        <TouchableOpacity 
          onPress={addEntry}
          activeOpacity={0.8}
          className="bg-[#0EA5E9] h-14 rounded-2xl mt-4 items-center justify-center shadow-lg shadow-blue-500/20"
        >
          <Text className="text-white font-jakarta-extrabold text-lg">Add Expense</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
