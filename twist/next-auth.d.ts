import { type DefaultSession } from "next-auth"

export type ExtendedUser = DefaultSession["user"] & {
    role: string,
    passkeys: {
        id: string;
        createdAt: Date;
        provider: string;
    }[],
    passwordExist: boolean
    githubLink: string | null
}

declare module "next-auth" {
    interface Session {
        user: ExtendedUser
    }
}