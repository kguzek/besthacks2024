import { JobHoursTime, JobType, UserRole } from "@prisma/client";
import { z } from "zod";

export const signInSchema = z.object({
    email: z
        .string({ required_error: "Email jest wymagany" })
        .email("Nieprawidłowy adres email"),
    password: z
        .string({ required_error: "Hasło jest wymagane" })
        .min(8, "Hasło musi mieć co najmniej 8 znaków"),
    callbackUrl: z.string({ required_error: "Callback URL is required" }),
});

export const signUpSchema = z.object({
    email: z
        .string({ required_error: "Email jest wymagany" })
        .email("Nieprawidłowy adres email"),
    password: z
        .string({ required_error: "Hasło jest wymagane" })
        .min(8, "Hasło musi mieć co najmniej 8 znaków"),
    dob: z.date({ required_error: "Data urodzenia jest wymagana" }),
    name: z
        .string({ required_error: "Imię i nazwisko jest wymagane" })
        .min(1, "Imię i nazwisko jest wymagane")
        .max(128, "Name must be less than 128 characters"),
    type: z.enum([UserRole.APPLICANT, UserRole.COMPANY], {
        required_error: "Typ konta jest wymagany",
    }),
    phoneNumber: z.string({ required_error: "Number telefonu" }),
});

const GITHUB_REGEX =
    /^https?:\/\/(www\.)?github\.com\/[A-z0-9-_]+(\/[A-z0-9-_]+)?$/;

export const updateProfileSchema = z.object({
    githubLink: z
        .string()
        .url()
        .refine((url) => GITHUB_REGEX.test(url), {
            message: "Nieprawidłowy format adresu profilu na GitHubie",
        }),
    preferredHours: z.enum(
        Object.values(JobHoursTime) as [JobHoursTime, ...JobHoursTime[]],
        { required_error: "Wymiar pracy jest wymagany" }
    ),
    preferredSalary: z.string({
        required_error: "Preferowane wynagrodzenie jest wymagane",
    }),
    jobType: z.enum(Object.values(JobType) as [JobType, ...JobType[]], {
        required_error: "Tryb pracy jest wymagany",
    }),
    location: z.string({ required_error: "Miejscowość pracy jest wymagana" }),
    jobTitle: z.string({ required_error: "Tytuł stanowiska jest wymagany" }),
});

export const createOfferSchema = z.object({
    jobTitle: z.string({ required_error: "Tytuł stanowiska jest wymagany" }),
    jobType: z.enum(Object.values(JobType) as [JobType, ...JobType[]], {
        required_error: "Tryb pracy jest wymagany",
    }),
    location: z.string({ required_error: "Miejscowość pracy jest wymagana" }),
    salary: z.number({
        required_error: "Szacowane wynagrodzenie jest wymagane",
    }),
    responsibilities: z.string(),
});
