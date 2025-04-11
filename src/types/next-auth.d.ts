import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

// Extend the built-in session/user types to include our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id?: string; // Add id
      type?: 'google' | 'credentials'; // Add type
      verified?: boolean; // Add verified
    } & DefaultSession["user"]; // Keep the default fields
  }

  // Extend the built-in User type if needed (often useful for database integration)
  interface User extends DefaultUser {
    type?: 'google' | 'credentials';
    verified?: boolean;
    // Add other fields from your user model if necessary
  }
}

// Extend the built-in JWT type
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string;
    type?: 'google' | 'credentials';
    verified?: boolean;
    // Add any other fields you are adding to the token in the jwt callback
    accessToken?: string;
  }
} 