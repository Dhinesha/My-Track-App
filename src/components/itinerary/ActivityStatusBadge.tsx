import { useEffect, useRef } from 'react';
import { View, Text, Animated } from 'react-native';

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
    in_progress: { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', label: 'In Progress', dot: 'bg-blue-500' },
    delayed: { bg: 'bg-red-50 border-red-200', text: 'text-red-700', label: `Delayed · ${updatedTime ?? ''}`, dot: 'bg-red-500' },
    completed: { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', label: 'Completed', dot: 'bg-gray-400' },
      border: "#E5E7EB",
      text: "#6B7280",
      label: "Completed",
      dot: "#9CA3AF",
    },
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
