import React, { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, FlatList,
  TextInput, StatusBar, StyleSheet, Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { PACKING_DEFAULTS } from '../../constants/packingDefaults';
import { fonts, Colors, Spacing, Shadows } from '../../constants/theme';

interface Item { id: string; label: string; checked: boolean; }
type Route = RouteProp<{ params: { tripId: string; tripName: string; tripType: string } }, 'params'>;

// Category icon mapping
const CATEGORY_META: Record<string, { icon: string; color: string; bg: string }> = {
  default: { icon: 'bag-personal-outline', color: '#2B8CEE', bg: '#EDF5FD' },
  family:  { icon: 'account-group-outline', color: '#0F766E', bg: '#F0FDFA' },
  solo:    { icon: 'hiking',                color: '#7C3AED', bg: '#F5F3FF' },
  couple:  { icon: 'heart-outline',         color: '#DB2777', bg: '#FDF2F8' },
};

export default function PackingChecklistScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const { tripId, tripName, tripType } = route.params;
  const KEY = `packing_${tripId}`;

  const [items, setItems] = useState<Item[]>([]);
  const [newItem, setNewItem] = useState('');

  const meta = CATEGORY_META[tripType] ?? CATEGORY_META.default;

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((raw) => {
      if (raw) { setItems(JSON.parse(raw)); return; }
      const defaults = (PACKING_DEFAULTS[tripType] ?? PACKING_DEFAULTS.family).map((label, i) => ({
        id: `default_${i}`, label, checked: false,
      }));
      setItems(defaults);
      AsyncStorage.setItem(KEY, JSON.stringify(defaults));
    });
  }, [tripId]);

  const save = (updated: Item[]) => {
    setItems(updated);
    AsyncStorage.setItem(KEY, JSON.stringify(updated));
  };

  const toggle   = (id: string) => save(items.map((i) => i.id === id ? { ...i, checked: !i.checked } : i));
  const remove   = (id: string) => save(items.filter((i) => i.id !== id));
  const resetAll = () => save(items.map((i) => ({ ...i, checked: false })));

  const addItem = () => {
    if (!newItem.trim()) return;
    save([...items, { id: Date.now().toString(), label: newItem.trim(), checked: false }]);
    setNewItem('');
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const progress     = items.length ? checkedCount / items.length : 0;
  const pct          = Math.round(progress * 100);

  // Sort: unchecked first, checked at bottom
  const sorted = [...items].sort((a, b) => Number(a.checked) - Number(b.checked));

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color={Colors.neutral.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle} numberOfLines={1}>Pack for {tripName}</Text>
          <View style={styles.categoryRow}>
            <View style={[styles.categoryDot, { backgroundColor: meta.color }]} />
            <Text style={[styles.categoryLabel, { color: meta.color }]}>
              {tripType.toUpperCase()} ESSENTIALS
            </Text>
          </View>
        </View>

        {/* Category icon badge */}
        <View style={[styles.catBadge, { backgroundColor: meta.bg }]}>
          <MaterialCommunityIcons name={meta.icon as any} size={22} color={meta.color} />
        </View>
      </View>

      {/* ── PROGRESS CARD ── */}
      <View style={styles.progressCard}>
        {/* Left: fraction */}
        <View style={styles.progressLeft}>
          <Text style={styles.progressFraction}>
            {checkedCount}
            <Text style={styles.progressTotal}>/{items.length}</Text>
          </Text>
          <Text style={styles.progressSubLabel}>ITEMS PACKED</Text>
        </View>

        {/* Right: percentage ring placeholder + number */}
        <View style={styles.progressRight}>
          <View style={[
            styles.pctRing,
            { borderColor: pct === 100 ? '#2B8CEE' : pct > 50 ? '#2B8CEE' : '#E2E8F0' }
          ]}>
            <Text style={[
              styles.pctText,
              { color: pct === 100 ? '#2B8CEE' : pct > 50 ? '#2B8CEE' : '#94A3B8' }
            ]}>
              {pct}%
            </Text>
          </View>
        </View>

        {/* Bar below */}
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${pct}%` as any }]}>
            <LinearGradient
              colors={['#2B8CEE', '#1A74D4']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFillObject}
            />
          </View>
        </View>
      </View>

      {/* ── LIST ── */}
      <FlatList
        data={sorted}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={[styles.itemCard, item.checked && styles.itemCardChecked]}>
            {/* Left accent bar */}
            {item.checked && <View style={styles.itemAccent} />}

            {/* Checkbox */}
            <TouchableOpacity
              onPress={() => toggle(item.id)}
              style={[styles.checkbox, item.checked && styles.checkboxChecked]}
              activeOpacity={0.75}
            >
              {item.checked && <Ionicons name="checkmark" size={15} color="#FFFFFF" />}
            </TouchableOpacity>

            {/* Label */}
            <Text style={[styles.itemLabel, item.checked && styles.itemLabelChecked]} numberOfLines={2}>
              {item.label}
            </Text>

            {/* Remove */}
            <TouchableOpacity onPress={() => remove(item.id)} style={styles.removeBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Feather name="x" size={16} color={item.checked ? '#CBD5E1' : '#94A3B8'} />
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="bag-checked" size={64} color="#E2E8F0" />
            <Text style={styles.emptyText}>Your packing list is empty</Text>
            <Text style={styles.emptySubText}>Add your first item below</Text>
          </View>
        }
      />

      {/* ── FOOTER ── */}
      <View style={styles.footer}>
        {/* Reset link */}
        {checkedCount > 0 && (
          <TouchableOpacity onPress={resetAll} style={styles.resetBtn} activeOpacity={0.6}>
            <Feather name="refresh-cw" size={12} color="#94A3B8" />
            <Text style={styles.resetText}>RESET ALL CHECKS</Text>
          </TouchableOpacity>
        )}

        {/* Input row */}
        <View style={styles.inputRow}>
          <TextInput
            value={newItem}
            onChangeText={setNewItem}
            placeholder="Add new item..."
            placeholderTextColor="#94A3B8"
            style={styles.input}
            onSubmitEditing={addItem}
            returnKeyType="done"
          />
          <TouchableOpacity
            onPress={addItem}
            style={[styles.addBtn, !newItem.trim() && styles.addBtnDisabled]}
            activeOpacity={0.8}
            disabled={!newItem.trim()}
          >
            <LinearGradient
              colors={newItem.trim() ? ['#2B8CEE', '#1A74D4'] : ['#E2E8F0', '#CBD5E1']}
              style={styles.addBtnGradient}
            >
              <Feather name="plus" size={22} color={newItem.trim() ? '#FFFFFF' : '#94A3B8'} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.neutral.pageBackground,
  },

  // ── Header ──────────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: Spacing.screenPaddingH,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.neutral.border,
    gap: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: Colors.neutral.pageBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontFamily: fonts.extraBold,
    fontSize: 17,
    color: Colors.neutral.textPrimary,
    lineHeight: 22,
  },
  categoryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  categoryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  categoryLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    letterSpacing: 1.5,
  },
  catBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Progress Card ────────────────────────────────
  progressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: Spacing.screenPaddingH,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 8,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    ...Platform.select({
      web: { boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      },
    }) as any,
  },
  progressLeft: {
    flex: 1,
  },
  progressFraction: {
    fontFamily: fonts.extraBold,
    fontSize: 36,
    color: Colors.neutral.textPrimary,
    lineHeight: 40,
  },
  progressTotal: {
    fontFamily: fonts.regular,
    fontSize: 20,
    color: Colors.neutral.textMuted,
  },
  progressSubLabel: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: Colors.neutral.textMuted,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  progressRight: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pctRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pctText: {
    fontFamily: fonts.extraBold,
    fontSize: 15,
  },
  barTrack: {
    width: '100%',
    height: 8,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 12,
  },
  barFill: {
    height: '100%',
    borderRadius: 8,
    overflow: 'hidden',
    minWidth: 8,
  },

  // ── List ─────────────────────────────────────────
  listContent: {
    paddingHorizontal: Spacing.screenPaddingH,
    paddingTop: 8,
    paddingBottom: 160,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
    overflow: 'hidden',
    ...Platform.select({
      web: { boxShadow: '0 1px 6px rgba(0,0,0,0.05)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 1,
      },
    }) as any,
  },
  itemCardChecked: {
    backgroundColor: '#F0F7FF',
    borderColor: '#DBEAFE',
  },
  itemAccent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    backgroundColor: '#2B8CEE',
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    flexShrink: 0,
  },
  checkboxChecked: {
    backgroundColor: '#2B8CEE',
    borderColor: '#2B8CEE',
  },
  itemLabel: {
    flex: 1,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: Colors.neutral.textPrimary,
    lineHeight: 20,
  },
  itemLabelChecked: {
    fontFamily: fonts.regular,
    textDecorationLine: 'line-through',
    color: '#94A3B8',
  },
  removeBtn: {
    padding: 4,
    flexShrink: 0,
  },

  // ── Empty state ───────────────────────────────────
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
    gap: 8,
  },
  emptyText: {
    fontFamily: fonts.bold,
    fontSize: 16,
    color: '#CBD5E1',
    marginTop: 8,
  },
  emptySubText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: '#E2E8F0',
  },

  // ── Footer ───────────────────────────────────────
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0.5,
    borderTopColor: Colors.neutral.border,
    paddingHorizontal: Spacing.screenPaddingH,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 28 : 16,
    gap: 10,
    ...Platform.select({
      web: { boxShadow: '0 -4px 16px rgba(0,0,0,0.06)' },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
        elevation: 8,
      },
    }) as any,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 2,
  },
  resetText: {
    fontFamily: fonts.bold,
    fontSize: 10,
    color: '#94A3B8',
    letterSpacing: 1.5,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 52,
    backgroundColor: Colors.neutral.pageBackground,
    borderRadius: 14,
    paddingHorizontal: 18,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    color: Colors.neutral.textPrimary,
    borderWidth: 0.5,
    borderColor: Colors.neutral.border,
  },
  addBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: 'hidden',
  },
  addBtnDisabled: {
    opacity: 0.7,
  },
  addBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
