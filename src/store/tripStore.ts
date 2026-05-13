import { create } from "zustand";
import { Platform } from "react-native";

interface TripStore {
  activeTripId: string | null;
  activeTripName: string;
  setActiveTrip: (id: string, name: string) => void;
  clearActiveTrip: () => void;
  loadPersistedTrip: () => Promise<void>;
}

// Initialize from localStorage
const getInitialState = () => {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    const stored = localStorage.getItem("trip-storage");
    if (stored) {
      try {
        const { activeTripId, activeTripName } = JSON.parse(stored);
        return { activeTripId, activeTripName };
      } catch (error) {
        console.error("Error loading persisted trip:", error);
      }
    }
  }
  return { activeTripId: null, activeTripName: "" };
};

const initialState = getInitialState();

export const useTripStore = create<TripStore>((set) => ({
  activeTripId: initialState.activeTripId,
  activeTripName: initialState.activeTripName,
  setActiveTrip: (activeTripId, activeTripName) => {
    set({ activeTripId, activeTripName });
    // Persist to localStorage on web
    if (Platform.OS === "web" && typeof window !== "undefined") {
      localStorage.setItem(
        "trip-storage",
        JSON.stringify({ activeTripId, activeTripName }),
      );
    }
  },
  clearActiveTrip: () => {
    set({ activeTripId: null, activeTripName: "" });
    if (Platform.OS === "web" && typeof window !== "undefined") {
      localStorage.removeItem("trip-storage");
    }
  },
  loadPersistedTrip: async () => {
    if (Platform.OS === "web" && typeof window !== "undefined") {
      const stored = localStorage.getItem("trip-storage");
      if (stored) {
        try {
          const { activeTripId, activeTripName } = JSON.parse(stored);
          set({ activeTripId, activeTripName });
        } catch (error) {
          console.error("Error loading persisted trip:", error);
        }
      }
    }
  },
}));
