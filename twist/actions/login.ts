"use server";

import { getUserByEmail } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { signInSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

export const loginUser = actionClient
    .schema(signInSchema)
    .action(async ({ parsedInput: { email, password, callbackUrl } }) => {
        const existingUser = await getUserByEmail(email);
        if (!existingUser || !existingUser.email || !existingUser.password) {
            return { failure: "Zły email lub hasło!" };
        }

        try {
            await signIn("credentials", {
                email,
                password,
                redirectTo: DEFAULT_LOGIN_REDIRECT
            });
            console.log(callbackUrl)
        } catch (error) {
            if (error instanceof AuthError) {
                switch (error.type) {
                    case "CredentialsSignin":
                        console.error("Invalid credentials!");
                        return { failure: "Zły email lub hasło!" };
                    default:
                        console.error("Something went wrong!");
                        return { failure: "Something went wrong!" };
                }
            }

            throw error;
        }
        return { success: `Pomyślnie zalogowano jako ${email}!` };
    });

export const loginWithDiscord = async () => {
    await signIn("discord");
};
