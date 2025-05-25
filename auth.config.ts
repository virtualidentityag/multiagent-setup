import GitHub from "next-auth/providers/github"
import type { NextAuthConfig } from "next-auth"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [GitHub],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      console.log("Auth callback:", auth);

      return !!auth
    },
  },
} satisfies NextAuthConfig