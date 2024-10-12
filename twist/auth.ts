import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { prisma } from "./lib/db"
import { getUserById } from "./lib/prisma"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    trustHost: true,
    debug: false,
    events: {
        async linkAccount({ user }) {
            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date() }
            })
        }
    },
    callbacks: {
        async session({ session, token }) {
            if (session.user && token.sub) {
                session.user.id = token.sub
            }

            if (session.user && token) {
                session.user.name = token.name
                session.user.image = token.image as string
                session.user.role = token.role as string
                // session.user.passkeys = token.passkeys as any
                session.user.passwordExist = token.passwordExist as boolean
            }
            return session
        },
        async jwt({ token }) {
            if (!token.sub) return token
    
            const user = await getUserById(token.sub)
            if (!user) return token

            // Extend token of user passkeys
            // token.passkeys = user.accounts.filter(account => account.provider === "passkey")
            token.passkeys = []
    
            token.name = user.name
            token.image = user.image
            token.passwordExist = !!user.password
    
            token.role = user.role
    
            return token
        }
    },
    ...authConfig,
})