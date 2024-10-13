import authConfig from "@/auth.config";
import NextAuth from "next-auth";
import {
    LOGIN_REDIRECT_ROUTES,
    apiAuthPrefix,
    apiPaymentPrefix,
    authRoutes,
    publicRoutes,
} from "@/routes";
import { NextResponse } from "next/server";
import { UserRole } from "@prisma/client";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isApiPaymentRoute = nextUrl.pathname.startsWith(apiPaymentPrefix);
    const isApiProductRoute = nextUrl.pathname.startsWith("/api/products");
    const isApiImageRoute = nextUrl.pathname.startsWith("/api/img");
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (
        isApiAuthRoute ||
        isApiPaymentRoute ||
        isApiProductRoute ||
        isApiImageRoute
    )
        return NextResponse.next();

    if (isAuthRoute) {
        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL(LOGIN_REDIRECT_ROUTES[(req.auth?.user.role ?? UserRole.APPLICANT) as keyof typeof UserRole], nextUrl)
            );
        }
        return NextResponse.next();
    }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname;
        if (nextUrl.search) callbackUrl += nextUrl.search;

        const encodedCallbackUrl = encodeURIComponent(callbackUrl);
        return NextResponse.redirect(
            new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        );
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
