"use server"

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { createOfferSchema } from "@/schemas";
import { openai } from "@ai-sdk/openai";
import { embed, generateObject } from "ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";

async function generateJobSkills(jobTitle: string, responsibilities: string) {
    console.log(
        "asking chatgpt about job skills for",
        jobTitle,
        responsibilities
    );
    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        output: "array",
        schema: z.object({
            name: z.string(),
            importance: z.number(),
        }),
        prompt: `provide a json condensed list of all skills required by "${jobTitle}" working on "${responsibilities}", with the key being a skill buzzword and the value representing how essential the skill is to the role`,
    });

    // results skills name in string: skill1, skill2, skill3
    const preparedSkills = object.map((skill) => skill.name).join(", ");

    return { skills: object, preparedSkills };
}

export const createOffer = actionClient
    .schema(createOfferSchema)
    .action(async ({ parsedInput }) => {
        console.log("creating offer with", parsedInput);
        try {
            const authData = await auth()
            if (!authData) {
                return {
                    failure: "Musisz być zalogowany, aby utworzyć ofertę",
                };
            }

            const { skills, preparedSkills } = await generateJobSkills(
                parsedInput.jobTitle,
                parsedInput.responsibilities
            );

            const { embedding } = await embed({
                model: openai.embedding("text-embedding-3-small"),
                value: preparedSkills,
            });
            await prisma.offer.create({ data: {...parsedInput, salary: +parsedInput.salary, skills, preparedSkills, embbedingSkills: embedding} });

            revalidatePath("/dashboard")
            
            return {
                success: "Stworzono ofertę",
            };
        } catch (error) {
            console.error("error creating offer", error);
            return {
                failure: "Wystąpił błąd podczas tworzenia oferty",
            };
        }
    });
