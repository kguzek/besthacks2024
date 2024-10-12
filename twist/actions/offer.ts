import { actionClient } from "@/lib/safe-action";
import { createOfferSchema } from "@/schemas";
import { openai } from "@ai-sdk/openai";
import { embed, generateObject } from "ai";
import { z } from "zod";

async function generateJobSkills(jobTitle: string, responsibilities: string) {
    console.log(
        "asking chatgpt about job skills for",
        jobTitle,
        responsibilities
    );
    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.object({
            skills: z.record(z.string(), z.number()),
        }),
        prompt: `provide a json condensed list of all skills required by "${jobTitle}" working on "${responsibilities}", with the key being a skill buzzword and the value representing how essential the skill is to the role`,
    });

    // results skills name in string: skill1, skill2, skill3
    const preparedSkills = Object.keys(object.skills).join(", ");
    const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: preparedSkills,
    });

    return { skills: object.skills, embedding };
}

export const createOffer = actionClient
    .schema(createOfferSchema)
    .action(async ({ parsedInput }) => {
        const jobSkills = await generateJobSkills(
            parsedInput.jobTitle,
            parsedInput.responsibilities
        );
    });
