import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Image, StatusBar, Platform, StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Typography, Spacing, Shadows } from '../constants/theme';

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
    { icon: 'notifications-outline', label: 'Notification Settings', id: 'notifications' },
    { icon: 'shield-checkmark-outline', label: 'Admin Dashboard', id: 'admin' },
    { icon: 'settings-outline', label: 'General Settings', id: 'settings' },
    { icon: 'help-circle-outline', label: 'Help & Support', id: 'help' },
  ];

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header Bar */}
        <View style={styles.headerBar}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity 
            onPress={() => handleEdit('Name', name, setName)}
            activeOpacity={0.7}
            style={styles.headerEditBtn}
          >
            <Ionicons name="pencil-outline" size={22} color={Colors.neutral.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={styles.scrollView} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={() => handleEdit('Photo URL', photo, setPhoto)}
              style={styles.avatarWrapper}
            >
              <View style={styles.avatarBorder}>
                <Image 
                  source={{ uri: photo }} 
                  style={styles.avatarImg} 
                />
              </View>
              <View style={styles.avatarCheckBadge}>
                <Ionicons name="checkmark" size={14} color="#FFFFFF" />
              </View>
            </TouchableOpacity>
            
            <View style={styles.nameRow}>
              <Text style={styles.nameText}>{name}</Text>
              <TouchableOpacity onPress={() => handleEdit('Name', name, setName)}>
                <Ionicons name="pencil-sharp" size={16} color={Colors.neutral.textMuted} />
              </TouchableOpacity>
            </View>
            <Text style={styles.emailText}>{email}</Text>
            
            <View style={styles.travellerBadge}>
              <Text style={styles.travellerBadgeText}>Primary Traveller</Text>
            </View>
          </View>

          {/* Emergency Contacts Card */}
          <View style={[styles.emergencyCard, Shadows.sm]}>
            <View style={styles.emergencyCardTitleRow}>
              <Ionicons name="alert-circle-outline" size={20} color={Colors.urgent.main} />
              <Text style={styles.emergencyCardTitle}>Emergency Contacts</Text>
            </View>

            <View style={styles.contactFieldWrapper}>
              <Text style={styles.contactFieldLabel}>Primary Contact</Text>
              <View style={styles.contactFieldBox}>
                <Text style={styles.contactFieldVal}>{primaryContact}</Text>
                <TouchableOpacity onPress={() => handleEdit('Primary Contact', primaryContact, setPrimaryContact)}>
                  <Ionicons name="pencil-sharp" size={16} color={Colors.neutral.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.contactFieldWrapper}>
              <Text style={styles.contactFieldLabel}>Secondary Contact</Text>
              <View style={styles.contactFieldBox}>
                <Text style={styles.contactFieldVal}>{secondaryContact}</Text>
                <TouchableOpacity onPress={() => handleEdit('Secondary Contact', secondaryContact, setSecondaryContact)}>
                  <Ionicons name="pencil-sharp" size={16} color={Colors.neutral.textMuted} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Stats Box */}
          <View style={[styles.statsCard, Shadows.sm]}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statLabel}>Trips</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>08</Text>
              <Text style={styles.statLabel}>Countries</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>04</Text>
              <Text style={styles.statLabel}>Members</Text>
            </View>
          </View>

          {/* Menu List */}
          <View style={[styles.menuCard, Shadows.sm]}>
            {MENU_ITEMS.map((item, index) => (
              <TouchableOpacity 
                key={item.id}
                onPress={() => item.id === 'admin' ? navigation.navigate('AdminDashboard') : {}}
                style={[
                  styles.menuItem,
                  index !== MENU_ITEMS.length - 1 && styles.menuItemBorder
                ]}
                activeOpacity={0.7}
              >
                <Ionicons name={item.icon as any} size={22} color={Colors.neutral.textSecondary} style={styles.menuIcon} />
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward-outline" size={18} color={Colors.neutral.textMuted} />
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
            style={[styles.logoutBtn, Shadows.sm]}
            activeOpacity={0.8}
          >
            <Ionicons name="log-out-outline" size={20} color={Colors.urgent.main} />
            <Text style={styles.logoutBtnText}>Log Out</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
  },
  safe: {
    flex: 1,
  },
  headerBar: {
    height: Spacing.headerHeight,
    backgroundColor: Colors.neutral.headerBg,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.screenPaddingH,
  },
  headerTitle: {
    fontSize: Typography.fontSizes.screenTitle,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.semibold,
  },
  headerEditBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 18,
    paddingBottom: 24,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 16,
  },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: Colors.neutral.border,
    padding: 3,
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 45,
  },
  avatarCheckBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    backgroundColor: Colors.success.checkIcon,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  nameText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  emailText: {
    fontSize: 13,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
    marginBottom: 12,
  },
  travellerBadge: {
    backgroundColor: Colors.primary.lightBg,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  travellerBadgeText: {
    color: Colors.primary.main,
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
    textTransform: 'uppercase',
  },
  emergencyCard: {
    backgroundColor: Colors.urgent.lightBg,
    borderRadius: Spacing.cardRadius,
    padding: 20,
    marginHorizontal: Spacing.screenPaddingH,
    marginBottom: 20,
    borderWidth: 0.5,
    borderColor: '#FECACA',
  },
  emergencyCardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  emergencyCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.urgent.main,
    fontFamily: Typography.fontFamilies.bold,
    textTransform: 'uppercase',
  },
  contactFieldWrapper: {
    marginBottom: 12,
  },
  contactFieldLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.urgent.main,
    fontFamily: Typography.fontFamilies.bold,
    textTransform: 'uppercase',
    marginBottom: 4,
    marginLeft: 2,
  },
  contactFieldBox: {
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
  },
  contactFieldVal: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.cardRadius,
    paddingVertical: 16,
    marginHorizontal: Spacing.screenPaddingH,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  statVal: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.bold,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.neutral.textMuted,
    fontFamily: Typography.fontFamilies.regular,
    marginTop: 2,
  },
  statDivider: {
    width: 0.5,
    height: 30,
    backgroundColor: Colors.neutral.divider,
  },
  menuCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.cardRadius,
    marginHorizontal: Spacing.screenPaddingH,
    marginBottom: 20,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  menuItemBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
  },
  menuIcon: {
    marginRight: 12,
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.neutral.textPrimary,
    fontFamily: Typography.fontFamilies.semibold,
  },
  logoutBtn: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.screenPaddingH,
    height: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  logoutBtnText: {
    color: Colors.urgent.main,
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Typography.fontFamilies.bold,
  },
});
