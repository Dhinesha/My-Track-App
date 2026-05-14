import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Slide1Illustration = () => {
  return (
    <View style={s.phone}>
      <View style={s.notch} />
      <View style={s.screen}>
        <View style={s.header}>
          <Text style={s.headerTitle}>PARIS ADVENTURE</Text>
        </View>
        <View style={s.mapMock}>
          <View style={s.routeLine} />
          <View style={[s.pin, { top: 20, left: 40 }]} />
          <View style={[s.pin, { top: 60, left: 100 }]} />
          <View style={[s.pin, { top: 40, left: 160 }]} />
        </View>
        <View style={s.list}>
          <Text style={s.day}>DAY 3: EXPLORING PARIS</Text>
          <View style={s.item}><View style={s.dot} /><Text style={s.itemText}>Check-in: Hotel Lumiere</Text></View>
          <View style={s.item}><View style={[s.dot, { backgroundColor: '#FFB300' }]} /><Text style={s.itemText}>Eiffel Tower</Text></View>
          <View style={s.item}><View style={[s.dot, { backgroundColor: '#1E88E5' }]} /><Text style={s.itemText}>Louvre Museum</Text></View>
        </View>
      </View>
      
      {/* Floating Key Tag */}
      <View style={s.tag}>
        <View style={s.tagRing} />
        <View style={s.tagBody}>
          <Text style={s.tagTxt}>HL</Text>
        </View>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  phone: {
    width: 140,
    height: 240,
    backgroundColor: '#0f172a',
    borderRadius: 24,
    borderWidth: 4,
    borderColor: '#334155',
    position: 'relative',
    padding: 6,
  },
  notch: {
    width: 40,
    height: 12,
    backgroundColor: '#0f172a',
    alignSelf: 'center',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    zIndex: 10,
  },
  screen: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  header: {
    height: 34,
    backgroundColor: '#2b8cee',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 8,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  mapMock: {
    height: 80,
    backgroundColor: '#f8fafc',
    position: 'relative',
  },
  routeLine: {
    position: 'absolute',
    top: 30,
    left: 40,
    width: 100,
    height: 40,
    borderWidth: 2,
    borderColor: '#2b8cee',
    borderStyle: 'dashed',
    borderRadius: 20,
  },
  pin: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2b8cee',
    borderWidth: 1,
    borderColor: '#fff',
  },
  list: {
    padding: 8,
  },
  day: {
    fontSize: 7,
    fontWeight: '800',
    color: '#94a3b8',
    marginBottom: 6,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#22c55e',
    marginRight: 6,
  },
  itemText: {
    fontSize: 7,
    color: '#334155',
    fontWeight: '600',
  },
  tag: {
    position: 'absolute',
    right: -20,
    top: 100,
    alignItems: 'center',
  },
  tagRing: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#94a3b8',
    marginBottom: -4,
    zIndex: 2,
  },
  tagBody: {
    width: 24,
    height: 32,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tagTxt: {
    fontSize: 8,
    fontWeight: '900',
    color: '#2b8cee',
  },
});

export default Slide1Illustration;
