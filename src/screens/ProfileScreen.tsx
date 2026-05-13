import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Button } from '../components/common';


export default function ProfileScreen() {
  const navigation = useNavigation<any>();

  const MENU_ITEMS = [
    { icon: 'users', label: 'My Family / Group', color: '#6366F1' },
    { icon: 'file-text', label: 'Documents & IDs', color: '#F59E0B' },
    { icon: 'heart', label: 'Medical Info', color: '#EF4444' },
    { icon: 'clock', label: 'Past Trips', color: '#10B981' },
    { icon: 'settings', label: 'App Settings', color: '#64748B' },
  ];

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <Text className="text-xl font-jakarta-extrabold text-text-primary">Profile</Text>
          <TouchableOpacity className="w-10 h-10 bg-background-input rounded-full items-center justify-center">
            <Feather name="edit-3" size={18} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Profile Header */}
          <View className="items-center py-8">
            <View className="relative mb-4">
              <Image 
                source={{ uri: 'https://i.pravatar.cc/150?u=dhinesha' }} 
                className="w-28 h-28 rounded-[40px] border-4 border-teal-light" 
              />
              <View className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white">
                <Feather name="camera" size={14} color="#fff" />
              </View>
            </View>
            <Text className="text-2xl font-jakarta-extrabold text-text-primary">Dhinesha Gnanavel</Text>
            <Text className="text-text-muted font-jakarta-bold text-sm">+91 98765 43210</Text>
          </View>

          {/* Stats Row */}
          <View className="flex-row justify-around bg-white mx-6 p-6 rounded-[32px] border border-border-light shadow-sm mb-8">
            <View className="items-center">
              <Text className="text-xl font-jakarta-extrabold text-text-primary">12</Text>
              <Text className="text-[10px] font-jakarta-bold text-text-muted uppercase tracking-widest">Trips</Text>
            </View>
            <View className="w-[1px] h-full bg-border-light" />
            <View className="items-center">
              <Text className="text-xl font-jakarta-extrabold text-text-primary">04</Text>
              <Text className="text-[10px] font-jakarta-bold text-text-muted uppercase tracking-widest">Group</Text>
            </View>
            <View className="w-[1px] h-full bg-border-light" />
            <View className="items-center">
              <Text className="text-xl font-jakarta-extrabold text-text-primary">2.4k</Text>
              <Text className="text-[10px] font-jakarta-bold text-text-muted uppercase tracking-widest">KM</Text>
            </View>
          </View>

          {/* Menu Items */}
          <View className="px-6 gap-3">
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity 
                key={index}
                activeOpacity={0.7}
                className="flex-row items-center bg-white p-4 rounded-2xl border border-border-light"
              >
                <View className="w-10 h-10 rounded-xl items-center justify-center mr-4" style={{ backgroundColor: `${item.color}15` }}>
                  <Feather name={item.icon as any} size={20} color={item.color} />
                </View>
                <Text className="flex-1 text-text-primary font-jakarta-bold text-base">{item.label}</Text>
                <Feather name="chevron-right" size={20} color={Colors.text.muted} />
              </TouchableOpacity>
            ))}
          </View>

          {/* Logout */}
          <View className="px-6 mt-10">
            <Button 
              label="Log Out"
              variant="outline"
              size="lg"
              onPress={() => Alert.alert("Logout", "Are you sure?")}
              fullWidth
              className="border-status-error/30"
              textClassName="text-status-error"
            />
          </View>

          <Text className="text-center text-text-muted font-jakarta-medium text-[10px] mt-8 uppercase tracking-[3px]">MyTripGuide v2.4.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}






