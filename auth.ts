import NextAuth, { User } from "next-auth"
import Credentials from 'next-auth/providers/credentials'
import prisma from '@/lib/prisma'
import { comparePassword } from "@/utils/password"
import { signInSchema } from "./lib/zod"
import { ZodError } from 'zod'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        try {
          let user = null

          const { email, password } = await signInSchema.parseAsync(credentials)

          // logic to verify if the user exists
          user = await prisma.user.findFirst({
            where: {
              email,
            }
          });

          if (!user || !await comparePassword(password, user.password)) {
            throw new Error("Invalid credentials.")
          }

          return user as User;
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }
        }
        return null
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
})