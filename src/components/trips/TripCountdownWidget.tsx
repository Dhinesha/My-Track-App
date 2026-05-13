import { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { differenceInDays, differenceInHours, parseISO, format } from 'date-fns';

interface Props {
  startDate: string; endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed';
}

export function TripCountdownWidget({ startDate, endDate, status }: Props) {
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const t = setInterval(() => forceUpdate((n) => n + 1), 60_000);
    return () => clearInterval(t);
  }, []);

  const now = new Date();
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  if (status === 'completed') {
    const daysAgo = differenceInDays(now, end);
    return <Text className="text-xs text-gray-400">Completed {daysAgo} day{daysAgo !== 1 ? 's' : ''} ago</Text>;
  }

  if (status === 'ongoing') {
    const totalDays = differenceInDays(end, start) + 1;
    const currentDay = differenceInDays(now, start) + 1;
    return (
      <View className="flex-row items-center gap-1.5">
        <View className="w-2 h-2 rounded-full bg-green-500" />
        <Text className="text-xs font-semibold text-green-700">Day {currentDay} of {totalDays} — Underway</Text>
      </View>
    );
  }

  // Upcoming
  const daysLeft = differenceInDays(start, now);
  const hoursLeft = differenceInHours(start, now);

  if (hoursLeft < 48) {
    const timeStr = format(start, 'h:mm a');
    const dayLabel = daysLeft === 0 ? 'Today' : 'Tomorrow';
    return <Text className="text-xs font-bold text-teal-700">{dayLabel} at {timeStr} — Get ready!</Text>;
  }
  if (daysLeft <= 7) {
    return <Text className="text-xs font-medium text-amber-600">{daysLeft} days to go 🎒</Text>;
  }
  return <Text className="text-xs text-blue-600">{daysLeft} days to go</Text>;
}
