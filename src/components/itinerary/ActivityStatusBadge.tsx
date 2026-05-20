import { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';

interface Props {
  status: 'upcoming' | 'in_progress' | 'delayed' | 'completed';
  updatedTime?: string;
}

export function ActivityStatusBadge({ status, updatedTime }: Props) {
  const pulse = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (status !== 'in_progress') return;
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 0.3, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [status]);

  if (status === 'upcoming') return null;

  const cfg = {
    in_progress: { bg: '#EFF6FF', border: '#BFDBFE', text: '#1D4ED8', label: 'In Progress', dot: '#3B82F6' },
    delayed: { bg: '#FEF2F2', border: '#FECACA', text: '#B91C1C', label: `Delayed · ${updatedTime ?? ''}`, dot: '#EF4444' },
    completed: { bg: '#F9FAFB', border: '#E5E7EB', text: '#6B7280', label: 'Completed', dot: '#9CA3AF' },
  }[status];

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: cfg.bg, borderColor: cfg.border },
      ]}
    >
      {status === "in_progress" ? (
        <Animated.View
          style={[styles.dot, { backgroundColor: cfg.dot, opacity: pulse }]}
        />
      ) : (
        <View style={[styles.dot, { backgroundColor: cfg.dot }]} />
      )}
      <Text style={[styles.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  text: {
    fontSize: 12,
    fontFamily: "PlusJakartaSans-Medium",
  },
});
