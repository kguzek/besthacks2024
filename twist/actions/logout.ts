"use server"

import { signOut } from "@/auth"

export const signOutFunction = async () => {
    await signOut()
}