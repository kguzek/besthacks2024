import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { prisma } from "./lib/db"
import { getUserById } from "./lib/prisma"
import axios from "axios"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error',
    },
    trustHost: true,
    debug: false,
    events: {
        async linkAccount({ user, account }) {
            console.log("linkAccount", user, account)
            if (account.provider !== "github") return

            const config = {
                method: 'get',
                maxBodyLength: Infinity,
                url: 'https://api.github.com/user',
                headers: { 
                    "Accept": "application/vnd.github+json",
                    'Authorization': "Bearer "+account.access_token,
                    "X-GitHub-Api-Version": "2022-11-28"
                }
            };
              
            const res = axios.request(config)
            const html_url = (await res).data.html_url

            await prisma.user.update({
                where: { id: user.id },
                data: { emailVerified: new Date(), githubLink: html_url }
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
                session.user.githubLink = token.githubLink as string | null
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

            token.githubLink = user.githubLink
    
            return token
        }
    },
    ...authConfig,
})