import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';

export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const [name, setName] = React.useState('Robert Jenkins');
  const [email, setEmail] = React.useState('robert.jenkins@example.com');
  const [photo, setPhoto] = React.useState('https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80');
  const [primaryContact, setPrimaryContact] = React.useState('+91 98765 43210');
  const [secondaryContact, setSecondaryContact] = React.useState('+91 98765 43211');

  const handleEdit = (field: string, current: string, setter: (v: string) => void) => {
    if (Platform.OS === 'web') {
      const val = window.prompt(`Edit ${field}`, current);
      if (val) setter(val);
    }
  };

  const MENU_ITEMS = [
    { icon: 'person-outline', label: 'Personal Information', id: 'personal' },
    { icon: 'notifications-none', label: 'Notification Settings', id: 'notifications' },
    { icon: 'admin-panel-settings', label: 'Admin Dashboard', id: 'admin' },
    { icon: 'settings', label: 'General Settings', id: 'settings' },
    { icon: 'help-outline', label: 'Help & Support', id: 'help' },
  ];

  return (
    <View className="flex-1 bg-white">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-2xl font-jakarta-extrabold text-[#1E293B]">Profile</Text>
          <TouchableOpacity onPress={() => handleEdit('Name', name, setName)}>
            <Feather name="edit-3" size={22} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Profile Header */}
          <View className="items-center pt-4 pb-8">
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => handleEdit('Photo URL', photo, setPhoto)}
              className="relative mb-6"
            >
              <View className="w-28 h-28 rounded-full border-2 border-slate-100 p-1">
                <Image 
                  source={{ uri: photo }} 
                  className="w-full h-full rounded-full" 
                />
              </View>
              <View className="absolute bottom-1 right-1 w-7 h-7 bg-[#22C55E] rounded-full items-center justify-center border-2 border-white">
                <MaterialIcons name="check" size={16} color="#fff" />
              </View>
            </TouchableOpacity>
            
            <View className="flex-row items-center mb-1">
              <Text className="text-2xl font-jakarta-extrabold text-[#1E293B] mr-2">{name}</Text>
              <TouchableOpacity onPress={() => handleEdit('Name', name, setName)}>
                <MaterialIcons name="edit" size={18} color="#94a3b8" />
              </TouchableOpacity>
            </View>
            <Text className="text-[#94a3b8] font-jakarta-medium text-sm mb-4">{email}</Text>
            
            <View className="bg-[#EFF6FF] px-4 py-1.5 rounded-full">
              <Text className="text-[#3B82F6] font-jakarta-extrabold text-xs">Primary Traveller</Text>
            </View>
          </View>

          {/* Emergency Contacts Card */}
          <View className="mx-6 bg-[#FFF1F2] rounded-[32px] p-6 border border-red-50 mb-8">
            <View className="flex-row items-center mb-6">
              <MaterialIcons name="emergency" size={20} color="#E11D48" />
              <Text className="text-[#E11D48] font-jakarta-extrabold text-sm ml-2">Emergency Contacts</Text>
            </View>

            <View className="mb-4">
              <Text className="text-[#E11D48] text-[10px] font-jakarta-extrabold uppercase mb-2 ml-1">Primary Contact</Text>
              <View className="bg-white rounded-2xl flex-row items-center px-4 h-14 border border-red-100">
                <Text className="flex-1 text-[#1E293B] font-jakarta-extrabold text-base">+91 98765 43210</Text>
                <MaterialIcons name="edit" size={18} color="#94a3b8" />
              </View>
            </View>

            <View>
              <Text className="text-[#E11D48] text-[10px] font-jakarta-extrabold uppercase mb-2 ml-1">Secondary Contact</Text>
              <View className="bg-white rounded-2xl flex-row items-center px-4 h-14 border border-red-100">
                <Text className="flex-1 text-[#1E293B] font-jakarta-extrabold text-base">+91 98765 43211</Text>
                <MaterialIcons name="edit" size={18} color="#94a3b8" />
              </View>
            </View>
          </View>

          {/* Stats Box */}
          <View className="mx-6 bg-[#F8FAFC] rounded-[32px] p-8 flex-row items-center border border-slate-50 mb-8 shadow-sm">
            <View className="flex-1 items-center border-r border-slate-200">
              <Text className="text-xl font-jakarta-extrabold text-[#1E293B]">12</Text>
              <Text className="text-xs font-jakarta-medium text-[#94a3b8]">Trips</Text>
            </View>
            <View className="flex-1 items-center border-r border-slate-200">
              <Text className="text-xl font-jakarta-extrabold text-[#1E293B]">08</Text>
              <Text className="text-xs font-jakarta-medium text-[#94a3b8]">Countries</Text>
            </View>
            <View className="flex-1 items-center">
              <Text className="text-xl font-jakarta-extrabold text-[#1E293B]">04</Text>
              <Text className="text-xs font-jakarta-medium text-[#94a3b8]">Members</Text>
            </View>
          </View>

          {/* Menu List */}
          <View className="mx-6 bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => item.id === 'admin' ? navigation.navigate('AdminDashboard') : {}}
                className={`flex-row items-center p-5 ${index !== MENU_ITEMS.length - 1 ? 'border-b border-slate-50' : ''}`}
              >
                <MaterialIcons name={item.icon as any} size={24} color="#64748B" style={{ marginRight: 16 }} />
                <Text className="flex-1 text-[#1E293B] font-jakarta-extrabold text-base">{item.label}</Text>
                <Feather name="chevron-right" size={20} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout Button */}
          <TouchableOpacity 
            onPress={() => {
              if (Platform.OS === 'web') {
                if (window.confirm("Logout?")) navigation.replace('Login');
              } else {
                navigation.replace('Login');
              }
            }}
            className="mx-6 mt-10 h-16 rounded-[20px] border-2 border-[#FEE2E2] bg-white flex-row items-center justify-center"
          >
            <MaterialIcons name="logout" size={20} color="#EF4444" style={{ marginRight: 8 }} />
            <Text className="text-[#EF4444] font-jakarta-extrabold text-base">Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}





