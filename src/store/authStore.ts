import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

interface User {
  id: string;
  name: string;
  mobile: string;
  role: "traveler" | "admin";
}

interface AuthStore {
  user: User | null;
  session: string | null;
  fcmToken: string | null;
  emergencyContact: string | null;
  emergencyContactName: string | null;
  setUser: (user: User) => void;
  setSession: (token: string) => void;
  setFcmToken: (token: string) => void;
  clearAuth: () => void;
  loadPersistedAuth: () => Promise<void>;
}

// Web storage fallback for localStorage
const webStorage = {
  getItem: (key: string) => {
    if (typeof window !== "undefined") {
      return Promise.resolve(localStorage.getItem(key));
    }
    return Promise.resolve(null);
  },
  setItem: (key: string, value: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, value);
    }
    return Promise.resolve();
  },
  removeItem: (key: string) => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(key);
    }
    return Promise.resolve();
  },
};

const storage = Platform.OS === "web" ? webStorage : AsyncStorage;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  session: null,
  fcmToken: null,
  emergencyContact: null,
  emergencyContactName: null,
  setUser: (user) => {
    set({ user });
    storage.setItem("auth_user", JSON.stringify(user));
  },
  setSession: (session) => {
    set({ session });
    storage.setItem("auth_session", session);
  },
  setFcmToken: (fcmToken) => {
    set({ fcmToken });
    storage.setItem("auth_fcm_token", fcmToken);
  },
  clearAuth: () => {
    set({
      user: null,
      session: null,
      fcmToken: null,
      emergencyContact: null,
      emergencyContactName: null,
    });
    storage.removeItem("auth_user");
    storage.removeItem("auth_session");
    storage.removeItem("auth_fcm_token");
  },
  loadPersistedAuth: async () => {
    try {
      const storedUser = await storage.getItem("auth_user");
      if (storedUser) {
        set({ user: JSON.parse(storedUser) });
      }
    } catch (e) {
      console.error("Failed to load persisted auth:", e);
    }
  },
}));

// Initialize auth store from storage
if (Platform.OS === "web" && typeof window !== "undefined") {
  const storedUser = localStorage.getItem("auth_user");
  if (storedUser) {
    try {
      useAuthStore.setState({ user: JSON.parse(storedUser) });
    } catch (e) {
      console.error("Failed to parse stored user:", e);
    }
  }
}
