import { UserRole } from '@prisma/client';
import { z } from 'zod';

export const signInSchema = z.object({
    email: z.string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z.string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(128, 'Password must be less than 128 characters'),
    callbackUrl: z.string({ required_error: 'Callback URL is required' })
});

export const signUpSchema = z.object({
    email: z.string({ required_error: 'Email is required' })
        .min(1, 'Email is required')
        .email('Invalid email'),
    password: z.string({ required_error: 'Password is required' })
        .min(1, 'Password is required')
        .min(8, 'Password must be more than 8 characters')
        .max(128, 'Password must be less than 128 characters'),
    repeatPassword: z.string({ required_error: 'Repeat password is required' }),
    name: z.string({ required_error: 'Name is required' })
        .min(1, 'Name is required')
        .max(128, 'Name must be less than 128 characters'),
    type: z.enum([UserRole.APPLICANT, UserRole.COMPANY], { required_error: 'Type is required' }),
    phoneNumber: z.string({ required_error: 'Phone number is required' })
});