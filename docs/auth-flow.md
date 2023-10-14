# Authentication flow

## OAuth 2.0

Currently users authenticate using [Alby](https://getalby.com/), with a classic [OAuth 2.0](https://oauth.net/2/) flow.

OAuth is a protocol, to understand how it works under the hood, check [here](https://next-auth.js.org/configuration/providers/oauth).

## NextAuth.js

To integrate the authentication mechanism in this app, we used [NextAuth](https://next-auth.js.org/).

There are dozens of built in OAuth providers, but as we need a lightning address for our users, we used alby.
For that we configured a custom OAuth provider in NextAuth.

### Configuration

The configuration is mainly done in [auth.ts](../src/lib/auth.ts). There we configured :

- The Session interface, for typescript
- The Alby provider
- The login page
- The JWT callback. Here is called the save-token endpoint. This endpoint retrieves the users alby_id by calling alby's API, and then saves the user and it's token in our database.
- The session callback. It receives the jwt in input, so it takes some data from the JWT and put them in the session. Now we can simply use the useSession hook, or the getServerSession function for Server Components, anywhere in the application, to check if the user is logged in, and access it's different tokens and ids.

Then this configuration is exported from the [auth route](../src/app/api/auth/[...nextauth]/route.ts). That's what needed for the NextAuth library to plug everything.

### Refresh tokens

The JWT tokens have a default duration of 30 days, and it is refreshed automatically when the user navigates in the app, as the NextAuthProvider is present on the main layout.
Everything is done automatically by the NextAuth.js library, using the refresh_token.

If a RefreshAccessTokenError occurs, we handle it by redirecting the user to the signIn page, so the user just have to login again.
