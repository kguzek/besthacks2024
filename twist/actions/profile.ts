"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { signUpSchema, updateProfileSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import gs from "github-scraper";

export const registerUser = actionClient
    .schema(signUpSchema)
    .action(async ({ parsedInput }) => {
        const hashedPassword = await bcrypt.hash(parsedInput.password, 10);
        const existingUser = await getUserByEmail(parsedInput.email);
        if (existingUser)
            return { failure: "Istnieje już użytkownik o tym adresie email." };

        try {
            await prisma.user.create({
                data: {
                    email: parsedInput.email,
                    password: hashedPassword,
                    name: parsedInput.name,
                    phoneNumber: parsedInput.phoneNumber,
                    dob: parsedInput.dob,
                    role: parsedInput.type,
                },
            });
        } catch (e) {
            console.error(e);
            const error = e as Error;
            return { failure: error.message };
        }
        return {
            success: `Pomyślnie zarejestrowano użytkownika '${parsedInput.email}'!`,
        };
    });

export const updateProfile = actionClient
    .schema(updateProfileSchema)
    .action(async ({ parsedInput }) => {
        const { user } = (await auth()) ?? {};
        if (!user)
            return {
                failure:
                    "Ta funkcja jest dostępna tylko dla zalogowanych użytkowników",
            };
        try {
            const preparedData = {
                ...parsedInput,
                preferredSalary: Number(parsedInput.preferredSalary),
            };
            await prisma.user.update({
                where: { id: user?.id },
                data: preparedData,
            });

            gs("qamarq/nui_blocker", function (err, data) {
                if (err) console.error(err);
                console.log("testetstest", data); // or what ever you want to do with the data
            });
        } catch (e) {
            console.error(e);
            const error = e as Error;
            return { failure: error.message };
        }
        return { success: "Pomyślnie zaktualizowano dane Twojego profilu." };
    });
