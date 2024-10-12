import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./schemas"
import type { NextAuthConfig } from "next-auth"
import { getUserByEmail } from "./lib/prisma"
import bcrypt from "bcryptjs"
import Passkey from "next-auth/providers/passkey"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/db"

export default {
    experimental: { enableWebAuthn: true },
    session: { strategy: "jwt" },
    adapter: PrismaAdapter(prisma),
    providers: [
        Credentials({
            async authorize(credentials) {
                const validationSchema = signInSchema.safeParse(credentials)
                
                if (validationSchema.success) {
                    const { email, password } = validationSchema.data

                    const user = await getUserByEmail(email)
                    if (!user || !user.password) { return null }

                    const passwordMatch = await bcrypt.compare(password, user.password)

                    if (passwordMatch) {
                        return user
                    }
                }

                return null
            }
        }),
        Passkey
    ],
} satisfies NextAuthConfig