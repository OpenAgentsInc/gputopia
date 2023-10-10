import NextAuth, { DefaultSession } from 'next-auth'

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    access_token: string
    refresh_token: string
    user: {
      avatar: string
      user_id: string
      alby_id: string
      lightning_address: string
    } & DefaultSession['user']
  }
}
