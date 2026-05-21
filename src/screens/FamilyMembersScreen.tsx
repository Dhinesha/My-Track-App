import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, Modal, TextInput, KeyboardAvoidingView, Platform, Alert, StatusBar, Pressable, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { fonts } from '../constants/theme';
import { Colors } from '../theme/colors';

const INITIAL_MEMBERS = [
  { id: '1', name: 'Sarah Jenkins', seat: '14B', status: 'Attending', checkIn: 'Checked In', isCheckedIn: true, avatar: 'https://i.pravatar.cc/150?u=sarah' },
  { id: '2', name: 'Tommy Jenkins', seat: '14C', status: 'Attending', checkIn: 'Pending Check-in', isCheckedIn: false, avatar: 'https://i.pravatar.cc/150?u=tommy' },
  { id: '3', name: 'Emily Jenkins', seat: '15A', status: 'Attending', checkIn: 'Pending Check-in', isCheckedIn: false, avatar: 'https://i.pravatar.cc/150?u=emily' },
  { id: '4', name: 'Robert Jenkins', seat: '', status: 'Not Attending', checkIn: 'Not Attending', isCheckedIn: false, avatar: 'https://i.pravatar.cc/150?u=robert' },
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
      seat: newSeat.toUpperCase() || '',
      status: 'Attending',
      checkIn: 'Pending Check-in',
      isCheckedIn: false,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newName)}&background=0EA5E9&color=fff`,
    };
    setMembers([...members, newMember]);
    setNewName('');
    setNewSeat('');
    setIsModalVisible(false);
  };

  const removeMember = (id: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm("Are you sure you want to remove this member?")) {
        setMembers(members.filter(m => m.id !== id));
      }
    } else {
      Alert.alert("Remove Member", "Are you sure?", [
        { text: "Cancel", style: "cancel" },
        { text: "Remove", style: "destructive", onPress: () => setMembers(members.filter(m => m.id !== id)) }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Feather name="arrow-left" size={20} color="#111111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Family Members</Text>
          <TouchableOpacity 
            onPress={() => setIsModalVisible(true)}
            style={styles.addButton}
            activeOpacity={0.7}
          >
            <Feather name="user-plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          <View style={styles.content}>
            <Text style={styles.subtitle}>
              You can manage actions and view statuses for your family members on this trip.
            </Text>

            {members.map((member) => {
              const isAttending = member.status === 'Attending';
              const isNotAttending = member.status === 'Not Attending';
              const isCheckedIn = member.checkIn === 'Checked In';
              
              return (
                <View 
                  key={member.id} 
                  style={styles.card}
                >
                  {/* Avatar section */}
                  <View style={styles.avatarContainer}>
                    {isNotAttending ? (
                      <View style={styles.avatarPlaceholder}>
                        <Feather name="user" size={32} color="#94A3B8" />
                      </View>
                    ) : (
                      <Image 
                        source={{ uri: member.avatar }} 
                        style={styles.avatar as any} 
                      />
                    )}
                    {isAttending && isCheckedIn && (
                      <View style={styles.checkBadge}>
                        <Feather name="check" size={10} color="#fff" />
                      </View>
                    )}
                  </View>

                  {/* Info section */}
                  <View style={styles.infoContainer}>
                    <View style={styles.nameRow}>
                      <Text 
                        style={[
                          styles.memberName, 
                          isNotAttending && { color: '#94A3B8' }
                        ]}
                      >
                        {member.name}
                      </Text>
                      {isAttending && member.seat ? (
                        <View style={styles.seatBadge}>
                          <Text style={styles.seatText}>{member.seat}</Text>
                        </View>
                      ) : null}
                    </View>

                    {/* Attending status row */}
                    <View style={styles.statusRow}>
                      {isAttending ? (
                        <>
                          <Feather name="send" size={12} color="#1D9E75" style={styles.statusIcon} />
                          <Text style={styles.statusText}>Attending</Text>
                        </>
                      ) : (
                        <>
                          <Feather name="user-x" size={12} color="#94A3B8" style={styles.statusIcon} />
                          <Text style={styles.statusTextMuted}>Not Attending</Text>
                        </>
                      )}
                    </View>

                    {/* Check-in status row (only for Attending) */}
                    {isAttending && (
                      <View style={styles.statusRow}>
                        {isCheckedIn ? (
                          <>
                            <Feather name="check-square" size={12} color="#2B8CEE" style={styles.statusIcon} />
                            <Text style={styles.statusTextBlue}>Checked In</Text>
                          </>
                        ) : (
                          <>
                            <Feather name="alert-circle" size={12} color="#BA7517" style={styles.statusIcon} />
                            <Text style={styles.statusTextAmber}>Pending Check-in</Text>
                          </>
                        )}
                      </View>
                    )}
                  </View>

                  {/* Actions */}
                  <View style={styles.actionsContainer}>
                    <TouchableOpacity 
                      onPress={() => removeMember(member.id)}
                      style={styles.deleteButton}
                      activeOpacity={0.7}
                    >
                      <Feather name="trash-2" size={16} color="#D94040" />
                    </TouchableOpacity>
                    <Feather name="chevron-right" size={20} color="#CBD5E1" />
                  </View>
                </View>
              );
            })}

            {members.length === 0 && (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconContainer}>
                  <Feather name="users" size={40} color="#94A3B8" />
                </View>
                <Text style={styles.emptyTitle}>No members added</Text>
                <Text style={styles.emptyText}>
                  Add your family members to manage their check-ins together.
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Add Member UI (Modal on native, Absolute View on web to stay inside phone mockup) */}
      {isModalVisible && (
        <View 
          style={Platform.OS === 'web' ? styles.webModalOverlay : { position: 'absolute', width: 0, height: 0 }}
        >
          {Platform.OS !== 'web' ? (
            <Modal visible={isModalVisible} animationType="slide" transparent statusBarTranslucent>
              <View style={styles.modalContainer}>
                <Pressable style={styles.modalFlexSpacer} onPress={() => setIsModalVisible(false)} />
                <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                  <View style={styles.modalContent}>
                    <View style={styles.modalDragHandle} />
                    <Text style={styles.modalTitle}>Add Member</Text>
                    
                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Full Name</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="Enter name"
                        placeholderTextColor="#94a3b8"
                        value={newName}
                        onChangeText={setNewName}
                        autoFocus
                      />
                    </View>

                    <View style={styles.inputContainer}>
                      <Text style={styles.inputLabel}>Seat (Optional)</Text>
                      <TextInput
                        style={styles.textInput}
                        placeholder="e.g. 14A"
                        placeholderTextColor="#94a3b8"
                        value={newSeat}
                        onChangeText={setNewSeat}
                        autoCapitalize="characters"
                      />
                    </View>

                    <View style={styles.modalActions}>
                      <TouchableOpacity 
                        onPress={() => setIsModalVisible(false)} 
                        style={styles.cancelButton}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        onPress={addMember} 
                        style={styles.submitButton}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.submitButtonText}>Add Member</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </View>
            </Modal>
          ) : (
            <>
              <Pressable style={styles.modalFlexSpacer} onPress={() => setIsModalVisible(false)} />
              <View style={styles.modalContent}>
                <View style={styles.modalDragHandle} />
                <Text style={styles.modalTitle}>Add Member</Text>
                
                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Enter name"
                    placeholderTextColor="#94a3b8"
                    value={newName}
                    onChangeText={setNewName}
                    autoFocus
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Seat (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="e.g. 14A"
                    placeholderTextColor="#94a3b8"
                    value={newSeat}
                    onChangeText={setNewSeat}
                    autoCapitalize="characters"
                  />
                </View>

                <View style={styles.modalActions}>
                  <TouchableOpacity 
                    onPress={() => setIsModalVisible(false)} 
                    style={styles.cancelButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={addMember} 
                    style={styles.submitButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.submitButtonText}>Add Member</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    outlineStyle: 'none' as any,
  },
  addButton: {
    width: 40,
    height: 40,
    backgroundColor: '#2B8CEE',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B8CEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    outlineStyle: 'none' as any,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: fonts.bold,
    color: '#0F172A',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#64748B',
    lineHeight: 22,
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.03,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EDF5FD',
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    backgroundColor: '#1D9E75',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  memberName: {
    fontSize: 16,
    fontFamily: fonts.bold,
    color: '#0F172A',
  },
  seatBadge: {
    backgroundColor: '#EDF5FD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  seatText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: '#2B8CEE',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: '#475569',
  },
  statusTextMuted: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: '#94A3B8',
  },
  statusTextBlue: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: '#2B8CEE',
  },
  statusTextAmber: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: '#BA7517',
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    width: 36,
    height: 36,
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    outlineStyle: 'none' as any,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIconContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F1F5F9',
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    color: '#0F172A',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
  },
  webModalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalFlexSpacer: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 32,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalDragHandle: {
    width: 48,
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: '#0F172A',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 4,
  },
  textInput: {
    fontFamily: fonts.medium,
    fontSize: 15,
    color: '#0F172A',
    backgroundColor: '#F1F5F9',
    padding: 16,
    borderRadius: 12,
    outlineStyle: 'none' as any,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    outlineStyle: 'none' as any,
  },
  cancelButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: '#475569',
  },
  submitButton: {
    flex: 1,
    backgroundColor: '#2B8CEE',
    height: 56,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#2B8CEE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
    outlineStyle: 'none' as any,
  },
  submitButtonText: {
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: '#ffffff',
  },
});
