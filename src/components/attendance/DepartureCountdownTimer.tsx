import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, { useSharedValue, withRepeat, withSequence, withTiming, useAnimatedStyle } from 'react-native-reanimated';
import { differenceInSeconds } from 'date-fns';

interface Props { departureISO: string | null; }

export function DepartureCountdownTimer({ departureISO }: Props) {
  const [secsLeft, setSecsLeft] = useState(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    if (!departureISO) return;
    const tick = () => {
      const s = differenceInSeconds(new Date(departureISO), new Date());
      setSecsLeft(s);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [departureISO]);

  useEffect(() => {
    if (secsLeft <= 0 || secsLeft > 1800) { 
      opacity.value = withTiming(1, { duration: 300 });
      return; 
    }
    const speed = secsLeft <= 900 ? 400 : 800;
    opacity.value = withRepeat(withSequence(
      withTiming(0.4, { duration: speed }),
      withTiming(1, { duration: speed })
    ), -1, true);
  }, [secsLeft]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!departureISO) return null;

  const mins = Math.floor(Math.abs(secsLeft) / 60);
  const secs = Math.abs(secsLeft) % 60;
  const timeStr = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  if (secsLeft <= 0) {
    return (
      <View className="bg-gray-50 border border-gray-200 rounded-xl p-4 items-center my-2">
        <Text className="text-gray-500 text-sm">Bus has departed — contact your organiser if you are missing</Text>
      </View>
    );
  }

  const isUrgent = secsLeft <= 900;
  const isWarning = secsLeft <= 1800;

  return (
    <Animated.View style={animStyle}
      className={`rounded-xl p-4 items-center border my-2
        ${isUrgent ? 'bg-red-50 border-red-300' : isWarning ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}
    >
      <Text className={`text-3xl font-bold tracking-wider
        ${isUrgent ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-green-600'}`}>
        {isUrgent ? '⚠️ ' : ''}{timeStr}
      </Text>
      <Text className={`text-xs mt-1 font-medium
        ${isUrgent ? 'text-red-500' : isWarning ? 'text-amber-500' : 'text-green-500'}`}>
        {isUrgent ? 'Board now!' : isWarning ? 'Bus departs soon — hurry up!' : 'Bus departs in'}
      </Text>
    </Animated.View>
  );
}
