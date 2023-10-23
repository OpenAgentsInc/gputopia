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

async function refreshAccessToken(refresh_token) {
  try {
    const response = await fetch(AlbyProvider.token, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${process.env.ALBY_CLIENT_ID}:${process.env.ALBY_CLIENT_SECRET}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token,
      }),
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
      };
    }
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return null;
  }
}


export const {
  handlers: { GET, POST },
  auth
} = NextAuth({
  providers: [AlbyProvider],
  callbacks: {
    // jwt({ token, account }) {
    //   if (account) {
    //     token.access_token = account.access_token
    //     token.refresh_token = account.refresh_token
    //   }
    //   // token.id = 1
    //   // token.user_id = 'testttt'
    //   // console.log('Returning jwt token:', token)
    //   // console.log('in jwt, account is', account)
    //   return token
    // },
    // authorized({ auth }) {
    //   console.log('auth:', auth)
    //   console.log('returnin', !!auth?.user)
    //   return !!auth?.user // this ensures there is a logged in user for -every- request
    // },
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

        token.expiry = Date.now() + (account.expires_in * 1000); // If 'expires_in' is in seconds
      }

      // Handle token expiration and refreshing
      if (token?.expiry && Date.now() > token.expiry) {
        const refreshedTokens = await refreshAccessToken(token.refresh_token);
        if (refreshedTokens) {
          token.access_token = refreshedTokens.accessToken;
          token.refresh_token = refreshedTokens.refreshToken; // Update this line
          token.expiry = Date.now() + (refreshedTokens.expiresIn * 1000);
        }
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
    maxAge: 60 * 60 * 24
  },
  pages: {
    signIn: '/login'
  }
})
