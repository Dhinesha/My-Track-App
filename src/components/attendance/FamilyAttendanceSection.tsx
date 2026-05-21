import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity,
  ActivityIndicator, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FamilyMemberRow } from './FamilyMemberRow';
import { useFamilyAttendance } from '@/hooks/useFamilyAttendance';
import { fonts } from '@/constants/theme';

interface Props {
  vehicleId: string;
  transportType: 'bus' | 'flight' | 'train' | 'cab';
}

export function FamilyAttendanceSection({
  vehicleId,
  transportType,
}: Props) {
  const {
    primaryMembers,
    secondaryMembers,
    familyMembers,
    selectedIds,
    loading,
    checkedCount,
    totalCount,
    toggleSelect,
    selectAll,
    deselectAll,
    checkInSelected,
    updateMemberStatus,
  } = useFamilyAttendance(vehicleId);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const allSelected = selectedIds.size === familyMembers.length;
  const noneSelected = selectedIds.size === 0;

  const handleSubmit = async () => {
    setSubmitting(true);
    await checkInSelected();
    setSubmitting(false);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const BOARD_LABEL: Record<string, string> = {
    bus: 'Board Bus',
    flight: 'Confirm at Gate',
    train: 'Board Train',
    cab: 'Confirm Pickup',
  };

  if (loading) {
    return (
      <View style={styles.loadingBox}>
        <ActivityIndicator color="#0F6E56" />
      </View>
    );
  }

  if (familyMembers.length === 0) {
    return (
      <View style={styles.emptyBox}>
        <Text style={styles.emptyText}>
          No family members on this vehicle.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* HEADER */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.sectionTitle}>Family Members</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {checkedCount}/{totalCount}
            </Text>
          </View>
        </View>
        {/* Select All / Deselect All */}
        <TouchableOpacity
          onPress={allSelected ? deselectAll : selectAll}
          style={styles.selectAllBtn}
        >
          <Text style={styles.selectAllText}>
            {allSelected ? 'Deselect All' : 'Select All'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* INSTRUCTION */}
      <View style={styles.instructionBox}>
        <Ionicons name="information-circle-outline"
          size={14} color="#2A7FD4" />
        <Text style={styles.instructionText}>
          All members selected by default.
          Uncheck absent members before confirming.
        </Text>
      </View>

      {/* PRIMARY MEMBERS — Father, Mother first */}
      {primaryMembers.length > 0 && (
        <View style={styles.group}>
          <Text style={styles.groupLabel}>
            PRIMARY MEMBERS
          </Text>
          <View style={styles.memberList}>
            {primaryMembers.map((m) => (
              <FamilyMemberRow
                key={m.paxId}
                member={m}
                isSelected={selectedIds.has(m.paxId)}
                onToggle={toggleSelect}
                onStatusChange={updateMemberStatus}
                transportType={transportType}
              />
            ))}
          </View>
        </View>
      )}

      {/* SECONDARY MEMBERS */}
      {secondaryMembers.length > 0 && (
        <View style={styles.group}>
          <Text style={styles.groupLabel}>
            OTHER MEMBERS
          </Text>
          <View style={styles.memberList}>
            {secondaryMembers.map((m) => (
              <FamilyMemberRow
                key={m.paxId}
                member={m}
                isSelected={selectedIds.has(m.paxId)}
                onToggle={toggleSelect}
                onStatusChange={updateMemberStatus}
                transportType={transportType}
              />
            ))}
          </View>
        </View>
      )}

      {/* SELECTED COUNT BAR */}
      <View style={styles.selectedBar}>
        <Text style={styles.selectedBarText}>
          {selectedIds.size} of {totalCount} members selected
        </Text>
        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[
            styles.progressFill,
            {
              width: totalCount > 0
                ? `${(selectedIds.size / totalCount) * 100}%`
                : '0%'
            },
          ]} />
        </View>
      </View>

      {/* SUBMIT BUTTON */}
      {submitted ? (
        <View style={styles.successCard}>
          <Ionicons
            name="checkmark-circle"
            size={24}
            color="#1D9E75"
          />
          <Text style={styles.successText}>
            Attendance recorded for {selectedIds.size} members ✓
          </Text>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={submitting || noneSelected}
          style={[
            styles.submitBtn,
            (submitting || noneSelected) && styles.submitBtnDisabled,
          ]}
        >
          {submitting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.submitBtnText}>
                {BOARD_LABEL[transportType]} —{' '}
                {selectedIds.size} Members
              </Text>
            </>
          )}
        </TouchableOpacity>
      )}

      {/* LONG PRESS HINT */}
      <Text style={styles.hint}>
        Long press any member to change their status
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  loadingBox: {
    padding: 32,
    alignItems: 'center',
  },
  emptyBox: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F4F5F7',
    borderRadius: 14,
  },
  emptyText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: '#888888',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: '#111111',
  },
  countBadge: {
    backgroundColor: '#0F6E56',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  selectAllBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0F6E56',
  },
  selectAllText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: '#0F6E56',
  },
  instructionBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: '#EBF3FC',
    borderRadius: 10,
    padding: 10,
  },
  instructionText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: '#1A5FA0',
    flex: 1,
    lineHeight: 18,
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    color: '#888888',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginLeft: 4,
  },
  memberList: {
    gap: 8,
  },
  selectedBar: {
    gap: 6,
    backgroundColor: '#F4F5F7',
    borderRadius: 12,
    padding: 12,
  },
  selectedBarText: {
    fontFamily: fonts.semiBold,
    fontSize: 13,
    color: '#333333',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#0F6E56',
    borderRadius: 3,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#0F6E56',
    borderRadius: 14,
    height: 56,
  },
  submitBtnDisabled: {
    backgroundColor: '#AAAAAA',
  },
  submitBtnText: {
    fontFamily: fonts.semiBold,
    fontSize: 16,
    color: '#FFFFFF',
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E8F5EE',
    borderRadius: 14,
    padding: 16,
  },
  successText: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#1A7A55',
    flex: 1,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#AAAAAA',
    textAlign: 'center',
  },
});
