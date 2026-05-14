import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { differenceInDays, differenceInHours, parseISO, format } from 'date-fns';

interface Props {
  startDate: string; 
  endDate: string;
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
    return (
      <View className="flex-row items-center gap-1.5">
        <View className="w-2 h-2 rounded-full bg-slate-300" />
        <Text className="text-[11px] font-jakarta-bold text-slate-400 uppercase tracking-wider">
          Completed {daysAgo} day{daysAgo !== 1 ? 's' : ''} ago
        </Text>
      </View>
    );
  }

  if (status === 'ongoing') {
    const totalDays = differenceInDays(end, start) + 1;
    const currentDay = Math.min(Math.max(differenceInDays(now, start) + 1, 1), totalDays);
    return (
      <View className="flex-row items-center gap-1.5">
        <View className="w-2 h-2 rounded-full bg-emerald-500" />
        <Text className="text-[11px] font-jakarta-bold text-emerald-600 uppercase tracking-wider">
          Day {currentDay} of {totalDays} — Underway
        </Text>
      </View>
    );
  }

  // Upcoming
  const daysLeft = differenceInDays(start, now);
  const hoursLeft = differenceInHours(start, now);

  if (hoursLeft < 48) {
    const timeStr = format(start, 'h:mm a');
    const dayLabel = daysLeft === 0 ? 'Today' : 'Tomorrow';
    return (
      <View className="flex-row items-center gap-1.5">
        <View className="w-2 h-2 rounded-full bg-[#0EA5E9]" />
        <Text className="text-[11px] font-jakarta-bold text-[#0EA5E9] uppercase tracking-wider">
          {dayLabel} at {timeStr} — Get ready! 🎒
        </Text>
      </View>
    );
  }

  if (daysLeft <= 7) {
    return (
      <View className="flex-row items-center gap-1.5">
        <View className="w-2 h-2 rounded-full bg-amber-500" />
        <Text className="text-[11px] font-jakarta-bold text-amber-600 uppercase tracking-wider">
          {daysLeft} days to go 🚀
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-1.5">
      <View className="w-2 h-2 rounded-full bg-blue-400" />
      <Text className="text-[11px] font-jakarta-bold text-blue-500 uppercase tracking-wider">
        {daysLeft} days to go
      </Text>
    </View>
  );
}
