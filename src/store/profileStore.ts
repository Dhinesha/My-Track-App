import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

export interface ProfileState {
  name: string;
  email: string;
  photo: string;
  primaryContact: string;
  secondaryContact: string;
}

interface ProfileStore extends ProfileState {
  updateProfile: (fields: Partial<ProfileState>) => void;
  loadProfile: () => Promise<void>;
}

const DEFAULT_PROFILE: ProfileState = {
  name: "Robert Jenkins",
  email: "robert.jenkins@example.com",
  photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  primaryContact: "+91 98765 43210",
  secondaryContact: "+91 98765 43211",
};

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
};

const storage = Platform.OS === "web" ? webStorage : AsyncStorage;

export const useProfileStore = create<ProfileStore>((set) => ({
  ...DEFAULT_PROFILE,
  updateProfile: (fields) => {
    set((state) => {
      const updated = { ...state, ...fields };
      // Save it asynchronously
      const toSave = {
        name: updated.name,
        email: updated.email,
        photo: updated.photo,
        primaryContact: updated.primaryContact,
        secondaryContact: updated.secondaryContact,
      };
      storage.setItem("user_profile_details", JSON.stringify(toSave));
      return toSave;
    });
  },
  loadProfile: async () => {
    try {
      const stored = await storage.getItem("user_profile_details");
      if (stored) {
        set(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load persisted profile:", e);
    }
  },
}));

// Pre-load persisted profile on startup for web
if (typeof window !== "undefined" && Platform.OS === "web") {
  const stored = localStorage.getItem("user_profile_details");
  if (stored) {
    try {
      useProfileStore.setState(JSON.parse(stored));
    } catch (e) {
      console.error("Failed to parse stored profile:", e);
    }
  }
}
