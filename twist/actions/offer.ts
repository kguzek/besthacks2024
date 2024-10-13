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
import { findSimilarDocuments } from "./search";

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
        prompt: `provide a json condensed list of all skills required by "${jobTitle}" working on "${responsibilities}", with the key being a skill buzzword and the value representing how essential the skill is to the role. Max 10 most important skills.`,
    });

    // results skills name in string: skill1, skill2, skill3
    const preparedSkills = object.map((skill) => skill.name).join(", ");

    return { skills: object, preparedSkills };
}

interface DistanceResult {
    origin: string;
    destination: string;
    distance: string; // e.g. '170 km'
    distanceValue: number; // e.g. 170009 (metres)
    duration: string;
    durationValue: number;
}

function calculateDistances(
    location: string,
    applicants: { location: string }[]
) {
    const options = {
        key: process.env.GOOGLE_MAPS_API_KEY,
        origins: [location],
        destinations: applicants
            .filter((a) => a.location != null)
            .map((a) => a.location!),
    };
    return new Promise<DistanceResult[]>((resolve, reject) =>
        GoogleDistanceApi.distance(
            options,
            (err: Error, data: DistanceResult[]) =>
                err ? reject(err) : resolve(data)
        )
    );
}

function getDistanceRating(jobType: JobType, distance: number) {
    switch (jobType) {
        case JobType.REMOTE:
            return 1;
        case JobType.HYBRID:
            return distance > 30_000 ? 0.1 : 1;
        case JobType.ONSITE:
        default:
            return distance > 15_000 ? 0.1 : 1;
    }
}

export const matchCandidates = async (
    embedding: number[],
    baseLocation: string
) => {
    console.log("searching for people");

    const users = (await findSimilarDocuments(embedding)) as {
        name: string;
        location: string;
        jobType: JobType;
        distanceRating?: number;
    }[];

    let sortedUsers = users.map((user, idx) => ({
        ...user,
        idx,
        distanceRating: 1,
    }));
    try {
        const distances = await calculateDistances(baseLocation, users);
        for (let i = 0; i < users.length; i++) {
            const user = users[i];
            const distanceData = distances[i];
            user.distanceRating = getDistanceRating(
                user.jobType,
                distanceData.distanceValue
            );
        }
        console.log(distances);
        sortedUsers = sortedUsers.sort(
            (a, b) => a.idx / a.distanceRating - b.idx / b.distanceRating
        );
    } catch (e) {
        console.error("Error calculating distances:", e);
    }
    return sortedUsers.splice(0, 10);
};

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

            const { embedding } = await embed({
                model: openai.embedding("text-embedding-3-small"),
                value: preparedSkills,
            });

            await prisma.offer.create({
                data: {
                    ...parsedInput,
                    salary: +parsedInput.salary,
                    skills,
                    preparedSkills,
                    embbedingSkills: embedding,
                },
            });

            revalidatePath("/dashboard");

            const topTenCandidates = await matchCandidates(
                embedding,
                parsedInput.location
            );

            return {
                success: "Stworzono ofertę",
                selectedCandidates: topTenCandidates,
            };
        } catch (error) {
            console.error("error creating offer", error);
            return {
                failure: "Wystąpił błąd podczas tworzenia oferty",
            };
        }
    });
