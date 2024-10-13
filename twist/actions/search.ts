"use server";

import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { MongoClient } from "mongodb";

export async function findSimilarDocuments(embedding: number[]) {
    const client = new MongoClient(process.env.DATABASE_URL!);

    try {
        await client.connect();

        const db = client.db("twist"); // Replace with your database name.
        const collection = db.collection("User"); // Replace with your collection name.

        // Query for similar documents.
        const documents = await collection
            .aggregate([
                {
                    $vectorSearch: {
                        queryVector: embedding,
                        path: "skillsEmbedding",
                        numCandidates: 100,
                        limit: 5,
                        index: "skills_vector_index",
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        skills: 1,
                        jobTitle: 1,
                        jobType: 1,
                        location: 1,
                        score: {
                            $meta: "vectorSearchScore",
                        },
                    },
                },
            ])
            .toArray();

        return documents;
    } finally {
        await client.close();
    }
}

export const searchTest = async () => {
    console.log("searching for offers");
    const input = "tworzenie stron";

    const { embedding } = await embed({
        model: openai.embedding("text-embedding-3-small"),
        value: input,
    });

    const documents = await findSimilarDocuments(embedding);
    console.log(documents);
};
