"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { signUpSchema, updateProfileSchema } from "@/schemas";
import bcrypt from "bcryptjs";

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
          role: parsedInput.type,
        },
      });
    } catch (e) {
      console.error(e);
      const error = e as Error;
      return { failure: error.message };
    }
    return { success: "Pomyślnie zarejestrowano nowego użytkownika! :)" };
  });

export const updateProfile = actionClient
  .schema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    const { user } = (await auth()) ?? {};
    if (!user)
      return {
        failure: "Ta funkcja jest dostępna tylko dla zalogowanych użytkowników",
      };
    try {
      await prisma.user.update({ where: { id: user?.id }, data: parsedInput });
    } catch (e) {
      console.error(e);
      const error = e as Error;
      return { failure: error.message };
    }
    return { success: "Pomyślnie zaktualizowano dane Twojego profilu." };
  });

export const readProfile = actionClient.action(async () => {
  const { user } = (await auth()) ?? {};
  if (!user)
    return {
      failure: "Ta funkcja jest dostępna tylko dla zalogowanych użytkowników",
    };
  try {
    return await prisma.user.findUnique({ where: { id: user?.id } });
  } catch (e) {
    console.error(e);
    const error = e as Error;
    return { failure: error.message };
  }
});
