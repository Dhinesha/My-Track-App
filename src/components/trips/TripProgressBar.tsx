import { View, Text } from 'react-native';
import { fonts, textStyles } from '../../constants/theme';
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
    if (status === 'completed') return 'Journey successfully completed';
    if (currentDay === 1) return 'Day 1 — Your journey begins';
    if (currentDay === totalDays) return `Final day of journey`;
    if (pct >= 50 && pct < 60) return 'Over halfway through your journey';
    return `Day ${currentDay} of ${totalDays}`;
  };

  useEffect(() => {
    progress.value = withTiming(pct / 100, { duration: 1000 });
  }, [pct]);

  const animStyle = useAnimatedStyle(() => ({ 
    width: `${progress.value * 100}%` 
  }));

  return (
    <View className="gap-2">
      <View className="h-1.5 bg-white/20 rounded-full overflow-hidden">
        <Animated.View
          style={animStyle}
          className={`h-full rounded-full ${status === 'completed' ? 'bg-emerald-400' : 'bg-[#0EA5E9]'}`}
        />
      </View>
      <Text className="text-white/60 text-[10px] font-jakarta-bold uppercase tracking-widest">
        {getMilestoneLabel()}
      </Text>
    </View>
  );
}
