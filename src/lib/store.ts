import { create } from 'zustand'
import { AlbyUser } from './useAlby'

type Store = {
  user: AlbyUser | null
  onlineMembers: number
  balance: number
  balanceUsd: number
  payments: any[]
  totalSatsEarned: number
  modelLoadPercentage: number
  lastMessage: string
  increment: () => void
  decrement: () => void
  modelLoaded: boolean
  setCount: (count: number) => void
  showWebgpuWarning: boolean
  busyInferencing: boolean
  paymentMethods: any[]
}

export const useStore = create<Store>(set => ({
  user: null,
  busyInferencing: false,
  modelLoaded: false,
  balance: 0,
  balanceUsd: 0,
  payments: [],
  onlineMembers: 0,
  totalSatsEarned: 0,
  modelLoadPercentage: 0,
  lastMessage: '',
  showWebgpuWarning: false,
  increment: () => set(state => ({ onlineMembers: state.onlineMembers + 1 })),
  decrement: () => set(state => ({ onlineMembers: state.onlineMembers - 1 })),
  setCount: count => set(() => ({ onlineMembers: count })),
  paymentMethods: []
}))
