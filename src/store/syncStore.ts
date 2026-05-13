import { create } from "zustand";

interface SyncStore {
  isOnline: boolean;
  pendingCount: number;
  lastSyncedAt: Date | null;
  setOnline: (v: boolean) => void;
  setPendingCount: (n: number) => void;
  setLastSynced: () => void;
}

export const useSyncStore = create<SyncStore>((set) => ({
  isOnline: true,
  pendingCount: 0,
  lastSyncedAt: null,
  setOnline: (isOnline) => set({ isOnline }),
  setPendingCount: (pendingCount) => set({ pendingCount }),
  setLastSynced: () => set({ lastSyncedAt: new Date() }),
}));
