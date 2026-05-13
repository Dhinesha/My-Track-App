import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

interface Shortcut {
  id: string;
  label: string;
  icon: string;
  screen: string;
  isImportant?: boolean;
  badgeCount?: number;
}

export const QuickShortcutRow: React.FC<{ unreadNotifCount?: number }> = ({ unreadNotifCount = 0 }) => {
  const navigation = useNavigation<any>();

  const shortcuts: Shortcut[] = [
    { id: '1', label: 'Itinerary', icon: 'calendar-month', screen: 'Itinerary' },
    { id: '2', label: 'Vehicle', icon: 'bus-side', screen: 'VehicleAttendance' },
    { id: '3', label: 'Notifications', icon: 'bell', screen: 'Notifications', badgeCount: unreadNotifCount },
    { id: '4', label: 'Emergency', icon: 'alert-decagram', screen: 'Emergency', isImportant: true },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {shortcuts.map((item) => (
          <TouchableOpacity 
            key={item.id}
            activeOpacity={0.7}
            style={styles.item}
            onPress={() => navigation.navigate(item.screen)}
          >
            <View style={[styles.iconCircle, item.isImportant && styles.importantCircle]}>
              <MaterialCommunityIcons 
                name={item.icon as any} 
                size={22} 
                color={item.isImportant ? '#FFFFFF' : '#0F6E56'} 
              />
              {item.label === 'Notifications' && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{unreadNotifCount}</Text>
                </View>
              )}
            </View>
            <Text style={styles.label}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
    position: 'relative',
    marginBottom: 8,
  },
  importantCircle: {
    backgroundColor: '#EF4444',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1F2937',
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: '#6B7280',
    textAlign: 'center',
  },
});

