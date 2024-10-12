import { prisma } from "@/lib/db";
import { actionClient } from "@/lib/safe-action";
import { createOfferSchema } from "@/schemas";
import { openai } from "@ai-sdk/openai";

const model = openai("gpt-4o");

async function generateJobSkills(jobTitle: string, responsibilities: string) {
  console.log(
    "asking chatgpt about job skills for",
    jobTitle,
    responsibilities
  );
  const skills = ["a", "b"];
  return skills;
}

export const createOffer = actionClient
  .schema(createOfferSchema)
  .action(async ({ parsedInput }) => {
    const jobSkills = await generateJobSkills(
      parsedInput.jobTitle,
      parsedInput.responsibilities
    );
  });
