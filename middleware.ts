import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { BLOCKED_REDIRECT, isPublic } from "@/utils/supabase/middleware/rules";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

export async function middleware(request: NextRequest) {
    if (!supabaseUrl || !supabaseKey) {
        throw new Error("Missing Supabase environment variables");
    }

    const response = NextResponse.next();

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

    const pathname = request.nextUrl.pathname;

    if (isPublic(pathname)) {
        return response; // allow
    }

    if (!user) {
        const url = request.nextUrl.clone();
        url.pathname = BLOCKED_REDIRECT;
        url.searchParams.set("blockedFrom", pathname);
        return NextResponse.redirect(url);
    }

    return response; // logged-in users can access everything else
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
