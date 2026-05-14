import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Slide3Illustration = () => {
  return (
    <View style={s.container}>
      {/* Card 1 (Urgent) */}
      <View style={[s.card, { borderLeftColor: '#EF5350', borderLeftWidth: 3, zIndex: 3 }]}>
        <View style={s.row}>
          <Text style={s.icon}>⚠️</Text>
          <View style={s.content}>
            <Text style={s.title}>Departure in 15 minutes</Text>
            <Text style={s.subtitle}>Please proceed to Bus 2 at Gate A</Text>
          </View>
          <View style={s.unreadDot} />
        </View>
      </View>

      {/* Card 2 (Bus) */}
      <View style={[s.card, { borderLeftColor: '#66BB6A', borderLeftWidth: 3, marginTop: -12, zIndex: 2, transform: [{ scale: 0.96 }] }]}>
        <View style={s.row}>
          <Text style={s.icon}>🚌</Text>
          <View style={s.content}>
            <Text style={s.title}>Bus has arrived</Text>
            <Text style={s.subtitle}>Bus 2 arrived at Kashi Vishwanath</Text>
          </View>
        </View>
      </View>

      {/* Card 3 (Info) */}
      <View style={[s.card, { borderLeftColor: '#2b8cee', borderLeftWidth: 3, marginTop: -12, zIndex: 1, transform: [{ scale: 0.92 }] }]}>
        <View style={s.row}>
          <Text style={s.icon}>📢</Text>
          <View style={s.content}>
            <Text style={s.title}>Organiser message</Text>
            <Text style={s.subtitle}>Carry water — no shops at Vindhyachal</Text>
          </View>
          <View style={s.unreadDot} />
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 240,
  },
  card: {
    width: 220,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
    color: '#333',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 10,
    color: '#888',
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2b8cee',
  },
});

export default Slide3Illustration;
