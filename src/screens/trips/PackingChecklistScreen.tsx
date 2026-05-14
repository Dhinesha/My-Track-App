import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, TextInput, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { PACKING_DEFAULTS } from '../../constants/packingDefaults';

interface Item { id: string; label: string; checked: boolean; }
type Route = RouteProp<{ params: { tripId: string; tripName: string; tripType: string } }, 'params'>;

export default function PackingChecklistScreen() {
  const navigation = useNavigation();
  const route = useRoute<Route>();
  const { tripId, tripName, tripType } = route.params;
  const KEY = `packing_${tripId}`;
  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) { 
        setItems(JSON.parse(raw)); 
        return; 
      }
      const defaults = (PACKING_DEFAULTS[tripType] ?? PACKING_DEFAULTS.family).map((label, i) => ({
        id: `default_${i}`, label, checked: false,
      }));
      setItems(defaults);
      AsyncStorage.setItem(KEY, JSON.stringify(defaults));
    });
  }, [tripId]);

  const save = (updated: Item[]) => { 
    setItems(updated); 
    AsyncStorage.setItem(KEY, JSON.stringify(updated)); 
  };

  const toggle = (id: string) => save(items.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  
  const addItem = () => {
    if (!newItem.trim()) return;
    const updated = [...items, { id: Date.now().toString(), label: newItem.trim(), checked: false }];
    save(updated); 
    setNewItem('');
  };

  const remove = (id: string) => save(items.filter((i) => i.id !== id));

  const checkedCount = items.filter((i) => i.checked).length;
  const progress = items.length ? (checkedCount / items.length) : 0;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
          <Feather name="arrow-left" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-xl font-jakarta-extrabold text-[#1E293B]">Pack for {tripName}</Text>
          <Text className="text-xs font-jakarta-bold text-emerald-600 uppercase tracking-widest">{tripType} essentials</Text>
        </View>
      </View>

      {/* Progress Section */}
      <View className="px-6 py-6 bg-slate-50/50">
        <View className="flex-row justify-between items-end mb-3">
          <View>
            <Text className="text-3xl font-jakarta-extrabold text-slate-900">{checkedCount}<Text className="text-slate-400 text-lg">/{items.length}</Text></Text>
            <Text className="text-slate-500 font-jakarta-bold text-xs uppercase tracking-tighter">Items Packed</Text>
          </View>
          <Text className="text-emerald-600 font-jakarta-extrabold text-lg">{Math.round(progress * 100)}%</Text>
        </View>
        <View className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <View 
            className="h-full bg-emerald-500 rounded-full" 
            style={{ width: `${progress * 100}%` }} 
          />
        </View>
      </View>

      <FlatList 
        data={items} 
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 24, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View className={`flex-row items-center gap-4 bg-white border rounded-[24px] px-5 py-4 mb-3 shadow-sm ${item.checked ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-100'}`}>
            <TouchableOpacity 
              onPress={() => toggle(item.id)}
              className={`w-7 h-7 rounded-xl items-center justify-center border-2 
                ${item.checked ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200'}`}
            >
              {item.checked && <Ionicons name="checkmark" size={18} color="white" />}
            </TouchableOpacity>
            <Text className={`flex-1 text-[15px] font-jakarta-bold ${item.checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
              {item.label}
            </Text>
            <TouchableOpacity onPress={() => remove(item.id)} className="p-1">
              <Feather name="x" size={18} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <MaterialCommunityIcons name="bag-checked" size={64} color="#E2E8F0" />
            <Text className="text-slate-400 font-jakarta-bold mt-4">Your list is empty</Text>
          </View>
        }
      />

      {/* Footer Input */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 pt-4 pb-10">
        <View className="flex-row gap-3">
          <TextInput 
            value={newItem} 
            onChangeText={setNewItem} 
            placeholder="Add new item..."
            placeholderTextColor="#94A3B8"
            className="flex-1 bg-slate-50 border border-slate-100 rounded-2xl px-5 h-14 font-jakarta-bold text-slate-700"
            onSubmitEditing={addItem} 
            returnKeyType="done" 
          />
          <TouchableOpacity 
            onPress={addItem} 
            className="bg-[#0EA5E9] w-14 h-14 rounded-2xl items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Feather name="plus" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
          onPress={() => save(items.map((i) => ({ ...i, checked: false })))}
          className="mt-4 self-center"
        >
          <Text className="text-slate-400 font-jakarta-bold text-xs uppercase tracking-widest border-b border-slate-200 pb-0.5">Reset all checks</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
