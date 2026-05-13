import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePowerSync } from '@powersync/react-native';
import { useTripStore } from '../../store/tripStore';
import { differenceInDays, parseISO, differenceInHours } from 'date-fns';

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
      
      const rows = await db.getAll(`SELECT start_date, destination FROM trips WHERE id=?`, [activeTripId]);
      const trip = rows[0];
      if (!trip) return;
      
      const dayNum = differenceInDays(new Date(), parseISO(trip.start_date)) + 1;
      const actRows = await db.getAll(
        `SELECT city FROM itinerary WHERE trip_id=? AND day=? AND city IS NOT NULL LIMIT 1`,
        [activeTripId, dayNum]
      );
      const targetCity = actRows[0]?.city ?? trip.destination;
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

      if (!OWM_KEY) {
          console.warn("EXPO_PUBLIC_OWM_KEY is not set");
          return;
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

  if (!weather) return null;

  const code = weather.weather?.[0]?.id ?? 800;
  const temp = Math.round(weather.main?.temp ?? 0);
  const desc = weather.weather?.[0]?.description ?? '';
  const rain = Math.round((weather.pop ?? 0) * 100);
  const hoursOld = lastUpdated ? differenceInHours(new Date(), lastUpdated) : 0;

  return (
    <TouchableOpacity onPress={() => setExpanded(!expanded)}
      className="bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 mx-4 my-2">
      <View className="flex-row items-center gap-3">
        <Text className="text-3xl">{getWeatherEmoji(code)}</Text>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-sky-900">{temp}°C · {desc}</Text>
          <Text className="text-xs text-sky-600">{city} · 🌧 {rain}% · {hoursOld > 0 ? `Updated ${hoursOld}h ago` : 'Just updated'}</Text>
        </View>
        <Text className="text-sky-400 text-xs">{expanded ? '▲' : '▼'}</Text>
      </View>
      {expanded && (
        <View className="mt-3 pt-3 border-t border-sky-200">
          <Text className="text-xs text-sky-600 text-center">Humidity: {weather.main?.humidity}% · Wind: {Math.round(weather.wind?.speed ?? 0)} km/h · Feels like {Math.round(weather.main?.feels_like ?? temp)}°C</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
