import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './db';
import { passkey, twoFactor } from 'better-auth/plugins';

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: 'postgresql', // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {  
        enabled: true
    },
    plugins: [
        twoFactor({
            issuer: "My App",
			otpOptions: {
				sendOTP(user, otp) {
					console.log({ otp });
				},
			},
		}),
		passkey(),
    ]
});
