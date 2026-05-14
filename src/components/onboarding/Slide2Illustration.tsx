import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Slide2Illustration = () => {
  return (
    <View style={s.card}>
      <Text style={s.sectionTitle}>Vehicle & Attendance</Text>
      
      {/* Check-in Button */}
      <View style={s.checkInBtn}>
        <Text style={s.checkInText}>Check In — 9:32 AM ✓</Text>
      </View>

      {/* Family List */}
      <View style={s.list}>
        <View style={s.row}>
          <View style={[s.avatar, { backgroundColor: '#2b8cee' }]}><Text style={s.avatarTxt}>S</Text></View>
          <Text style={s.name}>Sarah (You)</Text>
          <Text style={s.check}>✓</Text>
        </View>
        <View style={s.row}>
          <View style={[s.avatar, { backgroundColor: '#FFB300' }]}><Text style={s.avatarTxt}>R</Text></View>
          <Text style={s.name}>Raj (Father)</Text>
          <Text style={s.check}>✓</Text>
        </View>
        <View style={s.row}>
          <View style={[s.avatar, { backgroundColor: '#64748b' }]}><Text style={s.avatarTxt}>P</Text></View>
          <Text style={s.name}>Priya (Mother)</Text>
          <View style={s.emptyCheck} />
        </View>
      </View>

      {/* Floating Badge */}
      <View style={s.badge}>
        <Text style={s.badgeText}>2 of 3 ✓</Text>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
    position: 'relative',
  },
  sectionTitle: {
    fontSize: 11,
    color: '#888',
    marginBottom: 12,
  },
  checkInBtn: {
    height: 38,
    backgroundColor: '#2b8cee',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  checkInText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  list: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarTxt: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  name: {
    flex: 1,
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
  check: {
    color: '#2b8cee',
    fontSize: 14,
    fontWeight: 'bold',
  },
  emptyCheck: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#2b8cee',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default Slide2Illustration;
