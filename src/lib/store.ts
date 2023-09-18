import { create } from "zustand"
import { AlbyUser } from "./useAlby"

type Store = {
  user: AlbyUser | null;
  onlineMembers: number;
  totalSatsEarned: number;
  increment: () => void;
  decrement: () => void;
  setCount: (count: number) => void;
};

export const useStore = create<Store>((set) => ({
  user: null,
  onlineMembers: 0,
  totalSatsEarned: 0,
  increment: () => set((state) => ({ onlineMembers: state.onlineMembers + 1 })),
  decrement: () => set((state) => ({ onlineMembers: state.onlineMembers - 1 })),
  setCount: (count) => set(() => ({ onlineMembers: count })),
}));
