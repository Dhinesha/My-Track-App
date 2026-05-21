import React from 'react';
import {
  View, Text, TouchableOpacity,
  Linking, Alert, StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { fonts } from '@/constants/theme';
import type { FamilyMember, AttendanceStatus } from '@/types/attendance';

interface Props {
  member: FamilyMember;
  isSelected: boolean;
  onToggle: (paxId: string) => void;
  onStatusChange: (paxId: string, status: AttendanceStatus) => void;
  transportType: 'bus' | 'flight' | 'train' | 'cab';
}

const STATUS_CONFIG = {
  'Checked In': {
    bg: '#E8F5EE',
    text: '#1A7A55',
    icon: 'checkmark-circle' as const,
    label: 'Boarded',
  },
  'Not Boarded': {
    bg: '#F4F5F7',
    text: '#888888',
    icon: 'ellipse-outline' as const,
    label: 'Not boarded',
  },
  'Gone / Missing': {
    bg: '#FEF0F0',
    text: '#E53935',
    icon: 'warning-outline' as const,
    label: 'Missing',
  },
  Absent: {
    bg: '#F4F5F7',
    text: '#AAAAAA',
    icon: 'close-circle-outline' as const,
    label: 'Absent',
  },
};

const SEAT_LABEL: Record<string, string> = {
  bus: 'Seat',
  flight: 'Seat',
  train: 'Berth',
  cab: 'Seat',
};

export function FamilyMemberRow({
  member,
  isSelected,
  onToggle,
  onStatusChange,
  transportType,
}: Props) {
  const statusCfg = STATUS_CONFIG[member.attendanceStatus];
  const seatLabel = SEAT_LABEL[transportType];
  const seatValue =
    transportType === 'train'
      ? member.berthNumber ?? member.seatNumber
      : member.seatNumber;

  const handleCall = () => {
    if (!member.phone) return;
    Linking.openURL(`tel:${member.phone}`);
  };

  const handleLongPress = () => {
    Alert.alert(
      member.name,
      'Update attendance status',
      [
        {
          text: '✓ Mark as Boarded',
          onPress: () => onStatusChange(member.paxId, 'Checked In'),
        },
        {
          text: '⚠️ Mark as Gone / Missing',
          onPress: () => onStatusChange(member.paxId, 'Gone / Missing'),
        },
        {
          text: '✕ Mark as Absent',
          onPress: () => onStatusChange(member.paxId, 'Absent'),
          style: 'destructive',
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const isPrimary = member.role === 'PRIMARY';
  const isCheckedIn = member.attendanceStatus === 'Checked In';
  const needsCall =
    member.attendanceStatus === 'Not Boarded' && member.phone;

  return (
    <TouchableOpacity
      onLongPress={handleLongPress}
      activeOpacity={0.85}
      style={[
        styles.row,
        isPrimary && styles.primaryRow,
        isCheckedIn && styles.checkedRow,
      ]}
    >
      {/* CHECKBOX — tap to toggle */}
      <TouchableOpacity
        onPress={() => onToggle(member.paxId)}
        style={[
          styles.checkbox,
          isSelected && styles.checkboxSelected,
          isCheckedIn && styles.checkboxDone,
        ]}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        {(isSelected || isCheckedIn) && (
          <Ionicons
            name="checkmark"
            size={14}
            color="#FFFFFF"
          />
        )}
      </TouchableOpacity>

      {/* AVATAR */}
      <View style={[
        styles.avatar,
        { backgroundColor: isPrimary ? '#0F6E56' : '#2A7FD4' },
      ]}>
        <Text style={styles.avatarText}>
          {member.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* MEMBER INFO */}
      <View style={styles.info}>
        {/* Name + PRIMARY badge */}
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>
            {member.name}
          </Text>
          {isPrimary && (
            <View style={styles.primaryBadge}>
              <Text style={styles.primaryBadgeText}>PRIMARY</Text>
            </View>
          )}
        </View>

        {/* Seat / Berth + PNR */}
        <View style={styles.detailRow}>
          {seatValue ? (
            <View style={styles.seatChip}>
              <Text style={styles.seatChipText}>
                {seatLabel} {seatValue}
              </Text>
            </View>
          ) : null}
          {member.pnrNumber && (
            <Text style={styles.pnrText}>
              PNR: {member.pnrNumber.slice(-4)}
            </Text>
          )}
        </View>
      </View>

      {/* RIGHT SIDE — status + call */}
      <View style={styles.rightSide}>
        {/* Status chip */}
        <View style={[
          styles.statusChip,
          { backgroundColor: statusCfg.bg },
        ]}>
          <Ionicons
            name={statusCfg.icon}
            size={12}
            color={statusCfg.text}
          />
          <Text style={[styles.statusText, { color: statusCfg.text }]}>
            {statusCfg.label}
          </Text>
        </View>

        {/* Call button — only if not arrived */}
        {needsCall && (
          <TouchableOpacity
            onPress={handleCall}
            style={styles.callBtn}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Ionicons name="call" size={14} color="#0F6E56" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    gap: 10,
    borderWidth: 0.5,
    borderColor: '#E8E8E8',
  },
  primaryRow: {
    borderLeftWidth: 3,
    borderLeftColor: '#0F6E56',
  },
  checkedRow: {
    backgroundColor: '#F9FFFE',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#CCCCCC',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  checkboxSelected: {
    backgroundColor: '#0F6E56',
    borderColor: '#0F6E56',
  },
  checkboxDone: {
    backgroundColor: '#1D9E75',
    borderColor: '#1D9E75',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  avatarText: {
    fontFamily: fonts.bold,
    fontSize: 14,
    color: '#FFFFFF',
  },
  info: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
  },
  name: {
    fontFamily: fonts.semiBold,
    fontSize: 14,
    color: '#111111',
    flexShrink: 1,
  },
  primaryBadge: {
    backgroundColor: '#E1F5EE',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  primaryBadgeText: {
    fontFamily: fonts.bold,
    fontSize: 9,
    color: '#0F6E56',
    letterSpacing: 0.5,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  seatChip: {
    backgroundColor: '#E1F5EE',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  seatChipText: {
    fontFamily: fonts.semiBold,
    fontSize: 11,
    color: '#0F6E56',
  },
  pnrText: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: '#888888',
  },
  rightSide: {
    alignItems: 'flex-end',
    gap: 6,
    flexShrink: 0,
  },
  statusChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  statusText: {
    fontFamily: fonts.semiBold,
    fontSize: 10,
  },
  callBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E1F5EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
