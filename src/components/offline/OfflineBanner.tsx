import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";
import { useOffline } from "../../hooks/useOffline";
import { useSyncStore } from "../../store/syncStore";

export function OfflineBanner() {
  const { setOnline } = useSyncStore();
  const isOffline = useOffline();
  const [status, setStatus] = useState<"online" | "offline" | "reconnected">(
    "online",
  );
  const slideAnim = useRef(new Animated.Value(-60)).current;

  const showBanner = () => {
    Animated.spring(slideAnim, {
      toValue: 0,
      useNativeDriver: true,
      tension: 40,
      friction: 7,
    }).start();
  };
  const hideBanner = () => {
    Animated.spring(slideAnim, {
      toValue: -60,
      useNativeDriver: true,
    }).start();
  };

  useEffect(() => {
    setOnline(!isOffline);
    if (isOffline) {
      setStatus("offline");
      showBanner();
    } else if (status === "offline") {
      setStatus("reconnected");
      showBanner();
      const timer = setTimeout(() => {
        hideBanner();
        const resetTimer = setTimeout(() => setStatus("online"), 400);
        return () => clearTimeout(resetTimer);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOffline]);

  if (status === "online") return null;

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 10,
      }}
      className={`absolute top-0 left-0 right-0 z-[100] h-14 items-center justify-center pt-4
        ${status === "offline" ? "bg-amber-500" : "bg-emerald-600"}`}
    >
      <View className="flex-row items-center space-x-2">
        <Text className="text-white text-xs font-bold uppercase tracking-wider">
          {status === "offline"
            ? "⚠️ Offline Mode — Changes will sync later"
            : "✅ Back Online — Syncing Trip Data"}
        </Text>
      </View>
    </Animated.View>
  );
}

