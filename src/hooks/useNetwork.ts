import { useState, useEffect, useCallback } from "react";
import NetInfo from "@react-native-community/netinfo";

/**
 * Custom hook for tracking network connectivity
 */
export const useNetwork = () => {
  const [isOnline, setIsOnline] = useState(true);
  const [isConnecting, setIsConnecting] = useState(false);
  const [type, setType] = useState<"wifi" | "cellular" | "none">("wifi");

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
      setIsConnecting(state.isInternetReachable ?? true);
      setType((state.type as any) || "none");
    });

    // Initial check
    NetInfo.fetch().then((state) => {
      setIsOnline(state.isConnected ?? true);
      setIsConnecting(state.isInternetReachable ?? true);
      setType((state.type as any) || "none");
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return {
    isOnline,
    isConnecting,
    type,
    isWifi: type === "wifi",
    isCellular: type === "cellular",
    isOffline: !isOnline,
  };
};
