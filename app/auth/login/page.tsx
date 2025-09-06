"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

function LoginClient() {
    const supabase = createClient();
    const searchParams = useSearchParams();

    useEffect(() => {
        // const redirectAfter = searchParams.get("redirect") || "/";

        supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                // redirectTo: `${location.origin}/auth/callback?redirect=${encodeURIComponent(redirectAfter)}`,
                scopes: "identify email guilds",
                queryParams: {
                    prompt: searchParams.get("prompt") || "consent",
                },
            },
        });
    }, [supabase, searchParams]);

    return null;
}

export default function Page() {
    return (
        <Suspense
            fallback={
                <div className="flex justify-center items-center h-screen text-sm text-muted-foreground">
                    Logging you in...
                </div>
            }
        >
            <LoginClient />
        </Suspense>
    );
}
