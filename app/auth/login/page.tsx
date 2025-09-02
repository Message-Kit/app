"use client";

import { useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

export default function Page() {
    const supabase = createClient();

    useEffect(() => {
        supabase.auth.signInWithOAuth({
            provider: "discord",
            options: {
                redirectTo: `${location.origin}/auth/callback`,
                scopes: "identify email guilds",
                // queryParams: {
                //     prompt: "none",
                // }
            },
        });
    }, [supabase]);

    return <div className="flex justify-center items-center h-screen">Logging you in...</div>;
}
