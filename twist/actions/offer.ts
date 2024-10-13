"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { createOfferSchema } from "@/schemas";
import { openai } from "@ai-sdk/openai";
import { embed, generateObject } from "ai";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import GoogleDistanceApi from "google-distance-api";
import { JobType, Offer, User } from "@prisma/client";

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

function calculateDistances(offer: Offer, applicants: User[]) {
    const options = {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: [offer.location],
        destinations: applicants
            .filter((a) => a.location != null)
            .map((a) => a.location!),
    };
    return new Promise((resolve, reject) =>
        GoogleDistanceApi.distance(options, (err: Error, data: any) =>
            err ? reject(err) : resolve(data)
        )
    );
}

export const createOffer = actionClient
    .schema(createOfferSchema)
    .action(async ({ parsedInput }) => {
        console.log("creating offer with", parsedInput);
        try {
            const authData = await auth();
            if (!authData) {
                return {
                    failure: "Musisz być zalogowany, aby utworzyć ofertę",
                };
            }

            const { skills, preparedSkills } = await generateJobSkills(
                parsedInput.jobTitle,
                parsedInput.responsibilities
            );

            await prisma.offer.create({
                data: {
                    ...parsedInput,
                    salary: +parsedInput.salary,
                    skills,
                    preparedSkills,
                },
            });

            revalidatePath("/dashboard");

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
