import { REST } from "@discordjs/rest";
import { createServerClient } from "@supabase/ssr";
import { Routes } from "discord-api-types/v10";
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
        if (pathname.startsWith("/api")) {
            return NextResponse.json({ error: "unauthorized" }, { status: 401 });
        }

        const url = request.nextUrl.clone();

        url.pathname = BLOCKED_REDIRECT;
        url.searchParams.set("blockedFrom", pathname);

        return NextResponse.redirect(url);
    }

    // skip guild validation for api routes; handlers can validate their own params
    if (!pathname.startsWith("/api")) {
        // treat any first segment as a guild id and validate it
        const pathSegments = pathname.split("/").filter(Boolean);
        const potentialGuildId = pathSegments[0];

        if (potentialGuildId) {
            if (!(await isGuildValid(potentialGuildId, discordClientToken))) {
                const url = request.nextUrl.clone();
                url.pathname = BLOCKED_REDIRECT;
                url.searchParams.set("blockedFrom", pathname);
                return NextResponse.redirect(url);
            }
        }
    }

    return response;
}

export const config: MiddlewareConfig = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};

async function isGuildValid(guildId: string, clientToken: string): Promise<boolean> {
    const rest = new REST({ version: "10" }).setToken(clientToken);

    try {
        await rest.get(Routes.guild(guildId));
        return true;
    } catch {
        return false;
    }
}
