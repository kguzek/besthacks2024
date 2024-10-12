import { JobType, UserRole } from "@prisma/client";
import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(128, "Password must be less than 128 characters"),
  callbackUrl: z.string({ required_error: "Callback URL is required" }),
});

export const signUpSchema = z.object({
  email: z
    .string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: z
    .string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(128, "Password must be less than 128 characters"),
  name: z
    .string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(128, "Name must be less than 128 characters"),
  type: z.enum([UserRole.APPLICANT, UserRole.COMPANY], {
    required_error: "Type is required",
  }),
  phoneNumber: z.string({ required_error: "Phone number is required" }),
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
  preferredHours: z.string({ required_error: "Wymiar pracy jest wymagany" }),
  jobType: z.enum(Object.values(JobType) as [JobType, ...JobType[]], {
    required_error: "Tryb pracy jest wymagany",
  }),
  location: z.string({ required_error: "Miejscowość pracy jest wymagana" }),
  jobTitle: z.string({ required_error: "Tytuł pracy jest wymagany" }),
});
