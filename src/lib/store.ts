import { create } from "zustand"
import { AlbyUser } from "./useAlby"

type Store = {
  appends: { [key: string]: any };
  registerAppend: (id: string, appendFunction: any) => void;
  prompt: string;
  user: AlbyUser | null;
  onlineMembers: number;
  balance: number;
  payments: any[];
  totalSatsEarned: number;
  modelLoadPercentage: number;
  lastMessage: string;
  increment: () => void;
  decrement: () => void;
  modelLoaded: boolean;
  setCount: (count: number) => void;
  showWebgpuWarning: boolean;
  busyInferencing: boolean;
};

export const useStore = create<Store>((set) => ({
  appends: {},  // Store multiple append functions
  registerAppend: (id, appendFunction) => set((state) => ({
    appends: { ...state.appends, [id]: appendFunction }
  })),
  prompt: "",
  user: null,
  busyInferencing: false,
  modelLoaded: false,
  balance: 0,
  payments: [],
  onlineMembers: 0,
  totalSatsEarned: 0,
  modelLoadPercentage: 0,
  lastMessage: "",
  showWebgpuWarning: false,
  increment: () => set((state) => ({ onlineMembers: state.onlineMembers + 1 })),
  decrement: () => set((state) => ({ onlineMembers: state.onlineMembers - 1 })),
  setCount: (count) => set(() => ({ onlineMembers: count })),
}));
