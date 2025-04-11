import NextAuth, { AuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { NextApiRequest, NextApiResponse } from 'next'; // Import if needed for custom handling

// Define authOptions directly within the handler initialization if not needed elsewhere
const handler = NextAuth({
  providers: [
    GoogleProvider({
      // Type assertion ensures env variables are treated as strings
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Potentially add other providers like Credentials here if needed
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow sign in for Google users
      // Server-side checks (like domain restriction or DB lookup) could go here if needed
      if (account?.provider === 'google') {
        // You could add checks here, e.g., verify email domain
        // const isAllowedToSignIn = profile?.email?.endsWith('@example.com');
        // if (isAllowedToSignIn) {
        //   return true;
        // } else {
        //   console.log(`Google sign-in denied for email: ${profile?.email}`);
        //   return false; // Prevent sign-in
        // }
        return true; // Allow all Google sign-ins for now
      }
      // Allow sign in for other providers (if any)
      return true;
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and user details to the token right after signin
      if (account && user) {
        // Standard JWT fields from OAuth user
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;

        // Add provider-specific info
        if (account.provider === 'google') {
            token.accessToken = account.access_token; // Store Google access token if needed
            token.type = 'google'; // Identify the login type
            token.verified = true; // Google accounts are typically verified
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client session object
      // Ensure session.user exists
      if (session.user && token) {
        // Explicitly cast session.user to include custom fields
        const augmentedUser = session.user as {
            id?: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            type?: 'google' | 'credentials';
            verified?: boolean;
        };

        // Assign properties from the token to the augmented user object
        augmentedUser.id = token.id as string;
        augmentedUser.name = token.name;
        augmentedUser.email = token.email;
        augmentedUser.image = token.image as string | null | undefined;
        augmentedUser.type = token.type as 'google' | 'credentials';
        augmentedUser.verified = token.verified as boolean;

        // Note: Modifying the session object directly might be sufficient,
        // but this casting ensures TS understands the shape we expect.
        // session.user = augmentedUser; // Re-assign if necessary, often not needed
      }
      return session;
    },
  },
  // Ensure you have NEXTAUTH_SECRET in your .env.local for JWT encryption
  secret: process.env.NEXTAUTH_SECRET,
  // Optional: Define custom pages if needed
  // pages: {
  //   signIn: '/signin',
  //   // error: '/auth/error', // Error code passed in query string as ?error=
  // }
});

// Export handlers for GET and POST requests
export { handler as GET, handler as POST }; 