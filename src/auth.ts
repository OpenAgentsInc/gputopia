import { fetchUserFromAlby } from '@/lib/alby'
import NextAuth, { type DefaultSession } from 'next-auth'

declare module 'next-auth' {
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

const AlbyProvider = {
  id: 'alby',
  name: 'Alby',
  type: 'oauth' as 'oauth',
  authorization: {
    url: 'https://getalby.com/oauth',
    params: { scope: 'account:read balance:read invoices:create invoices:read' }
  },
  token: 'https://api.getalby.com/oauth/token',
  userinfo: 'https://api.getalby.com/user/me',
  async profile(profile: any, tokens: any) {
    // You can use the tokens, in case you want to fetch more profile information
    // For example several OAuth providers do not return email by default.
    // Depending on your provider, will have tokens like `access_token`, `id_token` and or `refresh_token`
    console.log('PROFILE:', profile)
    return {
      id: profile.identifier,
      email: profile.email,
      name: profile.name,
      image: profile.avatar
    }
  },
  clientId: process.env.NEXT_PUBLIC_ALBY_CLIENT_ID as string,
  clientSecret: process.env.NEXT_PUBLIC_ALBY_CLIENT_SECRET as string
}

export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [AlbyProvider],
  callbacks: {
    async jwt({ token, account, profile, trigger }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        const serverUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
        await fetch(`${serverUrl}/api/save-token`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            token: account.access_token,
            refresh_token: account.refresh_token
          })
        })
          .then(response => response.json())
          .then(data => {
            console.log('Did what?', data)
            token.user_id = data.userId
          })

        await fetchUserFromAlby(account.access_token)
          .then(user => {
            token.alby_id = user?.alby_id
          })
          .catch(error => {
            console.log('Error in jwt callback', error)
          })

        token.avatar = profile.avatar
        token.access_token = account.access_token
        token.refresh_token = account.refresh_token
        token.lightning_address = profile.lightning_address
      }
      return token
    },
    async session({ session, token, user }) {
      if (token) {
        session.access_token = token.access_token
        session.refresh_token = token.refresh_token
        session.user.avatar = token.avatar
        session.user.user_id = token.user_id
        session.user.alby_id = token.alby_id
        session.user.lightning_address = token.lightning_address
      }

      return session
    }
  },
  session: {
    maxAge: 60 * 60 * 2
  },
  pages: {
    signIn: '/login'
  }
})
