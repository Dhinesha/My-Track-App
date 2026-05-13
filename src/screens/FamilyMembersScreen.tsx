import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '../theme/colors';
import { Button } from '../components/common';


const INITIAL_MEMBERS = [
  { id: '1', name: 'Sarah Jenkins', seat: '14B', status: 'Attending', checkIn: 'Checked In', isCheckedIn: true, avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: '2', name: 'Tommy Jenkins', seat: '14C', status: 'Attending', checkIn: 'Pending', isCheckedIn: false, avatar: 'https://i.pravatar.cc/150?u=tommy' },
  { id: '3', name: 'Emily Jenkins', seat: '15A', status: 'Attending', checkIn: 'Pending', isCheckedIn: false, avatar: 'https://i.pravatar.cc/150?u=emily' },
];

export default function FamilyMembersScreen() {
  const navigation = useNavigation<any>();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSeat, setNewSeat] = useState('');

  const addMember = () => {
    if (!newName.trim()) return;
    const newMember = {
      id: Date.now().toString(),
      name: newName,
      seat: newSeat.toUpperCase() || '--',
      status: 'Attending',
      checkIn: 'Pending',
      isCheckedIn: false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=0F6E56&color=fff`,
    };
    setMembers([...members, newMember]);
    setNewName('');
    setNewSeat('');
    setIsModalVisible(false);
  };

  const removeMember = (id: string) => {
    Alert.alert("Remove Member", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      { text: "Remove", style: "destructive", onPress: () => setMembers(members.filter(m => m.id !== id)) }
    ]);
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" />
      <SafeAreaView className="flex-1" edges={['top']}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4">
          <TouchableOpacity onPress={() => navigation.goBack()} className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-sm border border-border-light">
            <Feather name="arrow-left" size={20} color={Colors.text.primary} />
          </TouchableOpacity>
          <Text className="text-xl font-jakarta-extrabold text-text-primary">Family & Group</Text>
          <TouchableOpacity 
            onPress={() => setIsModalVisible(true)}
            className="w-10 h-10 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/30"
          >
            <Feather name="user-plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View className="px-6 py-4">
            <Text className="text-text-muted font-jakarta-bold text-sm mb-6">
              Manage your family members and track their attendance status for this trip.
            </Text>

            {members.map((member) => (
              <View 
                key={member.id} 
                className="bg-white rounded-[32px] p-5 mb-4 border border-border-light shadow-sm flex-row items-center"
              >
                <View className="relative mr-4">
                  <Image 
                    source={{ uri: member.avatar }} 
                    className="w-16 h-16 rounded-[24px] bg-teal-light" 
                  />
                  {member.isCheckedIn && (
                    <View className="absolute -bottom-1 -right-1 w-6 h-6 bg-status-success rounded-full items-center justify-center border-2 border-white">
                      <Feather name="check" size={10} color="#fff" />
                    </View>
                  )}
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-text-primary font-jakarta-extrabold text-base mr-2">{member.name}</Text>
                    <View className="bg-teal-light px-2 py-0.5 rounded-full">
                      <Text className="text-primary font-jakarta-bold text-[10px]">{member.seat}</Text>
                    </View>
                  </View>
                  
                  <View className="flex-row items-center">
                    <View className={`w-2 h-2 rounded-full mr-2 ${member.isCheckedIn ? 'bg-status-success' : 'bg-status-warning'}`} />
                    <Text className={`text-[11px] font-jakarta-bold ${member.isCheckedIn ? 'text-status-success' : 'text-status-warning'}`}>
                      {member.checkIn}
                    </Text>
                  </View>
                </View>

                <TouchableOpacity 
                  onPress={() => removeMember(member.id)}
                  className="w-10 h-10 bg-status-error/10 rounded-full items-center justify-center"
                >
                  <Feather name="trash-2" size={18} color={Colors.status.error} />
                </TouchableOpacity>
              </View>
            ))}

            {members.length === 0 && (
              <View className="items-center py-20">
                <View className="w-20 h-20 bg-background-input rounded-full items-center justify-center mb-4">
                  <Feather name="users" size={40} color={Colors.text.muted} />
                </View>
                <Text className="text-text-primary font-jakarta-bold text-lg">No members added</Text>
                <Text className="text-text-muted font-jakarta-medium text-center mt-2 px-10">
                  Add your family members to manage their check-ins together.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Add Member Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent>
        <View className="flex-1 bg-black/50 justify-end">
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <View className="bg-white rounded-t-[40px] p-8 pb-12">
              <View className="w-12 h-1 bg-border-light rounded-full self-center mb-8" />
              <Text className="text-2xl font-jakarta-extrabold text-text-primary mb-6">Add Member</Text>
              
              <View className="mb-6">
                <Text className="text-text-muted font-jakarta-bold text-xs uppercase mb-2 ml-2">Full Name</Text>
                <TextInput
                  className="bg-background-input p-4 rounded-2xl font-jakarta-bold text-text-primary"
                  placeholder="Enter name"
                  value={newName}
                  onChangeText={setNewName}
                />
              </View>

              <View className="mb-8">
                <Text className="text-text-muted font-jakarta-bold text-xs uppercase mb-2 ml-2">Seat (Optional)</Text>
                <TextInput
                  className="bg-background-input p-4 rounded-2xl font-jakarta-bold text-text-primary"
                  placeholder="e.g. 14A"
                  value={newSeat}
                  onChangeText={setNewSeat}
                  autoCapitalize="characters"
                />
              </View>

              <View className="flex-row gap-4">
                <TouchableOpacity 
                  onPress={() => setIsModalVisible(false)}
                  className="flex-1 bg-background-input h-14 rounded-2xl items-center justify-center"
                >
                  <Text className="text-text-primary font-jakarta-bold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={addMember}
                  className="flex-1 bg-primary h-14 rounded-2xl items-center justify-center"
                >
                  <Text className="text-white font-jakarta-bold">Add Member</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}







