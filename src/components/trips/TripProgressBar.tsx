import { View, Text } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { useEffect } from 'react';
import { differenceInDays, parseISO } from 'date-fns';

interface Props { startDate: string; endDate: string; status: string; }

export function TripProgressBar({ startDate, endDate, status }: Props) {
  const progress = useSharedValue(0);

  const totalDays = differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
  const currentDay = Math.min(
    Math.max(differenceInDays(new Date(), parseISO(startDate)) + 1, 1),
    totalDays
  );
  const pct = status === 'completed' ? 100 : Math.round((currentDay / totalDays) * 100);

  const getMilestoneLabel = () => {
    if (status === 'completed') return 'Journey complete ✓';
    if (currentDay === 1) return 'Day 1 — Your journey begins!';
    if (currentDay === totalDays) return `Last day — enjoy every moment 🌅`;
    if (pct >= 50 && pct < 60) return 'Over halfway through your journey!';
    return `Day ${currentDay} of ${totalDays}`;
  };

  useEffect(() => {
    progress.value = withTiming(pct / 100, { duration: 800 });
  }, [pct]);

  const animStyle = useAnimatedStyle(() => ({ 
    flex: progress.value === 0 ? 0.001 : progress.value // Avoid flex 0 issues
  }));

  return (
    <View className="gap-1.5 px-4 mb-4">
      <View className="h-1 bg-gray-100 rounded-full overflow-hidden flex-row">
        <Animated.View
          style={animStyle}
          className={`h-full rounded-full ${status === 'completed' ? 'bg-gray-400' : 'bg-teal-500'}`}
        />
        <View style={{ flex: 1 - pct/100 }} />
      </View>
      <Text className={`text-xs font-medium ${status === 'completed' ? 'text-gray-400' : 'text-teal-700'}`}>
        {getMilestoneLabel()}
      </Text>
    </View>
  );
}
