import { create } from "zustand"
import { AlbyUser } from "./useAlby"

type Store = {
  user: AlbyUser | null;
  onlineMembers: number;
  balance: number;
  payments: any[];
  totalSatsEarned: number;
  modelLoadPercentage: number;
  lastMessage: string;
  increment: () => void;
  decrement: () => void;
  setCount: (count: number) => void;
};

export const useStore = create<Store>((set) => ({
  user: null,
  balance: 0,
  payments: [],
  onlineMembers: 0,
  totalSatsEarned: 0,
  modelLoadPercentage: 0,
  lastMessage: "",
  increment: () => set((state) => ({ onlineMembers: state.onlineMembers + 1 })),
  decrement: () => set((state) => ({ onlineMembers: state.onlineMembers - 1 })),
  setCount: (count) => set(() => ({ onlineMembers: count })),
}));
