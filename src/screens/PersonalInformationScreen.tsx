import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Colors, Spacing, Shadows, fonts } from '../constants/theme';
import { useProfileStore } from '../store/profileStore';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80', // Default man
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80', // Woman
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&q=80', // Man hiker
  'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&q=80', // Woman hiker
];

export default function PersonalInformationScreen() {
  const navigation = useNavigation<any>();
  const profile = useProfileStore();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [photo, setPhoto] = useState(profile.photo);
  const [primaryContact, setPrimaryContact] = useState(profile.primaryContact);
  const [secondaryContact, setSecondaryContact] = useState(profile.secondaryContact);
  const [isPresetModalOpen, setIsPresetModalOpen] = useState(false);

  // Sync with store on mount
  useEffect(() => {
    setName(profile.name);
    setEmail(profile.email);
    setPhoto(profile.photo);
    setPrimaryContact(profile.primaryContact);
    setSecondaryContact(profile.secondaryContact);
  }, [profile]);

  const handlePhotoUpload = async () => {
    try {
      // Request media library permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        if (Platform.OS === 'web') {
          window.alert('Sorry, we need photo gallery permissions to change the profile picture!');
        } else {
          Alert.alert('Permission Denied', 'Sorry, we need photo gallery permissions to change the profile picture!');
        }
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      if (Platform.OS === 'web') {
        window.alert('An error occurred while opening the photo gallery.');
      } else {
        Alert.alert('Error', 'An error occurred while opening the photo gallery.');
      }
    }
  };

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Validation Error', 'Name cannot be empty.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      Alert.alert('Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (!primaryContact.trim()) {
      Alert.alert('Validation Error', 'Primary Contact cannot be empty.');
      return;
    }

    profile.updateProfile({
      name,
      email,
      photo,
      primaryContact,
      secondaryContact,
    });

    if (Platform.OS === 'web') {
      window.alert('Profile saved successfully!');
    } else {
      Alert.alert('Success', 'Profile saved successfully!');
    }
    navigation.goBack();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.safe} edges={['top']}>
        {/* Header */}
        <View style={styles.headerBar}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
            style={styles.backBtn}
          >
            <Ionicons name="arrow-back-outline" size={24} color={Colors.neutral.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Personal Information</Text>
          <View style={styles.headerRightPlaceholder} />
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.flexOne}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Avatar Section */}
            <View style={styles.photoContainer}>
              <TouchableOpacity
                onPress={handlePhotoUpload}
                activeOpacity={0.9}
                style={styles.avatarWrapper}
              >
                <View style={styles.avatarBorder}>
                  <Image source={{ uri: photo }} style={styles.avatarImg} />
                </View>
                <View style={styles.cameraBadge}>
                  <Ionicons name="camera-outline" size={16} color="#FFFFFF" />
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={handlePhotoUpload} style={styles.uploadTextBtn}>
                <Text style={styles.uploadText}>
                  {Platform.OS === 'web' ? 'Upload Photo' : 'Change Avatar'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Predefined Avatars row (Quick choose) */}
            <View style={styles.presetContainer}>
              <Text style={styles.presetTitle}>Or Choose a Travel Avatar</Text>
              <View style={styles.presetRow}>
                {PRESET_AVATARS.map((url, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => setPhoto(url)}
                    style={[
                      styles.presetItem,
                      photo === url && styles.presetItemActive
                    ]}
                  >
                    <Image source={{ uri: url }} style={styles.presetImg} />
                    {photo === url && (
                      <View style={styles.checkBadge}>
                        <Ionicons name="checkmark" size={10} color="#FFFFFF" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Editing Card Form */}
            <View style={[styles.formCard, Shadows.sm]}>
              <Text style={styles.sectionHeading}>Traveler Details</Text>

              {/* Full Name */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="person-outline" size={18} color={Colors.neutral.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter your full name"
                    placeholderTextColor={Colors.neutral.textMuted}
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Email Address */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="mail-outline" size={18} color={Colors.neutral.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter email address"
                    placeholderTextColor={Colors.neutral.textMuted}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Primary Contact */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Primary Emergency Contact</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="call-outline" size={18} color={Colors.neutral.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={primaryContact}
                    onChangeText={setPrimaryContact}
                    placeholder="Primary contact phone"
                    placeholderTextColor={Colors.neutral.textMuted}
                    keyboardType="phone-pad"
                    style={styles.textInput}
                  />
                </View>
              </View>

              {/* Secondary Contact */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Secondary Emergency Contact</Text>
                <View style={styles.inputBox}>
                  <Ionicons name="call-outline" size={18} color={Colors.neutral.textMuted} style={styles.inputIcon} />
                  <TextInput
                    value={secondaryContact}
                    onChangeText={setSecondaryContact}
                    placeholder="Secondary contact phone"
                    placeholderTextColor={Colors.neutral.textMuted}
                    keyboardType="phone-pad"
                    style={styles.textInput}
                  />
                </View>
              </View>
            </View>

            {/* Save Button */}
            <TouchableOpacity
              onPress={handleSave}
              style={[styles.saveBtn, Shadows.md]}
              activeOpacity={0.8}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
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
  flexOne: {
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
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.semiBold,
  },
  headerRightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
    paddingTop: 16,
  },
  photoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarWrapper: {
    position: 'relative',
  },
  avatarBorder: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    padding: 3,
    backgroundColor: '#FFFFFF',
    ...Platform.select({
      web: { boxShadow: '0 4px 12px rgba(0,0,0,0.08)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 6,
        elevation: 4,
      }
    }),
  },
  avatarImg: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 32,
    height: 32,
    backgroundColor: Colors.primary.main,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  uploadTextBtn: {
    marginTop: 10,
  },
  uploadText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary.main,
    fontFamily: fonts.semiBold,
  },
  presetContainer: {
    paddingHorizontal: Spacing.screenPaddingH,
    marginBottom: 20,
    alignItems: 'center',
  },
  presetTitle: {
    fontSize: 12,
    color: Colors.neutral.textMuted,
    fontFamily: fonts.medium,
    marginBottom: 10,
  },
  presetRow: {
    flexDirection: 'row',
    gap: 12,
  },
  presetItem: {
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 2,
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: '#FFFFFF',
  },
  presetItemActive: {
    borderColor: Colors.primary.main,
  },
  presetImg: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    backgroundColor: Colors.primary.main,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  formCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: Spacing.cardRadius,
    padding: 20,
    marginHorizontal: Spacing.screenPaddingH,
    marginBottom: 24,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  sectionHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.neutral.textPrimary,
    fontFamily: fonts.bold,
    marginBottom: 18,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.neutral.textSecondary,
    fontFamily: fonts.bold,
    marginBottom: 6,
    textTransform: 'uppercase',
    marginLeft: 2,
  },
  inputBox: {
    height: 48,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    height: '100%',
    color: Colors.neutral.textPrimary,
    fontSize: 14,
    fontFamily: fonts.medium,
    outlineStyle: 'none' as any, // Prevents default outline on web
  },
  saveBtn: {
    backgroundColor: Colors.primary.main,
    marginHorizontal: Spacing.screenPaddingH,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary.main,
  },
  saveBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: fonts.bold,
  },
});
