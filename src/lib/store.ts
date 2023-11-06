import { create } from 'zustand'
import { AlbyUser } from './useAlby'
import { Chat } from './types'

type Store = {
  user: AlbyUser | null
  onlineMembers: number
  balance: number
  balanceUsd: number
  chats: Chat[]
  payments: any[]
  totalSatsEarned: number
  modelLoadPercentage: number
  lastMessage: string
  increment: () => void
  decrement: () => void
  modelLoaded: boolean
  setCount: (count: number) => void
  addChat: (chat: Chat) => void
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
  chats: [],
  payments: [],
  onlineMembers: 0,
  totalSatsEarned: 0,
  modelLoadPercentage: 0,
  lastMessage: '',
  showWebgpuWarning: false,
  increment: () => set(state => ({ onlineMembers: state.onlineMembers + 1 })),
  decrement: () => set(state => ({ onlineMembers: state.onlineMembers - 1 })),
  setCount: count => set(() => ({ onlineMembers: count })),
  addChat: (chat: Chat) => {
    set(state => ({
      chats: [{ ...chat }, ...state.chats]
    }))
  },
  paymentMethods: []
}))
