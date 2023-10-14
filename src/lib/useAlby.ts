import axios, { AxiosError } from 'axios'
import { SetStateAction, useEffect, useState } from 'react'
import { useStore } from './store'
import { useSession } from 'next-auth/react'
import { Session } from 'next-auth'

export interface AlbyUser {
  avatar: string | null
  email: string
  identifier: string
  keysend_custom_key: string
  keysend_custom_value: string
  keysend_pubkey: string
  lightning_address: string
  name: string | null
}

export function useAlby() {
  const { data: session } = useSession()
  const [user, setUser] = useState<AlbyUser | null>(null)

  const logout = () => {
    setUser(null)
    useStore.setState({ user: null })
  }

  // Grab user data from Alby
  useEffect(() => {
    if (session) {
      fetchUserData(session, setUser, logout)
    }
  }, [session])

  return { logout, user }
}

function fetchUserData(session: Session, setUser: any, logout: any) {
  fetch('https://api.getalby.com/user/me', {
    headers: {
      Authorization: `Bearer ${session.access_token}`
    }
  })
    .then(res => res.json())
    .then(res => {
      setUser(res)
      useStore.setState({ user: res })
    })
    .catch(err => {
      logout()
      console.error(err)
    })
}
