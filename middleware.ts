import { createServerClient } from "@supabase/ssr";
import { type MiddlewareConfig, type NextRequest, NextResponse } from "next/server";
import { BLOCKED_REDIRECT, isPublic } from "@/utils/supabase/middleware/rules";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
const discordClientToken = process.env.DISCORD_CLIENT_TOKEN;

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const response = NextResponse.next();

    if (isPublic(pathname)) {
        return response;
    }

    if (!supabaseUrl || !supabaseKey || !discordClientToken) {
        throw new Error("Missing Supabase or Discord environment variables");
    }

    // create supabase client bound to cookies
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
            getAll: () => request.cookies.getAll(),
            setAll: (cookies) => {
                cookies.forEach(({ name, value, options }) => {
                    response.cookies.set(name, value, options);
                });
            },
        },
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        const url = request.nextUrl.clone();

        url.pathname = BLOCKED_REDIRECT;
        url.searchParams.set("blockedFrom", pathname);

        return NextResponse.redirect(url);
    }

    return response;
}

export const config: MiddlewareConfig = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
