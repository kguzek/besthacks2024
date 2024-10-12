"use server";

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
  });

export const updateProfile = actionClient
  .schema(updateProfileSchema)
  .action(async ({ parsedInput }) => {
    // ...
  });
