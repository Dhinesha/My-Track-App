import React, { useEffect, useState } from 'react';
import { fonts, textStyles } from '../../constants/theme';
import { View, Text, TouchableOpacity, LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { differenceInDays, parseISO, differenceInHours } from 'date-fns';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const OWM_KEY = process.env.EXPO_PUBLIC_OWM_KEY;

const getWeatherEmoji = (code: number) => {
  if (code === 800) return '☀️';
  if (code >= 801 && code <= 802) return '⛅';
  if (code >= 803) return '☁️';
  if (code >= 500 && code < 600) return '🌧️';
  if (code >= 200 && code < 300) return '⛈️';
  if (code >= 600 && code < 700) return '❄️';
  if (code >= 700 && code < 800) return '🌫️';
  return '🌡️';
};

export function InTripWeatherWidget() {
  const [weather, setWeather] = useState<any>(null);
  const [expanded, setExpanded] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [city, setCity] = useState('');
  const db = usePowerSync();
  const { activeTripId } = useTripStore();

  useEffect(() => {
    (async () => {
      if (!activeTripId) return;

      const rows = await db.getAll(`SELECT start_date, destination FROM trips WHERE id=?`, [activeTripId]) as any[];
      const trip = rows[0];
      if (!trip) return;

      const dayNum = differenceInDays(new Date(), parseISO(trip.start_date)) + 1;
      const actRows = await db.getAll(
        `SELECT city FROM itinerary WHERE trip_id=? AND day=? AND city IS NOT NULL LIMIT 1`,
        [activeTripId, dayNum]
      ) as any[];
      const act = actRows[0];

      const targetCity = act?.city ?? trip.destination;
      if (!targetCity) return;
      setCity(targetCity);

      const cacheKey = `weather_${targetCity}`;
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        const { data, fetchedAt } = JSON.parse(cached);
        const hoursOld = differenceInHours(new Date(), new Date(fetchedAt));
        if (hoursOld < 3) { 
          setWeather(data); 
          setLastUpdated(new Date(fetchedAt)); 
          return; 
        }
      }

      try {
        const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${targetCity}&appid=${OWM_KEY}&units=metric`);
        const data = await res.json();
        if (data.cod === 200) {
          await AsyncStorage.setItem(cacheKey, JSON.stringify({ data, fetchedAt: new Date().toISOString() }));
          setWeather(data); 
          setLastUpdated(new Date());
        }
      } catch {
        if (cached) { 
          const { data, fetchedAt } = JSON.parse(cached); 
          setWeather(data); 
          setLastUpdated(new Date(fetchedAt)); 
        }
      }
    })();
  }, [activeTripId]);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  if (!weather) return null;

  const code = weather.weather?.[0]?.id ?? 800;
  const temp = Math.round(weather.main?.temp ?? 0);
  const desc = weather.weather?.[0]?.description ?? '';
  const rain = Math.round((weather.pop ?? 0) * 100);
  const humidity = weather.main?.humidity ?? 0;
  const wind = Math.round((weather.wind?.speed ?? 0) * 3.6); // convert m/s to km/h
  const feelsLike = Math.round(weather.main?.feels_like ?? temp);
  const hoursOld = lastUpdated ? differenceInHours(new Date(), lastUpdated) : 0;

  return (
    <TouchableOpacity 
      activeOpacity={0.9}
      onPress={toggleExpand}
      className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-[32px] px-6 py-5 shadow-sm"
    >
      <View className="flex-row items-center">
        <View className="w-14 h-14 bg-white rounded-full items-center justify-center shadow-sm">
          <Text className="text-3xl">{getWeatherEmoji(code)}</Text>
        </View>
        
        <View className="flex-1 ml-4">
          <View className="flex-row items-center gap-1.5 mb-0.5">
            <Text className="text-xl font-jakarta-extrabold text-[#0369A1]">{temp}°C</Text>
            <View className="bg-[#BAE6FD] w-1 h-1 rounded-full" />
            <Text className="text-sm font-jakarta-bold text-[#0369A1] capitalize">{desc}</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <Text className="text-[11px] font-jakarta-bold text-[#0EA5E9] uppercase tracking-wider">{city}</Text>
            <View className="bg-[#BAE6FD] w-1 h-1 rounded-full opacity-30" />
            <Text className="text-[11px] font-jakarta-medium text-[#7DD3FC]">
              {hoursOld > 0 ? `Updated ${hoursOld}h ago` : 'Just updated'}
            </Text>
          </View>
        </View>

        <View className="w-8 h-8 items-center justify-center">
          <Feather name={expanded ? "chevron-up" : "chevron-down"} size={20} color="#0EA5E9" />
        </View>
      </View>

      {expanded && (
        <View className="mt-5 pt-5 border-t border-[#BAE6FD]/50">
          <View className="flex-row justify-between items-center px-2">
            <View className="items-center">
              <MaterialCommunityIcons name="water-percent" size={20} color="#0EA5E9" />
              <Text className="text-[10px] font-jakarta-bold text-[#7DD3FC] mt-1 uppercase">Humidity</Text>
              <Text className="text-sm font-jakarta-extrabold text-[#0369A1]">{humidity}%</Text>
            </View>
            <View className="w-[1px] h-8 bg-[#BAE6FD]/50" />
            <View className="items-center">
              <Feather name="wind" size={18} color="#0EA5E9" />
              <Text className="text-[10px] font-jakarta-bold text-[#7DD3FC] mt-1 uppercase">Wind</Text>
              <Text className="text-sm font-jakarta-extrabold text-[#0369A1]">{wind} km/h</Text>
            </View>
            <View className="w-[1px] h-8 bg-[#BAE6FD]/50" />
            <View className="items-center">
              <MaterialCommunityIcons name="thermometer" size={20} color="#0EA5E9" />
              <Text className="text-[10px] font-jakarta-bold text-[#7DD3FC] mt-1 uppercase">Feels Like</Text>
              <Text className="text-sm font-jakarta-extrabold text-[#0369A1]">{feelsLike}°C</Text>
            </View>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
