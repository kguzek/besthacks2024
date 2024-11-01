/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getUserByEmail } from "@/lib/prisma";
import { actionClient } from "@/lib/safe-action";
import { signUpSchema, updateProfileSchema } from "@/schemas";
import { openai } from "@ai-sdk/openai";
import { embed, generateObject } from "ai";
import bcrypt from "bcryptjs";
import { z } from "zod";
// import gs from "github-scraper"

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
        return { success: "Pomyślnie zarejestrowano nowego użytkownika! :)" };
    });

const getGithubProfile = async (baseUrl: string, accessToken: string) => {
    // fetch data from https://api.github.com/users/qamarq
    const myHeaders = new Headers();
    myHeaders.append("Authorization", "Bearer " + accessToken);
    myHeaders.append("Accept", "application/vnd.github+json");
    myHeaders.append("X-GitHub-Api-Version", "2022-11-28");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
    } as const;

    const response = await fetch(
        `https://api.github.com/users/${baseUrl.split("/").pop()}`,
        requestOptions
    );
    const data = await response.json();
    if (data.status === 404)
        return { failure: "Nie znaleziono użytkownika na Githubie" };

    const mainProfile = {
        login: data.login,
        name: data.name,
        public_repos: data.public_repos,
        followers: data.followers,
    };

    const repos = await fetch(
        `https://api.github.com/users/${data.login}/repos`,
        requestOptions
    );
    const reposData = await repos.json();
    // const preparedRepos = reposData.map(async (repo: any) => {
    //     const languages = await fetch(repo.languages_url);
    //     return {
    //         name: repo.name,
    //         description: repo.description,
    //         stargazers_count: repo.stargazers_count,
    //         languages: languages.json(),
    //     }
    // })
    // prepared repos
    // console.log("reposData", reposData)
    const preparedRepos = await Promise.all(
        reposData.map(async (repo: any) => {
            const languages = await fetch(repo.languages_url, requestOptions);
            const languagesData = await languages.json();
            return {
                name: repo.name,
                description: repo.description,
                stargazers_count: repo.stargazers_count,
                languages: Object.keys(languagesData),
            };
        })
    );
    return { mainProfile, preparedRepos };
};

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
            const userData = await prisma.user.update({
                where: { id: user?.id },
                data: preparedData,
                include: { accounts: true },
            });

            const gitData = await getGithubProfile(
                parsedInput.githubLink,
                userData.accounts[0].access_token!
            );

            const { object } = await generateObject({
                model: openai("gpt-4o-mini"),
                output: "array",
                schema: z.object({
                    name: z.string(),
                    skill: z.number(),
                }),
                prompt: `analyse this github profile ${JSON.stringify(
                    gitData.mainProfile
                )} and repositories: ${JSON.stringify(
                    gitData.preparedRepos
                )} and provide a condensed json object with the keys being buzzword skills you believe this user posseses and the values being the estimated proficiency in each skill in scale from 1 to 10.`,
            });

            const preparedSkills = object
                .map((skill: any) => skill.name)
                .join(", ");
            const { embedding } = await embed({
                model: openai.embedding("text-embedding-3-small"),
                value: preparedSkills,
            });

            await prisma.user.update({
                where: { id: user?.id },
                data: {
                    skills: object,
                    skillsEmbedding: embedding,
                },
            });
        } catch (e) {
            console.error(e);
            const error = e as Error;
            return { failure: error.message };
        }
        return { success: "Pomyślnie zaktualizowano dane Twojego profilu." };
    });
