// useNotifications.ts
import { create } from "zustand";
import { Notification } from "@/types/item";

type NotiState = {
  notifications: Notification[];
  addNotification: (msg: string, icon?: React.ReactNode) => void;
  clearNotifications: () => void;
};

export const useNoti = create<NotiState>((set) => ({
  notifications: [],
  addNotification: (msg, icon) =>
    set((state) => ({
      notifications: [
        {
          id: crypto.randomUUID(),
          message: msg,
          icon,
          createdAt: new Date(),
        },
        ...state.notifications,
      ],
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
