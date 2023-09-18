import { create } from "zustand"

type Store = {
  onlineMembers: number;
  totalSatsEarned: number;
  increment: () => void;
  decrement: () => void;
  setCount: (count: number) => void;
};

export const useStore = create<Store>((set) => ({
  onlineMembers: 0,
  totalSatsEarned: 0,
  increment: () => set((state) => ({ onlineMembers: state.onlineMembers + 1 })),
  decrement: () => set((state) => ({ onlineMembers: state.onlineMembers - 1 })),
  setCount: (count) => set(() => ({ onlineMembers: count })),
}));
